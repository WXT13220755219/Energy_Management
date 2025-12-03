import { post } from '@/utils/http'

// 提交给后端的参数类型
interface OrderParamsType {
    pageSize: number,
    page: number,
    orderNo?: string,
    equipmentNo?: string,
    status: number | null,
    pay: string,
    endTime?: string,
    startTime?: string
}

const API = {
    Order: '/orderList',
    BatchDelete: '/batchDelete'
}

const getOrderAPI = (data:OrderParamsType) => {
    return post(API.Order,data)
}
// 参数 ids 是一个订单号数组，例如 ['123', '456']
const getBatchDeleteAPI = (ids:string[]) => {
    return post(API.BatchDelete,{order:ids})
}

export {
    type OrderParamsType,
    getOrderAPI,
    getBatchDeleteAPI
}