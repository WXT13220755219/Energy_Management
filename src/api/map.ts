import { post } from '@/utils/http'
import type { MapAdd } from '../type/map/mapTy';

const API = {
    MapList:'/mapList',
    AddStation:'/addStation'
}
const getMapListAPI = () => {
    return post(API.MapList)
}
const addStationAPI = (data: MapAdd) => {
    return post(API.AddStation, data)
}

export {
    getMapListAPI,
    addStationAPI
}