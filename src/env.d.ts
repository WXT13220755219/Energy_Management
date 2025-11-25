/// <reference types="vite/client" />
//全局类型声明
declare module "mockjs"
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}