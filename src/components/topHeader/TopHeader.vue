<template>
  <div class="header">
    <div class="left">
      <el-icon class="fold-icon" size="22" @click="toggle">
        <component :is="isCollapse ? 'Expand' : 'Fold'" />
      </el-icon>
      
      <el-breadcrumb separator="/" class="breadcrumb ml">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item 
          v-for="(item, index) in breadcrumbs" 
          :key="index"
        >
          {{ item.meta.title || item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="right-tools">
        <div class="tool-item" title="全局搜索" @click="openSearch">
           <el-icon size="18"><Search /></el-icon>
        </div>

        <div class="tool-item" title="全屏模式" @click="toggleFullScreen">
           <el-icon size="18">
             <component :is="isFullScreen ? 'Aim' : 'FullScreen'" />
           </el-icon>
        </div>

        <div class="tool-item" title="刷新页面" @click="handleRefresh">
           <el-icon size="18"><Refresh /></el-icon>
        </div>

        <div class="tool-item" title="消息通知">
           <el-badge is-dot class="badge-item">
              <el-icon size="18"><Bell /></el-icon>
           </el-badge>
        </div>

        <div class="user-box">
            <el-avatar :size="30" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <el-dropdown :hide-on-click="false" @command="handleCommand" class="ml-2">
                <span class="el-dropdown-link">
                  {{ username }}
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>              
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item icon="user" command="user">个人中心</el-dropdown-item>
                    <el-dropdown-item icon="SwitchButton" command="logout" divided>退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
             </el-dropdown>
        </div>
    </div>

    <el-dialog
      v-model="isShowSearch"
      title="菜单搜索"
      width="600px"
      destroy-on-close
      :show-close="false"
      class="search-dialog"
    >
      <el-select
        v-model="searchKeyword"
        filterable
        placeholder="请输入菜单名称进行搜索..."
        remote
        :remote-method="querySearch"
        style="width: 100%"
        size="large"
        @change="handleSelectMenu"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <el-option
          v-for="item in searchResult"
          :key="item.path"
          :label="item.name"
          :value="item.path"
        >
          <span style="float: left">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.path }}</span>
        </el-option>
      </el-select>
    </el-dialog>

  </div>
</template>

<script lang="ts" setup>
import { useLoginStore } from '@/store/login'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const props = defineProps<{
  isCollapse: boolean
}>()
const emit = defineEmits(['toggle-collapse'])

const router = useRouter()
const route = useRoute()
const loginStore = useLoginStore()
const { username, menu } = storeToRefs(loginStore) // [修改] 解构出 menu 数据

const isFullScreen = ref(false)

// [新增] 搜索相关变量
const isShowSearch = ref(false)
const searchKeyword = ref('')
const searchResult = ref<any[]>([]) // 存储搜索结果

// [新增] 定义扁平化菜单的接口
interface FlatMenuItem {
  name: string
  path: string
}

// [新增] 递归扁平化菜单函数 (将树形结构转为一维数组)
const flattenMenu = (menuList: any[], prefix = ''): FlatMenuItem[] => {
  let result: FlatMenuItem[] = []
  
  menuList.forEach(item => {
    // 假设 item.name 是菜单名，item.url 是路由路径
    // 如果有父级名称，拼接显示，例如 "系统管理 > 用户管理"
    const displayName = prefix ? `${prefix} > ${item.name}` : item.name
    
    // 如果有子菜单，递归处理
    if (item.children && item.children.length > 0) {
      result = result.concat(flattenMenu(item.children, displayName))
    } else {
      // 如果是叶子节点（真正的页面），加入结果集
      result.push({
        name: displayName,
        path: item.url // 这里使用你 menu 数据中的 url 字段
      })
    }
  })
  return result
}

// [新增] 计算属性：获取所有可搜索的菜单项 (缓存结果)
const allFlatMenus = computed(() => {
  return flattenMenu(menu.value || [])
})

// [新增] 打开搜索框
const openSearch = () => {
  isShowSearch.value = true
  searchKeyword.value = ''
  searchResult.value = allFlatMenus.value // 默认显示所有，或者置空等待输入
}

// [新增] 搜索过滤逻辑
const querySearch = (query: string) => {
  if (query) {
    searchResult.value = allFlatMenus.value.filter(item => {
      // 不区分大小写的模糊匹配
      return item.name.toLowerCase().includes(query.toLowerCase())
    })
  } else {
    searchResult.value = allFlatMenus.value
  }
}

// [新增] 选中菜单后的跳转逻辑
const handleSelectMenu = (path: string) => {
  if(!path) return
  router.push(path)
  isShowSearch.value = false // 关闭弹窗
}

// ... 下面是原有的代码 ...
const breadcrumbs = computed(() => {
  return route.matched.filter(item => item.name && item.name !== 'dashboard' && item.name !== 'Home')
})

const toggle = () => {
  emit('toggle-collapse')
}

const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
        isFullScreen.value = true
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
            isFullScreen.value = false
        }
    }
}

const handleRefresh = () => {
    window.location.reload()
}

const handleCommand = (command:string) => {
  if(command === 'user'){
    router.push('/personal')
  } else if(command === 'logout'){
    loginStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped lang="less">
/* ... 原有的 header 样式 ... */
.header{
  background-color: white;
  height: 60px;
  display: flex;
  justify-content: space-between; 
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #e6e6e6;
  
  .left {
    display: flex;
    align-items: center;
    .fold-icon {
      cursor: pointer;
      color: #606266;
      transition: color 0.3s;
      &:hover { color: #409eff; }
    }
    .ml { margin-left: 15px; }
    :deep(.el-breadcrumb__inner) {
      font-weight: normal;
      &.is-link {
        color: #606266;
        &:hover { color: #409eff; }
      }
    }
  }

  .right-tools {
    display: flex;
    align-items: center;
    height: 100%;

    .tool-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px; 
        height: 100%;
        cursor: pointer;
        color: #606266;
        transition: all 0.3s;
        
        &:hover {
            background-color: #f7f8fa;
            color: #409eff;
        }

        .badge-item {
            display: flex;
            align-items: center;
            :deep(.el-badge__content.is-fixed) {
                top: 0px;
                right: 2px;
            }
        }
    }

    .user-box {
        display: flex;
        align-items: center;
        margin-left: 15px; 
        padding-left: 15px;
        border-left: 1px solid #f0f0f0; 
        height: 30px; 

        .el-dropdown-link {
            cursor: pointer;
            color: #333;
            display: flex;
            align-items: center;
            border: none;
            outline: none;
            margin-left: 8px;
            font-size: 14px;
        }
    }
  }
}

/* [新增] 搜索弹窗样式优化 */
:deep(.search-dialog) {
  .el-dialog__header {
    display: none; /* 隐藏原本的标题栏，模仿 Spotlight 风格 */
  }
  .el-dialog__body {
    padding: 20px;
  }
  border-radius: 10px;
}
</style>