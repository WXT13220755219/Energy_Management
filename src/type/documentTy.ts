// 从后端获取参数的类型
export interface DocumentParamsType {
    id?: string | number,
    title: string,
    type: string,
    level: string,
    content: string,
    date?: string,
    publisher?: string,
    readCount?: number
}