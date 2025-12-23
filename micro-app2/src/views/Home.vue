<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>微应用2 - 首页</span>
        </div>
      </template>
      <div class="content">
        <el-alert
          title="欢迎来到微应用2"
          type="info"
          :closable="false"
          style="margin-bottom: 20px"
        />

        <el-descriptions title="主应用传递的用户信息" :column="1" border>
          <el-descriptions-item label="用户名">
            {{ userInfo?.username || '未获取' }}
          </el-descriptions-item>
          <el-descriptions-item label="Token">
            {{ userInfo?.token || '未获取' }}
          </el-descriptions-item>
          <el-descriptions-item label="登录时间">
            {{ userInfo?.loginTime || '未获取' }}
          </el-descriptions-item>
          <el-descriptions-item label="主应用名称">
            {{ mainAppName || '未获取' }}
          </el-descriptions-item>
        </el-descriptions>

        <el-divider />

        <el-row :gutter="20">
          <el-col :span="8">
            <el-statistic title="在线用户" :value="120" />
          </el-col>
          <el-col :span="8">
            <el-statistic title="今日访问" :value="2680" />
          </el-col>
          <el-col :span="8">
            <el-statistic title="系统消息" :value="15" />
          </el-col>
        </el-row>

        <el-divider />

        <el-space wrap>
          <el-button type="primary" @click="goToDashboard">
            前往仪表板
          </el-button>
          <el-button type="success" @click="showNotification">
            显示通知
          </el-button>
          <el-button type="warning" @click="changeTheme">
            切换主题
          </el-button>
        </el-space>

        <div v-if="isDark" class="dark-box">
          深色主题模式已启用
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'

const router = useRouter()
const instance = getCurrentInstance()
const userInfo = ref(null)
const mainAppName = ref('')
const isDark = ref(false)

onMounted(() => {
  // 获取主应用传递的数据
  const mainAppData = instance?.appContext.config.globalProperties.$mainAppData
  if (mainAppData) {
    userInfo.value = mainAppData.userInfo
    mainAppName.value = mainAppData.mainAppName
  }
})

const goToDashboard = () => {
  router.push('/dashboard')
}

const showNotification = () => {
  ElNotification({
    title: '系统通知',
    message: '这是来自微应用2的通知消息！',
    type: 'success'
  })
}

const changeTheme = () => {
  isDark.value = !isDark.value
  ElMessage.success(isDark.value ? '已切换到深色主题' : '已切换到浅色主题')
}
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.content {
  padding: 10px 0;
}

.dark-box {
  margin-top: 20px;
  padding: 20px;
  background: #2c3e50;
  color: white;
  border-radius: 8px;
  text-align: center;
  font-size: 16px;
}
</style>
