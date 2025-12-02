import { defineStore } from 'pinia'
import type { MapAdd } from '@/type/map/mapTy'
import { addStationAPI } from '@/api/map'

export const useMapStore = defineStore('map', () => {

    const addStation = async (data: MapAdd) => {
        try{
            const res = await addStationAPI(data)
            if(res.code === 200){
                return true
            }
        } catch(error){
            console.error(error)
        } 
        return false
    }
    return {
        addStation
    }
})
