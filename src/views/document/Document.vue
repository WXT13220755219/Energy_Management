<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入文章标题" v-model="searchKeyword" clearable />
      </el-col>
      <el-col :span="6">
        <el-button type="primary">查询</el-button>
        <el-button type="success" icon="Plus" @click="handleCreate">发布招商文案</el-button>
      </el-col>
    </el-row>
  </el-card>

  <el-card class="mt">
    <el-table :data="tableData" border stripe>
      <el-table-column label="序号" type="index" width="60" align="center" />
      <el-table-column label="文章标题" prop="title" align="center" />
      <el-table-column label="类型" prop="type" width="120" align="center">
        <template #default="scope">
          <el-tag>{{ scope.row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="重要程度" prop="level" width="100" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.level === '一级' ? 'danger' : 'warning'" effect="plain">
            {{ scope.row.level }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" prop="date" width="180" align="center" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button link type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog
    v-model="dialogVisible"
    :title="form.id ? '编辑文章' : '发布文章'"
    width="800px"
    destroy-on-close
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="文章标题">
        <el-input v-model="form.title" placeholder="请输入标题" />
      </el-form-item>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="文章类型">
            <el-select v-model="form.type" placeholder="请选择" style="width:100%">
              <el-option v-for="item in typeList" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="重要程度">
            <el-select v-model="form.level" placeholder="请选择" style="width:100%">
              <el-option v-for="item in levelList" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="文章内容">
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
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认发布</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeUnmount, shallowRef } from 'vue'
import { ElMessage } from 'element-plus'
// 引入 WangEditor 的 CSS
import '@wangeditor/editor/dist/css/style.css' 
// 引入 Vue 组件
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// --- 1. 数据定义 ---
const searchKeyword = ref('')
const dialogVisible = ref(false)
const typeList = ["招商类", "公告类", "日常类"] // 模拟下拉选项
const levelList = ["一级", "二级", "三级"]

// 表格模拟数据
const tableData = ref([
  { id: 1, title: '2024年第一季度招商计划', type: '招商类', level: '一级', date: '2024-03-01', content: '<p>内容...</p>' },
  { id: 2, title: '充电站维护公告', type: '公告类', level: '二级', date: '2024-03-05', content: '<p>维护通知...</p>' },
])

// 表单数据对象
const form = reactive({
  id: '',
  title: '',
  type: '',
  level: '',
  content: '<p>欢迎使用富文本编辑器...</p>' // 默认内容
})

// --- 2. 编辑器配置 ---
// editorRef 必须使用 shallowRef (浅层响应式)，否则编辑器实例可能会出错
const editorRef = shallowRef() 
const mode = 'default' // 模式：'default' 或 'simple'

const toolbarConfig = {} // 工具栏配置，默认即可
const editorConfig = { 
    placeholder: '请输入内容...',
    MENU_CONF: {} // 可以在这里配置上传图片等高级功能
}

// 编辑器创建回调：记录 editor 实例，方便后续销毁
const handleCreated = (editor: any) => {
  editorRef.value = editor 
}

// 组件销毁前，必须销毁编辑器实例，防止内存泄漏
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

// --- 3. 交互逻辑 ---
// 点击“发布”
const handleCreate = () => {
  form.id = ''
  form.title = ''
  form.type = ''
  form.level = ''
  form.content = '' // 清空富文本
  dialogVisible.value = true
}

// 点击“编辑”
const handleEdit = (row: any) => {
  // 回显数据
  Object.assign(form, row)
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = () => {
  console.log('提交的数据:', form) // 可以在这里看 content 也就是富文本生成的 HTML
  ElMessage.success('操作成功')
  dialogVisible.value = false
}
</script>

<style scoped lang="less">
/* 简单的间隔样式 */
.mt {
  margin-top: 20px;
}

/* 编辑器容器边框样式 */
.editor-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  width: 100%;
  
  /* 深度选择器：防止富文本内容样式被全局污染 */
  :deep(.w-e-text-container) {
    background-color: #fff;
  }
}
</style>