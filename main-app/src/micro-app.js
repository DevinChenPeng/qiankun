import { registerMicroApps, start } from 'qiankun'

export function loadMicroApp(onLoadingChange) {
  const notifyLoading = (appName, isLoading) => {
    if (typeof onLoadingChange === 'function') {
      onLoadingChange(appName, isLoading)
    }
  }

  const createLoader = (appName) => (loading) => {
    notifyLoading(appName, loading)
  }

  // 获取登录用户信息
  const getUserInfo = () => {
    const userInfoStr = sessionStorage.getItem('userInfo')
    return userInfoStr ? JSON.parse(userInfoStr) : null
  }

  // 注册微应用
  registerMicroApps(
    [
      {
        name: 'micro-app1',
        entry: '//localhost:8081',
        container: '#subapp-container',
        activeRule: '/micro-app1',
        loader: createLoader('micro-app1'),
        props: {
          userInfo: getUserInfo(),
          mainAppName: '主应用'
        }
      },
      {
        name: 'micro-app2',
        entry: '//localhost:8082',
        container: '#subapp-container',
        activeRule: '/micro-app2',
        loader: createLoader('micro-app2'),
        props: {
          userInfo: getUserInfo(),
          mainAppName: '主应用'
        }
      }
    ],
    {
      beforeLoad: [
        app => {
          console.log('[主应用] before load', app.name)
        }
      ],
      beforeMount: [
        app => {
          console.log('[主应用] before mount', app.name)
        }
      ],
      afterMount: [
        app => {
          console.log('[主应用] after mount', app.name)
        }
      ],
      beforeUnmount: [
        app => {
          console.log('[主应用] before unmount', app.name)
        }
      ],
      afterUnmount: [
        app => {
          console.log('[主应用] after unmount', app.name)
        }
      ]
    }
  )

  // 启动 qiankun，配置代理沙箱和样式隔离
  start({
    sandbox: {
      // 使用代理沙箱（默认为 true）
      experimentalStyleIsolation: true, // 实验性样式隔离
      strictStyleIsolation: false // 不使用严格样式隔离（shadow DOM）
    },
    prefetch: true, // 预加载
    singular: false, // 是否为单实例场景，false表示允许多个微应用同时激活
    fetch: window.fetch // 自定义 fetch 方法
  })
}

export default {
  loadMicroApp
}
