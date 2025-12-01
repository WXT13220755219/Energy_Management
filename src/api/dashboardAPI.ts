import { get } from '@/utils/http'

const API = {
    ChartData:'/chartData',
    ChartData2:'/chartData2',
    ChartData3:'/chartData3',
    DeviceStatus:'/deviceStatus',
    QuickFunctions:'/quickFunctions', //常用功能
    RevenueRank:'/revenueRank', //营收统计
    FaultAlarm:'/faultAlarm', //故障列表
}

const getChartDataAPI = () => {
    return get( API.ChartData )
}
const getChartDataAPI2 = () => {
    return get( API.ChartData2 )
}
const getChartDataAPI3 = () => {
    return get( API.ChartData3 )
}
const getDeviceStatusAPI = () => {
    return get( API.DeviceStatus )
}
const getQuickFunctionsAPI = () => {
    return get(API.QuickFunctions)
}
const getRevenueRankAPI = () => {
    return get(API.RevenueRank)
}
const getFaultAlarmAPI = () => {
    return get(API.FaultAlarm)
}

export{
    getChartDataAPI,
    getChartDataAPI2,
    getChartDataAPI3,
    getDeviceStatusAPI,
    getQuickFunctionsAPI,
    getRevenueRankAPI,
    getFaultAlarmAPI
}