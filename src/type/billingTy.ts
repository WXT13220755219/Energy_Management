// 定义单个时段的计费规则
export interface BillingItemType {
    startTime: string;      // 时段开始时间，格式 "HH:mm" (例如 "00:00")
    endTime: string;        // 时段结束时间，格式 "HH:mm" (例如 "08:00")
    // 时段类型：peak=高峰, flat=平段, valley=低谷, sharp=尖峰
    type: 'peak' | 'flat' | 'valley' | 'sharp'; 
    elecPrice: number;      // 基础电价（元/度）
    servicePrice: number;   // 服务费（元/度）
}

// 定义计费规则的主体结构
export interface BillingRuleType {
    id?: number | string;   // 规则ID (新增时可选)
    ruleName: string;       // 规则名称
    version: string;        // 版本号 (例如 "V1.0")
    status: 0 | 1;          // 状态: 0=停用, 1=启用
    createTime?: string;    // 创建时间
    effectiveTime: string;  // 生效时间
    remark?: string;        // 备注说明
    items?: BillingItemType[]; // 包含的多个时段规则数组
}

// 定义列表查询时的参数结构
export interface BillingParamsType {
    page: number;           // 当前页码
    pageSize: number;       // 每页条数
    ruleName?: string;      // 搜索关键词：规则名称
}

// 定义通用的 API 响应结构 (可选，用于增强类型检查)
export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}