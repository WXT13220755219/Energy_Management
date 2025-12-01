import { get } from '@/utils/http'

const API = {
    ChartData:'/chartData',
    ChartData2:'/chartData2',
    ChartData3:'/chartData3',
    DeviceStatus:'/deviceStatus',
    QuickFunctions:'/quickFunctions',
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


export{
    getChartDataAPI,
    getChartDataAPI2,
    getChartDataAPI3,
    getDeviceStatusAPI,
    getQuickFunctionsAPI,
}