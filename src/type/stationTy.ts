/**
 * 充电站列表项数据接口
 */
export interface StationItem {
    id: string;          // 站点编号 (如: VXZ10001)
    name: string;        // 站点名称
    city: string;        // 所属城市
    fast: number;        // 直流快充桩数
    slow: number;        // 交流慢充桩数
    status: number;      // 状态: 1-空闲/正常 2-使用中 3-维修中 4-建设中 5-故障
    now: number;         // 当前利用率/在充人数
    fault: number;       // 故障桩数量
    person: string;      // 负责人
    tel: number | string;// 联系电话
}

/**
 * 搜索表单数据接口
 */
export interface StationQuery {
    name: string;        // 站点名称
    status: number | null; // 站点状态
    page: number;        // 当前页码
    pageSize: number;    // 每页条数
}

/**
 * 编辑/新增表单数据接口
 * (通常和列表项类似，或者是其子集)
 */
export interface StationForm extends StationItem {}