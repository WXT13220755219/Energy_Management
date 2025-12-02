<template>
  <div class="steps-container">
    <el-steps :active="currentStep" finish-status="success" align-center>
        
    </el-steps>
  </div>

  <div class="content-container" mt>
    <div v-show="currentStep === 0">
        <slot name="step-1"></slot>
    </div>
    <div v-show="currentStep === 1">
        <slot name="step-2"></slot>
    </div>
    <div v-show="currentStep === 2">
        <slot name="step-3"></slot>
    </div>
  </div>

  <div class="footer-btn mt" >
    <el-button v-if="currentStep > 0" @click="prevStep">上一步</el-button>
    <el-button type="primary" @click="nextStep">
        {{ currentStep < steps.length - 1 ? '下一步' : '提交' }}
    </el-button>
  </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'

// --- 1. Props 定义 (接收父组件传来的数据) ---
const props = defineProps<{
    steps: {title:string}[]; // 接收一个包含 title 的对象数组
    formRefs: (FormInstance | undefined)[]; // 重点：接收父组件所有 form 的 ref 实例数组
}>()

// --- 2. Emit 定义 (向父组件发送事件) ---
const emit = defineEmits(['submit'])

// --- 3. 内部状态 ---
const currentStep = ref(0)

// --- 4. 逻辑方法 ---

// 点击“下一步”
const nextStep = async () => {
    // 1. 获取当前步骤对应的表单引用
    // props.formRefs 是父组件传来的数组 [form1, form2, form3]
    const currentForm = props.formRefs[currentStep.value]
    if(!currentForm){
        // 如果没有表单（比如只是展示信息），直接下一步
        handleStepChange(1)
        return
    }

    // 2. 调用 Element Plus 表单的校验方法 validate
    await currentForm.validate((valid) => {
        if(valid){
            if(currentStep.value < props.steps.length - 1){
                currentStep.value++
            } else {
                emit('submit')
            }
        }
    })
}

// 点击“上一步”
const prevStep = () => {
    if(currentStep.value > 0){
        currentStep.value--
    }
}

// 辅助函数，防止索引越界
const handleStepChange = (val:number) => {
    currentStep.value += val
}




</script>

<style scoped>
.steps-container {
    max-width: 800px; /* 限制最大宽度，防止太宽不好看 */
    margin: 0 auto;   /* 左右自动边距，实现水平居中 */
}

.content-container {
    /* min-height 保证内容少的时候抽屉也不会太难看 */
    min-height: 200px; 
}

.footer-btn {
    text-align: center; /* 按钮居中 */
}
</style>
