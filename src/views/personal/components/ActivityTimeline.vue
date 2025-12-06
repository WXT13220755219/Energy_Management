<!-- [右侧-Tab1] 操作动态时间轴 -->
 <template>
  <div class="timeline-box">
    <el-empty v-if="activities.length === 0" description="暂无动态" />
    <el-timeline v-else>
      <el-timeline-item 
        v-for="(activity, index) in activities" 
        :key="index" 
        :timestamp="activity.timestamp" 
        :type="activity.type"
        :hollow="index === 0" 
        placement="top"
      >
        <el-card shadow="never" class="timeline-card">
          <h4>{{ activity.title }}</h4>
          <p>{{ activity.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script lang="ts" setup>
import type { ActivityType } from '@/type/personalTy'

defineProps<{
  activities: ActivityType[]
}>()
</script>

<style scoped lang="less">
.timeline-box {
    max-height: 600px;
    overflow-y: auto;
    padding: 10px;
}
.timeline-card {
  border: 1px solid #ebeef5; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); transition: all 0.3s;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-color: #dcdfe6; }
  h4 { margin: 0 0 8px; font-size: 15px; color: #303133; font-weight: 600;}
  p { margin: 0; font-size: 13px; color: #606266; line-height: 1.5; }
}
/* 隐藏滚动条 */
.timeline-box::-webkit-scrollbar { display: none; }
</style>