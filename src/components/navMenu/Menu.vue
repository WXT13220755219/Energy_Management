<template>
    <div class="logo">
        <img :src="logo" width="32px" height="32px">
        <h1>动力港</h1>
    </div>
    
    <el-menu 
        :router="true" 
        :default-active="$route.path"
        class="custom-menu"
    >
        <menu-item 
            v-for="item in menuList" 
            :item="item" 
            :key="item.url"
        ></menu-item>
    </el-menu>
</template>

<script lang="ts" setup>
import logo from '@/assets/logo.png'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
// 1. 引入组件
import MenuItem from '@/components/navMenu/MenuItem.vue'
// 2. 引入正确的 Store (根据你提供的文件列表，store是 auth.ts)
import { useLoginStore } from '@/store/login'

const route = useRoute()
const userStore = useLoginStore() // 使用 userStore

// 3. 从 store 获取菜单数据
// 确保 store 里有 menu 这个属性，并且已经 populated 了数据
const menuList = computed(() => userStore.menu)
</script>

<style scoped lang="less">
    .logo {
        display: flex;
        align-items: center;
        padding-left: 24px;
        height: 60px;
        border-bottom: 1px solid #f0f0f0;
        
        h1 {
            color: #1f2d3d;
            font-size: 20px;
            font-weight: 700;
            margin-left: 12px;
            font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', sans-serif;
        }
    }

    .custom-menu {
        border-right: none;
        padding: 10px;
        
        /* 胶囊样式优化 */
        :deep(.el-menu-item), :deep(.el-sub-menu__title) {
            border-radius: 8px;
            margin-bottom: 4px;
            height: 50px;
            line-height: 50px;
            color: #606266;
            
            &:hover {
                background-color: #f5f7fa;
                color: #409eff;
            }
        }

        :deep(.el-menu-item.is-active) {
            background-color: #e6f7ff !important;
            color: #1890ff !important;
            font-weight: 600;
            
            &::before {
                content: "";
                position: absolute;
                left: 5px;
                top: 50%;
                transform: translateY(-50%);
                width: 4px;
                height: 16px;
                background-color: #1890ff;
                border-radius: 2px;
            }
        }
    }
</style>