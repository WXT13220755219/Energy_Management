import { post } from '@/utils/http'
import type { BillingParamsType, BillingRuleType } from '@/type/billingTy'

const API = {
    getList: '/billing/rule/list',
    save: '/billing/rule/save',
    delete: '/billing/rule/delete'
}

// 获取计费规则列表
export const getBillingRuleListAPI = (data: BillingParamsType) => {
    // 模拟 Mock 数据返回（实际项目中请删除此 mock 逻辑直接 return post(...)）
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                code: 200,
                data: {
                    total: 12,
                    list: [
                        {
                            id: 1,
                            ruleName: '2025年Q1通用费率',
                            version: 'V1.0',
                            status: 1,
                            createTime: '2024-12-01 10:00:00',
                            effectiveTime: '2025-01-01 00:00:00',
                            remark: '适用于市区大部分站点',
                            items: [] 
                        },
                        {
                            id: 2,
                            ruleName: '工业园区专用费率',
                            version: 'V2.1',
                            status: 0,
                            createTime: '2024-11-15 14:30:00',
                            effectiveTime: '2024-12-01 00:00:00',
                            remark: '夜间谷电优惠',
                            items: []
                        }
                    ]
                }
            })
        }, 500)
    })
    // return post(API.getList, data)
}

// 保存或新增规则
export const saveBillingRuleAPI = (data: BillingRuleType) => {
    return post(API.save, data)
}

// 删除规则
export const deleteBillingRuleAPI = (ids: (number | string)[]) => {
    return post(API.delete, { ids })
}