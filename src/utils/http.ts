import service from '@/utils/axios'


interface ResponseData<T = any> {
    code:number,
    data:T,
    message:string
}
// 封装GET请求
const get = <T=any>(url:string,params?:any):Promise<ResponseData<T>> => {
    return service.get(url,{params})
}


// 封装POST请求
const post = <T=any>(url:string,data?:any):Promise<ResponseData<T>> => {
    return service.post(url,data)
}
export { get, post }