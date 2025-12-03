<!-- 会员卡管理 -->
<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="6">
          <el-input placeholder="请输入会员卡号" v-model="searchParams.no" clearable></el-input>
      </el-col>
      <el-col :span="6">
          <el-input placeholder="请输入手机号" v-model="searchParams.tel" clearable></el-input>
      </el-col>
      <el-col :span="6">
          <el-input placeholder="请输入姓名" v-model="searchParams.name" clearable></el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="loadData">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-col>
    </el-row>
  </el-card>

  <el-card class="mt">
    <el-table :data="tableData">
        <el-table-column label="会员卡号" prop="memberCardNumber" align="center" width="180"></el-table-column>
        <el-table-column label="卡类型" prop="cardType" align="center"></el-table-column>
        
        <el-table-column label="开卡日期" prop="issueDate" align="center" sortable width="120"></el-table-column>
        
        <el-table-column label="持有人姓名" prop="holderName" align="center"></el-table-column>
        <el-table-column label="持有人电话" prop="holderPhone" align="center" width="120"></el-table-column>
        
        <el-table-column label="卡余额" prop="cardBalance" align="center" sortable>
             <template #default="scope">
                <span style="color: #f56c6c; font-weight: bold;">{{ scope.row.cardBalance }} 元</span>
            </template>
        </el-table-column>

        <el-table-column label="消费记录" width="110" align="center">
          <template #default="scope">
            <el-popover placement="left" title="消费明细" :width="220" trigger="hover" >
              <template #reference>
                <el-button link type="primary" size="small">查看记录</el-button>
              </template>
              
              <div v-if="scope.row.transactionRecords && scope.row.transactionRecords.length">
                  <el-timeline style="width: 220px; padding-left: 30px;">
                    <el-timeline-item 
                      v-for="(item, index) in scope.row.transactionRecords" 
                      :key="index" 
                      :timestamp="item.transactionDate"
                      color="#0bbd87"
                    >
                      <p>类型：{{ item.transactionType }}</p>
                      <p>金额：{{ item.transactionAmount }} 元</p>
                    </el-timeline-item>
                  </el-timeline>
              </div>
              <div v-else>暂无记录</div>

            </el-popover>
          </template>
        </el-table-column>
        
        <el-table-column label="有效期" prop="validUntil" align="center" sortable width="120"></el-table-column>
    </el-table>
    <el-pagination
        class="mt fr mb"
        v-model:current-page="searchParams.page"
        v-model:page-size="searchParams.pageSize"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="loadData"
        @current-change="loadData"
        background
    />
  </el-card>
</template>


<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import type { MemberType } from '@/type/memberTy'
import { getMemberAPI, type MemberParamsType } from '@/api/memberAPI'

const total = ref<number>(0)
const tableData = ref<MemberType[]>([])
const searchParams = reactive<MemberParamsType>({
    page: 1,
    pageSize:10,
    no: '', 
    tel: '',
    name: ''
})

const loadData = async () => {
  try {
    const res = await getMemberAPI(searchParams)
    console.log('前端收到的API响应:', res)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error){
    console.error(error)
  }
}
const handleReset = () => {
  searchParams.name = '',
  searchParams.no = '',
  searchParams.tel = '',
  loadData()
}

onMounted( () => loadData() )
</script>

<style scoped>

</style>
