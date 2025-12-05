<template>
    <div class="logo-container">
        <img :src="logo" class="logo-img">
        <h1 class="logo-text">动力港</h1>
    </div>
    
    <div class="menu-scroll-wrapper">
        <el-menu 
            :router="true" 
            :default-active="$route.path"
            class="custom-menu"
            :unique-opened="true" 
        >
            <menu-item 
                v-for="item in menuList" 
                :item="item" 
                :key="item.url"
            ></menu-item>
        </el-menu>
    </div>
</template>

<script lang="ts" setup>
import logo from '@/assets/logo.png'
import { computed } from 'vue'
import MenuItem from '@/components/navMenu/MenuItem.vue'
import { useLoginStore } from '@/store/login'

const userStore = useLoginStore()
const menuList = computed(() => userStore.menu)
</script>

<style scoped lang="less">
    /* [优化] Logo 区域样式重构 */
    .logo-container {
        display: flex;
        align-items: center;
        justify-content: center; /* 居中对齐 */
        height: 60px;
        /* 添加一个微妙的渐变背景，区分 Logo 区和菜单区 */
        background: linear-gradient(to bottom, #ffffff, #fdfdfd); 
        box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08); /* 底部阴影，增加层次感 */
        position: relative;
        z-index: 10; /* 保证阴影在菜单上方 */
        
        .logo-img {
            width: 32px;
            height: 32px;
            /* 图片增加简单的悬浮动画 */
            transition: transform 0.3s;
            &:hover {
                transform: rotate(360deg);
            }
        }
        
        .logo-text {
            color: #1d2129; /* 更深的黑色，提升可读性 */
            font-size: 20px;
            font-weight: 800; /* 加粗 */
            margin-left: 12px;
            font-family: 'PingFang SC', sans-serif;
            letter-spacing: 1px; /* 字间距 */
        }
    }

    /* [新增] 菜单滚动容器，填满剩余高度 */
    .menu-scroll-wrapper {
        height: calc(100vh - 60px); /* 减去 Logo 高度 */
        overflow-y: auto; /* 允许垂直滚动 */
        overflow-x: hidden;
        
        /* 隐藏 Chrome/Safari/Edge 的滚动条 */
        &::-webkit-scrollbar {
            display: none;
        }
        /* 隐藏 Firefox 的滚动条 */
        scrollbar-width: none;
    }

    .custom-menu {
        border-right: none; /* [关键] 去除 Element 菜单默认的右边框 */
        padding: 10px;
        background-color: transparent; /* 背景透明，透出父级背景 */
        
        /* 胶囊样式优化 (保留你之前的优秀设计，微调阴影) */
        :deep(.el-menu-item), :deep(.el-sub-menu__title) {
            border-radius: 8px;
            margin-bottom: 4px;
            height: 50px;
            line-height: 50px;
            color: #606266;
            
            &:hover {
                background-color: rgba(64, 158, 255, 0.08); /* 更淡的蓝色背景 */
                color: #409eff;
            }
        }

        :deep(.el-menu-item.is-active) {
            background-color: #e6f7ff !important;
            color: #1890ff !important;
            font-weight: 600;
            /* 增加选中时的左侧指示条 */
            &::before {
                content: "";
                position: absolute;
                left: 0px; /* 紧贴左边 */
                top: 50%;
                transform: translateY(-50%);
                width: 4px;
                height: 24px; /* 稍微加长 */
                background-color: #1890ff;
                border-radius: 0 4px 4px 0;
            }
        }
    }
</style>