// src/api/stationAPI.ts
import { post } from '@/utils/http'
import type { StationQuery, StationForm } from '@/type/stationTy'

// 定义接口地址
const API = {
    list: '/stationList',
    edit: '/station/edit',
    delete: '/station/delete'
}

/**
 * 获取充电站列表
 * @param data 查询参数
 */
export const getStationListAPI = (data: StationQuery) => {
    return post(API.list, data)
}

/**
 * 新增或编辑充电站
 * @param data 表单数据
 */
export const editStationAPI = (data: StationForm) => {
    return post(API.edit, data)
}

/**
 * 删除充电站
 * @param data 包含 id 的对象
 */
export const deleteStationAPI = (data: { id: string }) => {
    return post(API.delete, data)
}