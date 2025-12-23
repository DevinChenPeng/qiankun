<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>微应用2 - 仪表板</span>
        </div>
      </template>
      <div class="content">
        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <span>应用信息</span>
              </template>
              <el-descriptions :column="1" border>
                <el-descriptions-item label="应用名称">
                  微应用2 (micro-app2)
                </el-descriptions-item>
                <el-descriptions-item label="技术栈">
                  Vue3 + Vite + Element Plus
                </el-descriptions-item>
                <el-descriptions-item label="运行端口">
                  8082
                </el-descriptions-item>
                <el-descriptions-item label="JS隔离">
                  代理沙箱
                </el-descriptions-item>
                <el-descriptions-item label="样式隔离">
                  属性前缀
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <span>快捷操作</span>
              </template>
              <el-space direction="vertical" style="width: 100%">
                <el-button type="primary" style="width: 100%">
                  数据统计
                </el-button>
                <el-button type="success" style="width: 100%">
                  用户管理
                </el-button>
                <el-button type="warning" style="width: 100%">
                  系统设置
                </el-button>
                <el-button type="info" style="width: 100%">
                  日志查看
                </el-button>
              </el-space>
            </el-card>
          </el-col>
        </el-row>

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
