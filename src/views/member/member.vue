<template>
  <el-card shadow="never" class="header-card">
    <div class="header-content">
      <div class="left-panel">
        <h3 class="title">会员列表</h3>
        <span class="subtitle">管理所有注册会员及储值卡信息</span>
      </div>
      <div class="right-panel">
        <el-button type="primary" icon="Plus" @click="handleCreate">新增会员</el-button>
        <el-button plain icon="Upload" @click="importVisible = true">批量导入</el-button>
      </div>
    </div>
    
    <div class="filter-section mt">
      <el-input v-model="searchParams.name" placeholder="搜索会员姓名" class="w-200" prefix-icon="User" clearable @clear="loadData" />
      <el-input v-model="searchParams.tel" placeholder="搜索手机号" class="w-200 ml" prefix-icon="Iphone" clearable @clear="loadData"/>
      <el-input v-model="searchParams.no" placeholder="会员卡号" class="w-200 ml" prefix-icon="CreditCard" clearable @clear="loadData"/>
      <el-button type="primary" plain class="ml" @click="loadData">查询</el-button>
    </div>
  </el-card>

  <el-card shadow="never" class="mt table-card">
    <el-table :data="tableData" size="large" :header-cell-style="{background:'#f5f7fa'}" v-loading="loading">
        <el-table-column label="会员信息" min-width="180">
          <template #default="scope">
            <div class="user-info">
              <el-avatar :size="40" :class="getAvatarClass(scope.row.cardType)">
                 {{ scope.row.holderName ? scope.row.holderName.charAt(0) : 'User' }}
              </el-avatar>
              <div class="user-detail">
                <div class="name">
                    {{ scope.row.holderName }}
                    <el-tag v-if="scope.row.status === 0" type="danger" size="small" effect="dark" class="ml-status">已冻结</el-tag>
                </div>
                <div class="phone">{{ scope.row.holderPhone }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="会员卡" min-width="160">
           <template #default="scope">
             <div class="card-info">
                <el-tag effect="light" :type="getCardTypeTag(scope.row.cardType)" size="small" class="mb-5">
                    {{ scope.row.cardType }}
                </el-tag>
                <div class="card-no">{{ scope.row.memberCardNumber }}</div>
             </div>
           </template>
        </el-table-column>
        
        <el-table-column label="开卡日期" prop="issueDate" width="120" align="center"></el-table-column>
        
        <el-table-column label="账户余额" prop="cardBalance" align="right" min-width="120">
             <template #default="scope">
                <div class="balance-wrapper">
                    <span class="currency">¥</span>
                    <span class="amount">{{ scope.row.cardBalance }}</span>
                </div>
            </template>
        </el-table-column>

        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="handleRecharge(scope.row)" :disabled="scope.row.status === 0">充值</el-button>
            
            <el-popconfirm 
                :title="scope.row.status === 1 ? '确认冻结该会员账户吗？' : '确认解除该账户的冻结状态？'"
                @confirm="handleFreeze(scope.row)"
                width="200"
            >
                <template #reference>
                    <el-button link :type="scope.row.status === 1 ? 'danger' : 'success'">
                        {{ scope.row.status === 1 ? '冻结' : '解冻' }}
                    </el-button>
                </template>
            </el-popconfirm>

            <el-divider direction="vertical" />
            
            <el-popover placement="left" :width="320" trigger="click">
              <template #reference>
                <el-button link type="info">明细</el-button>
              </template>
              <h4 class="pop-title">近期交易记录</h4>
              <div class="transaction-list">
                  <div v-if="scope.row.transactionRecords?.length" class="timeline-box">
                      <div v-for="(item, i) in scope.row.transactionRecords" :key="i" class="timeline-item">
                          <span class="time">{{ item.transactionDate }}</span>
                          <span class="type">{{ item.transactionType }}</span>
                          <span class="money" :class="{'is-add': item.transactionType.includes('充值')}">
                              {{ item.transactionType.includes('充值') ? '+' : '-' }}{{ item.transactionAmount }}
                          </span>
                      </div>
                  </div>
                  <div v-else class="empty-text">暂无记录</div>
              </div>
            </el-popover>
          </template>
        </el-table-column>
    </el-table>

    <div class="pagination-right mt">
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

  <MemberEditDialog ref="editDialogRef" @success="loadData" />

  <el-dialog v-model="rechargeVisible" title="会员充值" width="400px">
      <div v-if="currentMember" class="recharge-content">
          <p>会员姓名：<strong>{{ currentMember.holderName }}</strong></p>
          <p>当前余额：<span class="text-red">¥ {{ currentMember.cardBalance }}</span></p>
          <div class="input-area mt">
              <el-input-number 
                  v-model="rechargeAmount" 
                  :min="1" 
                  :step="100" 
                  size="large" 
                  style="width: 100%;"
                  placeholder="请输入充值金额"
              >
                <template #prefix>¥</template>
              </el-input-number>
          </div>
          <div class="quick-select mt">
              <el-tag v-for="amount in [100, 200, 500, 1000]" :key="amount" 
                  class="amount-tag" 
                  @click="rechargeAmount = amount"
                  :effect="rechargeAmount === amount ? 'dark' : 'plain'"
                  cursor="pointer"
              >
                  {{ amount }}元
              </el-tag>
          </div>
      </div>
      <template #footer>
          <el-button @click="rechargeVisible = false">取消</el-button>
          <el-button type="primary" @click="submitRecharge" :loading="btnLoading">确认充值</el-button>
      </template>
  </el-dialog>

  <el-dialog v-model="importVisible" title="批量导入会员" width="500px">
      <el-upload
          class="upload-demo"
          drag
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" 
          :auto-upload="false"
          :on-change="handleFileChange"
          multiple
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将 Excel 文件拖到此处，或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            只能上传 xls/xlsx 文件，且不超过 5MB。<el-link type="primary">下载模板</el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
          <el-button @click="importVisible = false">取消</el-button>
          <el-button type="primary" @click="submitImport" :loading="btnLoading">开始导入</el-button>
      </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue' // 引入图标
import type { MemberType } from '@/type/memberTy'
import { getMemberAPI, type MemberParamsType } from '@/api/memberAPI'
import { ElMessage } from 'element-plus'
import MemberEditDialog from './components/MemberEditDialog.vue'

// --- 类型扩展 ---
// 前端临时扩展 status 字段 (1:正常, 0:冻结)，实际需后端支持
interface MemberTypeExtended extends MemberType {
    status?: number 
}

// --- 状态与数据 ---
const loading = ref(false)
const btnLoading = ref(false)
const total = ref<number>(0)
const tableData = ref<MemberTypeExtended[]>([]) // 使用扩展后的类型
const searchParams = reactive<MemberParamsType>({
    page: 1,
    pageSize:10,
    no: '', 
    tel: '',
    name: ''
})

// 弹窗控制
const editDialogRef = ref<InstanceType<typeof MemberEditDialog> | null>(null)
const rechargeVisible = ref(false)
const importVisible = ref(false)

// 充值相关
const currentMember = ref<MemberTypeExtended | null>(null)
const rechargeAmount = ref(100)

// --- API 方法 ---
const loadData = async () => {
  loading.value = true
  try {
    const res = await getMemberAPI(searchParams)
    // 模拟后端数据：手动给每条数据加上 status 字段，默认 1 (正常)
    tableData.value = res.data.list.map((item: any) => ({
        ...item,
        status: item.status !== undefined ? item.status : 1 
    }))
    total.value = res.data.total
  } catch (error){
    console.error("加载会员失败", error)
  } finally {
    loading.value = false
  }
}

// --- 业务逻辑：新增 ---
const handleCreate = () => {
    editDialogRef.value?.open() // 打开子组件弹窗
}

// --- 业务逻辑：充值 ---
const handleRecharge = (row: MemberTypeExtended) => {
    currentMember.value = row
    rechargeAmount.value = 100 // 重置默认金额
    rechargeVisible.value = true
}

const submitRecharge = () => {
    if(!currentMember.value) return
    btnLoading.value = true
    // 模拟 API 请求
    setTimeout(() => {
        ElMessage.success(`成功为 ${currentMember.value?.holderName} 充值 ${rechargeAmount.value} 元`)
        // 前端模拟更新余额
        currentMember.value!.cardBalance += rechargeAmount.value 
        // 增加一条交易记录
        currentMember.value!.transactionRecords?.unshift({
            transactionDate: new Date().toISOString().split('T')[0],
            transactionType: '柜台充值',
            transactionAmount: rechargeAmount.value
        })
        rechargeVisible.value = false
        btnLoading.value = false
    }, 800)
}

// --- 业务逻辑：冻结/解冻 ---
const handleFreeze = (row: MemberTypeExtended) => {
    // 1: 正常, 0: 冻结
    const newStatus = row.status === 1 ? 0 : 1
    const actionText = newStatus === 0 ? '冻结' : '解冻'
    
    // 模拟 API
    loading.value = true
    setTimeout(() => {
        row.status = newStatus
        ElMessage.success(`已成功${actionText}该账户`)
        loading.value = false
    }, 500)
}

// --- 业务逻辑：导入 ---
const handleFileChange = (uploadFile: any) => {
    console.log('File selected:', uploadFile)
}
const submitImport = () => {
    btnLoading.value = true
    setTimeout(() => {
        ElMessage.success('成功导入 12 条会员数据')
        importVisible.value = false
        btnLoading.value = false
        loadData() // 刷新列表
    }, 1000)
}

// --- 样式辅助函数 ---
const getCardTypeTag = (type: string) => {
    if(type.includes('金')) return 'warning'
    if(type.includes('钻')) return 'danger' // 钻石卡用红色
    return 'info'
}

const getAvatarClass = (type: string) => {
    if(type.includes('金')) return 'bg-gold'
    if(type.includes('钻')) return 'bg-diamond'
    return 'bg-blue'
}

onMounted(() => loadData())
</script>

<style scoped lang="less">
/* --- 布局工具类 --- */
.w-200 { width: 200px; }
.ml { margin-left: 12px; }
.mt { margin-top: 20px; }
.mb-5 { margin-bottom: 5px; }
.ml-status { margin-left: 8px; transform: scale(0.8); }

/* --- 顶部卡片 --- */
.header-card {
    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        .title { margin: 0; font-size: 18px; color: #303133; }
        .subtitle { font-size: 12px; color: #909399; margin-top: 4px; display: block;}
    }
}

/* --- 表格内容自定义 --- */
.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .el-avatar {
        color: #fff;
        font-size: 14px;
        &.bg-blue { background: #409eff; }
        &.bg-gold { background: #e6a23c; } /* 金卡颜色 */
        &.bg-diamond { background: #722ed1; } /* 钻石卡颜色 */
    }

    .user-detail {
        display: flex;
        flex-direction: column;
        .name { font-weight: 600; font-size: 14px; color: #303133; display: flex; align-items: center;}
        .phone { font-size: 12px; color: #909399; margin-top: 2px;}
    }
}

.card-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .card-no { font-family: monospace; color: #606266; letter-spacing: 0.5px; }
}

.balance-wrapper {
    font-weight: bold;
    color: #f56c6c; 
    .currency { font-size: 12px; margin-right: 2px; }
    .amount { font-size: 16px; }
}

/* --- 充值弹窗样式 --- */
.recharge-content {
    font-size: 15px;
    .text-red { color: #f56c6c; font-size: 18px; font-weight: bold; }
}
.quick-select {
    display: flex;
    gap: 10px;
    .amount-tag { cursor: pointer; transition: all 0.2s; &:active { transform: scale(0.95); } }
}

/* --- Popover 明细样式 --- */
.pop-title {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #303133;
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 8px;
}
.timeline-item {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-bottom: 10px;
    color: #606266;
    .money { 
        font-weight: bold; 
        color: #67c23a; /* 支出绿色 */
        &.is-add { color: #f56c6c; } /* 充值红色 */
    }
}
.empty-text { text-align: center; color: #909399; padding: 10px; font-size: 12px; }
.pagination-right { display: flex; justify-content: flex-end; }
</style>