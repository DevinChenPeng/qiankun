<template>
  <div id="micro-app2" data-qiankun-app="micro-app2">
    <router-view />
  </div>
</template>

<script setup>
</script>

<style>
/* 使用属性前缀实现样式隔离 */
#micro-app2[data-qiankun-app="micro-app2"] {
  width: 100%;
  min-height: 400px;
}

#micro-app2[data-qiankun-app="micro-app2"] h1 {
  color: #67c23a;
}

#micro-app2[data-qiankun-app="micro-app2"] .page-container {
  padding: 20px;
}
</style>
