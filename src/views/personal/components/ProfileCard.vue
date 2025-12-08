<template>
  <el-card shadow="hover" class="profile-card" :body-style="{ padding: '0px' }">
    
    <div class="user-header-bg">
      <div class="greeting-text">
        {{ greeting }}，{{ userInfo.name  || '用户'}}，愿你今天充满活力！
      </div>
    </div>
    
    <div class="profile-content">
      
      <div class="avatar-wrapper">
        <el-avatar :size="100" :src="userInfo.avatar" class="user-avatar" />
      </div>
      
      <div class="user-name">{{ userInfo.name }}</div>
      <div class="user-role">{{ userInfo.role }} | {{ userInfo.department }}</div>
      
      <div class="tags-section mt">
        <el-tag 
          v-for="(tag, index) in (userInfo.tags || [])" 
          :key="index" 
          :type="tag.type" 
          effect="light" 
          round
          class="mx-1"
        >
          {{ tag.label }}
        </el-tag>
      </div>

      <div class="progress-section mt">
        <div class="label-row">
          <span>资料完整度</span>
          <span>{{ userInfo.completeness }}%</span>
        </div>
        <el-progress 
          :percentage="userInfo.completeness || 0" 
          :show-text="false" 
          :status="userInfo.completeness === 100 ? 'success' : undefined" 
          :stroke-width="8" 
        />
      </div>

      <el-divider />

      <div class="detail-list">
        <div class="detail-item">
          <div class="label"><el-icon><User /></el-icon> 账号ID</div>
          <div class="value">{{ userInfo.account }}</div>
        </div>
        <div class="detail-item">
          <div class="label"><el-icon><Iphone /></el-icon> 手机号码</div>
          <div class="value">{{ userInfo.phone }}</div>
        </div>
        <div class="detail-item">
          <div class="label"><el-icon><Message /></el-icon> 邮箱地址</div>
          <div class="value">{{ userInfo.email }}</div>
        </div>
        <div class="detail-item">
          <div class="label"><el-icon><Location /></el-icon> 所属地址</div>
          <div class="value">{{ userInfo.location }}</div>
        </div>
        <div class="detail-item">
          <div class="label"><el-icon><Calendar /></el-icon> 加入天数</div>
          <div class="value">{{ userInfo.joinDays }} 天</div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { PersonalInfoType } from '@/type/personalTy'
// 解释：defineProps 是编译宏，声明的 userInfo 会自动暴露给 template 使用
defineProps<{
  userInfo: PersonalInfoType
}>()

// 计算属性：根据当前小时返回问候语
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 17) return '下午好'
  if (hour < 19) return '傍晚好'
  return '晚上好'
})
</script>

<style scoped lang="less">
/* 工具类：统一间距 */
.mt { margin-top: 20px; }
.mx-1 { margin: 0 4px; }

.profile-card {
  border: none;
  border-radius: 8px; /* 圆角 */
  transition: all 0.3s; /* 过渡动画，让hover效果更丝滑 */
  
  /* 鼠标悬停时上浮并加深阴影 */
  &:hover { 
    transform: translateY(-5px); 
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08); 
  }

  .user-header-bg {
    height: 140px;
    /* CSS 渐变背景：从左上(135deg)开始，由蓝紫色过渡到深紫色 */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative; /* 为子元素的 absolute 定位提供基准 */
    
    .greeting-text {
      position: absolute; 
      top: 24px; 
      left: 24px; 
      color: rgba(255,255,255,0.95); /* 白色半透明，看起来更柔和 */
      font-size: 16px; 
      font-weight: 500; 
      letter-spacing: 1px; /* 字间距 */
    }
  }

  .profile-content {
    padding: 0 24px 24px; 
    position: relative; 
    text-align: center; /* 让内部文本默认居中 */
    
    .avatar-wrapper {
      margin-top: -60px; /* 负外边距：让头像向上移动，产生压在背景图上的层叠效果 */
      margin-bottom: 16px; 
      position: relative; 
      display: inline-block;
      
      .user-avatar { 
        border: 4px solid #fff; /* 白色边框，区分头像和背景 */
        box-shadow: 0 4px 16px rgba(0,0,0,0.15); 
        background-color: #fff; 
      }
    }
    
    .user-name { font-size: 24px; font-weight: 700; color: #303133; margin-bottom: 6px; }
    .user-role { font-size: 14px; color: #909399; }
    
    .progress-section {
      text-align: left; 
      background: #f8f9fa; /* 浅灰背景，区分区块 */
      padding: 15px; 
      border-radius: 8px;
      
      .label-row { 
        display: flex; /* Flex布局 */
        justify-content: space-between; /* 两端对齐 */
        font-size: 13px; 
        color: #606266; 
        margin-bottom: 6px; 
      }
    }

    .detail-list {
      text-align: left; 
      margin-top: 20px;
      
      .detail-item {
        display: flex; 
        justify-content: space-between; 
        align-items: center; /* 垂直居中 */
        padding: 14px 0; 
        border-bottom: 1px dashed #f0f2f5; /* 虚线分割 */
        font-size: 14px;
        
        /* 最后一个元素去掉底边框 */
        &:last-child { border-bottom: none; }
        
        .label { 
          display: flex; 
          align-items: center; 
          color: #606266; 
          .el-icon { margin-right: 8px; font-size: 16px; color: #409eff;} 
        }
        .value { color: #303133; font-weight: 500; }
      }
    }
  }
}
</style>