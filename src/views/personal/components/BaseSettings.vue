<!-- [右侧-Tab2] 基本设置表单 -->
 <template>
  <el-form label-position="top" :model="form" :rules="rules" ref="formRef" class="setting-form">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="昵称" prop="name">
          <el-input v-model="form.name" placeholder="请输入昵称" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="个人简介">
      <el-input 
        v-model="form.bio" 
        type="textarea" 
        :rows="4" 
        placeholder="简单的介绍一下你自己，让大家更了解你..." 
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="loading" @click="submit">更新基本信息</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import type { PersonalInfoType } from '@/type/personalTy'

const props = defineProps<{
  userInfo: PersonalInfoType,
  loading: boolean
}>()

const emit = defineEmits(['update'])

const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  phone: '',
  bio: ''
})

const rules = {
  name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ]
}

// 监听父组件传来的 userInfo，回填表单
watch(() => props.userInfo, (newVal) => {
  if (newVal) {
    form.name = newVal.name
    form.phone = newVal.phone
    // 模拟简介
    form.bio = '热爱编程，专注于前端技术栈，致力于打造极致的用户体验。'
  }
}, { immediate: true })

const submit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      emit('update', form)
    }
  })
}
</script>

<style scoped>
.setting-form { padding: 10px; }
</style>