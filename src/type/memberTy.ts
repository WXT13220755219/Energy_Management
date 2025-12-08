
interface MemberType {
    memberCardNumber: string,          // 会员卡号
    cardType: string// 卡类型
    issueDate: string, // 开卡日期
    holderName: string,             // 持有人姓名
    holderPhone: string,     // 持有人电话
    cardBalance: number, // 卡余额
    transactionRecords:TransactionRecordsType[],      
    validUntil: string // 有效期至
}

interface TransactionRecordsType {
    transactionDate?: string,
    transactionAmount: number,
    transactionType: string
}

export type {
    MemberType
}
