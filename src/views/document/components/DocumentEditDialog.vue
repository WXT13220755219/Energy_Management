<template>
  <el-dialog
    v-model="visible"
    :title="form.id ? '编辑文章' : '发布文章'"
    width="800px"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-form :model="form" label-width="80px" ref="formRef" :rules="rules">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题" />
      </el-form-item>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="文章类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择" style="width:100%">
              <el-option v-for="item in typeList" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="重要程度" prop="level">
            <el-select v-model="form.level" placeholder="请选择" style="width:100%">
              <el-option v-for="item in levelList" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="文章内容" prop="content">
        <div class="editor-container">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            :mode="mode"
          />
          <Editor
            style="height: 300px; overflow-y: hidden;"
            v-model="form.content"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="handleCreated"
          />
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确认发布</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeUnmount, shallowRef } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { getAddAPI } from '@/api/documentAPI'
import  type { DocumentParamsType } from '@/type/documentTy' 
// 引入 WangEditor
import '@wangeditor/editor/dist/css/style.css' 
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// ------------------- 1. 组件通讯定义 (核心) -------------------

// 【Emits】定义子组件可以触发的事件
// 'success': 当表单提交成功后，通知父组件（通常用于让父组件刷新列表）
const emit = defineEmits(['success'])

// ------------------- 2. 数据定义 -------------------
const visible = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

// 下拉选项数据（硬编码）
const typeList = ["招商类", "广告类", "公告类", "提示类", "日常类"] 
const levelList = ["一级", "二级", "三级"]

// 表单数据：使用 reactive 定义对象
const form = reactive<DocumentParamsType>({
  id: '',
  title: '',
  type: '',
  level: '',
  content: '<p>请输入内容...</p>' 
})

const rules = {
    title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
    type: [{ required: true, message: '请选择文章类型', trigger: 'change' }],
    level: [{ required: true, message: '请选择重要程度', trigger: 'change' }],
}

// ------------------- 3. 编辑器配置 -------------------
const editorRef = shallowRef() 
const mode = 'default' 
const toolbarConfig = {} 
const editorConfig = { placeholder: '请输入详细内容...' }

const handleCreated = (editor: any) => { editorRef.value = editor }

// 销毁编辑器，防止内存泄漏
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

// ------------------- 4. 交互逻辑 -------------------

// 【Expose 方法】打开弹窗
// 这个方法会被父组件通过 ref 调用：dialogRef.value.open(row)
const open = (row?: DocumentParamsType) => {
  visible.value = true
  
  if (row) {
    // 如果传了 row，说明是“编辑”模式 -> 回显数据
    // Object.assign(目标对象, 源对象) 将 row 的属性复制给 form
    Object.assign(form, row)
  } else {
    // 如果没传 row，说明是“新增”模式 -> 重置表单
    form.id = ''
    form.title = ''
    form.type = ''
    form.level = ''
    form.content = '<p>请输入内容...</p>'
    
    // 注意：虽然 destroy-on-close 会重置 DOM，但 reactive 的数据需要手动重置
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
      if (valid) {
          submitLoading.value = true
          try {
              // 调用 API (这里暂时用 add 模拟编辑保存)
              const res = await getAddAPI(form)
              if(res.code === 200){
                  ElMessage.success('操作成功')
                  visible.value = false // 关闭弹窗
                  
                  // 【核心】触发事件，告诉父组件“我搞定了，你去刷新列表吧”
                  emit('success') 
              }
          } catch(e) {
              console.error(e)
          } finally {
              submitLoading.value = false
          }
      }
  })
}

// 【Expose】将 open 方法暴露给父组件，否则父组件无法调用
defineExpose({
  open
})
</script>

<style scoped lang="less">
.editor-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  width: 100%;
  z-index: 1000; 
  
  :deep(.w-e-text-container) {
    background-color: #fff;
  }
}
</style>