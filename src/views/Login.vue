<template>
    <div class="bg">
        <div class="login">
            <div class="logo">
                <img :src="logoImage" width="70px" height="70px">
                <h1 class="ml">动力港能源管理</h1>
            </div>
            <el-form :model="loginForm" :rules="rules" ref="formRef" @submit.prevent="handleLogin">
                <el-form-item label="账号:" prop="username">
                    <el-input placeholder="请输入账号" v-model="loginForm.username" prefix-icon="User"></el-input>
                </el-form-item>
                <el-form-item label="密码:" prop="password">
                    <el-input placeholder="请输入密码" v-model="loginForm.password" prefix-icon="Lock" type="password" show-password ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width:100%;" @click="handleLogin" :loading="loading" native-type="submit">登录</el-button>
                </el-form-item>
            </el-form>

            <div class="demo-account-box">
                <p class="tip-title">演示账号 (点击一键填充)：</p>
                <div class="account-item" @click="fillAccount('dongligang1', 'dongligang123')">
                    <el-tag type="success" size="small" effect="dark">管理员</el-tag>
                    <span>dongligang1 / 123</span>
                </div>
                <div class="account-item" @click="fillAccount('dongligang2', 'dongligang456')">
                    <el-tag type="" size="small" effect="dark">运营员</el-tag>
                    <span>dongligang2 / 456</span>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import logo from '@/assets/logo.png'
import type{ FormInstance } from 'element-plus'
import  { useLoginStore }  from '@/store/login'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus' // 引入提示

interface LoginRulesType {
    username:string,
    password:string
}
const logoImage = ref(logo)
const loginForm = reactive<LoginRulesType>({
    username:'',
    password:''
})
const formRef = ref<FormInstance>()
const rules = reactive({
    username:[
        { required:true, message:'请输入账号', trigger:'blur' },
        { min:3, max:15, message:'不能小于3个，大于8个字符', trigger:'blur' }
    ],
    password:[
        { required:true, message:'不能为空', trigger:'blur' }
    ]
})

const router = useRouter()
const loginStore = useLoginStore()
const loading = ref(false) // 增加一个loading状态

const handleLogin = () => {
    formRef.value?.validate( async(valid:boolean) => {
        if(valid){
            loading.value = true
            try {
                await loginStore.login(loginForm)
                ElMessage.success('登录成功')
                router.push('/')
            } catch (e) {
                // 错误处理交由拦截器或在此处理
            } finally {
                loading.value = false
            }
        }
    } )
}

// [新增] 填充账号的方法
const fillAccount = (u: string, p: string) => {
    loginForm.username = u
    loginForm.password = p
    ElMessage.info(`已填充${u.includes('1') ? '管理员' : '运营员'}账号`)
}
</script>

<style scoped lang="less">
/* ... 原有的 .bg 样式保持不变 ... */
.bg {
    width: 100%;
    height: 100vh;
    background-image: url('../assets/bg.png');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    
    display: flex;
    align-items: center; 
    justify-content: flex-start; 
    padding-left: 10%; 
    box-sizing: border-box; 

    .login {
        width: 420px;
        background-color: rgba(255, 255, 255, 0.95);
        padding: 40px 50px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        text-align: center;

        .logo {
            /* ... 保持不变 ... */
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 30px;
            h1 {
                color: #0e3594;
                font-size: 24px;
                margin-left: 10px;
                font-weight: 600;
                letter-spacing: 1px;
            }
        }
        
        /* [新增] 演示账号样式 */
        .demo-account-box {
            margin-top: 25px;
            border-top: 1px dashed #dcdfe6;
            padding-top: 15px;
            text-align: left;
            
            .tip-title {
                font-size: 12px;
                color: #909399;
                margin-bottom: 10px;
            }
            
            .account-item {
                display: flex;
                align-items: center;
                background: #f4f6f8;
                padding: 8px 12px;
                border-radius: 6px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: all 0.3s;
                
                &:hover {
                    background: #ecf5ff;
                    transform: translateX(5px);
                }
                
                span {
                    font-size: 13px;
                    color: #606266;
                    margin-left: 10px;
                    font-family: monospace; /* 等宽字体显示密码更清晰 */
                }
            }
        }
    }
}

:deep(.el-input__wrapper) {
    background-color: #f5f7fa;
    border-radius: 20px;
    padding: 5px 15px;
    box-shadow: none !important;
    border: 1px solid transparent;
    transition: all 0.3s;
}

/* 以下输入框美化样式保持不变 */
:deep(.el-input__wrapper) {
    background-color: #f5f7fa;
    border-radius: 20px;
    padding: 5px 15px;
    box-shadow: none !important;
    border: 1px solid transparent;
    transition: all 0.3s;
}

:deep(.el-input__wrapper.is-focus) {
    background-color: #fff;
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2) !important;
}

:deep(.el-button--primary) {
    width: 100%;
    height: 44px;
    border-radius: 22px;
    font-size: 16px;
    letter-spacing: 2px;
    background: linear-gradient(90deg, #2b5876 0%, #4e4376 100%);
    border: none;
    margin-top: 10px;
    
    &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
}

:deep(.el-input input:-webkit-autofill) {
    -webkit-box-shadow: 0 0 0px 1000px #f5f7fa inset !important;
    -webkit-text-fill-color: #333 !important;
    transition: background-color 5000s ease-in-out 0s;
}

:deep(.el-input__wrapper.is-focus input:-webkit-autofill) {
    -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
}
</style>