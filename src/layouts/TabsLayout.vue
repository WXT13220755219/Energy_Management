<template>
  <el-main>
    <el-tabs v-model="currentTab.name" class="demo-tabs" closable @tab-remove="remove" @tab-click="handleClick" type="card">
      <el-tab-pane
        
        v-for="item in tabs"
        :key="item.url"
        :name="item.name"
        :label="item.name"
      >
      <template #label>
        <span class="custom-tabs-label">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>&nbsp;{{ item.name }}</span>
        </span>
      </template>
      </el-tab-pane>
    </el-tabs>
    <RouterView v-slot="{Component}">
      <KeepAlive>
        <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive"></component>
      </KeepAlive>
      <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive"></component>
    </RouterView>
  </el-main>
</template>

<script lang="ts" setup>
import { useTabsStore } from '@/store/tabs'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useLoginStore } from '@/store/login'
import type { TabsPaneContext } from 'element-plus'

const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()
const { tabs, currentTab } = storeToRefs(tabsStore)
const { setCurrentTab, removeTab, addTabs } = tabsStore
const loginStore = useLoginStore()
const { menu } = storeToRefs(loginStore)

// 点击tab
const handleClick = ( pane:TabsPaneContext ) => {
  // 获取点击标签的名字
  const clickTab = pane.props.name
  // 在tabs数组里找到对应的对象
  const tab = tabs.value.find( item => item.name == clickTab)
  if(tab){
    router.push(tab.url)
    setCurrentTab(tab.name,tab.url)
  }
}
// 关闭tab
const remove = (name:string) => {
  removeTab(name)
  router.push(currentTab.value.url)
}
 const findObjectByUrl = (arr:any[], url:string) => {
    for(const item of arr){
      if(item.url === url){
        return item
      }
      if(item.children){
        const found:any = findObjectByUrl(item.children,url)
        if(found){
          return found
        }
      }
    }
    return null
 }
const {name, url, icon} = findObjectByUrl(menu.value, route.path)
addTabs(name,url,icon)
setCurrentTab(name,url)

</script>

<style scoped lang="less">
.demo-tabs{
  :deep(.is-active){
    background-color: rgb(95, 166, 252) !important;
    color: white !important
  }
  .custom-tabs-label{
    display:flex;
    align-items:center;
    justify-content: center;
  }
}

</style>
