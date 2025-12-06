import { get, post } from '@/utils/http'
import type { PersonalInfoType, ActivityType } from '@/type/personalTy'


const API = {
    Info:'/personal/info',
    Activities:'/personal/activities',
    Update:'/personal/update'
}

// 获取个人详情
const getPersonalInfoAPI = () => {
    return get<PersonalInfoType>(API.Info)
}
// 获取操作动态
const getActivitiesAPI = () => {
    return get<{list:ActivityType[]}>(API.Activities)
}
// 更新基本信息 (模拟)
const updatePersonalInfoAPI = (data:any) => {
    return post(API.Update, data)
}

export {
    updatePersonalInfoAPI,
    getActivitiesAPI,
    getPersonalInfoAPI
}