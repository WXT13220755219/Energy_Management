import { post } from '@/utils/http'
// 引入刚才定义的类型，确保参数类型安全
import type { BillingParamsType, BillingRuleType } from '@/type/billingTy'

// 定义后端接口路径枚举，方便统一管理
const API = {
    getList : '/billing/rule/list',   // 获取列表
    save : '/billing/rule/save',      // 新增或保存
    delete : '/billing/rule/delete'   // 删除
}

/**
 * 获取计费规则列表
 * @param data 查询参数 (page, pageSize, ruleName)
 */
export const getBillingRuleListAPI = (data: BillingParamsType) => {
    return post(API.getList, data)
}

/**
 * 保存或新增计费规则
 * @param data 规则表单数据
 * 说明：如果 data 中包含 id 视为编辑，否则视为新增
 */
export const saveBillingRuleAPI = (data: BillingRuleType) => {
    return post(API.save, data)
}

/**
 * 删除计费规则
 * @param ids 要删除的规则 ID 数组
 */
export const deleteBillingRuleAPI = (ids: (number | string)[]) => {
    // 注意：后端通常期望接收一个对象 { ids: [...] }
    return post(API.delete, { ids })
}