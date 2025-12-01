<!-- 营收统计表 (右中) -->
 <template>
    <el-card shadow="hover" class="rank-card">
        <template #header>
            <div class="card-header">
                <h3>营收统计表</h3>
                <el-tag type="success">月度</el-tag>
            </div>
        </template>

<div class="list-container" v-loading="loading">
      <div class="header-row">
        <span class="col-1">排名</span>
        <span class="col-2">城市</span>
        <span class="col-3">销售额(元)</span>
        <span class="col-4">趋势</span>
      </div>
      
      <ul class="rank-list">
        <li v-for="(item, index) in rankList" :key="index" class="rank-item">
          <div class="col-1">
            <span class="rank-badge" :class="`rank-${index + 1}`">{{ index + 1 }}</span>
          </div>
          
          <div class="col-2 font-bold">{{ item.city }}</div>
          
          <div class="col-3">{{ item.money }}</div>
          
          <div class="col-4 trend" :class="getStatusClass(item.status)">
            <el-icon v-if="item.status === 1"><CaretTop /></el-icon>
            <el-icon v-else-if="item.status === -1"><CaretBottom /></el-icon>
            <el-icon v-else><Minus /></el-icon>
            <span>{{ Math.abs(item.rise) }}%</span>
          </div>
        </li>
      </ul>
    </div>
    </el-card>
 </template>
 
 <script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getRevenueRankAPI } from '@/api/dashboardAPI'


 interface RankItem {
    city:string,
    money:string,
    rise:number,
    status:number
 }
 const loading = ref(false)
 const rankList = ref<RankItem[]>([])
// 获取样式类名
const getStatusClass = (status:number) => {
    if (status === 1) return 'up'
    if (status === -1) return 'down'
    return 'flat'
}
// 获取故障报警数据
const getData = async() => {
    loading.value = true
    try{
    const res = await getRevenueRankAPI()
    console.log('营收统计表数据', res)
        if(res.code === 200){
            rankList.value = res.data.list
        }
    } catch(error) {
        console.error(error)
    } finally {
        loading.value =false
    }
}
onMounted( () => getData() )


 </script>
 
<style scoped lang="less">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 { margin: 0; font-size: 16px; color: #333; }
}

.list-container {
  /* 定义列宽比例 */
  .col-1 { width: 15%; text-align: center; }
  .col-2 { width: 25%; }
  .col-3 { width: 35%; text-align: right; padding-right: 15px; }
  .col-4 { width: 25%; text-align: right; }

  .header-row {
    display: flex;
    color: #909399;
    font-size: 12px;
    margin-bottom: 10px;
    padding: 0 5px;
  }

  .rank-list {
    list-style: none;
    padding: 0;
    margin: 0;

    .rank-item {
      display: flex;
      align-items: center;
      height: 40px;
      font-size: 13px;
      color: #606266;
      border-bottom: 1px dashed #f0f0f0;
      
      &:last-child { border-bottom: none; }

      .rank-badge {
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 50%;
        background-color: #f0f2f5;
        color: #909399;
        font-weight: bold;
        font-size: 12px;

        /* 前三名高亮色：金、银、铜 */
        &.rank-1 { background-color: #faad14; color: #fff; }
        &.rank-2 { background-color: #a0d911; color: #fff; } /* 这里我用了绿色系代替银色，防止看不清，你可以换 #d9d9d9 */
        &.rank-3 { background-color: #409eff; color: #fff; }
      }

      .font-bold {
        font-weight: 500;
        color: #303133;
      }

      /* 趋势颜色 */
      .trend {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 2px;
        
        &.up { color: #f56c6c; }
        &.down { color: #67c23a; }
        &.flat { color: #909399; }
      }
    }
  }
}
</style>