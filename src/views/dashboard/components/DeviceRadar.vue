<!-- 设备总览 (右上 - 雷达图) -->
 <template>
    <el-card>
        <template #header>
            <h3>设备总览</h3>
        </template>
        <div ref="radarChartRef" style="width: 100%; height: 280px;"></div>
    </el-card>
 </template>
 
 <script lang="ts" setup>
 import { ref } from 'vue'
 import { useChart } from '@/hooks/useChart'
 import { getChartDataAPI3 } from '@/api/dashboardAPI'

 const radarChartRef = ref(null)
 const getRadarOptions = async() => {
    const { data } =await getChartDataAPI3()
    return {
        radar: {
          indicator: [
            { name: '闲置', max: 500 },
            { name: '使用中', max: 500 },
            { name: '故障', max: 500 },
            { name: '维修', max: 500 },
            { name: '报废', max: 500 },
            { name: '离线', max: 500 }
          ]
        },
        series:[
            {
                name: '设备状态',
                type: 'radar',
                data: [
                    {
                        value: data.list,
                        name: '数量统计'
                    }
                ],
                areaStyle: { opacity: 0.2 }
            }
        ]
    }
 }
 useChart(radarChartRef, getRadarOptions)
 </script>
 
 <style scoped>
 
 </style>
 