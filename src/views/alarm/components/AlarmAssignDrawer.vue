<template>
    <el-drawer
        v-model="visible"
        :title="title"
        size="600px"
        destroy-on-close
    >
        <step-form 
            :steps="stepsConfig" 
            :form-refs="[formRef1, formRef2, formRef3]"
            @submit="handleFinalSubmit"
        >
            <template #step-1>
                <el-form :model="formData.base" :rules="rules.base" ref="formRef1" label-width="100px">
                    <el-form-item label="任务名称" prop="taskName">
                        <el-input v-model="formData.base.taskName" placeholder="例如：处理CD1001设备离线" />
                    </el-form-item>
                    <el-form-item label="是否加急" prop="isUrgent">
                        <el-switch 
                            v-model="formData.base.isUrgent" 
                            active-text="加急" 
                            inactive-text="普通"
                        />
                    </el-form-item>
                    <el-form-item label="处理方式" prop="method">
                        <el-checkbox-group v-model="formData.base.method">
                            <el-checkbox label="远程重启" value="restart" />
                            <el-checkbox label="现场维修" value="fix" />
                            <el-checkbox label="更换设备" value="replace" />
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="备注说明">
                        <el-input v-model="formData.base.remarks" type="textarea" :rows="3" />
                    </el-form-item>
                </el-form>
            </template>

            <template #step-2>
                <el-form :model="formData.audit" :rules="rules.audit" ref="formRef2" label-width="100px">
                    <el-form-item label="审批部门" prop="department">
                        <el-select v-model="formData.audit.department" placeholder="请选择部门" style="width: 100%">
                            <el-option label="维修部" value="dep_fix" />
                            <el-option label="运营部" value="dep_op" />
                            <el-option label="技术部" value="dep_tech" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="抄送人" prop="cc">
                        <el-input v-model="formData.audit.cc" placeholder="请输入抄送人邮箱或姓名" />
                    </el-form-item>
                </el-form>
            </template>

            <template #step-3>
                <el-form :model="formData.manager" :rules="rules.manager" ref="formRef3" label-width="100px">
                    <el-form-item label="负责人" prop="name">
                        <el-input v-model="formData.manager.name" placeholder="请输入负责人姓名" />
                    </el-form-item>
                    <el-form-item label="联系电话" prop="phone">
                        <el-input v-model="formData.manager.phone" placeholder="请输入11位手机号" />
                    </el-form-item>
                    <el-form-item label="执行时间" prop="date">
                         <el-date-picker
                            v-model="formData.manager.date"
                            type="datetime"
                            placeholder="选择预计执行时间"
                            style="width: 100%"
                        />
                    </el-form-item>
                </el-form>
            </template>
        </step-form>
    </el-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
// 引入类型定义，方便 TS 类型检查
import type { FormInstance, FormRules } from 'element-plus'
import StepForm from '@/components/stepForm/stepForm.vue'

// --- 1. 定义事件 (Emits) ---
// 当表单提交成功后，通知父组件刷新列表
const emit = defineEmits(['success'])

// --- 2. 响应式变量 ---
const visible = ref(false)
const title = ref('任务指派')
// 暂存当前正在操作的行数据（比如具体的某个报警设备信息）
const currentRow = ref<any>(null)

// --- 3. 表单引用 (Refs) ---
// 这里必须定义 3 个 ref，名字要和 template 里的 ref="..." 对应
// FormInstance 是 Element Plus 提供的表单实例类型，包含 validate 等方法
const formRef1 = ref<FormInstance>()
const formRef2 = ref<FormInstance>()
const formRef3 = ref<FormInstance>()

// --- 4. 静态配置 ---
const stepsConfig = [
    { title: '基本信息' },
    { title: '审批流程' },
    { title: '负责人确认' }
]

// --- 5. 表单数据 (Reactive) ---
const formData = reactive({
    base: {
        taskName: '',
        isUrgent: false,
        method: [] as string[], // TS断言：这是一个字符串数组
        remarks: ''
    },
    audit: {
        department: '',
        cc: ''
    },
    manager: {
        name: '',
        phone: '',
        date: ''
    }
})

// --- 6. 校验规则 (Rules) ---
// FormRules 是 TS 类型，能帮你检查规则写得对不对
const rules = reactive<Record<string, FormRules>>({
    base: {
        taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        method: [{ required: true, message: '请至少选择一种处理方式', trigger: 'change' }]
    },
    audit: {
        department: [{ required: true, message: '请选择审批部门', trigger: 'change' }]
    },
    manager: {
        name: [{ required: true, message: '请输入负责人姓名', trigger: 'blur' }],
        // 正则表达式校验手机号
        phone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ]
    }
})

// --- 7. 核心方法：打开抽屉 ---
// 这个方法会被父组件调用
const open = (row: any) => {
    currentRow.value = row
    title.value = `任务指派 - ${row.equNo}` // 动态标题
    
    // 初始化/重置表单数据
    // 虽然 destroy-on-close 会重置 DOM，但重置数据是个好习惯
    // 这里也可以给一些默认值，比如自动填入任务名
    formData.base.taskName = `${row.address}设备故障处理`
    formData.base.isUrgent = row.level === 1 // 如果是严重告警(level 1)，默认勾选加急
    formData.base.method = []
    // ... 其他重置逻辑
    
    visible.value = true
}

// --- 8. 提交逻辑 ---
const handleFinalSubmit = () => {
    // 这里通常会调用后端 API 提交 formData 和 currentRow.value.id
    console.log('最终提交的数据:', formData)
    console.log('关联的报警项:', currentRow.value)

    // 模拟异步请求
    setTimeout(() => {
        ElMessage.success('指派任务成功！')
        visible.value = false // 关闭弹窗
        emit('success') // 通知父组件刷新
    }, 500)
}

// --- 9. 暴露方法给父组件 ---
// 只有在这里暴露了 open，父组件才能通过 ref.value.open() 访问到
defineExpose({
    open
})
</script>

<style lang="less" scoped>
/* Scoped CSS: 样式只对当前组件生效 */
</style>