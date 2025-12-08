<template>
  <el-dialog 
    :model-value="visible"
    :title="titleMap[type]"
    width="800px"
    :close-on-click-modal="false"
    @close="handleClose"
    destroy-on-close
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="规则名称" prop="ruleName">
            <el-input v-model="formData.ruleName" placeholder="如: 2025市区通用规则" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生效时间" prop="effectiveTime">
            <el-date-picker 
              v-model="formData.effectiveTime" 
              type="datetime" 
              placeholder="选择生效时间" 
              style="width: 100%"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item label="规则备注">
        <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="填写适用区域或说明" />
      </el-form-item>

      <el-divider content-position="left">
        时段电价配置 
        <el-tag size="small" type="info" class="ml-10">需完整覆盖 00:00 - 24:00</el-tag>
      </el-divider>

      <div class="time-slots-wrapper">
        <div v-for="(item, index) in formData.items" :key="index" class="slot-item">
          <span class="index-badge">{{ index + 1 }}</span>
          
          <div class="slot-time">
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

          <el-select v-model="item.type" class="w-100" placeholder="类型">
            <el-option label="尖峰" value="sharp"><span class="color-sharp">● 尖峰</span></el-option>
            <el-option label="高峰" value="peak"><span class="color-peak">● 高峰</span></el-option>
            <el-option label="平段" value="flat"><span class="color-flat">● 平段</span></el-option>
            <el-option label="低谷" value="valley"><span class="color-valley">● 低谷</span></el-option>
          </el-select>

          <div class="price-input">
            <el-input v-model.number="item.elecPrice" placeholder="电费" type="number" class="w-100">
              <template #prefix>电</template>
            </el-input>
            <span class="plus">+</span>
            <el-input v-model.number="item.servicePrice" placeholder="服务费" type="number" class="w-100">
              <template #prefix>服</template>
            </el-input>
          </div>

          <el-button 
            type="danger" 
            :icon="Delete"
            circle 
            plain 
            @click="removeSlot(index)" 
            v-if="formData.items && formData.items.length > 1" 
          />
        </div>
        
        <div class="slot-actions mt-10">
          <el-button type="primary" link :icon="Plus" @click="addSlot">添加后续时段</el-button>
          
          <div class="total-price-preview">
            <transition name="el-fade-in">
              <span v-if="!isCovered" class="error-tip">
                <el-icon><Warning /></el-icon> 时段未闭环 (当前结束于 {{ lastEndTime }})
              </span>
              <span v-else class="success-tip">
                <el-icon><CircleCheck /></el-icon> 24小时已覆盖
              </span>
            </transition>
          </div>
        </div>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">保存配置</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { Plus, Delete, Warning, CircleCheck } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { saveBillingRuleAPI } from '@/api/billingAPI'
import type { BillingRuleType, BillingItemType } from '@/type/billingTy'

// --- Props & Emits ---
const props = defineProps<{
  visible: boolean
  rowdata?: BillingRuleType
}>()

const emit = defineEmits(['update:visible', 'success'])

// --- 状态定义 ---
const formRef = ref<FormInstance>()
const loading = ref(false)
const type = ref<'add' | 'edit'>('add')

const titleMap = {
  add: '新建计费规则',
  edit: '编辑计费规则'
}

// 表单数据初始化
const defaultItem: BillingItemType = {
  startTime: '00:00',
  endTime: '24:00',
  type: 'flat',
  elecPrice: 0.8,
  servicePrice: 0.4
}

const formData = reactive<BillingRuleType>({
  id: '',
  ruleName: '',
  version: 'V1.0',
  status: 1,
  effectiveTime: '',
  remark: '',
  items: []
})

const rules = {
  ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  effectiveTime: [{ required: true, message: '请选择生效时间', trigger: 'change' }]
}

// --- 监听器：初始化数据 ---
watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (props.rowdata && props.rowdata.id) {
        type.value = 'edit'
        Object.assign(formData, JSON.parse(JSON.stringify(props.rowdata)))
      } else {
        type.value = 'add'
        Object.assign(formData, {
          id: '',
          ruleName: '',
          version: 'V1.0',
          status: 1,
          effectiveTime: '',
          remark: '',
          items: [JSON.parse(JSON.stringify(defaultItem))]
        })
      }
    }
  }
)

// --- 计算属性：时段校验 ---
const lastEndTime = computed(() => {
  if (!formData.items || formData.items.length === 0) return '00:00'
  return formData.items[formData.items.length - 1]?.endTime
})

const isCovered = computed(() => {
  if (!formData.items || formData.items.length === 0) return false
  const first = formData.items[0]
  const last = formData.items[formData.items.length - 1]
  return first?.startTime === '00:00' && last?.endTime === '24:00'
})

// --- 时段操作逻辑 ---
const addSlot = () => {
  if (!formData.items) formData.items = []
  const lastItem = formData.items[formData.items.length - 1]
  const newStart = lastItem ? lastItem.endTime : '00:00'
  
  if (newStart === '24:00') {
    ElMessage.warning('时段已覆盖至24:00，请先调整前序时段结束时间')
    return
  }
  
  formData.items.push({
    ...defaultItem,
    startTime: newStart,
    endTime: '24:00'
  })
}

const removeSlot = (index: number) => {
  formData.items?.splice(index, 1)
}

// --- 提交与关闭 ---
const handleClose = () => {
  emit('update:visible', false)
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      if (!isCovered.value) {
        ElMessage.error('计费时段必须完整覆盖 00:00 - 24:00')
        return
      }
      
      loading.value = true
      try {
        const res: any = await saveBillingRuleAPI(formData)
        if (res.code === 200) {
          ElMessage.success('保存成功')
          emit('success')
          handleClose()
        } else {
          ElMessage.error(res.message || '保存失败')
        }
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped lang="less">
.ml-10 { margin-left: 10px; }
.mt-10 { margin-top: 10px; }
.w-120 { width: 120px; }
.w-100 { width: 100px; }

.time-slots-wrapper {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  border: 1px dashed #dcdfe6;

  /* 核心：时段行样式 */
  .slot-item {
    display: flex;
    align-items: center;
    justify-content: center; /* 水平居中 */
    gap: 10px; /* 【关键】使用 gap 统一间距，不再依赖 ml-10，保证完美居中 */
    margin-bottom: 10px;
    background: #fff;
    padding: 10px 15px;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

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
      flex-shrink: 0;
    }

    .separator { margin: 0 5px; color: #909399; }

    .price-input {
      display: flex;
      align-items: center;
      .plus { margin: 0 5px; color: #909399; font-weight: bold; }
    }
  }

  /* 底部操作行样式 */
  .slot-actions {
    display: flex;
    justify-content: center; /* 按钮居中 */
    align-items: center;
    position: relative; 
    
    .total-price-preview {
      /* 提示信息绝对定位到右侧，不影响按钮居中 */
      position: absolute;
      right: 10px;
      font-size: 12px;
      
      .error-tip { color: #f56c6c; display: flex; align-items: center; gap: 4px; font-weight: bold;}
      .success-tip { color: #67c23a; display: flex; align-items: center; gap: 4px; }
    }
  }
}

/* 颜色标识 */
.color-sharp { color: #f56c6c; font-weight: bold; }
.color-peak { color: #e6a23c; font-weight: bold; }
.color-flat { color: #409eff; font-weight: bold; }
.color-valley { color: #67c23a; font-weight: bold; }
</style>