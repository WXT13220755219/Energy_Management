import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MenuItem } from '@/type/menuTy'

export const useTabsStore = defineStore('tabs', () => {
    // state
    // 1.标签列表(那一行打开的所有标签)
    const tabs = ref<MenuItem[]>([])
    // 2.高亮的标签
    const currentTab = ref<{name:string, url:string}>(
        { name:'',url:''}
    )
    // action
    // 1.添加标签
    const addTabs = (name:string,url:string,icon:string) => {
        if(!tabs.value.some( (item) => item.url === url)){
            tabs.value.push({name,url,icon})
        }
    }
    // 2.高亮当前标签
    const setCurrentTab = (name:string,url:string) => {
        currentTab.value = { name, url }
    }
    // 3.关闭标签
    const removeTab = (name:string) => {
        // 找到要关闭标签的索引
        const index = tabs.value.findIndex( (item) => item.name === name )
        // 关闭标签(把要关闭标签之外的标签留下)
        tabs.value = tabs.value.filter( (item) => item.name !== name )
        // 如果关闭的是当前高亮的标签
        if(name === currentTab.value.name){
            // 如果还有剩余标签
            if(tabs.value.length > 0){
                let nextTab :MenuItem | undefined
                // 如果关闭的是第一个标签，将新的第一个标签高亮
                if(index === 0){
                    nextTab = tabs.value[0]
                }
                // 如果关闭的不是第一个标签，将前一个标签高亮
                else{
                    nextTab = tabs.value[index-1]
                }
                if(nextTab){
                    currentTab.value = {
                        name:nextTab.name,
                        url:nextTab.url
                    }
                }
            } 
            // 没有剩余标签就清空高亮标签
            else{
                currentTab.value = { name:'', url:''}
            }
        } 
    }
    return {
        tabs,
        currentTab,
        addTabs,
        setCurrentTab,
        removeTab
    }
})