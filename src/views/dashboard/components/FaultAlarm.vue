<!-- 故障报警 (右下) -->
 <template>
   <el-card shadow="hover" class="alarm-card">
        <template #header>
          <div class="card-header">
              <h3>故障报警</h3>
              <el-button link type="primary" size="small" @click="handleMore">查看更多</el-button>
          </div>
        </template>

        <div class="timeline-box" v-loading="loading">
          <el-timeline>
            <el-timeline-item
              v-for="(item,index) in list"
              :key="index"
              :type="item.type"
              :timestamp="item.time"
              :hollow="index === 0"
            >
              <h4 class="alarm-title">{{ item.title }}</h4>
              <p class="alarm-address">{{ item.address }}</p>
            </el-timeline-item>
          </el-timeline>
        </div>        
   </el-card>
 </template>
 
 <script lang="ts" setup>
 import { ref, onMounted } from 'vue'
 import { getFaultAlarmAPI } from '@/api/dashboardAPI'
 import { useTabsStore } from '@/store/tabs'
 import { useRouter } from 'vue-router'

 interface AlarmItem {
  id:number,
  title:string,
  time:string,
  type:'primary' | 'success' | 'waring'| 'danger' | 'info',
  address:string
 }
 const tabsStore = useTabsStore()
 const router = useRouter()
 const loading = ref(false)
 const list = ref<AlarmItem[]>([])
 const getData = async() => {
  loading.value = true
  try{
    const res = await getFaultAlarmAPI()
    if(res.code === 200){
      list.value = res.data.list
    }
  } catch(error){
    console.log(error)
  } finally{
    loading.value = false
  }
 }
 const handleMore = () => {
  // 添加标签页
  tabsStore.addTabs('报警管理','/alarm','Phone')
  // 高亮标签页
  tabsStore.setCurrentTab('报警管理','/alarm')
  // 跳转路由
  router.push('/alarm')
 }
 onMounted( () => getData())
 </script>
 
 <style scoped lang="less">
 .card-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3{
    margin: 0;
    font-size: 16px;
    color: #333;
  }
 }
 .timeline-box{
  padding-left: 5px;
  max-height: 400px;
  height: 240px;
  overflow-y: auto; /* 超出部分显示滚动条 */
  .alarm-title{
    margin:0;
    font-size:14px;
    font-weight:500;
    color:#303133;
  }
  .alarm-address{
    margin:5px 0 0;
    font-size:12px;
    color:#909399;
  }
 }

 </style>
 