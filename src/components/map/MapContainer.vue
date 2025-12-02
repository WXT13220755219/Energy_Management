<template>
  <div id="container"></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import stationImg from '@/assets/station.jpg'
import flashIcon from '@/assets/flashIcon.png'
import { getMapListAPI } from '@/api/map'

// 保存地图实例和AMap构造函数命名空间
let mapInstance: any = null
let AMapNamespace: any = null 
const emit = defineEmits(['map-click'])

const initMap = () => {
    AMapLoader.load({
        key: "de929fa2537c8cde27e66f50e71326e9", // 你的 Key
        version: "1.4.15",     // 指定版本为 1.4.15
        plugins: ['AMap.Scale', 'AMap.ToolBar'],
    }).then((AMap) => {
        AMapNamespace = AMap
        
        // --- 1.4.15 版本初始化优化 ---
        mapInstance = new AMap.Map("container", {
            zoom: 5,
            center: [116.397428, 39.90923],
            resizeEnable: true, // 1.4.15 必须开启此项，否则窗口变化时地图不跟随缩放
            // 建议：v1.4.15 尽量不要用 viewMode: '3D'，除非你确实需要并不介意性能损耗
        })
        
        // --- 点击事件监听 (保持功能) ---
        mapInstance.on('click', (e: any) => {
            const lng = e.lnglat.getLng()
            const lat = e.lnglat.getLat()
            emit('map-click', { lng, lat })
        })
        
        renderMarkers()
        
    }).catch(e => {
        console.error('地图加载失败:', e)
    })
}

const renderMarkers = async () => {
    // 安全检查：如果 AMap 命名空间或地图实例不存在，直接终止
    if (!mapInstance || !AMapNamespace) return

    try {
        const { data } = await getMapListAPI()
        
        // 清除地图上已有的覆盖物
        mapInstance.clearMap()

        // 创建信息窗体 (注意：使用保存的 AMapNamespace)
        // 这里如果 AMapNamespace 是 null，就不会执行到这，避免了 Pixel(NaN) 错误
        const infoWindow = new AMapNamespace.InfoWindow({
            offset: new AMapNamespace.Pixel(0, -30) 
        })

        data.forEach((item: any) => {
            // 数据清洗：确保坐标有效
            if (!item.position || !Array.isArray(item.position) || item.position.length < 2) return
            const lng = Number(item.position[0])
            const lat = Number(item.position[1])
            if (!Number.isFinite(lng) || !Number.isFinite(lat)) return

            // 创建标记
            const marker = new AMapNamespace.Marker({
                position: [lng, lat],
                icon: new AMapNamespace.Icon({
                    size: new AMapNamespace.Size(30, 33),
                    image: flashIcon,
                    imageSize: new AMapNamespace.Size(30, 33)
                }),
                title: item.title
            })

            // 绑定点击事件
            marker.on('click', () => {
                infoWindow.setContent(`
                    <div class="info-window">
                        <img src="${stationImg}" alt="station" class="info-img" />
                        <div class="info-right">
                            <h4>${item.title}</h4>
                            <p>桩数: <span class="highlight">${item.count || 0}</span></p>
                            <p>状态: <span class="${item.status === 1 ? 'status-free' : 'status-busy'}">
                                ${item.status === 1 ? '空闲' : '使用中'}
                            </span></p>
                        </div>
                    </div>
                `)
                infoWindow.open(mapInstance, marker.getPosition())
            })

            mapInstance.add(marker)
        })
    } catch (error) {
        console.error("获取站点数据失败", error)
    }
}

// 暴露给父组件的刷新方法
const refreshMarkers = () => {
    renderMarkers()
}

onMounted(() => {
    initMap()
})

onUnmounted(() => {
    mapInstance?.destroy()
})

defineExpose({ refreshMarkers })
</script>

<style scoped lang="less">
#container {
    width: 100%;
    height: 80vh;
    border-radius: 8px;
}

/* 全局样式穿透：用于自定义信息窗体 */
:global(.info-window) {
    display: flex;
    width: 280px;
    padding: 5px;
    align-items: center;
}
:global(.info-img) {
    width: 90px;
    height: 65px;
    object-fit: cover;
    border-radius: 4px;
}
:global(.info-right) {
    margin-left: 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 65px;
}
:global(.info-right h4) {
    margin: 0;
    font-size: 15px;
    color: #333;
}
:global(.info-right p) {
    margin: 0;
    font-size: 12px;
    color: #666;
}
:global(.highlight) {
    color: #409EFF;
    font-weight: bold;
    margin-left: 4px;
}
:global(.status-free) {
    color: #67C23A;
    margin-left: 4px;
}
:global(.status-busy) {
    color: #E6A23C;
    margin-left: 4px;
}
</style>