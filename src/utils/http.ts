import service from '@/utils/axios'


interface ResponseData {
    code:number,
    data:string,
    message:string
}
// 封装GET请求
const get = (url:string,params:any):Promise<ResponseData> => {
    return service.get(url,{params})
}


// 封装POST请求
const post = (url:string,data?:any):Promise<ResponseData> => {
    return service.post(url,data)
}
export { get, post }