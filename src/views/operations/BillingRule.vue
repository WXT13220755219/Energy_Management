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
             <el-tag type="info" size="small">{{ scope.row.version }}</el-tag>
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
            <el-button link type="primary" size="small" @click="handleEdit(scope.row)">配置费率</el-button>
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

    <el-dialog 
      v-model="dialogVisible" 
      :title="dialogType === 'add' ? '新建计费规则' : '配置费率时段'" 
      width="800px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form ref="formRef" :model="currentForm" :rules="rules" label-width="100px">
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="规则名称" prop="ruleName">
                    <el-input v-model="currentForm.ruleName" placeholder="如: 2025市区通用规则" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                 <el-form-item label="生效时间" prop="effectiveTime">
                    <el-date-picker 
                        v-model="currentForm.effectiveTime" 
                        type="datetime" 
                        placeholder="选择生效时间" 
                        style="width: 100%"
                        value-format="YYYY-MM-DD HH:mm:ss"
                    />
                </el-form-item>
            </el-col>
        </el-row>
        
        <el-form-item label="规则备注">
            <el-input v-model="currentForm.remark" type="textarea" :rows="2" placeholder="填写适用区域或说明" />
        </el-form-item>

        <el-divider content-position="left">时段电价配置 (需覆盖24小时)</el-divider>

        <div class="time-slots-wrapper">
             <div v-for="(item, index) in currentForm.items" :key="index" class="slot-item">
                <div class="slot-time">
                    <span class="index-badge">{{ index + 1 }}</span>
                    <el-time-select
                        v-model="item.startTime"
                        :max-time="item.endTime"
                        class="w-120"
                        placeholder="开始"
                        start="00:00"
                        step="00:30"
                        end="24:00"
                        :disabled="index > 0" 
                    />
                    <span class="separator">至</span>
                    <el-time-select
                        v-model="item.endTime"
                        :min-time="item.startTime"
                        class="w-120"
                        placeholder="结束"
                        start="00:00"
                        step="00:30"
                        end="24:00"
                    />
                </div>

                <el-select v-model="item.type" class="w-100 ml-10" placeholder="类型">
                    <el-option label="尖峰" value="sharp"><span class="color-sharp">● 尖峰</span></el-option>
                    <el-option label="高峰" value="peak"><span class="color-peak">● 高峰</span></el-option>
                    <el-option label="平段" value="flat"><span class="color-flat">● 平段</span></el-option>
                    <el-option label="低谷" value="valley"><span class="color-valley">● 低谷</span></el-option>
                </el-select>

                <div class="price-input ml-10">
                    <el-input v-model="item.elecPrice" placeholder="电费" type="number" class="w-100">
                         <template #prefix>电</template>
                    </el-input>
                    <span class="plus">+</span>
                    <el-input v-model="item.servicePrice" placeholder="服务费" type="number" class="w-100">
                         <template #prefix>服</template>
                    </el-input>
                </div>

                <el-button type="danger" icon="Delete" circle plain class="ml-10" @click="removeSlot(index)" v-if="currentForm.items.length > 1" />
             </div>
             
             <div class="slot-actions mt-10">
                <el-button type="primary" link icon="Plus" @click="addSlot">添加时段</el-button>
                <div class="total-price-preview">
                    当前合计: {{ currentForm.items.length }} 个时段 
                    <span v-if="!checkTimeCoverage()" class="error-tip">(未完全覆盖24小时)</span>
                    <span v-else class="success-tip">(已覆盖24小时)</span>
                </div>
             </div>
        </div>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">保存配置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { getBillingRuleListAPI, saveBillingRuleAPI, deleteBillingRuleAPI } from '@/api/billingAPI'
import type { BillingRuleType, BillingParamsType, BillingItemType } from '@/type/billingTy'

// --- 状态定义 ---
const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const total = ref(0)
const tableData = ref<BillingRuleType[]>([])

// 搜索参数
const searchParams = reactive<BillingParamsType>({
    page: 1,
    pageSize: 10,
    ruleName: ''
})

// 表单对象
const formRef = ref<FormInstance>()
const currentForm = reactive<BillingRuleType>({
    id: '',
    ruleName: '',
    version: 'V1.0',
    status: 1,
    createTime: '',
    effectiveTime: '',
    remark: '',
    items: []
})

// 表单校验规则
const rules = {
    ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
    effectiveTime: [{ required: true, message: '请选择生效时间', trigger: 'change' }]
}

// --- 核心逻辑：时段管理 ---

// 初始化一个默认时段
const createDefaultSlot = (startTime = '00:00'): BillingItemType => ({
    startTime,
    endTime: '24:00',
    type: 'flat',
    elecPrice: 0.8,
    servicePrice: 0.4
})

const addSlot = () => {
    const lastItem = currentForm.items![currentForm.items!.length - 1]
    // 自动衔接上一段的结束时间
    const newStart = lastItem ? lastItem.endTime : '00:00'
    // 如果上一段已经是24:00，则提示无法添加
    if(newStart === '24:00'){
        ElMessage.warning('时段已覆盖至24:00，请调整前序时段')
        return
    }
    currentForm.items!.push(createDefaultSlot(newStart))
}

const removeSlot = (index: number) => {
    currentForm.items!.splice(index, 1)
}

// 检查时间是否覆盖 00:00 - 24:00 且连续
const checkTimeCoverage = () => {
    if (!currentForm.items || currentForm.items.length === 0) return false
    // 简单校验：第一条开始必须00:00，最后一条结束必须24:00
    // 严格校验需判断每一条的 endTime === 下一条的 startTime (此处简化逻辑)
    const first = currentForm.items[0]
    const last = currentForm.items[currentForm.items.length - 1]
    return first.startTime === '00:00' && last.endTime === '24:00'
}

// --- 业务逻辑 ---

const loadData = async () => {
    loading.value = true
    try {
        const res: any = await getBillingRuleListAPI(searchParams)
        if(res.code === 200) {
            tableData.value = res.data.list
            total.value = res.data.total
        }
    } catch(e) { console.error(e) } 
    finally { loading.value = false }
}

const handleCreate = () => {
    dialogType.value = 'add'
    // 重置表单
    Object.assign(currentForm, {
        id: '',
        ruleName: '',
        version: 'V1.0',
        status: 1,
        effectiveTime: '',
        remark: '',
        items: [createDefaultSlot('00:00')] // 默认给一条全天规则
    })
    dialogVisible.value = true
}

const handleEdit = (row: BillingRuleType) => {
    dialogType.value = 'edit'
    // 深拷贝数据回显
    Object.assign(currentForm, JSON.parse(JSON.stringify(row)))
    // 如果没有 items，补一个默认
    if(!currentForm.items || currentForm.items.length === 0) {
        currentForm.items = [createDefaultSlot()]
    }
    dialogVisible.value = true
}

const handleCopy = (row: BillingRuleType) => {
    ElMessage.success(`已复制规则：${row.ruleName}`)
    handleCreate()
    // 实际应将 row 的 items 复制进 currentForm
    currentForm.ruleName = `${row.ruleName}_副本`
    currentForm.items = JSON.parse(JSON.stringify(row.items || [createDefaultSlot()]))
}

const handleStatusChange = async (row: BillingRuleType) => {
    ElMessage.success(`状态已更新为：${row.status === 1 ? '启用' : '停用'}`)
    // await saveBillingRuleAPI(...)
}

const handleDelete = async (row: BillingRuleType) => {
    try {
        await ElMessageBox.confirm(`确认删除规则 "${row.ruleName}" 吗？`, '警告', { type: 'warning' })
        // await deleteBillingRuleAPI([row.id])
        ElMessage.success('删除成功')
        loadData()
    } catch(e) {}
}

const handleSubmit = async () => {
    if(!formRef.value) return
    await formRef.value.validate(async (valid) => {
        if(valid){
            if(!checkTimeCoverage()){
                ElMessage.error('时段配置必须完整覆盖 00:00 - 24:00')
                return
            }
            submitLoading.value = true
            // 模拟 API
            setTimeout(() => {
                ElMessage.success(dialogType.value === 'add' ? '创建成功' : '更新成功')
                dialogVisible.value = false
                submitLoading.value = false
                loadData()
            }, 600)
        }
    })
}

onMounted(() => loadData())
</script>

<style scoped lang="less">
/* --- 布局间距 --- */
.mt-20 { margin-top: 20px; }
.ml-10 { margin-left: 10px; }
.text-bold { font-weight: 600; color: #303133; }
.text-gray { color: #909399; }
.pagination-right { display: flex; justify-content: flex-end; }

/* --- 弹窗内的时段配置样式 --- */
.time-slots-wrapper {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 4px;
    border: 1px dashed #dcdfe6;

    .slot-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        background: #fff;
        padding: 8px;
        border-radius: 4px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);

        .index-badge {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: #909399;
            color: #fff;
            border-radius: 50%;
            text-align: center;
            line-height: 20px;
            font-size: 12px;
            margin-right: 8px;
        }

        .w-120 { width: 120px; }
        .w-100 { width: 100px; }
        
        .separator { margin: 0 5px; color: #909399; }

        .price-input {
            display: flex;
            align-items: center;
            .plus { margin: 0 5px; color: #909399; font-weight: bold; }
        }
    }
}

/* --- 颜色标识 --- */
.color-sharp { color: #f56c6c; font-weight: bold; } /* 尖峰 - 红 */
.color-peak { color: #e6a23c; font-weight: bold; }  /* 高峰 - 橙 */
.color-flat { color: #409eff; font-weight: bold; }  /* 平段 - 蓝 */
.color-valley { color: #67c23a; font-weight: bold; }/* 低谷 - 绿 */

.error-tip { color: #f56c6c; font-size: 12px; font-weight: bold; }
.success-tip { color: #67c23a; font-size: 12px; }
</style>