<template>
    <div class="bg">
        <div class="login">
            <div class="logo">
                <img :src="logo" width="70px" height="70px">
                <h1 class="ml">动力港能源管理</h1>
            </div>
            <el-form :model="loginForm" :rules="rules" ref="formRef" @submit.prevent="handleLogin">
                <el-form-item label="账号：" prop="username">
                    <el-input placeholder="请输入账号" v-model="loginForm.username" prefix-icon="User"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="password">
                    <el-input placeholder="请输入密码" v-model="loginForm.password" prefix-icon="Lock" type="password" show-password ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width:100%;" @click="handleLogin" native-type="submit">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import logo from '@/assets/logo.png'
import type{ FormInstance } from 'element-plus'
import  { useLoginStore }  from '@/store/login'
import { useRouter } from 'vue-router'

interface LoginRulesType {
    username:string,
    password:string
}
const loginForm = reactive<LoginRulesType>({
    username:'',
    password:''
})
const formRef = ref<FormInstance>()
const rules = reactive({
    username:[
        { required:true, message:'请输入账号', trigger:'blur' },
        { min:3, max:8, message:'不能小于3个，大于8个字符', trigger:'blur' }
    ],
    password:[
        { required:true, message:'不能为空', trigger:'blur' }
    ]
})

const router = useRouter()
const loginStore = useLoginStore()
const handleLogin = () => {
    formRef.value?.validate( async(valid:boolean) => {
        if(valid){
            await loginStore.login(loginForm)
            router.push('/')
        }
    } )
}
</script>

<style scoped>
.bg{
    background-image:url('../assets/bg.png');
    background-position: center; /* 背景图居中显示 */
    background-size: cover; /* 让背景图始终铺满屏幕，不留白 */
    background-repeat: no-repeat; 
    height: 100vh; /* 容器高度 = 视口高度，保证全屏背景 */
    .login {
        width: 500px;
        height: 300px;
        padding: 50px;
        box-shadow: 0 0 10px 10px #f4f4f4; /* 四周浅灰色阴影，制造悬浮卡片效果 */
        text-align: center; /* 内部行内元素水平居中 */
        position: absolute; /* 绝对定位，方便自由摆放 */
        top: 50%; /* 垂直方向居中第一步 */
        left: 10%;  /* 左侧留出 10% 视口宽度，偏左放置 */
        margin-top: -200px;  /* 垂直居中第三步：往上偏移自身高度一半（300/2+50padding≈200） */
        .logo{
            display: flex;
            justify-content: center; /* 水平居中 */
            align-content: center; /* 垂直居中 */
            margin-bottom: 40px;
        }
    }
    h1 {
        color: rgb(14, 53, 148); /* 深蓝主题色 */
        margin-top: 10px;
    }
}
</style>
