<template>
    <el-card>
        <el-radio-group v-model="filterLevel" size="large">
            <el-radio-button label="全部告警" :value="0" />
            <el-radio-button label="严重告警" :value="1" />
            <el-radio-button label="紧急告警" :value="2" />
            <el-radio-button label="重要告警" :value="3" />
            <el-radio-button label="一般告警" :value="4" />
        </el-radio-group>
    </el-card>

    <el-card class="mt" v-for="item in filteredList" :key="item.equNo">
        <el-alert 
            :title="`${item.address}充电桩异常`" 
            :type="item.level === 1 ? 'error' : 'warning'" 
            show-icon 
            :closable="false"
        />
        <el-descriptions :column="4" border class="mt">
            <el-descriptions-item v-for="key in Object.keys(item)" :key="key" :label="getLabel(key)">
                <template v-if="key === 'level'">
                    <el-tag :type="item.level===1?'danger':'warning'">
                        {{ item.level===1?'严重':'紧急' }}
                    </el-tag>
                </template>
                <template v-else>
                    {{ item[key] }}
                </template>
            </el-descriptions-item>
            
            <el-descriptions-item label="操作">
                <el-button 
                    type="primary" 
                    size="small" 
                    @click="handleAssign(item)"
                    v-if="item.status === 1"
                >
                    指派
                </el-button>
                <el-button type="info" size="small" v-else>查看</el-button>
            </el-descriptions-item>
        </el-descriptions>
    </el-card>

    <AlarmAssignDrawer ref="drawerRef" @success="loadData" />

</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { getAlarmListAPI } from '@/api/alarmAPI'
import { getLabel } from './fieldLabelMap'
// 1. 引入新组件
import AlarmAssignDrawer from './components/AlarmAssignDrawer.vue'

// --- 基础列表逻辑 ---
const filterLevel = ref(0)
const alarmList = ref<any[]>([])

const loadData = async () => {
    const { data } = await getAlarmListAPI()
    alarmList.value = data
}

onMounted(() => loadData())

const filteredList = computed(() => {
    if (filterLevel.value === 0) return alarmList.value
    return alarmList.value.filter(item => item.level === filterLevel.value)
})

// --- 抽屉交互逻辑 ---

// 2. 定义 ref 变量，绑定到 template 中的子组件标签上
// 注意：类型是 InstanceType<typeof 组件名>，这是 TS 获取组件类型的写法
const drawerRef = ref<InstanceType<typeof AlarmAssignDrawer>>()

// 3. 处理点击指派按钮
const handleAssign = (row: any) => {
    // 调用子组件暴露出来的 open 方法
    // ?. 是可选链操作符，防止 drawerRef 为空时报错
    drawerRef.value?.open(row)
}

</script>

<style lang="less" scoped>
.mt {
    margin-top: 20px;
}
</style>