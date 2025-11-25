// 侧边栏点击后，不仅要跳转路由，还要在顶部添加页签
import { defineStore } from 'pinia'
import type { MenuItem } from '@/type/menuTy'
import { ref } from 'vue'

 export const useTabsStore = defineStore('tabs',() => {
    // 默认存在一个首页标签
    const tabs = ref<MenuItem[]>([
        {name:'数据看板', url:'/dashboard', icon:'DataLine'}
    ])
    // 当前激活的标签
    const currentTab = ref<{name:string,url:string}>({
        name:'数据看板',
        url:'/dashboard'
    })
    // 添加标签的动作
    const addTabs = (name:string,url:string,icon:string) => {
        if(!tabs.value.some(item => item.url == url)){
            tabs.value.push({name,url,icon})
        }
    }
    // 设置当前激活标签的动作
    const setCurrentTab = (name:string,url:string) => {
        currentTab.value = { name, url }
    }
    return { 
        tabs,
        currentTab,
        addTabs,
        setCurrentTab
     }
})