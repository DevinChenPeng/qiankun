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
          <div id="subapp-container"></div>
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

onMounted(() => {
  // 获取用户信息
  const userInfoStr = sessionStorage.getItem('userInfo')
  if (userInfoStr) {
    userInfo.value = JSON.parse(userInfoStr)
  }

  // 根据当前路由设置激活菜单
  updateActiveMenu()

  // 加载微应用
  loadMicroApp()
})

// 监听路由变化
watch(() => route.path, () => {
  updateActiveMenu()
})

const updateActiveMenu = () => {
  if (route.path.startsWith('/micro-app1')) {
    activeMenu.value = '/micro-app1'
  } else if (route.path.startsWith('/micro-app2')) {
    activeMenu.value = '/micro-app2'
  } else {
    activeMenu.value = '/home'
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
</style>
