import { post } from '@/utils/http'

interface MemberParamsType {
    page: number,
    pageSize: number,
    no: string, //如果一个“数字”不需要参与数学运算，它通常更适合作为字符串处理
    tel: string,
    name: string
}
const API = {
    Member: '/member'
}
const getMemberAPI = (data:MemberParamsType) => {
    return post(API.Member,data)
}

export {
    type MemberParamsType,
    getMemberAPI
}