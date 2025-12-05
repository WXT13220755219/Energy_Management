<template>
  <el-dialog 
    v-model="visible" 
    title="权限设置" 
    width="500px"
    destroy-on-close
  >
    <el-form label-width="80px">
      <el-form-item label="当前账号">
          <el-input v-model="currentAccount" disabled></el-input>
      </el-form-item>

      <el-form-item label="菜单权限">
        <el-tree
          ref="treeRef"
          :data="menuList"
          show-checkbox
          node-key="url"
          default-expand-all
          :props="{ label: 'name', children: 'children' }"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="loading">确认保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { ElTree } from 'element-plus/es/components/tree'
import { useLoginStore } from '@/store/login' // 引入 store 获取完整菜单
import { getUserAuthAPI, getSetAuthAPI } from '@/api/systemAPI' // 引入真实接口

// 1. 基础数据
const visible = ref(false)
const loading = ref(false)
const currentAccount = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()

// 从 Pinia 获取所有可用菜单（假设管理员拥有全量菜单作为展示模板）
const loginStore = useLoginStore()
const menuList = loginStore.menu 

// 辅助函数：递归提取菜单中的 url，用于回显勾选
const extractUrls = (menus: any[]): string[] => {
    let urls: string[] = []
    menus.forEach(item => {
        // 只有叶子节点（没有children或children为空）才加入勾选，
        // 这样 el-tree 会自动处理父节点的半选/全选状态
        if (!item.children || item.children.length === 0) {
            urls.push(item.url)
        } else {
            urls = urls.concat(extractUrls(item.children))
        }
    })
    return urls
}

// 2. 打开弹窗
const open = async (row: any) => {
  visible.value = true
  currentAccount.value = row.account
  
  // 显示加载状态（可选，如果不想让用户在数据回来前操作）
  // loading.value = true 
  
  try {
    // 调用接口：根据用户的权限字段(pageAuthority)获取他拥有的菜单
    const res = await getUserAuthAPI({ pageAuthority: row.pageAuthority })
    if(res.code === 200) {
        // 提取后端返回菜单里的 url
        const checkedKeys = extractUrls(res.data.list)
        
        // 等待 DOM 更新后设置勾选
        setTimeout(() => {
            treeRef.value?.setCheckedKeys(checkedKeys)
        }, 0)
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('获取用户权限失败')
  } 
}

// 3. 确认保存
const handleConfirm = async () => {
  loading.value = true
  try {
    // 获取所有选中的节点 (包括全选和半选的父节点)
    const checkedNodes = treeRef.value?.getCheckedNodes(false, true) || []
    
    // 构造后端需要的参数结构
    const params = {
        account: currentAccount.value,
        pageList: checkedNodes, // 发送选中的菜单对象数组
        btnList: [] // 这里可以扩展按钮权限
    }

    const res = await getSetAuthAPI(params)
    if(res.code === 200){
        ElMessage.success('权限修改成功')
        visible.value = false
        // 这里可以触发父组件刷新，emit('refresh')
    }
  } catch(error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

defineExpose({ open })
</script>