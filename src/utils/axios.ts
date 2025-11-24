 import axios, { type AxiosInstance, type AxiosResponse, AxiosError, type InternalAxiosRequestConfig } from 'axios'
 import { ElNotification } from 'element-plus'

//  创建 axios 实例
const service:AxiosInstance = axios.create({
    baseURL: "https://www.demo.com", 
    timeout: 5000 //请求超时时间
})
// 请求拦截器
service.interceptors.request.use(
    (config:InternalAxiosRequestConfig) => {
        return config
    },
    (error:AxiosError) => {
        ElNotification({
            title:'Error',
            message:'Request Error:'+error.message,
            type:'error'
        })
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response:AxiosResponse) => {
        const res = response.data
        if(res.code !== 200){
            ElNotification({
                title:'Error',
                message:res.message || 'Error',
                type:'error'
            })
            return Promise.reject(new Error(res.message || 'Error'))
        }else{
            return res
        }
    },
    (error:AxiosError) => {
        ElNotification({
            title:'Error',
            message:'Resopnse Error:'+error.message,
            type:'error'
        })
        return Promise.reject(error)
    }
)
export default service