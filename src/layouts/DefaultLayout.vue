<template>
  <el-container>
      <el-aside width="200px">
        <Menu></Menu>
      </el-aside>
      <el-container>
          <el-header>
            <TopHeader />
          </el-header>
          <el-main>
            <TabsLayout />
          </el-main>
      </el-container>
  </el-container>
</template>

<script lang="ts" setup>

import Menu from '@/components/navMenu/Menu.vue'
import TopHeader from '@/components/topHeader/TopHeader.vue'
import TabsLayout from './TabsLayout.vue'

</script>

<style scoped>
.el-aside{
  height: 100vh;
  box-shadow: 20px 0 8px -2px rgba(29, 35, 41, 0.05);
  background-color:white;
  transition: width 0.3s; /* 为将来做折叠动画预留 */
  z-index: 100; /* 确保侧边栏层级较高 */
  overflow: hidden; /* 防止内部内容撑开导致出现双滚动条 */
}
.el-header{
  padding: 0!important;
}
.el-main{
  height: 80vh;
  overflow:auto;
}
</style>
