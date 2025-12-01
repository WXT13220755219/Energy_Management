<!-- 能源统计 (左下 - 含折线图和饼图) -->
 <template>
    <el-card>
        <template #header>
            <div class="card-header">
                <h3>能源统计</h3>
            </div>
        </template>
        <el-row :gutter="20">
            <el-col :span="8">
                <div ref="pieChartRef" style="width: 100%; height: 450px;"></div>
            </el-col>
            <el-col :span="16">
                <div ref="lineChartRef" style="width: 100; height: 450px"></div>
            </el-col>
        </el-row>
    </el-card>

 </template>
 
 <script lang="ts" setup>
 import { ref } from 'vue'
 import { getChartDataAPI2, getChartDataAPI } from '@/api/dashboardAPI'
 import { useChart } from '@/hooks/useChart'

// 饼图配置
const pieChartRef = ref(null)
const getPieOptions = async() => {
    const res = await getChartDataAPI2()
    return {
        title:{
            text:'设备分布',
            left:'left',
            // top:'center'
        },
        tooltip: { trigger: 'item' },
        legend: {
            top: 'bottom',
            padding: [0, 0, 20, 0]
        },
        series:[
            {
                name: '设备占比',
                type: 'pie',
                radius: ['45%', '65%'],
                center: ['50%', '45%'],
                label:{
                    show: true,
                    position: 'outside',
                    formatter: '{b}'
                },
                labelLine:{
                    show:true,
                    length:20,
                    length2:20,
                    // borderRadius: 10,
                    // borderColor: '#fff',
                    // borderWidth: 2
                },
                itemStyle: { 
                    borderRadius: 10, 
                    borderColor: '#fff', 
                    borderWidth: 2 
                },
                data: res.data.list
            }
        ]
    }
}
useChart(pieChartRef, getPieOptions)
// 折线图配置
const lineChartRef = ref(null)
const getLineOptions = async() => {
    const { data } = await getChartDataAPI()
    const seriesData = data.list.map((item:any) => ({
        name: item.name,
        type: 'line',
        smooth: true,
        data: item.data,
        areaStyle:{
            opacity: 0.1
        }
    }))
    return {
        title: { text: '趋势统计', left: 'left' },
        tooltip: { trigger: 'axis' },
        legend: { data: data.list.map((i: any) => i.name), top: 'top' },
        grid:{
            top:'15%',
            bottom:'10%',
            left:'3%',
            right:'4%',
            containLabel:true
        },
        xAxis: { 
          type: 'category', 
          boundaryGap: false, 
          data: ['12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00', '02:00', '04:00'] // 这里可以写死或者让后端返回
        },
        yAxis: { type: 'value' },
        series: seriesData
    }
}
useChart(lineChartRef, getLineOptions)
 </script>
 
<style scoped lang="less">
.card-header h3{
    margin:0;
    font-weight: 600;
    color:#1d2129
}
</style>
 