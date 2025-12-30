<template>
  <div class="layout-container">
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <h2>微前端主应用</h2>
        </div>
        <div class="header-right">
          <span class="user-info">欢迎，{{ userInfo.username }}</span>
          <el-button type="danger" size="small" @click="handleLogout">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px" class="aside">
          <el-menu
            :default-active="activeMenu"
            class="el-menu-vertical"
            @select="handleMenuSelect"
          >
            <el-menu-item index="/home">
              <span>首页</span>
            </el-menu-item>
            <el-menu-item index="/micro-app1/home">
              <span>微应用1</span>
            </el-menu-item>
            <el-menu-item index="/micro-app2">
              <span>微应用2</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <!-- 首页内容 -->
          <div v-if="activeMenu === '/home'" class="home-content">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>欢迎使用微前端系统</span>
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
          <div v-else class="subapp-wrapper">
            <div v-if="showMicroAppLoading" class="loading-placeholder">
              <span class="loading-text">微应用加载中…</span>
            </div>
            <div v-show="!showMicroAppLoading" id="subapp-container"></div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { loadMicroApp } from '../micro-app'

const router = useRouter()
const route = useRoute()
const activeMenu = ref('/home')
const userInfo = ref({})
const showMicroAppLoading = ref(false)
const loadedMicroApps = new Set()

const resolveMicroAppName = (path) => {
  if (path.startsWith('/micro-app1')) {
    return 'micro-app1'
  }
  if (path.startsWith('/micro-app2')) {
    return 'micro-app2'
  }
  return null
}

onMounted(() => {
  // 获取用户信息
  const userInfoStr = sessionStorage.getItem('userInfo')
  if (userInfoStr) {
    userInfo.value = JSON.parse(userInfoStr)
  }

  // 根据当前路由设置激活菜单
  updateActiveMenu()

  // 加载微应用
  loadMicroApp(handleMicroAppLoading)
})

// 监听路由变化
watch(() => route.path, () => {
  updateActiveMenu()
})

const updateActiveMenu = () => {
  const microAppName = resolveMicroAppName(route.path)

  if (microAppName === 'micro-app1') {
    activeMenu.value = '/micro-app1'
  } else if (microAppName === 'micro-app2') {
    activeMenu.value = '/micro-app2'
  } else {
    activeMenu.value = '/home'
  }

  if (microAppName && !loadedMicroApps.has(microAppName)) {
    showMicroAppLoading.value = true
  } else {
    showMicroAppLoading.value = false
  }
}

const handleMenuSelect = (index) => {
  activeMenu.value = index
  router.push(index)
}

const handleLogout = () => {
  sessionStorage.removeItem('userInfo')
  ElMessage.success('退出成功')
  router.push('/login')
}

const handleMicroAppLoading = (appName, isLoading) => {
  const isActiveApp = resolveMicroAppName(route.path) === appName

  if (!isActiveApp) {
    return
  }

  if (!isLoading) {
    loadedMicroApps.add(appName)
    showMicroAppLoading.value = false
    return
  }

  if (!loadedMicroApps.has(appName)) {
    showMicroAppLoading.value = true
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #409eff;
  color: white;
  padding: 0 20px;
}

.header-left h2 {
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  margin-right: 10px;
}

.aside {
  background-color: #f5f7fa;
  height: calc(100vh - 60px);
}

.main {
  padding: 20px;
  background-color: #f0f2f5;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.home-content {
  max-width: 800px;
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
