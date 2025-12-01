<!-- 数据看板 -->
<template>
  <el-row :gutter="20">
    <!-- 左侧内容 (占18份) -->
    <el-col :span="18">
      <!-- 1. 设备运行状态 -->
      <DeviceStatus />
      
      <!-- 2. 常用功能 -->
      <QuickNavigation class="mt" />
      
      <!-- 3. 能源统计 -->
      <EnergySection class="mt" />
    </el-col>

    <!-- 右侧内容 (占6份) -->
    <el-col :span="6">
      <!-- 4. 设备总览 (雷达图) -->
      <DeviceRadar class="mb" />
      
      <!-- 5. 营收统计表 -->
      <RevenueRank class="mb" />
      
      <!-- 6. 故障报警 -->
      <FaultAlarm class="mb" />
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import DeviceStatus from './components/DeviceStatus.vue'
import QuickNavigation from '@/views/dashboard/components/QuickNavigation.vue'
import EnergySection from './components/EnergySection.vue'
import DeviceRadar from './components/DeviceRadar.vue'
import RevenueRank from '@/views/dashboard/components/RevenueRank.vue'
import FaultAlarm from './components/FaultAlarm.vue'
</script>


