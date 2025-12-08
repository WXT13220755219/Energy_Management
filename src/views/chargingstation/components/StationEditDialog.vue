<template>
  <el-dialog 
    v-model="visible" 
    :title="title" 
    width="500px"
    @close="handleClose"
  >
    <el-form 
      ref="formRef" 
      :model="formData" 
      :rules="rules" 
      label-width="100px"
    >
      <el-form-item label="站点名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入站点名称" />
      </el-form-item>
      
      <el-form-item label="站点编号" prop="id">
        <el-input v-model="formData.id" placeholder="系统自动生成/请输入" :disabled="isEdit" />
      </el-form-item>

      <el-form-item label="所属城市" prop="city">
        <el-input v-model="formData.city" placeholder="请输入城市" />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="快充桩数" prop="fast">
            <el-input-number v-model="formData.fast" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="慢充桩数" prop="slow">
            <el-input-number v-model="formData.slow" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="负责人" prop="person">
        <el-input v-model="formData.person" placeholder="请输入负责人姓名" />
      </el-form-item>

      <el-form-item label="联系电话" prop="tel">
        <el-input v-model="formData.tel" placeholder="请输入联系电话" />
      </el-form-item>

      <el-form-item label="当前状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
          <el-option label="正常使用" :value="1" />
          <el-option label="拥挤" :value="2" />
          <el-option label="维修中" :value="3" />
          <el-option label="建设中" :value="4" />
          <el-option label="故障" :value="5" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import type { StationForm } from '@/type/stationTy'
import { editStationAPI } from '@/api/stationAPI'

// 定义 props 和 emits
const emit = defineEmits(['refresh'])

// 响应式数据
const visible = ref(false)
const isEdit = ref(false) // 是否为编辑模式
const formRef = ref<FormInstance>()

// 初始表单数据
const defaultData: StationForm = {
  id: '',
  name: '',
  city: '',
  fast: 0,
  slow: 0,
  status: 1,
  now: 0,
  fault: 0,
  person: '',
  tel: ''
}

const formData = reactive<StationForm>({ ...defaultData })

// 计算属性：弹窗标题
const title = computed(() => isEdit.value ? '编辑充电站' : '新增充电站')

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
  city: [{ required: true, message: '请输入所属城市', trigger: 'blur' }],
  person: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// === 方法 ===

// 打开弹窗（父组件调用）
const open = (row?: StationForm) => {
  visible.value = true
  if (row) {
    isEdit.value = true
    // 浅拷贝数据回显
    Object.assign(formData, row)
  } else {
    isEdit.value = false
    // 重置表单
    Object.assign(formData, defaultData)
  }
}

// 关闭回调
const handleClose = () => {
  formRef.value?.resetFields()
  visible.value = false
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await editStationAPI(formData)
        if (res.code === 200) {
          ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
          visible.value = false
          emit('refresh') // 通知父组件刷新列表
        } else {
          ElMessage.error(res.message || '操作失败')
        }
      } catch (error) {
        console.error(error)
      }
    }
  })
}

// 暴露 open 方法
defineExpose({ open })
</script>

<style scoped lang="less">
// 简单的样式调整
</style>