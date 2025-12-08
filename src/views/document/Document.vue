<template>
  <div class="investment-container">
    <el-row :gutter="20" class="mb-20">
      <el-col :span="6" v-for="(card, index) in statCards" :key="index">
        <el-card shadow="hover" class="stat-card-simple">
          <div class="stat-body">
            <div class="icon-wrapper" :class="card.colorClass">
              <el-icon><component :is="card.icon" /></el-icon>
            </div>
            <div class="text-wrapper">
              <div class="label">{{ card.label }}</div>
              <div class="number">{{ card.value }}<span class="unit">{{ card.unit }}</span></div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="main-content">
      <el-col :span="18">
        <el-card shadow="never" class="table-panel">
          <div class="toolbar">
            <div class="filters">
              <el-input 
                v-model="searchParams.title" 
                placeholder="搜索文案标题..." 
                prefix-icon="Search"
                style="width: 200px"
                clearable
                @clear="loadData"
              />
              <el-select v-model="filterStatus" placeholder="状态" style="width: 120px" class="ml-10" clearable @change="handleFilter">
                <el-option label="已发布" value="published" />
                <el-option label="审核中" value="auditing" />
                <el-option label="草稿" value="draft" />
              </el-select>
              <el-button type="primary" class="ml-10" @click="loadData">查询</el-button>
            </div>
            <div class="actions">
              <el-button type="success" plain icon="Plus" @click="handleCreate">新建文案</el-button>
              <el-button icon="Refresh" circle @click="loadData"></el-button>
            </div>
          </div>

          <el-table :data="tableData" v-loading="loading" stripe class="mt-20 custom-table">
            <el-table-column label="文案信息" min-width="250">
              <template #default="scope">
                <div class="doc-info">
                  <div class="doc-icon">
                    <el-icon v-if="scope.row.type === '政策'" class="text-blue"><Files /></el-icon>
                    <el-icon v-else class="text-orange"><Flag /></el-icon>
                  </div>
                  <div class="doc-text">
                    <div class="title link-type" @click="handlePreview(scope.row)">{{ scope.row.title }}</div>
                    <div class="sub-info">
                      <el-tag size="small" type="info" effect="plain">{{ scope.row.type }}</el-tag>
                      <span class="author">发布人: {{ scope.row.publisher }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="状态" width="100" align="center">
              <template #default="scope">
                <el-tag v-if="scope.row.level === '一级'" type="success" size="small" effect="light">
                  <span class="dot-success"></span>已发布
                </el-tag>
                <el-tag v-else type="warning" size="small" effect="light">
                  <span class="dot-warning"></span>审核中
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="阅读热度" width="140" align="center">
              <template #default="scope">
                 <div class="data-cell">
                   <span class="read-num">{{ scope.row.readCount }}</span>
                   <el-progress 
                      :percentage="Math.min(scope.row.readCount / 100, 100)" 
                      :show-text="false" 
                      :stroke-width="6"
                      :color="scope.row.readCount > 5000 ? '#67c23a' : '#409eff'"
                   />
                 </div>
              </template>
            </el-table-column>

            <el-table-column label="更新时间" prop="date" width="120" align="center" show-overflow-tooltip />

            <el-table-column label="操作" width="220" align="center" fixed="right">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="handlePreview(scope.row)">预览</el-button>
                
                <el-button 
                  v-if="scope.row.level === '一级'" 
                  link 
                  type="danger" 
                  size="small" 
                  @click="handleOffline(scope.row)"
                >下架</el-button>
                
                <el-button 
                   v-if="scope.row.level !== '一级'" 
                   link 
                   type="warning" 
                   size="small" 
                   @click="handleAudit(scope.row)"
                >审核</el-button>

                <el-button link type="info" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-footer">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next"
              :total="total"
              v-model:current-page="searchParams.page"
              v-model:page-size="searchParams.pageSize"
              :page-sizes="[10, 20, 30]"
              @size-change="loadData"
              @current-change="loadData"
            />
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="never" class="side-card">
          <template #header>
            <div class="card-header">
              <span>待办审核</span>
              <el-tag type="danger" round size="small">3</el-tag>
            </div>
          </template>
          <div class="todo-list">
            <div class="todo-item" v-for="i in 3" :key="i">
              <div class="todo-content">
                <div class="todo-title">关于2025新能源补贴政策公示文案...</div>
                <div class="todo-meta">提交人：张三 · 10分钟前</div>
              </div>
              <el-button link type="primary" size="small" @click="ElMessage.info('请在左侧列表点击审核')">处理</el-button>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" class="side-card mt-20">
          <template #header><span>快捷入口</span></template>
          <div class="tools-grid">
            <div class="tool-item" @click="ElMessage.success('正在打开批量导入...')">
               <div class="tool-icon bg-blue"><el-icon><Upload /></el-icon></div>
               <span>批量导入</span>
            </div>
            <div class="tool-item" @click="ElMessage.success('正在下载报表...')">
               <div class="tool-icon bg-green"><el-icon><Download /></el-icon></div>
               <span>数据导出</span>
            </div>
            <div class="tool-item" @click="ElMessage.warning('功能开发中')">
               <div class="tool-icon bg-orange"><el-icon><Share /></el-icon></div>
               <span>一键分发</span>
            </div>
             <div class="tool-item">
               <div class="tool-icon bg-gray"><el-icon><Setting /></el-icon></div>
               <span>配置</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <DocumentEditDialog ref="dialogRef" @success="handleSuccess" />

    <el-dialog v-model="previewVisible" title="文档预览" width="600px">
        <div class="preview-container" v-if="currentDoc">
            <h2 class="preview-title">{{ currentDoc.title }}</h2>
            <div class="preview-meta">
                <span>发布人：{{ currentDoc.publisher }}</span>
                <span>时间：{{ currentDoc.date }}</span>
                <span>类型：{{ currentDoc.type }}</span>
            </div>
            <el-divider />
            <div class="preview-content">
                <p>尊敬的合作伙伴：</p>
                <p>您好！这是关于 <strong>{{ currentDoc.title }}</strong> 的详细内容预览。</p>
                <p>此处展示文档的正文部分，支持富文本格式。当前文档阅读量为 {{ currentDoc.readCount }}，状态为 {{ currentDoc.level }}。</p>
                <p class="lorem">（此处为模拟占位文本：新能源充电站的建设标准需符合国家最新规定...）</p>
            </div>
        </div>
    </el-dialog>

    <el-dialog v-model="auditVisible" title="文档审核" width="400px">
        <el-form :model="auditForm" label-position="top">
            <el-form-item label="审核结果">
                <el-radio-group v-model="auditForm.status">
                    <el-radio label="pass" border>通过</el-radio>
                    <el-radio label="reject" border>驳回</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="审核意见">
                <el-input 
                    v-model="auditForm.comment" 
                    type="textarea" 
                    :rows="3" 
                    placeholder="请输入审核意见（必填）..."
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="auditVisible = false">取消</el-button>
            <el-button type="primary" @click="submitAudit">确认提交</el-button>
        </template>
    </el-dialog>

  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { 
  Files, Flag, Upload, Download, Share, Setting
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { DocumentParamsType } from '@/type/documentTy'
import { type DocumentParams, getListAPI } from '@/api/documentAPI'
import DocumentEditDialog from './components/DocumentEditDialog.vue'

// ------------------- 1. 数据定义 -------------------

// 顶部统计卡片配置（静态数据，模拟）
const statCards = [
    { label: '在库文案', value: '128', unit: '篇', icon: 'Document', colorClass: 'icon-blue' },
    { label: '本月阅读', value: '4,320', unit: '次', icon: 'View', colorClass: 'icon-green' },
    { label: '转化人数', value: '45', unit: '人', icon: 'User', colorClass: 'icon-orange' },
    { label: '待审核', value: '3', unit: '篇', icon: 'Timer', colorClass: 'icon-purple' },
]

const loading = ref(false)
const total = ref(0)
const tableData = ref<DocumentParamsType[]>([])
const filterStatus = ref('') 

// 查询参数
const searchParams = reactive<DocumentParams>({
    page: 1,
    pageSize: 10,
    title: ''
})

// 弹窗引用
const dialogRef = ref<InstanceType<typeof DocumentEditDialog> | null>(null)

// 预览相关状态
const previewVisible = ref(false)
const currentDoc = ref<DocumentParamsType | null>(null)

// 审核相关状态
const auditVisible = ref(false)
const auditForm = reactive({
    status: 'pass',
    comment: ''
})
const currentAuditRow = ref<DocumentParamsType | null>(null)

// ------------------- 2. 业务逻辑 -------------------

// 加载列表数据
const loadData = async () => {
    loading.value = true
    try {
        const res = await getListAPI(searchParams)
        if(res.code === 200){
            tableData.value = res.data.list
            total.value = res.data.total
        }
    } catch(e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

// 筛选变更
const handleFilter = () => {
    // 实际项目中应将 filterStatus 传给后端
    loadData() 
}

// 打开新增/编辑
const handleCreate = () => dialogRef.value?.open()
const handleEdit = (row: DocumentParamsType) => dialogRef.value?.open(row)
const handleSuccess = () => loadData()

// --- [功能实现] 预览 ---
const handlePreview = (row: DocumentParamsType) => {
    currentDoc.value = row
    previewVisible.value = true
}

// --- [功能实现] 下架 ---
const handleOffline = (row: DocumentParamsType) => {
    ElMessageBox.confirm(
        `确认要下架文档《${row.title}》吗？下架后用户将无法查看。`,
        '下架确认',
        {
            confirmButtonText: '确认下架',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {
        // 模拟 API 请求
        setTimeout(() => {
            ElMessage.success('下架成功')
            // 前端模拟状态变更：实际上应该重新 loadData()
            row.level = '二级' // 假设变回审核中或下架状态
        }, 500)
    }).catch(() => {})
}

// --- [功能实现] 审核 ---
const handleAudit = (row: DocumentParamsType) => {
    currentAuditRow.value = row
    auditForm.status = 'pass' // 重置表单
    auditForm.comment = ''
    auditVisible.value = true
}

const submitAudit = () => {
    if(!auditForm.comment && auditForm.status === 'reject'){
        ElMessage.warning('驳回时必须填写审核意见')
        return
    }
    
    // 模拟 API 提交
    const actionText = auditForm.status === 'pass' ? '通过' : '驳回'
    ElMessage.success(`审核已${actionText}`)
    
    // 前端更新模拟
    if(currentAuditRow.value && auditForm.status === 'pass'){
        currentAuditRow.value.level = '一级' // 变更为已发布
    }
    
    auditVisible.value = false
}

onMounted(() => loadData())
</script>

<style scoped lang="less">
/* --- 布局间距 --- */
.mb-20 { margin-bottom: 20px; }
.mt-20 { margin-top: 20px; }
.ml-10 { margin-left: 10px; }

/* --- 1. 顶部统计卡片 (新版：清爽风格) --- */
.stat-card-simple {
    border: none;
    background-color: #fff;
    /* 更加柔和的阴影 */
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    transition: all 0.3s;
    
    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
    }

    .stat-body {
        display: flex;
        align-items: center;
        padding: 15px 5px;
    }

    /* 图标容器：使用浅色圆角矩形 */
    .icon-wrapper {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        margin-right: 16px;
        
        /* 配色方案：图标深色，背景极浅色 */
        &.icon-blue { background-color: #ecf5ff; color: #409eff; }
        &.icon-green { background-color: #f0f9eb; color: #67c23a; }
        &.icon-orange { background-color: #fdf6ec; color: #e6a23c; }
        &.icon-purple { background-color: #f4f4f5; color: #909399; }
    }

    .text-wrapper {
        .label { font-size: 13px; color: #909399; margin-bottom: 4px; }
        .number { 
            font-size: 24px; 
            font-weight: 600; 
            color: #303133; 
            font-family: 'DIN Alternate', sans-serif; 
        }
        .unit { font-size: 12px; margin-left: 4px; font-weight: normal; color: #909399;}
    }
}

/* --- 2. 表格区域优化 --- */
.table-panel {
    min-height: 600px;
    border: none;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05); /* 统一卡片阴影 */
}

.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.custom-table {
    .doc-info {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .doc-icon {
            font-size: 20px;
            /* 简单的图标颜色，不使用背景块 */
            .text-blue { color: #409eff; }
            .text-orange { color: #e6a23c; }
        }
        
        .doc-text {
            .title { 
                font-size: 14px; 
                font-weight: 500; 
                color: #303133; 
                margin-bottom: 4px; 
            }
            .link-type { cursor: pointer; &:hover { color: #409eff; text-decoration: underline;} }
            
            .sub-info { font-size: 12px; color: #909399; display: flex; gap: 8px; align-items: center;}
        }
    }
    
    /* 状态小圆点 */
    .dot-success { display: inline-block; width: 6px; height: 6px; background: #67c23a; border-radius: 50%; margin-right: 5px; }
    .dot-warning { display: inline-block; width: 6px; height: 6px; background: #e6a23c; border-radius: 50%; margin-right: 5px; }

    .data-cell {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 10px;
        .read-num { font-size: 13px; font-weight: bold; color: #606266; margin-bottom: 2px; }
    }
}

.pagination-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    padding-top: 10px;
    border-top: 1px solid #ebeef5;
}

/* --- 3. 右侧辅助栏 --- */
.side-card {
    border: none;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
    .card-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 14px;}
}

.todo-list {
    .todo-item {
        padding: 12px 0;
        border-bottom: 1px dashed #ebeef5;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        &:last-child { border-bottom: none; }
        
        .todo-content {
            flex: 1;
            margin-right: 10px;
            overflow: hidden;
            .todo-title { font-size: 13px; color: #303133; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
            .todo-meta { font-size: 12px; color: #c0c4cc; }
        }
    }
}

.tools-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    padding: 10px 0;
    
    .tool-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover { transform: translateY(-2px); span { color: #409eff; } }
        
        .tool-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            margin-bottom: 8px;
            font-size: 18px;
            
            &.bg-blue { background: #409eff; }
            &.bg-green { background: #67c23a; }
            &.bg-orange { background: #e6a23c; }
            &.bg-gray { background: #909399; }
        }
        span { font-size: 12px; color: #606266; }
    }
}

/* --- 预览样式 --- */
.preview-container {
    padding: 0 10px;
    .preview-title { text-align: center; margin-bottom: 15px; color: #303133; }
    .preview-meta { 
        display: flex; 
        justify-content: center; 
        gap: 20px; 
        color: #909399; 
        font-size: 12px; 
        margin-bottom: 10px; 
    }
    .preview-content {
        line-height: 1.8;
        color: #606266;
        font-size: 14px;
        min-height: 200px;
        .lorem { color: #999; font-style: italic; margin-top: 20px; }
    }
}
</style>