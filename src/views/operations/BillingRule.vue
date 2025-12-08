<template>
  <div class="billing-container">

    <el-card shadow="never" class="header-card">
      <el-form :inline="true" :model="searchParams" class="search-form">
        <el-form-item label="规则名称">
          <el-input v-model="searchParams.ruleName" placeholder="请输入规则名称" clearable @clear="loadData" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="loadData">查询</el-button>
          <el-button type="success" icon="Plus" @click="handleCreate">新建计费规则</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt-20 table-card">
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column type="index" label="#" width="50" align="center" />
        
        <el-table-column prop="ruleName" label="规则名称" min-width="180" show-overflow-tooltip>
           <template #default="scope">
             <span class="text-bold">{{ scope.row.ruleName }}</span>
           </template>
        </el-table-column>
        
        <el-table-column prop="version" label="版本号" width="100" align="center">
           <template #default="scope">
             <el-tag type="info" size="small" effect="plain">{{ scope.row.version }}</el-tag>
           </template>
        </el-table-column>
        
        <el-table-column label="状态" width="100" align="center">
          <template #default="scope">
            <el-switch 
                v-model="scope.row.status" 
                :active-value="1" 
                :inactive-value="0"
                inline-prompt
                active-text="启用"
                inactive-text="停用"
                @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="effectiveTime" label="生效时间" width="180" align="center" />
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="180" align="center" class-name="text-gray" />

        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleEdit(scope.row)">配置</el-button>
            <el-button link type="primary" size="small" @click="handleCopy(scope.row)">复制</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-right mt-20">
        <el-pagination
          v-model:current-page="searchParams.page"
          v-model:page-size="searchParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
          background
        />
      </div>
    </el-card>

    <BillingRuleDialog 
      v-model:visible="dialogVisible" 
      :rowdata="currentRow"
      @success="loadData"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBillingRuleListAPI, saveBillingRuleAPI, deleteBillingRuleAPI } from '@/api/billingAPI'
import type { BillingRuleType, BillingParamsType } from '@/type/billingTy'
// 引入子组件
import BillingRuleDialog from './components/BillingRuleDialog.vue'

// --- 状态定义 ---
const loading = ref(false)
const tableData = ref<BillingRuleType[]>([])
const total = ref(0)

// 弹窗控制
const dialogVisible = ref(false)
const currentRow = ref<BillingRuleType | undefined>(undefined)

// 搜索参数
const searchParams = reactive<BillingParamsType>({
    page: 1,
    pageSize: 10,
    ruleName: ''
})

// --- 业务逻辑 ---

// 1. 加载列表
const loadData = async () => {
    loading.value = true
    try {
        const res: any = await getBillingRuleListAPI(searchParams)
        if(res.code === 200) {
            tableData.value = res.data.list
            total.value = res.data.total
        }
    } catch(e) { 
        console.error(e) 
    } finally { 
        loading.value = false 
    }
}

// 2. 新建
const handleCreate = () => {
    currentRow.value = undefined // 传递空数据给子组件
    dialogVisible.value = true
}

// 3. 编辑
const handleEdit = (row: BillingRuleType) => {
    // 传递当前行数据
    currentRow.value = row
    dialogVisible.value = true
}

// 4. 复制
const handleCopy = (row: BillingRuleType) => {
    // 构造一个"副本"数据传给子组件
    // 注意：这里我们手动把 id 去掉，并修改名称，这样子组件会识别为"新增"但带有预设数据
    const copyData = JSON.parse(JSON.stringify(row))
    copyData.id = '' // 清空ID
    copyData.ruleName = `${row.ruleName}_副本`
    
    currentRow.value = copyData
    dialogVisible.value = true
    ElMessage.success('已载入模板数据，保存后生效')
}

// 5. 删除
const handleDelete = async (row: BillingRuleType) => {
    try {
        await ElMessageBox.confirm(`确认删除规则 "${row.ruleName}" 吗？此操作不可恢复。`, '删除警告', { 
            type: 'warning',
            confirmButtonText: '确认删除',
            cancelButtonText: '取消'
        })
        
        // 这里的 id 需要断言或确保存在
        if(row.id) {
            const res: any = await deleteBillingRuleAPI([row.id])
            if(res.code === 200) {
                ElMessage.success('删除成功')
                loadData() // 刷新列表
            }
        }
    } catch(e) {
        // 用户取消或API错误
    }
}

// 6. 状态切换
const handleStatusChange = async (row: BillingRuleType) => {
    try {
        // 直接调用保存接口更新状态
        // 注意：Mock 接口里我们是把整个对象传进去覆盖的，这符合 saveBillingRuleAPI 的逻辑
        await saveBillingRuleAPI(row)
        ElMessage.success(`状态已更新`)
    } catch(e) {
        // 如果失败，回滚状态（简单处理：刷新列表）
        row.status = row.status === 1 ? 0 : 1
        ElMessage.error('更新状态失败')
    }
}

onMounted(() => loadData())
</script>

<style scoped lang="less">
.mt-20 { margin-top: 20px; }
.text-bold { font-weight: 600; color: #303133; }
.text-gray { color: #909399; }
.pagination-right { display: flex; justify-content: flex-end; }
</style>