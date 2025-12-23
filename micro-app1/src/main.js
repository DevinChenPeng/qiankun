import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import routes from "./router";
import {
  renderWithQiankun,
  qiankunWindow,
} from "vite-plugin-qiankun/dist/helper";

let app = null;
let router = null;
let history = null;

function render(props = {}) {
  const { container, userInfo } = props;

  history = createWebHistory(
    qiankunWindow.__POWERED_BY_QIANKUN__ ? "/micro-app1" : "/"
  );
  router = createRouter({
    history,
    routes,
  });

  app = createApp(App);
  app.use(ElementPlus);
  app.use(router);

  // 将主应用传递的数据挂载到全局
  app.config.globalProperties.$mainAppData = props;

  // 保存用户信息
  if (userInfo) {
    app.config.globalProperties.$userInfo = userInfo;
  }

  const containerElement = container
    ? container.querySelector("#app")
    : document.getElementById("app");
  app.mount(containerElement);
}

// 独立运行时
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}

// qiankun 生命周期钩子
renderWithQiankun({
  // 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
  mount(props) {
    console.log("[micro-app1] mount", props);
    render(props);
  },
  // 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
  unmount(props) {
    console.log("[micro-app1] unmount", props);
    app?.unmount();
    app = null;
    router = null;
    history = null;
  },
  // 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
  bootstrap() {
    console.log("[micro-app1] bootstrap");
  },
  // 可选，应用更新时调用
  update(props) {
    console.log("[micro-app1] update", props);
  },
});
