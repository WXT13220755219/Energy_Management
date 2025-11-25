<template>
  <!-- logo -->
   <div class="logo">
    <img :src="logo" width="34px" height="34px" >
    <h1>动力港</h1>
   </div>
   <!-- 菜单容器 -->
    <!-- router: 开启 vue-router 模式，index 直接作为 path 跳转 -->
   <el-menu
      active-text-color="#409EFF"
      background-color="#FFFFFF"
      class="el-menu-vertical-demo"
      :default-active="route.path"
      text-color="#303133"
      :router="true"
      :unique-opened="true"
      :collapse-transition="false"
    >
      <menu-item 
        v-for="item in menuList"
        :key="item.url"
        :item="item"
      />
   </el-menu>
</template>

<script lang="ts" setup>
import logo from '@/assets/logo.png'
import { useRoute } from 'vue-router'
import { useLoginStore } from '@/store/login'
import { computed } from 'vue'
import  MenuItem  from '@/components/navMenu/MenuItem.vue'

const route = useRoute()
const loginStore = useLoginStore()
// 从pinia获取登录后存储的菜单数据
const menuList = computed(()=>loginStore.menu)
</script>

<style scoped lang="less">
.logo{
  display: flex;
  justify-content: center; //水平居中
  align-items: center;
  height: 60px;
  background-color: #F5F7FA;
}
h1{
  color: #303133;
  margin-left: 10px;
  font-size: 25px;
  white-space: nowrap;
}
.el-menu{
  border-right:none;
}
/* 选中和悬停样式优化 */
:deep(.el-menu-item:hover) {
  background-color: rgb(220, 231, 244) !important;
  color: #fff !important;
}
:deep(.is-active) {
  background-color: rgb(200, 201, 202) !important;
  color: #fff !important;
}
</style>
