import { createApp } from 'vue'
import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import routes from './router'
import {
  renderWithQiankun,
  qiankunWindow
} from 'vite-plugin-qiankun/dist/helper'

const appInstances = new Map()

const resolveInstanceId = (props = {}) => {
  if (props.instanceId) {
    return props.instanceId
  }

  if (props.container?.id) {
    return `micro-app2:${props.container.id}`
  }

  return qiankunWindow.__POWERED_BY_QIANKUN__
    ? 'micro-app2:qiankun-default'
    : 'micro-app2:standalone'
}

const resolveContainerElement = (container) => {
  return container ? container.querySelector('#app') : document.getElementById('app')
}

const createAppHistory = (props = {}) => {
  const isMemoryMode = props.routerMode === 'memory' || props.from === 'dialog'
  const routerBase = props.routerBase || '/'

  return isMemoryMode
    ? createMemoryHistory(routerBase)
    : createWebHistory(routerBase)
}

const destroyInstance = (instanceId) => {
  const instance = appInstances.get(instanceId)

  if (!instance) {
    return
  }

  instance.app?.unmount()
  appInstances.delete(instanceId)
}

function render(props = {}) {
  const { container, userInfo } = props
  const instanceId = resolveInstanceId(props)
  const containerElement = resolveContainerElement(container)

  if (!containerElement) {
    return null
  }

  destroyInstance(instanceId)

  const history = createAppHistory(props)
  const router = createRouter({
    history,
    routes
  })

  const app = createApp(App)
  app.use(ElementPlus)
  app.use(router)

  // 将主应用传递的数据挂载到全局
  app.config.globalProperties.$mainAppData = props

  // 保存用户信息
  if (userInfo) {
    app.config.globalProperties.$userInfo = userInfo
  }

  app.mount(containerElement)

  appInstances.set(instanceId, {
    app,
    router,
    history,
    containerElement
  })

  return appInstances.get(instanceId)
}

// 独立运行时
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}

// qiankun 生命周期钩子
renderWithQiankun({
  // 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
  mount(props) {
    console.log('[micro-app2] mount', props, props.from)
    render(props)
  },
  // 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
  unmount(props) {
    console.log('[micro-app2] unmount', props)
    destroyInstance(resolveInstanceId(props))
  },
  // 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
  bootstrap() {
    console.log('[micro-app2] bootstrap')
  },
  // 可选，应用更新时调用
  update(props) {
    console.log('[micro-app2] update', props)
  }
})
