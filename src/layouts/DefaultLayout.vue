<template>
  <el-container>
      <el-aside :width=" isCollapse ? '0px' :'200px'">
        <Menu :is-collapse="isCollapse"></Menu>
      </el-aside>
      <el-container>
          <el-header>
            <TopHeader 
              :is-collapse="isCollapse"
              @toggle-collapse="handleToggleCollapse"
            />
          </el-header>
          <el-main>
            <TabsLayout />
          </el-main>
      </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Menu from '@/components/navMenu/Menu.vue'
import TopHeader from '@/components/topHeader/TopHeader.vue'
import TabsLayout from './TabsLayout.vue'

//  定义侧边栏折叠状态，默认不折叠 (false)
const isCollapse = ref(false)

//  处理折叠切换事件
const handleToggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
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
