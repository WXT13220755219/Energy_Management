<template>
  <div class="header">
    <div class="left">
      <el-icon class="fold-icon" size="22"><Fold /></el-icon>
      
      <el-breadcrumb separator="/" class="breadcrumb ml">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item 
          v-for="(item, index) in breadcrumbs" 
          :key="index"
        >
          {{ item.meta.title || item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="personal">
       <el-badge is-dot class="item" style="margin-right: 20px; cursor:pointer;">
            <el-icon size="20"><Bell /></el-icon>
        </el-badge>
        <el-avatar :size="30" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" style="margin-right: 10px;" />
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
import { useRouter, useRoute } from 'vue-router' // [新增] 引入 useRoute
import { storeToRefs } from 'pinia'
import { computed } from 'vue' // [新增]

const router = useRouter()
const route = useRoute() // [新增] 获取当前路由对象
const loginStore = useLoginStore()
const { username } = storeToRefs(loginStore)

// [新增] 计算属性：动态获取面包屑数据
const breadcrumbs = computed(() => {
  // route.matched 包含当前路由的所有嵌套记录
  // 过滤掉没有 name 的路由，且排除首页(因为上面已经写死首页了)
  return route.matched.filter(item => item.name && item.name !== 'dashboard' && item.name !== 'Home')
})

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
  justify-content: space-between; 
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #e6e6e6;
  
  /* [新增] 左侧样式优化 */
  .left {
    display: flex;
    align-items: center;
    
    .fold-icon {
      cursor: pointer;
      color: #606266;
      transition: color 0.3s;
      
      &:hover {
        color: #409eff; /* 悬停变蓝 */
      }
    }

    /* 调整面包屑左边距 */
    .ml {
      margin-left: 15px;
    }
    
    /* 深度选择器修改面包屑文字样式 */
    :deep(.el-breadcrumb__inner) {
      font-weight: normal;
      &.is-link {
        color: #606266;
        &:hover {
          color: #409eff;
        }
      }
    }
  }

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