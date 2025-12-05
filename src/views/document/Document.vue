<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入文章标题" v-model="searchParams.title" clearable @clear="loadData" />
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="loadData">查询</el-button>
        <el-button type="success" icon="Plus" @click="handleCreate">发布招商文案</el-button>
      </el-col>
    </el-row>
  </el-card>

  <el-card class="mt" v-loading="loading">
    <el-table :data="tableData" border stripe>
      <el-table-column label="序号" type="index" width="60" align="center" />
      <el-table-column label="文章标题" prop="title" align="center" show-overflow-tooltip />
      
      <el-table-column label="类型" prop="type" width="120" align="center">
        <template #default="scope">
          <el-tag>{{ scope.row.type }}</el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="重要程度" prop="level" width="100" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.level === '一级' ? 'danger' : 'warning'" effect="plain">
            {{ scope.row.level }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="发布人" prop="publisher" width="120" align="center" />
      <el-table-column label="阅读量" prop="readCount" width="100" align="center" sortable />
      <el-table-column label="发布时间" prop="date" width="180" align="center" sortable />
      
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button link type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        class="mt fr mb" 
        v-model:current-page="searchParams.page"
        v-model:page-size="searchParams.pageSize"
        :page-sizes="[10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="loadData"
        @current-change="loadData"
    />
  </el-card>

  <DocumentEditDialog ref="dialogRef" @success="handleSuccess" />

</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import type { DocumentParamsType } from '@/type/documentTy'
import { type DocumentParams, getListAPI } from '@/api/documentAPI'
import DocumentEditDialog from './components/DocumentEditDialog.vue'


// ------------------- 1. 数据定义 -------------------
const loading = ref<boolean>(false)
const total = ref<number>(0)
const tableData = ref<DocumentParamsType[]>([])
const searchParams = reactive<DocumentParams>({
    page: 1,
    pageSize: 10,
    title: ''
})
// 定义子组件实例，类型为: InstanceType<typeof 组件名> | null
const dialogRef = ref<InstanceType<typeof DocumentEditDialog> | null>(null)

// ------------------- 2. 业务逻辑 -------------------

// 加载列表
const loadData = async () => {
    loading.value = true
    try {
      const res = await getListAPI(searchParams)
      if(res.code === 200){
        tableData.value = res.data.list
        total.value = res.data.total
      }
    } 
    catch(e){
      console.error(e)
    } 
    finally {
      loading.value = false
    }
}

// 点击【发布】按钮
const handleCreate = () => {
  // 调用子组件暴露的 open 方法
  // ?. 是可选链，防止 dialogRef 为空时报错
  dialogRef.value?.open()
}

// 点击【编辑】按钮
const handleEdit = (row:DocumentParamsType) => {
  // 将当前行的数据传给子组件
  dialogRef.value?.open(row)
}

// 处理子组件成功回调
const handleSuccess = () => {
  // 如果是新增，通常回到第一页看最新数据
  // 如果是编辑，可以停留在当前页
  // 这里简单处理：回到第一页并刷新
  searchParams.page = 1
  loadData()
}



onMounted( () => loadData())

</script>

<style scoped>

</style>
