import { post } from '@/utils/http'
import type { DocumentParamsType } from '@/type/documentTy'

// post 给后端参数的参数类型
interface DocumentParams {
    page: number,
    pageSize: number,
    title: string,
}

const API = {
    Add: '/document/add',
    List: '/document/list'
}

const getListAPI = (data:DocumentParams) => {
    return post(API.List, data)
}
const getAddAPI = (data:DocumentParamsType) => {
    return post(API.Add, data)
}

export {
    getAddAPI,
    getListAPI,
    type DocumentParams
}