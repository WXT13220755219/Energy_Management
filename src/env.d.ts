/// <reference types="vite/client" />
//全局类型声明，防止找不到导入文件
declare module "mockjs"
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}
declare module '@wangeditor/editor-for-vue' {
    import { DefineComponent } from 'vue'
    const Editor: DefineComponent<{}, {}, any>
    const Toolbar: DefineComponent<{}, {}, any>
    export { Editor, Toolbar }
}
// --- 在这里添加 png 的声明 ---
declare module '*.png' {
    const value: string;
    export default value;
}