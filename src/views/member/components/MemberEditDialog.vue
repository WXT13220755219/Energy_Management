<template>
  <el-dialog 
    v-model="visible" 
    :title="isEdit ? '编辑会员' : '新增会员'" 
    width="500px"
    @close="handleClose"
  >
    <el-form 
        ref="formRef"
        :model="form" 
        :rules="rules" 
        label-width="100px"
        class="member-form"
    >
        <div class="avatar-upload">
            <el-avatar :size="60" icon="UserFilled" class="mb-10" />
            <el-button link type="primary" size="small">上传头像</el-button>
        </div>

        <el-form-item label="会员姓名" prop="holderName">
            <el-input v-model="form.holderName" placeholder="请输入真实姓名" />
        </el-form-item>
        
        <el-form-item label="手机号码" prop="holderPhone">
            <el-input v-model="form.holderPhone" placeholder="请输入11位手机号" maxlength="11" />
        </el-form-item>

        <el-form-item label="卡片类型" prop="cardType">
            <el-radio-group v-model="form.cardType">
                <el-radio-button label="普通会员" />
                <el-radio-button label="黄金会员" />
                <el-radio-button label="钻石会员" />
            </el-radio-group>
        </el-form-item>

        <el-form-item label="初始充值" prop="initialBalance" v-if="!isEdit">
            <el-input-number v-model="form.initialBalance" :min="0" :step="100" controls-position="right" style="width: 100%;">
                 <template #suffix>元</template>
            </el-input-number>
        </el-form-item>
        
        <el-form-item label="备注信息">
            <el-input v-model="form.remark" type="textarea" :rows="2" />
        </el-form-item>
    </el-form>

    <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'

// --- 父组件交互 ---
const emit = defineEmits(['success'])

// --- 状态定义 ---
const visible = ref(false)
const isEdit = ref(false)
const loading = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
    holderName: '',
    holderPhone: '',
    cardType: '普通会员',
    initialBalance: 0,
    remark: ''
})

// 校验规则
const rules = {
    holderName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    holderPhone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
    ],
    cardType: [{ required: true, message: '请选择卡片类型', trigger: 'change' }]
}

// --- 暴露给父组件的方法 ---
const open = (row?: any) => {
    visible.value = true
    if (row) {
        isEdit.value = true
        // 简单的数据回显
        form.holderName = row.holderName
        form.holderPhone = row.holderPhone
        form.cardType = row.cardType
        // 编辑模式下不显示初始充值，防止误操作
    } else {
        isEdit.value = false
        resetForm()
    }
}

// 内部方法
const resetForm = () => {
    form.holderName = ''
    form.holderPhone = ''
    form.cardType = '普通会员'
    form.initialBalance = 0
    form.remark = ''
}

const handleClose = () => {
    formRef.value?.resetFields()
}

const handleSubmit = async () => {
    if (!formRef.value) return
    
    await formRef.value.validate((valid) => {
        if (valid) {
            loading.value = true
            // 模拟 API 提交
            setTimeout(() => {
                loading.value = false
                visible.value = false
                ElMessage.success(isEdit.value ? '编辑成功' : '新增会员成功')
                emit('success') // 通知父组件刷新列表
            }, 800)
        }
    })
}

// 暴露 open 方法
defineExpose({ open })
</script>

<style scoped>
.avatar-upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
}
.mb-10 { margin-bottom: 10px; }
</style>