import { post } from "@/utils/http"

// post给后端数据的数据类型
interface SystemType {
    page: number,
    pageSize: number,
    name: string,
    department:string,

}

const API = {
    System: '/permissionList'
}

const getSystemAPI = (data:SystemType) => {
    return post(API.System,data)
}

export {
    type SystemType,
    getSystemAPI
}