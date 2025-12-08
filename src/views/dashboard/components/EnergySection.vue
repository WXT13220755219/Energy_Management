<template>
    <el-card shadow="hover" class="energy-card">
        <template #header>
            <div class="card-header">
                <h3>能源统计</h3>
            </div>
        </template>
        <el-row :gutter="20">
            <el-col :span="8">
                <div ref="pieChartRef" class="chart-box"></div>
            </el-col>
            <el-col :span="16">
                <div ref="lineChartRef" class="chart-box"></div>
            </el-col>
        </el-row>
    </el-card>
</template>
 
<script lang="ts" setup>
import { ref } from 'vue'
import * as echarts from 'echarts' 
import { getChartDataAPI2, getChartDataAPI } from '@/api/dashboardAPI'
import { useChart } from '@/hooks/useChart'

// ================= 全局配色定义 =================
// 饼图配色池 (清新明亮风格)
const pieColors = [
    '#3A77FF', // 蓝
    '#00D1B2', // 青
    '#F7BA1E', // 黄
    '#FF7D00', // 橙
    '#F53F3F', // 红
    '#A062D6'  // 紫
]

// 折线图主题色类型定义
interface ThemeColor {
    line: string;
    start: string;
    end: string;
}

// ================= 1. 饼图配置 (优化版) =================
const pieChartRef = ref(null)
const getPieOptions = async() => {
    const res = await getChartDataAPI2()
    return {
        // [新增] 注入自定义配色
        color: pieColors,
        title:{
            text:'设备分布',
            left:'left',
            textStyle: { fontSize: 16, fontWeight: 600, color: '#333' }
        },
        // [优化] Tooltip 样式卡片化
        tooltip: { 
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)', // 显示格式：名称: 数值 (百分比)
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#ececec',
            borderWidth: 1,
            padding: 10,
            textStyle: { color: '#333' },
            extraCssText: 'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); border-radius: 4px;'
        },
        // [优化] 图例放底部，使用圆形图标
        legend: {
            bottom: '0',
            left: 'center',
            icon: 'circle', 
            itemWidth: 10, 
            itemHeight: 10,
            itemGap: 15,
            textStyle: { color: '#666', fontSize: 12 }
        },
        series:[
            {
                name: '设备分布',
                type: 'pie',
                radius: ['50%', '70%'], // [关键] 调整为环形，且更细一些
                center: ['50%', '45%'], // 稍微上移，给底部图例留空间
                avoidLabelOverlap: false,
                itemStyle: { 
                    borderRadius: 8, // 扇区圆角
                    borderColor: '#fff', 
                    borderWidth: 3 // [关键] 增加白色描边宽度，制造"切割"感
                },
                // 默认状态：隐藏标签，保持干净
                label: {
                    show: false,
                    position: 'center'
                },
                // [核心交互] 鼠标悬停高亮配置
                emphasis: {
                    scale: true,
                    scaleSize: 10, // 悬停放大
                    label: {
                        show: true, // 悬停时显示中心文字
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#333',
                        formatter: '{b}\n{d}%' // 换行显示名称和百分比
                    }
                },
                labelLine: { show: false },
                data: res.data.list
            }
        ]
    }
}
useChart(pieChartRef, getPieOptions)

// ================= 2. 折线图配置 (保持之前的优化) =================
const lineChartRef = ref(null)

const color1: ThemeColor = {
    line: 'rgba(58, 119, 255, 1)', 
    start: 'rgba(58, 119, 255, 0.3)', 
    end: 'rgba(58, 119, 255, 0)'
}
const color2: ThemeColor = {
    line: 'rgba(0, 209, 178, 1)', 
    start: 'rgba(0, 209, 178, 0.3)', 
    end: 'rgba(0, 209, 178, 0)'
}
const themeColors: ThemeColor[] = [color1, color2]

const getLineOptions = async() => {
    const { data } = await getChartDataAPI()
    
    const seriesData = data.list.map((item:any, index:number) => {
        // [修复] 使用类型断言确保 color 总是有效的 ThemeColor 类型
        const color = themeColors[index % themeColors.length] as ThemeColor
        
        return {
            name: item.name,
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
                width: 3,
                color: color.line, 
                shadowColor: 'rgba(0, 0, 0, 0.1)', 
                shadowBlur: 10,
                shadowOffsetY: 5
            },
            areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: color.start },
                    { offset: 1, color: color.end }
                ])
            },
            itemStyle: {
                color: color.line,
                borderColor: '#fff',
                borderWidth: 2
            },
            data: item.data
        }
    })

    return {
        title: { 
            text: '趋势统计', 
            left: 'left',
            textStyle: { fontSize: 16, fontWeight: 600, color: '#333' }
        },
        tooltip: { 
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#ececec',
            borderWidth: 1,
            padding: 10,
            textStyle: { color: '#333' },
            extraCssText: 'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); border-radius: 4px;'
        },
        legend: { 
            data: data.list.map((i: any) => i.name), 
            top: '0',
            right: '0', 
            icon: 'rect', 
            itemWidth: 12,
            itemHeight: 4,
            itemGap: 20
        },
        grid: {
            top: '18%',
            bottom: '10%',
            left: '2%',
            right: '2%',
            containLabel: true
        },
        xAxis: { 
            type: 'category', 
            boundaryGap: false, 
            data: ['12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00', '02:00', '04:00'],
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { 
                color: '#86909C', 
                fontSize: 12,
                margin: 15 
            }
        },
        yAxis: { 
            type: 'value',
            splitLine: { 
                show: true, 
                lineStyle: { 
                    type: 'dashed', 
                    color: '#E5E6EB' 
                } 
            },
            axisLabel: { color: '#86909C' }
        },
        series: seriesData
    }
}

useChart(lineChartRef, getLineOptions)
</script>
 
<style scoped lang="less">
/* 复用之前的样式优化 */
.card-header h3 {
    margin: 0;
    font-weight: 600;
    color: #1d2129;
    font-size: 18px;
}

.chart-box {
    width: 100%;
    height: 380px; /* 统一高度 */
}

.energy-card {
    :deep(.el-card__body) {
        padding-top: 10px;
    }
}
</style>