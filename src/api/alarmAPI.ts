import { get } from '@/utils/http'

const API = {
    AlarmList: '/alarmList',
}

// enum API {
//     AlarmList = '/alarmList',
// }
const getAlarmListAPI =() => {
    return get(API.AlarmList)
}

export {
    getAlarmListAPI
}