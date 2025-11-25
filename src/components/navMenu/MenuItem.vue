<template>
<!-- 组件需要判断是否有子集，如果有需要递归调用自己 -->
<!-- 1.有子菜单：渲染el-sub-menu 是个"文件夹"-->
    <el-sub-menu
        v-if="item.children && item.children.length > 0"
        :index="item.url"
    >
        <!-- 1)显示文件夹的标题 -->
        <template #title>
            <el-icon>
                <component :is="item.icon"/>
            </el-icon>
            <span>{{ item.name }}</span>
        </template>
        <!-- 2)递归调用 -->
         <!-- 把 chidren里面的每一个child,扔给MyMenuItem处理一遍 -->
        <my-menu-item 
            v-for="child in item.children"
            :key="child.url"
            :item="child"
        />
    </el-sub-menu>

<!-- 2.没有子菜单：渲染el-menu-item 是个"文件"-->
    <el-menu-item
        v-else
        :index="item.url"
        v-show="item.name !== '订单详情'"
        @click="handleClick"
    >
        <!-- 动态组件渲染图标 -->
        <el-icon>
            <component :is="item.icon"/>
        </el-icon>
        <span>{{ item.name }}</span>
    </el-menu-item>
<!-- el-menu-item是可以点击的菜单项,el-sub-menu是折叠面板 -->
</template>

<script lang="ts" setup>
import { defineOptions } from 'vue'
import type { MenuItem } from '@/type/menuTy'
import { useTabsStore } from '@/store/tabs'

// 定义组件名称，用<my-menu-item>递归的调用自己
defineOptions({
    name:'MyMenuItem'
})
// 接受父组件传来的数据（当前菜单项）
const props = defineProps<{
    item: MenuItem
}>()
// 点击菜单时的逻辑:联动 useTabsStore
const tabsStore = useTabsStore()
const { addTabs, setCurrentTab } = tabsStore

const handleClick = () => {
    addTabs(props.item.name, props.item.url, props.item.icon)
    setCurrentTab(props.item.name, props.item.url)
}


</script>

<style scoped>

</style>
