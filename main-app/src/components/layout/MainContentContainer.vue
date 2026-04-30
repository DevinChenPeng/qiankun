<script setup>
import { ref } from 'vue'
import MicroAppDialog from './MicroAppDialog.vue'

defineProps({
  activeMenu: {
    type: String,
    required: true
  },
  userInfo: {
    type: Object,
    required: true
  },
  showMicroAppLoading: {
    type: Boolean,
    required: true
  }
})

const dialogVisible = ref(false)
const currentDialogAppName = ref('')

const openMicroAppDialog = (appName) => {
  currentDialogAppName.value = appName

  dialogVisible.value = true
}

const handleDialogClosed = () => {
  currentDialogAppName.value = ''
}
</script>

<template>
  <el-main class="main-content-container">
    <!-- 首页内容 -->
    <div v-show="activeMenu === '/home'" class="home-content">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>欢迎使用微前端系统</span>
            <div class="card-actions">
              <el-button size="small" @click="openMicroAppDialog('micro-app1')">
                单独一个弹窗打开app1微应用
              </el-button>
              <el-button size="small" @click="openMicroAppDialog('micro-app2')">
                单独一个弹窗打开app2微应用
              </el-button>
            </div>
          </div>
        </template>
        <div>
          <p><strong>用户名:</strong> {{ userInfo.username }}</p>
          <p><strong>Token:</strong> {{ userInfo.token }}</p>
          <p><strong>登录时间:</strong> {{ userInfo.loginTime }}</p>
          <el-divider />
          <p>请从左侧菜单选择要访问的微应用</p>
        </div>
      </el-card>
    </div>

    <!-- 微应用容器 -->
    <div v-show="activeMenu !== '/home'" class="subapp-wrapper">
      <div v-if="showMicroAppLoading" class="loading-placeholder">
        <span class="loading-text">微应用加载中…</span>
      </div>
      <div v-show="!showMicroAppLoading" id="subapp-container"></div>
    </div>

    <MicroAppDialog
      v-model="dialogVisible"
      :app-name="currentDialogAppName"
      :user-info="userInfo"
      @closed="handleDialogClosed"
    />
  </el-main>
</template>

<style scoped>
.main-content-container {
  padding: 20px;
  background-color: #f0f2f5;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.home-content {
  max-width: 800px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

#subapp-container {
  width: 100%;
  min-height: 500px;
}

.subapp-wrapper {
  width: 100%;
  min-height: 500px;
  position: relative;
}

.loading-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 500px;
  background-color: #fff;
  border: 1px dashed #dcdfe6;
  color: #909399;
}

.loading-text {
  font-size: 16px;
}
</style>
