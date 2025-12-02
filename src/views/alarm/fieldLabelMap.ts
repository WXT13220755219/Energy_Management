// 字段映射：将后端返回的英文数据映射为中文

const fieldLabelMap: Record<string, string> = {
    description: "故障描述",
    address: "设备地址",
    equNo: "设备号",
    level: "告警级别", // 数据里可能是 1, 2, 3
    time: "故障时间",
    code: "故障代码",
    status: "当前状态", // 数据里可能是 1:待指派, 2:处理中
}

// 导出一个辅助函数，输入英文 Key，返回中文 Label
// 如果字典里找不到这个 Key，就直接原样返回 Key，防止报错
export const getLabel = (key:string):string => {
    return fieldLabelMap[key] || key
}