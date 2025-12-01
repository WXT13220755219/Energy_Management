import type { Ref } from 'vue'
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, ref, markRaw } from 'vue'

export const useChart = (chartRef:Ref<HTMLElement | null>, setChartData:any) => {
    // 定义图表实例变量
    const chartInstance = ref<echarts.ECharts | null>(null)
    // 初始化
    const initChart = async () => {
        // 1.确保 DOM 元素存在
        if(chartRef.value){
            // 2.初始化 ECharts 实例,markRaw去除响应式
            chartInstance.value = markRaw(echarts.init(chartRef.value))
            // 3.调用传入的回调函数，获取图表配置数据
            const options = await setChartData()
            // 4.将配置注入图表，进行渲染
            chartInstance.value.setOption(options)
        }
    }
    // 窗口适配页面大小
    const resizeChart =  () => {
        chartInstance.value?.resize()
    }
    // 生命周期管理（挂载、卸载）
    onMounted( () => {
        // 页面渲染完成后，初始化图表
        initChart()
        // 监听浏览器窗口调整事件
        window.addEventListener('resize', resizeChart)
    })
    onBeforeUnmount( () => {
        // 移除监听，防止内存泄漏
        window.removeEventListener('resize', resizeChart)
        // 销毁图表实例
        if(chartInstance.value){
            chartInstance.value.dispose()
        }
    })

}