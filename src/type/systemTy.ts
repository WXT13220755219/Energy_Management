// 后端返回数据的数据类型定义

export interface SystemParamsType {
    name:string,
    account:string, //账号
    phone:string,
    idNo:string, // 身份证号
    position:string, //职位
    department:string, //所属部门
    pageAuthority:string, //页面权限
    btnAuthority:string //按钮权限
}