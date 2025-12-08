<template>
  <div class="stats-container mb">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="stats-card">
          <template #header>
            <div class="card-header">
              <span>今日订单数</span>
              <el-tag type="success">日</el-tag>
            </div>
          </template>
          <div class="stats-value">1,203</div>
          <div class="stats-desc">较昨日 <span class="up">+15%</span></div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stats-card">
          <template #header>
            <div class="card-header">
              <span>今日营收</span>
              <el-tag type="warning">元</el-tag>
            </div>
          </template>
          <div class="stats-value">¥ 45,230</div>
          <div class="stats-desc">较昨日 <span class="down">-2%</span></div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stats-card is-danger">
          <template #header>
            <div class="card-header">
              <span>异常订单</span>
              <el-tag type="danger">急</el-tag>
            </div>
          </template>
          <div class="stats-value">3</div>
          <div class="stats-desc">待处理退款</div>
        </el-card>
      </el-col>
       <el-col :span="6">
        <el-card shadow="hover" class="stats-card">
           <template #header>
            <div class="card-header">
              <span>活跃设备</span>
              <el-tag>台</el-tag>
            </div>
          </template>
          <div class="stats-value">185</div>
          <div class="stats-desc">总设备 200</div>
        </el-card>
      </el-col>
    </el-row>
  </div>

  <el-card shadow="never">
    <div class="search-wrapper">
        <el-form :inline="true" :model="searchParams" class="demo-form-inline">
            <el-form-item label="订单号">
                <el-input v-model="searchParams.orderNo" placeholder="请输入订单号" clearable />
            </el-form-item>
             <el-form-item label="状态">
                <el-select v-model="searchParams.status" placeholder="全部状态" style="width: 120px;">
                    <el-option label="全部" :value="0"></el-option>
                    <el-option label="进行中" :value="2"></el-option>
                    <el-option label="已完成" :value="3"></el-option>
                    <el-option label="异常" :value="4"></el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="日期范围">
                <el-date-picker
                    v-model="dateRange"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始"
                    end-placeholder="结束"
                    value-format="YYYY-MM-DD"
                    @change="handleDateChange"
                    style="width: 240px"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="loadData">查询</el-button>
                <el-button icon="Refresh" @click="handleReset">重置</el-button>
                <el-button type="success" plain icon="Download" @click="handleExport" class="ml">导出Excel</el-button>
                <el-button type="danger" plain icon="Delete" @click="handleBatchDelete">批量删除</el-button>
            </el-form-item>
        </el-form>
    </div>

    <el-table :data="tableData" @selection-change="handleSelectionChange" border stripe header-cell-class-name="table-header-gray">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="订单号" prop="orderNo" width="180" fixed="left"></el-table-column>
        <el-table-column align="center" label="设备编号" prop="equipmentNo"></el-table-column>
        <el-table-column align="center" label="金额" prop="money" sortable>
            <template #default="scope">
                <span class="money-text">¥ {{ scope.row.money }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="状态" prop="status">
            <template #default="scope">
                <div class="status-dot">
                    <span :class="['dot', getStatusColorClass(scope.row.status)]"></span>
                    <span>{{ getStatusLabel(scope.row.status) }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column align="center" label="支付方式" prop="pay"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="date" width="180"></el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
            <template #default="scope">
                <el-button type="primary" size="small" link @click="handleDetail(scope.row)">详情</el-button>
                <el-button type="danger" size="small" link @click="handleDelete(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div class="pagination-wrapper mt">
        <el-pagination 
            v-model:current-page="searchParams.page"
            v-model:page-size="searchParams.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="loadData"
            @current-change="loadData"
        />
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { getBatchDeleteAPI, getOrderAPI, type OrderParamsType } from '@/api/orderAPI'
import type { OrderType } from '@/type/orderTy'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as XLSX from 'xlsx'

// --- 状态定义 ---
// TS: 明确泛型类型 <OrderType[]>，防止类型推断错误
const tableData = ref<OrderType[]>([])
const total = ref<number>(0)
const selectedRows = ref<OrderType[]>([])
const dateRange = ref([])

// TS: 使用接口定义搜索参数，保证类型安全
const searchParams = reactive<OrderParamsType>({
  page: 1,
  pageSize: 10,
  orderNo: '',
  equipmentNo: '',
  status: null,
  pay: '',
  startTime: '',
  endTime: ''
})

// --- 方法定义 ---

// 获取数据：异步操作建议使用 async/await 和 try/catch
const loadData = async () => {
  try {
    const res = await getOrderAPI(searchParams)
    if(res.code === 200){
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch(error){
    console.error("加载订单数据失败:", error)
  }
}

// 获取状态对应的CSS类名（用于自定义圆点样式）
const getStatusColorClass = (status: number) => {
    switch(status) {
        case 2: return 'is-primary'; // 进行中 - 蓝色
        case 3: return 'is-success'; // 已完成 - 绿色
        case 4: return 'is-danger';  // 异常 - 红色
        default: return 'is-info';
    }
}

const getStatusLabel = (status:number) => {
  const map: Record<number, string> = {
      2: "进行中",
      3: "已完成",
      4: "订单异常"
  }
  return map[status] || "未知"
}

// 处理日期筛选
const handleDateChange = (val:string[]) => {
    if(val){
        searchParams.startTime = val[0]
        searchParams.endTime = val[1]
    } else {
      searchParams.endTime = ''
      searchParams.startTime = ''
    }
}

const handleReset = () => {
    // 重置所有搜索条件
    searchParams.orderNo = ''
    searchParams.status = null
    dateRange.value = []
    handleDateChange([]) // 确保重置时间参数
    loadData()
}

const handleSelectionChange = (val:OrderType[]) => {
    selectedRows.value = val
}

// 批量删除逻辑
const handleBatchDelete = async () => {
    if(selectedRows.value.length === 0) {
        ElMessage.warning('请先勾选需要删除的订单')
        return
    }
    try{
        await ElMessageBox.confirm(`确认删除选中的 ${selectedRows.value.length} 条订单？`, '高风险操作', {
            type: 'warning',
            confirmButtonText: '确定删除',
            cancelButtonText: '取消'
        })
        const ids = selectedRows.value.map(item => item.orderNo)
        const res = await getBatchDeleteAPI(ids)
        if(res.code === 200){
            ElMessage.success('批量删除成功')
            loadData()
        }
    } catch(e) {
        // 用户取消或API错误
        console.log(e)
    }
}

const handleDelete = async (row: OrderType) => {
    // 复用 API 逻辑，包装成数组
    try {
        await ElMessageBox.confirm('确认删除该条订单记录吗？', '提示', { 
          type: 'warning',
          confirmButtonText: '确定删除',
          cancelButtonText: '取消'
        
        })
        const res = await getBatchDeleteAPI([row.orderNo])
        if(res.code === 200) {
            ElMessage.success('删除成功')
            loadData()
        }
    } catch(e) {}
}

const handleDetail = (row: OrderType) => {
    ElMessage.info(`查看详情：${row.orderNo}`)
}

// 导出Excel功能
const handleExport = () => {
    if(!tableData.value.length) return ElMessage.warning('无数据可导出')
    
    const exportList = tableData.value.map(item => ({
        '订单号': item.orderNo,
        '日期': item.date,
        '金额': item.money,
        '状态': getStatusLabel(item.status)
    }))
    
    const ws = XLSX.utils.json_to_sheet(exportList)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '订单报表')
    XLSX.writeFile(wb, `订单数据_${new Date().getTime()}.xlsx`)
}

onMounted(() => loadData())
</script>

<style scoped lang="less">
/* --- 顶部统计卡片样式 --- */
.stats-card {
    /* 保持卡片高度一致 */
    height: 140px; 
    border: none;
    /* 增加过渡效果，鼠标悬停时上浮 */
    transition: transform 0.3s, box-shadow 0.3s;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.05);
    }
    
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #606266;
        font-size: 14px;
    }
    
    .stats-value {
        font-size: 28px;
        font-weight: bold;
        color: #303133;
        margin-top: 10px;
        font-family: 'DIN', sans-serif; /* 使用数字字体 */
    }
    
    .stats-desc {
        font-size: 12px;
        color: #909399;
        margin-top: 8px;
        
        .up { color: #67c23a; }   /* 上升 - 绿色 */
        .down { color: #f56c6c; } /* 下降 - 红色 */
    }
    
    /* 异常卡片的特殊样式 */
    &.is-danger {
        background: #fef0f0;
        .stats-value { color: #f56c6c; }
    }
}

/* --- 表格样式优化 --- */
.money-text {
    color: #303133;
    font-weight: 600;
    font-family: Consolas, monospace; /* 等宽字体对齐数字 */
}

/* 状态圆点设计：比Tag更简约 */
.status-dot {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    
    .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        
        &.is-primary { background-color: #409eff; }
        &.is-success { background-color: #67c23a; }
        &.is-danger { background-color: #f56c6c; }
        &.is-info { background-color: #909399; }
    }
}

/* 简单的辅助类 */
.mt { margin-top: 20px; }
.mb { margin-bottom: 20px; }
.ml-auto { margin-left: auto; } /* 自动左边距，把元素挤到右边 */
.pagination-wrapper {
    display: flex;
    justify-content: flex-end; /* 分页靠右 */
}
</style>