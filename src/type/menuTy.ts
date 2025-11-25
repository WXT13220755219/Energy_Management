// 定义菜单的形状
export interface MenuItem {
    name:string,
    url:string,
    icon:string, //后端返回的是字符串
    children?:MenuItem[]
}