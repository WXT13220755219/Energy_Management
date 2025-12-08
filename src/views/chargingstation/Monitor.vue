<template>
  <div class="monitor-container">
    <el-card shadow="hover" class="search-card">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="站点名称">
          <el-input 
            v-model="queryParams.name" 
            placeholder="请输入站点名称" 
            clearable 
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        
        <el-form-item label="运营状态">
          <el-select v-model="queryParams.status" placeholder="全部状态" clearable style="width: 150px">
            <el-option label="正常使用" :value="1" />
            <el-option label="拥挤" :value="2" />
            <el-option label="维修中" :value="3" />
            <el-option label="建设中" :value="4" />
            <el-option label="故障" :value="5" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
          <el-button icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover" class="table-card mt">
      <div class="table-header mb">
        <div class="left-panel">
          <span class="title">充电站列表</span>
        </div>
        <div class="right-panel">
          <el-button type="primary" icon="Plus" @click="handleAdd">新增站点</el-button>
        </div>
      </div>

      <el-table 
        v-loading="loading" 
        :data="tableData" 
        border 
        stripe 
        style="width: 100%"
      >
        <el-table-column prop="id" label="编号" width="120" fixed />
        <el-table-column prop="name" label="站点名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="city" label="城市" width="100" />
        
        <el-table-column label="桩群规模" width="160">
          <template #default="{ row }">
            <div class="pile-info">
              <el-tag size="small" type="success" effect="plain">快: {{ row.fast }}</el-tag>
              <el-tag size="small" type="info" effect="plain" class="ml-5">慢: {{ row.slow }}</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="实时状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="now" label="在线使用" width="100" align="center">
          <template #default="{ row }">
            <span :class="{'text-active': row.now > 0}">{{ row.now }} 台</span>
          </template>
        </el-table-column>

        <el-table-column prop="fault" label="故障告警" width="100" align="center">
          <template #default="{ row }">
            <span v-if="row.fault > 0" class="text-danger">{{ row.fault }}</span>
            <span v-else class="text-gray">-</span>
          </template>
        </el-table-column>

        <el-table-column label="联系人" width="180">
          <template #default="{ row }">
            <div>
              <el-icon class="mr-5"><User /></el-icon>{{ row.person }}
            </div>
            <div class="text-gray text-small">
              <el-icon class="mr-5"><Phone /></el-icon>{{ row.tel }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container mt">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <StationEditDialog ref="dialogRef" @refresh="loadData" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getStationListAPI, deleteStationAPI } from '@/api/stationAPI'
import type { StationItem, StationQuery } from '@/type/stationTy'
import StationEditDialog from './components/StationEditDialog.vue'

// === 状态定义 ===
const loading = ref(false)
const total = ref(0)
const dialogRef = ref<InstanceType<typeof StationEditDialog>>()

// 查询参数
const queryParams = reactive<StationQuery>({
  name: '',
  status: null,
  page: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<StationItem[]>([])

// 状态字典映射
const statusMap: Record<number, { text: string; type: string }> = {
  1: { text: '正常使用', type: 'success' },
  2: { text: '拥挤', type: 'warning' },
  3: { text: '维修中', type: 'info' },
  4: { text: '建设中', type: 'primary' },
  5: { text: '故障', type: 'danger' }
}

// === 方法定义 ===

// 获取列表数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getStationListAPI(queryParams)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取站点列表失败', error)
  } finally {
    loading.value = false
  }
}

// 辅助函数：获取状态样式
const getStatusType = (status: number) => statusMap[status]?.type || ''
const getStatusText = (status: number) => statusMap[status]?.text || '未知'

// 搜索
const handleSearch = () => {
  queryParams.page = 1 // 重置到第一页
  loadData()
}

// 重置
const handleReset = () => {
  queryParams.name = ''
  queryParams.status = null
  handleSearch()
}

// 分页处理
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  loadData()
}
const handlePageChange = (val: number) => {
  queryParams.page = val
  loadData()
}

// 新增
const handleAdd = () => {
  dialogRef.value?.open()
}

// 编辑
const handleEdit = (row: StationItem) => {
  dialogRef.value?.open(row)
}

// 删除
const handleDelete = (row: StationItem) => {
  ElMessageBox.confirm(
    `确定要删除站点 "${row.name}" 吗？此操作不可恢复。`,
    '警告',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const res = await deleteStationAPI({ id: row.id })
      if (res.code === 200) {
        ElMessage.success('删除成功')
        // 如果当前页只有一条数据且不是第一页，则回退一页
        if (tableData.value.length === 1 && queryParams.page > 1) {
          queryParams.page--
        }
        loadData()
      }
    } catch (error) {
      console.error(error)
    }
  })
}

// 生命周期钩子
onMounted(() => {
  loadData()
})
</script>

<style scoped lang="less">
/* 布局与间距 */
.mt { margin-top: 15px; }
.mb { margin-bottom: 15px; }
.ml-5 { margin-left: 5px; }
.mr-5 { margin-right: 5px; }

/* 头部操作栏 */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    padding-left: 10px;
    border-left: 4px solid #409EFF; // 蓝色竖条装饰
  }
}

/* 文本样式 */
.text-danger { color: #F56C6C; font-weight: bold; }
.text-active { color: #409EFF; font-weight: bold; }
.text-gray { color: #909399; }
.text-small { font-size: 12px; }

/* 表格内元素微调 */
.pile-info {
  display: flex;
  align-items: center;
}

/* 分页居右 */
.pagination-container {
  display: flex;
  justify-content: flex-end;
}
</style>