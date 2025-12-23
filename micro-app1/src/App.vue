<template>
  <div id="micro-app1" data-qiankun-app="micro-app1">
    <router-view />
  </div>
</template>

<script setup>
</script>

<style>
/* 使用属性前缀实现样式隔离 */
#micro-app1[data-qiankun-app="micro-app1"] {
  width: 100%;
  min-height: 400px;
}

#micro-app1[data-qiankun-app="micro-app1"] h1 {
  color: #409eff;
}

#micro-app1[data-qiankun-app="micro-app1"] .page-container {
  padding: 20px;
}
</style>
