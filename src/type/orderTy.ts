// 从后端获取的订单管理的参数类型
interface OrderType {
    orderNo: string,
    date: string,
    startTime: string,
    endTime: string,
    equipmentNo: string,
    money: number,
    pay: string,
    status: number
}

export {
    type OrderType
}