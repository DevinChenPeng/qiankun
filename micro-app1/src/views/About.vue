<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>微应用1 - 关于页面</span>
        </div>
      </template>
      <div class="content">
        <el-descriptions title="应用信息" :column="1" border>
          <el-descriptions-item label="应用名称">
            微应用1 (micro-app1)
          </el-descriptions-item>
          <el-descriptions-item label="技术栈">
            Vue3 + Vite + Element Plus
          </el-descriptions-item>
          <el-descriptions-item label="运行端口">
            8081
          </el-descriptions-item>
          <el-descriptions-item label="JS隔离">
            代理沙箱
          </el-descriptions-item>
          <el-descriptions-item label="样式隔离">
            属性前缀
          </el-descriptions-item>
        </el-descriptions>

        <el-divider />

        <el-space>
          <el-button type="primary" @click="goBack">
            返回首页
          </el-button>
        </el-space>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/')
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
</style>
