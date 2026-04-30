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
            <el-menu-item index="/micro-app1/">
              <span>微应用1</span>
            </el-menu-item>
            <el-menu-item index="/micro-app2/">
              <span>微应用2</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <MainContentContainer
          :active-menu="activeMenu"
          :user-info="userInfo"
          :show-micro-app-loading="showMicroAppLoading"
        />
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { loadMicroApp } from '../micro-app'
import MainContentContainer from '../components/layout/MainContentContainer.vue'

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
    activeMenu.value = '/micro-app1/'
  } else if (microAppName === 'micro-app2') {
    activeMenu.value = '/micro-app2/'
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
</style>
