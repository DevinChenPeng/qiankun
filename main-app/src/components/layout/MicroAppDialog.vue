<template>
  <el-dialog
    v-model="dialogVisible"
    :title="currentAppConfig.title"
    width="80%"
    top="6vh"
    append-to-body
    destroy-on-close
    @closed="handleClosed"
  >
    <div class="dialog-content">
      <div v-if="appLoading" class="dialog-loading">子应用加载中…</div>
      <div v-if="appLoadError" class="dialog-error">{{ appLoadError }}</div>
      <div
        v-show="!appLoadError"
        ref="microAppContainerRef"
        class="micro-app-container"
      ></div>
    </div>
  </el-dialog>
</template>
<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { loadMicroApp as loadQiankunMicroApp } from "qiankun";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  appName: {
    type: String,
    default: "",
  },
  userInfo: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue", "closed"]);

const appConfigMap = {
  "micro-app1": {
    title: "微应用1",
    name: "micro-app1-dialog",
    instanceId: "micro-app1-dialog",
    entry: "//localhost:8081",
  },
  "micro-app2": {
    title: "微应用2",
    name: "micro-app2-dialog",
    instanceId: "micro-app2-dialog",
    entry: "//localhost:8082",
  },
};

const currentAppConfig = computed(() => {
  return (
    appConfigMap[props.appName] || {
      title: "子应用",
      name: "",
      instanceId: "",
      entry: "",
    }
  );
});

const microAppContainerRef = ref(null);
const microAppInstance = ref(null);
const appLoading = ref(false);
const appLoadError = ref("");
let unmountingPromise = null;

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const unmountMicroApp = async () => {
  if (unmountingPromise) {
    return unmountingPromise;
  }

  if (!microAppInstance.value) {
    return;
  }

  const instance = microAppInstance.value;
  microAppInstance.value = null;

  try {
    unmountingPromise = (async () => {
      try {
        if (instance.mountPromise) {
          await instance.mountPromise;
        }

        const appStatus =
          typeof instance.getStatus === "function"
            ? instance.getStatus()
            : typeof instance.getAppStatus === "function"
              ? instance.getAppStatus()
              : "MOUNTED";

        if (appStatus === "MOUNTED") {
          await instance.unmount();
        }
      } finally {
        appLoading.value = false;
        unmountingPromise = null;
      }
    })();

    await unmountingPromise;
  } finally {
    appLoading.value = false;
  }
};

const mountMicroApp = async () => {
  if (!dialogVisible.value || !props.appName || !currentAppConfig.value.entry) {
    return;
  }

  await unmountMicroApp();
  await nextTick();

  if (!microAppContainerRef.value) {
    return;
  }

  appLoadError.value = "";
  const obj = {
    name: currentAppConfig.value.name,
    entry: currentAppConfig.value.entry,
    container: microAppContainerRef.value,
    loader: (loading) => {
      appLoading.value = loading;
    },
    props: {
      userInfo: props.userInfo,
      mainAppName: "主应用",
      instanceId: currentAppConfig.value.instanceId,
      from: "dialog",
      routerMode: "memory",
      routerBase: "/",
    },
  };

  try {
    microAppInstance.value = loadQiankunMicroApp(obj, {
      sandbox: {
        experimentalStyleIsolation: true,
        strictStyleIsolation: false,
      },
    });

    await microAppInstance.value.mountPromise;
    appLoading.value = false;
  } catch (error) {
    appLoadError.value = "子应用加载失败，请确认子应用已启动。";
    appLoading.value = false;
    console.error("[MicroAppDialog] load failed:", error);
  }
};

watch([() => props.modelValue, () => props.appName], async ([visible]) => {
  if (!visible) {
    await unmountMicroApp();
    return;
  }

  await mountMicroApp();
});

onBeforeUnmount(async () => {
  await unmountMicroApp();
});

const handleClosed = () => {
  emit("closed");
};
</script>

<style scoped>
.dialog-content {
  width: 100%;
  height: 70vh;
  position: relative;
}

.micro-app-container {
  width: 100%;
  height: 100%;
  background: #fff;
}

.dialog-loading,
.dialog-error {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  color: #606266;
  z-index: 1;
}

.dialog-error {
  color: #f56c6c;
}
</style>
