<template>
  <el-row :gutter="20" class="mb">
    <el-col :span="6" v-for="(item, index) in statCards" :key="index">
      <el-card shadow="hover" class="stat-card" :body-style="{ padding: '20px' }">
        <div class="stat-content">
          <div class="icon-wrapper" :style="{ background: item.bg }">
            <el-icon :size="24" color="#fff">
              <component :is="item.icon" />
            </el-icon>
          </div>
          <div class="text-info">
            <div class="label">{{ item.label }}</div>
            <div class="value">{{ item.value }}</div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>

  <el-row :gutter="20">
    <el-col :span="6">
      <el-card shadow="hover" class="chart-card">
        <template #header>
          <div class="card-header">
            <span>人员结构分布</span>
          </div>
        </template>
        <div ref="chartRef" style="width: 100%; height: 300px;"></div>
        <div class="chart-footer">
          <p>数据实时更新</p>
          <p>统计范围：全公司</p>
        </div>
      </el-card>
    </el-col>

    <el-col :span="18">
      <el-card shadow="hover">
        <template #header>
          <div class="table-header">
            <span class="title">用户权限列表</span>
            <div class="filter-group">
              <el-input 
                v-model="searchParams.name" 
                placeholder="搜索姓名" 
                prefix-icon="Search" 
                style="width: 150px;" 
                clearable
                @clear="loadData"
              />
              <el-select 
                v-model="searchParams.department" 
                placeholder="部门" 
                style="width: 100px; margin: 0 10px;"
                clearable
                @clear="loadData"
              >
                <el-option label="技术部" value="技术部"></el-option>
                <el-option label="运营部" value="运营部"></el-option>
                <el-option label="市场部" value="市场部"></el-option>
              </el-select>
              <el-button type="primary" @click="loadData">查询</el-button>
              <el-button icon="Refresh" circle @click="handleReset"></el-button>
            </div>
          </div>
        </template>

        <el-table 
          :data="tableData" 
          v-loading="loading" 
          stripe 
          style="width: 100%" 
          height="380" 
        >
          <el-table-column label="用户" width="180">
            <template #default="scope">
              <div class="user-info">
                <el-avatar :size="36" :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${scope.row.account}`" />
                <div class="ml-2">
                  <div class="name">{{ scope.row.name }}</div>
                  <div class="account">@{{ scope.row.account }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="职位/部门" width="160">
            <template #default="scope">
              <div class="dept-info">
                <el-tag size="small" effect="light">{{ scope.row.department }}</el-tag>
                <span class="position">{{ scope.row.position }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="phone" label="联系方式" width="130" />
          
          <el-table-column label="权限状态" align="center">
            <template #default="scope">
              <el-tag :type="getAuthType(scope.row.pageAuthority)" effect="plain" round size="small">
                {{ scope.row.pageAuthority === 'admin' ? '管理员' : (scope.row.pageAuthority === 'manager' ? '经理' : '员工') }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="150" align="center" fixed="right">
            <template #default="scope">
              <el-button type="primary" link icon="Edit" @click="handleEdit(scope.row)">授权</el-button>
              <el-button type="danger" link icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            v-model:current-page="searchParams.page"
            v-model:page-size="searchParams.pageSize"
            :page-sizes="[6, 10, 20]"
            layout="total, prev, pager, next"
            :total="total"
            @size-change="loadData"
            @current-change="loadData"
          />
        </div>
      </el-card>
    </el-col>
  </el-row>

  <PermissionDialog ref="permissionDialogRef" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { getSystemAPI } from '@/api/systemAPI'
import type { SystemParamsType } from '@/type/systemTy'
import { ElMessage, ElMessageBox } from 'element-plus'
import PermissionDialog from './components/PermissionDialog.vue'
import { useChart } from '@/hooks/useChart'

// --- 1. 数据定义：调整颜色 ---
const statCards = [
  // 改为更柔和的渐变，或者可以改用纯色
  { label: '系统总用户', value: '1,203', icon: 'User', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }, 
  { label: '在线人数', value: '432', icon: 'Monitor', bg: 'linear-gradient(135deg, #16d9e3 0%, #30c7ec 47%, #46aef7 100%)' }, 
  { label: '管理员', value: '15', icon: 'Key', bg: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' }, 
  { label: '系统状态', value: '运行中', icon: 'Cpu', bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' } 
]

const tableData = ref<SystemParamsType[]>([])
const total = ref<number>(0)
const loading = ref<boolean>(false)
const searchParams = reactive({
    page: 1,
    pageSize: 6, // [修改] 默认只展示6条，防止一页太长
    name: '',
    department: '',
})

const permissionDialogRef = ref<InstanceType<typeof PermissionDialog>>()
const chartRef = ref(null)

// --- 2. 图表逻辑 (左侧) ---
const getChartOption = () => {
  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: '0%', left: 'center', itemWidth: 10, itemHeight: 10 },
    color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'], // 使用 ECharts 经典配色，稳重不花哨
    series: [
      {
        name: '部门分布',
        type: 'pie',
        radius: ['45%', '65%'],
        center: ['50%', '45%'], // 稍微上移，给图例留空间
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 5, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold' }
        },
        data: [
          { value: 1048, name: '技术部' },
          { value: 735, name: '运营部' },
          { value: 580, name: '市场部' },
          { value: 484, name: '客服部' },
          { value: 300, name: '总裁办' }
        ]
      }
    ]
  }
}
useChart(chartRef, getChartOption)

// --- 3. 业务逻辑 ---
const loadData = async () => {
    loading.value = true
    try {
        const res = await getSystemAPI(searchParams)
        if(res.code === 200){
            tableData.value = res.data.list
            total.value = res.data.total
        }
    } catch(e){
        console.error(e)
    } finally {
      loading.value = false
    }
}

const handleReset = () => {
    searchParams.page = 1
    searchParams.name = ''
    searchParams.department = ''
    loadData()
}

const getAuthType = (auth:string) => {
    if( auth === 'admin') return 'danger'
    if( auth === 'manager') return 'warning'
    return 'info'
}

const handleEdit = (row:SystemParamsType) => {
    permissionDialogRef.value?.open(row)
}

const handleDelete = (row:SystemParamsType) => {
    ElMessageBox.confirm(`确认删除账号 ${row.account}?`, '警告', { type: 'warning' })
    .then( () => { ElMessage.success('删除成功'); loadData() })
    .catch( () => {})
}

onMounted(() => loadData())
</script>

<style scoped lang="less">
.mb { margin-bottom: 20px; }
.ml-2 { margin-left: 10px; }

/* 1. 优化后的卡片样式：白底，简约 */
.stat-card {
  border: none;
  border-radius: 8px; /* 圆角 */
  /* 给整个卡片加一个微弱的阴影，显干净 */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  
  .stat-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .icon-wrapper {
    /* 渐变色现在只在这里 */
    width: 50px;
    height: 50px;
    border-radius: 12px; /* 方形圆角更现代 */
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1); /* 图标增加一点浮起感 */
  }

  .text-info {
    text-align: right;
    .label { font-size: 13px; color: #8c9096; margin-bottom: 5px; }
    .value { font-size: 24px; font-weight: 700; color: #303133; font-family: 'Helvetica Neue', sans-serif; }
  }
}

/* 2. 表格头部样式 */
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .title {
    font-size: 16px;
    font-weight: 600;
    color: #1d2129;
    /* 改为左侧小蓝块装饰，更商务 */
    display: flex;
    align-items: center;
    &::before {
        content: "";
        width: 4px;
        height: 16px;
        background-color: #409eff;
        margin-right: 8px;
        border-radius: 2px;
    }
  }
}

/* 3. 用户信息列 */
.user-info {
  display: flex;
  align-items: center;
  .name { font-weight: 500; font-size: 14px; color: #333; }
  .account { font-size: 12px; color: #999; line-height: 1.2; }
}

.dept-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  .position { font-size: 12px; color: #606266; margin-top: 2px;}
}

/* 4. 左侧图表底部 */
.chart-footer {
  margin-top: 10px;
  text-align: center;
  font-size: 12px;
  color: #909399;
  border-top: 1px dashed #eee;
  padding-top: 15px;
  p { margin: 4px 0; }
}

/* 5. 分页 */
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}
</style>