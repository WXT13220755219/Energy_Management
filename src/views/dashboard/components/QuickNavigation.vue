<!-- 常用功能 (左中) -->
 <template>
  <el-card class="quick-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <h3>常用功能</h3>
      </div>
    </template>
    
    <!-- 加载状态 -->
    <div class="quick-functions" v-loading="loading">
      <el-row :gutter="0">
        <!-- 循环渲染功能项 -->
        <el-col 
          :span="4" 
          v-for="(item, index) in quickList" 
          :key="index"
        >
          <div class="function-card" @click="handleJump(item.path)">
            <!-- 角标组件：如果有 badge 则显示 -->
            <el-badge :value="item.badge" :hidden="!item.badge" class="item-badge">
              
              <!-- 图标容器：动态绑定背景色 -->
              <div class="icon-wrapper" :style="{ backgroundColor: item.bg }">
                <!-- 这里的 icon 是经过前端 map 处理后的真实路径 -->
                <img :src="item.icon" alt="">
              </div>

            </el-badge>
            
            <p class="label">{{ item.name }}</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getQuickFunctionsAPI } from '@/api/dashboardAPI'
import type { QuickFunctionItem } from '@/type/dashboard/quickFunctionItemTy'

// 1. 引入所有需要的图标资源
import repair from '@/assets/repair.png'
import progress from '@/assets/progress.png'
import remain from '@/assets/remain.png'
import total from '@/assets/total.png'
import money from '@/assets/money.png'
import daily from '@/assets/daily.png'

const router = useRouter()
const loading = ref(false)
const quickList = ref<QuickFunctionItem[]>([])

// 2. 建立【后端Key】与【前端图片】的映射关系
const iconMap: Record<string, string> = {
  repair: repair,
  progress: progress,
  remain: remain,
  total: total,
  money: money,
  daily: daily
}

// 3. 获取数据
const getQuickData = async () => {
  loading.value = true
  try {
    const res = await getQuickFunctionsAPI()
    if (res.code === 200) {
      // 核心逻辑：遍历后端数据，根据 iconKey 找到对应的图片路径，赋值给 icon 属性
      quickList.value = res.data.list.map((item:QuickFunctionItem) => ({
        ...item,
        icon: iconMap[item.iconKey] || repair // 如果没找到图，给个默认图
      }))
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 4. 路由跳转
const handleJump = (path: string) => {
  if (path) router.push(path)
}

onMounted(() => {
  getQuickData()
})
</script>

<style lang="less" scoped>
.quick-card {
  /* 头部样式 */
  .card-header {
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1d2129;
    }
  }
}

.quick-functions {
  padding: 10px 0;

  .function-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 15px 0;
    border-radius: 8px;
    transition: all 0.3s ease;

    /* 悬停交互效果 */
    &:hover {
      transform: translateY(-5px); /* 上浮 */
      background-color: #f7f8fa; /* 浅灰背景 */
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* 阴影 */
      
      .label {
        color: #409eff; /* 文字变蓝 */
      }
      
      .icon-wrapper {
        transform: scale(1.1); /* 图标微放大 */
      }
    }

    /* 图标底座样式 */
    .icon-wrapper {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
      transition: transform 0.3s;

      img {
        width: 28px;
        height: 28px;
        object-fit: contain;
      }
    }

    .label {
      font-size: 14px;
      color: #4e5969;
      margin: 0;
      transition: color 0.3s;
    }
  }
}

/* 修复 Element Plus Badge 的位置 */
:deep(.el-badge__content) {
  top: 5px;
  right: 5px;
  border: none;
}
</style>