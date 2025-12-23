<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>微应用1 - 首页</span>
        </div>
      </template>
      <div class="content">
        <el-alert
          title="欢迎来到微应用1"
          type="success"
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

        <el-space wrap>
          <el-button type="primary" @click="goToAbout">
            前往关于页面
          </el-button>
          <el-button type="success" @click="showMessage">
            显示消息
          </el-button>
          <el-button type="warning" @click="testIsolation">
            测试样式隔离
          </el-button>
        </el-space>

        <div v-if="showTest" class="test-box">
          这是一个测试样式隔离的盒子
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const instance = getCurrentInstance()
const userInfo = ref(null)
const mainAppName = ref('')
const showTest = ref(false)

onMounted(() => {
  // 获取主应用传递的数据
  const mainAppData = instance?.appContext.config.globalProperties.$mainAppData
  if (mainAppData) {
    userInfo.value = mainAppData.userInfo
    mainAppName.value = mainAppData.mainAppName
  }
})

const goToAbout = () => {
  router.push('/about')
}

const showMessage = () => {
  ElMessage({
    message: '这是来自微应用1的消息！',
    type: 'success'
  })
}

const testIsolation = () => {
  showTest.value = !showTest.value
  ElMessage.info(showTest.value ? '显示测试盒子' : '隐藏测试盒子')
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

.test-box {
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  text-align: center;
  font-size: 16px;
}
</style>
