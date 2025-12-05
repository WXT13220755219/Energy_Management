<template>

    <el-card>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-input placeholder="请输入姓名" v-model="searchParams.name" clearable></el-input>
            </el-col>
            <el-col :span="8">
                <el-select placeholder="请选择部门" v-model="searchParams.department">
                    <el-option label="总裁办" :value="1"></el-option>
                    <el-option label="技术部" :value="2"></el-option>
                    <el-option label="市场部" :value="3"></el-option>
                    <el-option label="维修部" :value="4"></el-option>
                    <el-option label="运营部" :value="5"></el-option>
                    <el-option label="客服部" :value="6"></el-option>
                </el-select>
            </el-col>
            <el-col :span="8">
                <el-button type="primary" @click="loadData()">查询</el-button>
                <el-button @click="handleReset()">重置</el-button>
            </el-col>
        </el-row>
    </el-card>

    <el-card class="mt">
        <el-table :data="tableData">
            <el-table-column align="center" label="序号" type="index" width="80"></el-table-column>
            <el-table-column align="center" label="账号" prop="account" width="120"></el-table-column>
            <el-table-column align="center" label="姓名" prop="name"></el-table-column>
            <el-table-column align="center" label="电话" prop="phone" width="160"></el-table-column>
            <el-table-column align="center" label="身份证号" prop="idNo" width="210"></el-table-column>
            <el-table-column align="center" label="职位" prop="position" width="100">
                <template #default="scope">
                    <el-tag type="info" effect="plain">{{ scope.row.position }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="部门" prop="department" width="100"></el-table-column>
            <el-table-column align="center" label="页面权限" prop="pageAuthority" width="160">
                <template #default="scope">
                    <el-tag :type="getAuthType(scope.row.pageAuthority)">
                        {{ scope.row.pageAuthority }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="按钮权限" prop="btnAuthority" width="130">
                <template #default="scope">
                    <el-tag :type="getAuthType(scope.row.btnAuthority)">
                        {{ scope.row.btnAuthority }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="280" >
                <template #default="scope">
                    <el-button icon="Edit" size="small" link type="primary" @click="handleEdit(scope.row)" >权限设置</el-button>
                    <el-button icon="Delete" size="small" link type="danger" @click="handleDelete(scope.row)" >删除</el-button>
                    <el-button icon="Lock" size="small" link type="info" >禁用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="fr mb mt"
            v-model:current-page="searchParams.page"
            v-model:page-size="searchParams.pageSize"
            :page-sizes="[10, 20, 30, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="loadData"
            @current-change="loadData"
        />
    </el-card>
    <PermissionDialog ref="permissionDialogRef" />
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { getSystemAPI, type SystemType } from '@/api/systemAPI'
import type { SystemParamsType } from '@/type/systemTy'
import { ElMessage, ElMessageBox } from 'element-plus'
import PermissionDialog from './components/PermissionDialog.vue'

const tableData = ref<SystemParamsType[]>([])
const total = ref<number>(0)
const searchParams = reactive<SystemType>({
    page: 1,
    pageSize: 10,
    name: '',
    department: '',
})
const loading = ref<boolean>(false)
// InstanceType<typeof ...> 是 TS 的语法，用于获取组件的类型定义
const permissionDialogRef = ref<InstanceType<typeof PermissionDialog>>()

const loadData = async () => {
    loading.value = true
    try {
        const res = await getSystemAPI(searchParams)
        if(res.code === 200){
            tableData.value = res.data.list
            total.value = res.data.total
        }
    } catch(e){
        console.error(e)
    } finally {
      loading.value = false
    }
}

const handleReset = () => {
    searchParams.page = 1
    searchParams.pageSize = 10
    searchParams.name = ''
    searchParams.department = ''
    loadData()
}

// 获取权限标签的类型颜色
const getAuthType = (auth:string) => {
    if( auth === 'admin' || auth === 'edit' ) return 'danger'
    if( auth === 'manager' || auth === 'all' ) return 'warning'
    if( auth === 'user' || auth === 'add') return 'success'
    return 'info'
}

// 处理权限设置点击
const handleEdit = (row:SystemParamsType) => {
    // 调用子组件暴露出的 open 方法，并将当前行数据传进
    permissionDialogRef.value?.open(row)
}

// 处理禁用/启用点击


// 处理删除点击
const handleDelete = (row:SystemParamsType) => {
    ElMessageBox.confirm(
        `确认要删除账号 ${row.account} 吗? 此操作无法恢复。`,
        {
          confirmButtonText:'确认删除',
          cancelButtonText:'取消',
          type:'warning',
          buttonSize:'small'
        }
    )
    .then( () => {
        ElMessage.success('删除成功')
        loadData()
    })
    .catch( () => {
        ElMessage.info('已取消删除')
    })
}





onMounted( () => loadData() )







</script>

<style scoped>

</style>
