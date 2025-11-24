// 防止未登录用户访问受保护页面
import router from './index'
import { useLoginStore } from '@/store/login'

router.beforeEach((to,from) => {
    const loginStore = useLoginStore()
    const isLogin = loginStore.token
    // 用户未登录
    if(!isLogin){
        if(to.path != '/login'){
            return {path:'/login'}
        }
    } else{
        // 用户登录了
        if (to.path == '/login'){
            return {path:'/'}
        }
    }
})