<template>
  <el-row :gutter="20">
    <el-col :span="18">
      <el-card shadow="hover">
        <MapContainer  ref="mapRef" @map-click="handleMapClick"/>
      </el-card>
    </el-col>
    
    <el-col :span="6">
      <el-card shadow="hover" class="mb">
        <template #header>
          <div class="card-header">
            <span>操作提示</span>
          </div>
        </template>
        <div class="tips">
          <p>1.经纬度请从高德开放平台拾取器获取</p>
          <p>2.新增站点默认为“建设中”状态</p>
        </div>
      </el-card>

      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>新增站点</span>
          </div>
        </template>

        <el-form :form="formData" >
          <el-form-item label="站点名称:" >
            <el-input placeholder="例如:北京朝阳充电站" v-model="formData.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="站点地址:">
            <el-input placeholder="请输入详细地址" v-model="formData.region" clearable></el-input>
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="经度:">
                <el-input placeholder="116.xx" v-model="formData.location1"></el-input>
              </el-form-item>
            </el-col>
              <el-col :span="12" >
                <el-form-item label="纬度:">
                  <el-input placeholder="39.xx" v-model="formData.location2"></el-input>
                </el-form-item>
              </el-col> 
          </el-row>

          <el-form-item label="立即启用:">
            <el-switch  v-model="formData.now" active-text="是" inactive-text="否" />
          </el-form-item>

          <el-form-item label="备注信息:">
            <el-input placeholder="请输入备注信息:" v-model="formData.remarks"></el-input>
          </el-form-item>

          <el-form-item>
            <div class="btn-group">
              <el-button type="primary" @click="handleCreate">创建站点</el-button>
              <el-button @click="handleReset">重置</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import MapContainer from '@/components/map/MapContainer.vue'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useMapStore } from '@/store/map'
import type { MapAdd } from '@/type/map/mapTy'


const mapStore = useMapStore()
// 获取地图组件实例
const mapRef = ref<InstanceType<typeof MapContainer>>()

// 表单数据
const formData = reactive<MapAdd>({
  name: '',
  region: '',
  location1: '',
  location2: '',
  now: true,
  remarks: ''
 })

// 创建站点处理函数
const handleCreate = async () => {
  // 1.校验表单数据
  if(!formData.name || !formData.location1 || !formData.location2){
    ElMessage.warning('请补全站点名称和经纬度信息')
    return
  }
  const lng = Number(formData.location1)
  const lat = Number(formData.location2)
  if(isNaN(lng) || isNaN(lat)){
    ElMessage.warning('经纬度格式不正确，请输入有效的数字')
    return
  }
  // 2.调用store中新增站点的方法
  const success = await mapStore.addStation({...formData})
  if(success){
    ElMessage.success('站点创建成功')
  }
  // 3.调用地图组件暴露的刷新方法
  mapRef.value?.refreshMarkers()
  // 4.重置表单
  handleReset()
}
// 重置表单处理函数
const handleReset = () => {
  formData.name = '',
  formData.region ='',
  formData.location1 = '',
  formData.location2 = '',
  formData.now = true,
  formData.remarks = ''
}
const handleMapClick = (coords: { lng: number, lat: number }) => {
  // 自动填充表单
  formData.location1 = coords.lng.toString() // 经度
  formData.location2 = coords.lat.toString() // 纬度
  
  // 可选：给个提示
  ElMessage.success(`已拾取坐标：${coords.lng.toFixed(6)}, ${coords.lat.toFixed(6)}`)
}
</script>

<style scoped lang="less">
.card-header{
  display: flex;
  align-items: center;
  justify-content: space-between; //左右分散对齐
  font-weight: bold; //字体加粗
  color: #333; //字体颜色深灰色
  font-size: clamp(14px, 1.2vw, 16px);
}
.tips{
  font-size: clamp(12px, 1vw, 14px);
  color:#909399;
  line-height:1.6; //行高
  p{
    margin-bottom: 4px; 
  }
}
.btn-group{
  display: flex;
  width: 100%;
  gap: 10px; //弹性布局设置子元素间距
  .flex-1 {
    flex: 1; //子元素占满剩余空间
    font-size: clamp( 14px, 1.2vw, 16px );
  }
}
// 对表单标签的响应式调整（深度选择器）
:deep(.el-form-item_label){
  //让表单前面的文字也能随页面缩放
  font-size: clamp( 14px, 1.2vw, 14px );
}
</style>
