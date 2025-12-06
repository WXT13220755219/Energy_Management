<!-- [右侧-Tab3] 安全中心列表 -->
 <template>
  <div class="security-list">
    <div class="security-item">
      <div class="left">
        <div class="title">账户密码</div>
        <div class="desc">当前密码强度：<span class="strong">强</span></div>
      </div>
      <el-button link type="primary">修改</el-button>
    </div>
    <el-divider />
    <div class="security-item">
      <div class="left">
        <div class="title">密保手机</div>
        <div class="desc">已绑定手机：{{ phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }}</div>
      </div>
      <el-button link type="primary">修改</el-button>
    </div>
    <el-divider />
    <div class="security-item">
      <div class="left">
        <div class="title">MFA 设备</div>
        <div class="desc">未绑定 MFA 设备，建议绑定以提升安全性</div>
      </div>
      <el-button link type="primary">绑定</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  phone?: string
}>()
</script>

<style scoped lang="less">
.security-list { padding: 10px; }
.security-item {
  display: flex; justify-content: space-between; align-items: center; padding: 10px 0;
  .title { font-size: 15px; font-weight: 500; color: #303133; margin-bottom: 4px; }
  .desc { font-size: 13px; color: #909399; .strong { color: #67c23a; font-weight: bold; } }
}
</style>