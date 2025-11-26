import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLoginAPI } from '@/api/loginAPI'
import type { LoginType } from '@/type/loginTy'

 export const useLoginStore = defineStore('login', () => {
    // State
    // 从sessionStorage初始化，防止刷新丢失
    const token = ref<string|null>(sessionStorage.getItem('token') || null)
    const roles = ref<string[]>(sessionStorage.getItem('roles')?JSON.parse(sessionStorage.getItem('roles')!):[])
    const username = ref<string>(sessionStorage.getItem('username') || '')
    const menu = ref<any[]>(sessionStorage.getItem('menu')?JSON.parse(sessionStorage.getItem('menu')!):[])
    // Actions
    // 登录动作
    const login = async(data:LoginType) => {
        try{
            const res = await getLoginAPI(data)
            // 1.结构返回数据
            const { token:accessToken, user, menulist } = res.data
            // 2.更新pinia状态
            token.value = accessToken
            username.value = user.username
            roles.value = user.roles
            menu.value = menulist
            // 3.持久化存储到SessionStorage（手动同步）
            sessionStorage.setItem('token',accessToken)
            sessionStorage.setItem('username',user.username)
            sessionStorage.setItem('roles',JSON.stringify(user.roles))
            sessionStorage.setItem('menu',JSON.stringify(menulist))
            // 返回结果供组件判断
            return res

        } catch(error){
            console.error('登录失败',error)
            throw error
        }
    }
    // 退出登录
    const logout = () => {
        // 1.清空pinia状态
        menu.value = [],
        roles.value = [],
        username.value = '',
        token.value = '',
        // 2.清空浏览器缓存
        sessionStorage.clear()
        localStorage.clear()
    }
    // 暴露出去
    return {
        token,
        username,
        roles,
        menu,
        login,
        logout
    }
})
