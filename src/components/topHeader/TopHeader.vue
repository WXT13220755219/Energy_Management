<template>
  <div class="header">
    <!-- 左侧区域 -->
     <div class="left"></div>
    <!-- 个人中心区域 -->
    <div class="personal">
        <!-- 1.消息通知铃铛 -->
          <el-badge is-dot class="item" style="margin-right: 20px; cursor:pointer;">
            <el-icon size="20"><Bell /></el-icon>
          </el-badge>
        <!-- 2.头像 -->
          <el-avatar 
            :size="30"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            style="margin-right: 10px;"
          />
        <!-- 3.下拉菜单 -->
         <el-dropdown :hide-on-click="false" @command="handleCommand">
            <span class="el-dropdown-link">
              欢迎你，{{ username }}
              <el-icon class="el-icon-right"><arrow-down /></el-icon>              
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item icon="user" command="user">个人中心</el-dropdown-item>
                <el-dropdown-item icon="SwitchButton" command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
         </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLoginStore } from '@/store/login'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const router = useRouter()
const loginStore = useLoginStore()
// 使用storeToRefs保持username的响应式，用户信息更新，Header 上的名字也会自动变
const { username } = storeToRefs(loginStore)
// 处理下拉菜单点击事件
const handleCommand = (command:string) => {
  if(command === 'user'){
    router.push('/personal')
  } else if(command === 'logout'){
    loginStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped lang="less">
.header{
  background-color: white;
  height: 60px;
  display: flex;
  justify-content: space-between; //左右撑开
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #e6e6e6;
  .personal{
    display: flex;
    align-items: center;
  }
  .el-dropdown-link{
    cursor:pointer;
    color: #333;
    display: flex;
    align-items: center;
    border: none;
    outline: none;
  }
}
</style>
