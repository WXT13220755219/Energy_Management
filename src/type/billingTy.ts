// 计费规则的列表项类型
export interface BillingRuleType {
    id: number | string;
    ruleName: string;       // 规则名称，如：2025夏季标准费率
    version: string;        // 版本号
    status: 0 | 1;          // 0: 停用, 1: 启用
    createTime: string;     // 创建时间
    effectiveTime: string;  // 生效时间
    remark?: string;        // 备注
    items?: BillingItemType[]; // 具体的时段规则
}

// 单个时段的计费详情
export interface BillingItemType {
    startTime: string;      // 开始时间，如 "00:00"
    endTime: string;        // 结束时间，如 "08:00"
    type: 'peak' | 'flat' | 'valley' | 'sharp'; // 峰平谷尖
    elecPrice: number;      // 基础电费
    servicePrice: number;   // 服务费
}

// 查询参数类型
export interface BillingParamsType {
    page: number;
    pageSize: number;
    ruleName?: string;
}