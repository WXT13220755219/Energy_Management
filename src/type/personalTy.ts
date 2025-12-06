// 定义后端返回数据类型

// 1. 个人详细信息
interface PersonalInfoType {
    name: string;       // 姓名
    avatar: string;     // 头像链接
    role: string;       // 职位角色
    department: string; // 所属部门
    account: string;    // 登录账号
    phone: string;      // 手机号
    email: string;      // 邮箱
    location: string;   // 地址
    joinDays: number;   // 加入天数
    completeness: number; // 资料完整度 (0-100)
    tags: TagType[];    // 标签数组 (引用上面的 TagType)
}

// 标签类型
interface TagType {
    label: string,
    type: '' | 'success' | 'warning' | 'danger' | 'info'
}


// 2. 动态/操作日志
interface ActivityType {
    id: number;
    title: string;      // 操作标题
    content: string;    // 操作详情
    timestamp: string;  // 时间
    // 动态类型，决定时间轴节点的颜色
    type: 'primary' | 'success' | 'warning' | 'danger' | 'info';    
}


export {
    type PersonalInfoType,
    type ActivityType
}