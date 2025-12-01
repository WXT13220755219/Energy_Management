<!-- 设备运行状态 (左上) -->
<template>
      <!-- 设备运行状态 -->
      <el-card shadow="hover" class="status-card">
        <!-- 头部：左右分布 -->
        <div class="card-header">
          <div class="header-left">
            <h3>今日设备运行状态</h3>
          </div>
          <div class="header-right">
            <span>更新时间: {{ currentDate }}</span>
            <el-icon 
              class="refresh-icon" 
              :class="{ 'is-loading': isLoading }"
              @click="getDeviceStatusData"
            >
              <Refresh />
            </el-icon>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="equipment-container">
          <div 
            class="equipment-item" 
            v-for="(item, index) in deviceStatusData" 
            :key="index"
          >
            <!-- 1. 顶部：图标 + 标题 -->
            <div class="item-header">
              <div class="icon-bg">
                <img :src="iconMap[item.icon]" alt="">
              </div>
              <span class="item-title">{{ item.name }}</span>
            </div>

            <!-- 2. 中部：核心数据 (大号数字) -->
            <div class="item-data">
              <span class="numerator">{{ item.usedCount }}</span>
              <span class="separator">/</span>
              <span class="denominator">{{ item.totalCount }}</span>
            </div>

            <!-- 3. 底部：次要指标 (灰色背景卡片) -->
            <div class="item-footer">
              <!-- 左侧：故障 -->
              <div class="info-block">
                <span class="label">异常</span>
                <el-tooltip :content="`当前有${item.faultCount}台设备异常`" placement="top">
                  <div class="value warning">
                    {{ item.faultCount }}
                    <el-icon><Warning /></el-icon>
                  </div>
                </el-tooltip>
              </div>
              
              <el-divider direction="vertical" />

              <!-- 右侧：趋势 -->
              <div class="info-block">
                <span class="label">较昨日</span>
                <div class="value success">
                  {{ item.rise }}%
                  <el-icon><CaretTop /></el-icon>
                </div>
              </div>
            </div>

            <!-- 垂直分割线 (除了最后一个元素) -->
            <div class="vertical-line" v-if="index !== deviceStatusData.length - 1"></div>
          </div>
        </div>
      </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import flash2 from '@/assets/flash2.png'
import flash from '@/assets/flash.png'
import flash3 from '@/assets/flash3.png'
import { getDeviceStatusAPI } from '@/api/dashboardAPI'
import type{ DeviceItemType } from '@/type/dashboard/deviceItemTy'
import { ElMessage } from 'element-plus'

// 定义图片映射字典，动态绑定src
const iconMap:Record<string,string> = {
  flash: flash,
  flash2: flash2,
  flash3: flash3
}
// 定义状态控制图标旋转
const isLoading = ref<boolean>(false)
// 获取当前日期
const currentDate = ref(new Date().toLocaleString())

const deviceStatusData = ref<DeviceItemType[]>([])
// 调用后端设备状态的数据
const getDeviceStatusData = async() => {
  isLoading.value = true
  try{
    const res = await getDeviceStatusAPI()
    if(res.code === 200){
      // 获取数据
      deviceStatusData.value = res.data.list
      // 更新时间
      currentDate.value = new Date().toLocaleString()
      ElMessage.success('刷新成功')
    }
  } catch(error){
    ElMessage.error('刷新失败')
  } finally{
    setTimeout( () => {
      isLoading.value = false
    }, 500)
  }

}
onMounted( () => {
  getDeviceStatusData()
})
</script>

<style scoped lang="less">
/* 卡片整体微调 */
.status-card {
  :deep(.el-card__body) {
    padding: 20px 0; /* 让分割线能顶到头，调整内边距 */
  }
}

/* 头部样式：左右对齐 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 15px 20px; /* 头部保留左右边距 */
  border-bottom: 1px solid #f0f0f0; /* 增加一条淡淡的分隔线 */
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1d2129;
  }

  .header-right {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #86909c;
    
    .refresh-icon {
      margin-left: 8px;
      cursor: pointer;
      font-size: 16px;
      transition: color 0.3s;
      
      &:hover {
        color: #409eff;
      }
    }
  }
}

/* 内容容器 */
.equipment-container {
  display: flex;
  justify-content: space-around;
  padding-top: 20px;
}

/* 单个项目样式 */
.equipment-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 0 10px;

  /* 垂直分割线样式 */
  .vertical-line {
    position: absolute;
    right: 0;
    top: 10%;
    height: 80%;
    width: 1px;
    background-color: #e5e6eb;
  }

  /* 1. 顶部 图标+标题 */
  .item-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;

    .icon-bg {
      width: 32px;
      height: 32px;
      background-color: #f2f3f5;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      img {
        width: 20px;
        height: 20px;
      }
    }

    .item-title {
      font-size: 15px;
      color: #4e5969;
      font-weight: 500;
    }
  }

  /* 2. 中部 核心数据 */
  .item-data {
    margin-bottom: 20px;
    display: flex;
    align-items: baseline; /* 基线对齐，让斜杠和数字底部自然 */
    
    .numerator {
      font-size: 32px;
      font-weight: 700;
      color: #1d2129;
      font-family: 'DIN', sans-serif; /* 如果有数字字体更好 */
      line-height: 1;
    }
    
    .separator {
      font-size: 20px;
      color: #c9cdd4;
      margin: 0 6px;
    }
    
    .denominator {
      font-size: 16px;
      color: #86909c;
      font-weight: 500;
    }
  }

  /* 3. 底部 信息卡片 */
  .item-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 80%; /* 控制底部卡片宽度 */
    background-color: #f7f8fa;
    padding: 10px 15px;
    border-radius: 6px;

    .info-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      
      .label {
        font-size: 12px;
        color: #86909c;
      }
      
      .value {
        font-size: 14px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 2px;
        
        &.warning {
          color: #ff7d00; /* 橙色表示警告 */
        }
        
        &.success {
          color: #00b42a; /* 绿色表示增长 */
        }
      }
    }
  }
}
</style>