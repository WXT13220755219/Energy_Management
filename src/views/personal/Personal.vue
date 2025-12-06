<template>
  <div class="personal-container" v-loading="pageLoading">
    <el-row :gutter="20">
      
      <el-col :span="8" :xs="24">
        <ProfileCard :user-info="userInfo" class="mb" />
      </el-col>

      <el-col :span="16" :xs="24">
        <el-card shadow="hover" class="feature-card">
          <el-tabs v-model="activeTab" class="custom-tabs">
            
            <el-tab-pane label="操作动态" name="timeline">
              <ActivityTimeline :activities="activities" />
            </el-tab-pane>

            <el-tab-pane label="基本设置" name="settings">
              <BaseSettings 
                :user-info="userInfo" 
                :loading="updateLoading" 
                @update="handleUpdateInfo" 
              />
            </el-tab-pane>

            <el-tab-pane label="安全中心" name="security">
              <SecuritySettings :phone="userInfo.phone" />
            </el-tab-pane>

          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getPersonalInfoAPI, getActivitiesAPI, updatePersonalInfoAPI } from '@/api/personalAPI'
import type { PersonalInfoType, ActivityType } from '@/type/personalTy'

// 引入子组件
import ProfileCard from './components/ProfileCard.vue'
import ActivityTimeline from './components/ActivityTimeline.vue'
import BaseSettings from './components/BaseSettings.vue'
import SecuritySettings from './components/SecuritySettings.vue'
import { useLoginStore } from '@/store/login'

// 状态管理
const pageLoading = ref(false)
const updateLoading = ref(false)
const activeTab = ref('timeline')
const loginStore = useLoginStore()

const userInfo = ref<PersonalInfoType>({} as PersonalInfoType)
const activities = ref<ActivityType[]>([])

// 获取所有数据
const initData = async () => {
  pageLoading.value = true
  try {
    const [infoRes, actRes] = await Promise.all([
      getPersonalInfoAPI(),
      getActivitiesAPI()
    ])
    
    if (infoRes.code === 200){
        userInfo.value = infoRes.data
        if(loginStore.account){
            userInfo.value.account = loginStore.account
        }
        
    } 
    if (actRes.code === 200) activities.value = actRes.data.list
    

  } catch (error) {
    console.error(error)
    ElMessage.error('数据加载失败')
  } finally {
    pageLoading.value = false
  }
}

// 处理信息更新
const handleUpdateInfo = async (formData: any) => {
  updateLoading.value = true
  try {
    const res = await updatePersonalInfoAPI(formData)
    if (res.code === 200) {
      ElMessage.success('个人信息更新成功')
      // 更新本地视图数据
      userInfo.value.name = formData.name
      userInfo.value.phone = formData.phone
    }
  } catch (e) {
    ElMessage.error('更新失败')
  } finally {
    updateLoading.value = false
  }
}

onMounted(() => {
  initData()
})
</script>

<style scoped lang="less">
.personal-container {
  animation: fadeIn 0.5s ease-in-out;
}
.mb { margin-bottom: 20px; }

.feature-card {
  min-height: 600px;
  border: none;
  border-radius: 8px;
  
  :deep(.el-tabs__item) {
    font-size: 16px; height: 50px; line-height: 50px; color: #606266;
    &.is-active { font-weight: bold; color: #409eff; }
  }
  :deep(.el-tabs__nav-wrap::after) { height: 1px; background-color: #f0f0f0; }
  :deep(.el-tabs__content) { padding: 20px; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>