/**
 * 新增站点表单数据接口
 */
export interface MapAdd{
    name: string; // 站点名称
    region: string; // 站点地址/区域
    location1: string; // 经度
    location2: string;  // 纬度
    now: boolean; // 是否立即启用 (对应 el-switch)
    remarks: string; // 备注信息
}