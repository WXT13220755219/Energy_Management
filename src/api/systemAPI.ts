import { post } from "@/utils/http"

// post给后端数据的数据类型
interface SystemType {
    page: number,
    pageSize: number,
    name: string,
    department:string,

}

const API = {
    System: '/permissionList',
    GetUserAuth: '/userAuth',
    SetAuth: '/setAuth'
}

const getSystemAPI = (data:SystemType) => {
    return post(API.System,data)
}
const getUserAuthAPI = (data:{pageAuthority:string}) => {
    return post(API.GetUserAuth, data)
}
const getSetAuthAPI = (data: {btnList:any[], pageList:any[], account:string}) => {
    return post(API.GetUserAuth, data)
}

export {
    type SystemType,
    getSystemAPI,
    getUserAuthAPI,
    getSetAuthAPI
}