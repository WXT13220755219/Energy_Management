<template>
  <el-row :gutter="20" >
      <el-col :span="6">
        <el-input placeholder="请输入订单号" v-model="searchParams.orderNo" clearable></el-input>
      </el-col>
      <el-col :span="6">
        <el-select placeholder="全部" v-model="searchParams.status" style="width: 100%;">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="进行中" :value="2"></el-option>
          <el-option label="已完成" :value="3"></el-option>
          <el-option label="订单异常" :value="4"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="设备编号" v-model="searchParams.equipmentNo"></el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="loadData">查询</el-button>
        <el-button type="info" @click="handleReset">重置</el-button>
      </el-col>
      <el-col :span="6" class="mt">
        <el-input placeholder="请输入支付方式" v-model="searchParams.pay"></el-input>
      </el-col>

      <el-col :span="6" class="mt">
          <el-date-picker
              v-model="dateRange"
              type="daterange"
              rannge-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              @change="handleDateChange"
              style="width: 100%"
          />
      </el-col>

  </el-row>
  
  <el-card class="mt">
      <el-button type="danger" icon="Delete" @click="handleBatchDelete">批量删除</el-button>
      <el-button type="primary" icon="Download" @click="handleExport">导出订单数据到 Excel</el-button>
  </el-card>

  <el-card class="mt">
      <el-table :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="55" />
          <el-table-column align="center" label="订单号" prop="orderNo"></el-table-column>
          <el-table-column align="center" label="订单日期" prop="date"></el-table-column>
          <el-table-column align="center" label="开始时间" prop="startTime"></el-table-column>
          <el-table-column align="center" label="结束时间" prop="endTime"></el-table-column>
          <el-table-column align="center" label="设备编号" prop="equipmentNo"></el-table-column>
          
          <el-table-column align="center" label="金额" prop="money" sortable>
              <template #default="scope">
                  <span style="color: #f56c6c">￥{{ scope.row.money }}元</span>
              </template>
          </el-table-column>
          
          <el-table-column align="center" label="支付方式" prop="pay">
              <template #default="scope">
                <el-tag effect="plain" type="info">{{ scope.row.pay }}</el-tag>
              </template>
          </el-table-column>

          <el-table-column align="center" label="订单状态" prop="status">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{ getStatusLabel(scope.row.status) }}</el-tag>
              </template>
          </el-table-column>

          <el-table-column label="操作" align="center">
              <template #default="scope">
                  <el-button type="primary" size="small" link @click="handleDetail(scope.row)">详情</el-button>
                  <el-button type="danger" size="small" link @click="handleDelete(scope.row)">删除</el-button>
              </template>
          </el-table-column>
      </el-table>
      <el-pagination 
        class="fr mb mt"
        v-model:current-page="searchParams.page"
        v-model:page-size="searchParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="loadData"
        @current-change="loadData"
      />
  </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { getBatchDeleteAPI, getOrderAPI, type OrderParamsType } from '@/api/orderAPI'
import type { OrderType } from '@/type/orderTy'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as XLSX from 'xlsx'

// 后端返回的数据
const tableData = ref<OrderType[]>([])
// post给后端的数据
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
const total = ref<number>(0)
//存储选中的行
const selectedRows = ref<OrderType[]>([])
// 日期选择器绑定的数组 [start, end]
const dateRange = ref([])

// 加载表格数据
const loadData = async () => {
  try {
    const res = await getOrderAPI(searchParams)
    if(res.code === 200){
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch(error){
    console.error(error)
  }
}

// 获取 status 类型
const getStatusLabel = (status:number) => {
  if(status === 2) return "进行中"
  if(status === 3) return "已完成"
  if(status === 4) return "订单异常"
  return "未知"
}

// 获取 tag 颜色类型
const getStatusType = (status:number) => {
  switch (status){
    case 2:
      return 'primary'
    case 3:
      return 'success'
    case 4:
      return 'danger'
    default:
      return 'info'
  }
}

// 处理日期变化
const handleDateChange = (val:string[]) => {
    if(val){
        searchParams.startTime = val[0]
        searchParams.endTime = val[1]
    } else {
      searchParams.endTime = ''
      searchParams.startTime = ''
    }
}

// 重置功能
const handleReset = () => {
  searchParams.page = 1
  searchParams.pageSize = 10
  searchParams.orderNo = ''
  searchParams.equipmentNo = ''
  searchParams.status = null
  searchParams.endTime = ''
  searchParams.startTime = ''
  dateRange.value = []
  loadData()
}
// 处理表格多选
const handleSelectionChange = (val:OrderType[]) => {
    selectedRows.value = val
}

// 处理批量删除
const handleBatchDelete = async () => {
  try{
    await ElMessageBox.confirm(
      `确认要删除选中的${selectedRows.value.length}条订单吗？`, '提示',
      {
        type:'warning',
        confirmButtonText:'确认删除',
        cancelButtonText:'取消',
        buttonSize:'small'
      }
    
    )
    // 提取选中的订单号
    const ids = selectedRows.value.map(item => item.orderNo)
    const res = await getBatchDeleteAPI(ids)
    if(res.code === 200){
      ElMessage.success('批量删除成功')
      loadData()
    }
  } catch(e){
    console.log(e)
  }
}

// 处理单个删除
const handleDelete = async (row:OrderType) => {
  try {
    const res = await getBatchDeleteAPI([row.orderNo])
    if(res.code === 200){
      ElMessage.success('删除成功')
      loadData()
    }
  } catch(e) {
    console.error
  }
}

// 处理详情
const handleDetail = (row: OrderType) => {
  ElMessage.info(`查看订单 ${row.orderNo} 的详情`)
}

// 导出到 Excel
const handleExport = () => {
  // 1. 检查有没有数据
  if(tableData.value.length === 0){
    ElMessage.warning('表格中没有数据可导出')
    return
  }
  // 2. 数据格式化
  // Excel 里的列名应该是中文，而且状态要是中文（不是数字 2,3）
  // map 方法：遍历数组，把每一项变成新的格式
  const exportList = tableData.value.map( item => {
    return {
      '订单号': item.orderNo,        // 左边是Excel表头，右边是数据
      '订单日期': item.date,
      '开始时间': item.startTime,
      '结束时间': item.endTime,
      '设备编号': item.equipmentNo,
      '金额(元)': item.money,
      '支付方式': item.pay,
      '状态': getStatusLabel(item.status) // 把数字转成中文
    }
  })
  // 3. 创建一个工作表 (Work Sheet)
  // json_to_sheet：把 JSON 数据对象直接变成 Excel 的 Sheet
  const ws = XLSX.utils.json_to_sheet(exportList)

  // 4. 创建一个工作簿 (Work Book)
  const wb = XLSX.utils.book_new()

  // 5. 把工作表添加到工作簿中，命名为 "订单列表"
  XLSX.utils.book_append_sheet(wb,ws,'订单列表')

  // 6. 写入文件并触发下载
  XLSX.writeFile(wb, "订单数据导出.xlsx")

}

onMounted( () => loadData() )

</script>

<style scoped>
:deep(.el-table .el-checkbox__inner) {
    /* 原来的颜色太浅(可能是 #dcdfe6)，我们把它改成深灰色 
       #606266 是 Element Plus 文字的默认深灰色，足够清晰
       或者你可以用 #333 (接近黑色)
    */
    border-color: #606266; 
}
</style>
