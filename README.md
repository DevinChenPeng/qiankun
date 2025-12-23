# 微前端学习项目

这是一个基于 qiankun 的微前端学习项目，包含 1 个主应用和 2 个微应用。

## 项目结构

```
qiankun/
├── main-app/          # 主应用 (端口: 8080)
│   ├── src/
│   │   ├── views/     # 页面组件
│   │   │   ├── Login.vue        # 登录页
│   │   │   └── Layout.vue       # 布局页（含微应用容器）
│   │   ├── router/    # 路由配置
│   │   ├── micro-app.js         # qiankun 配置
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   └── vite.config.js
├── micro-app1/        # 微应用1 (端口: 8081)
│   ├── src/
│   │   ├── views/     # 页面组件
│   │   │   ├── Home.vue
│   │   │   └── About.vue
│   │   ├── router/    # 路由配置
│   │   ├── App.vue
│   │   └── main.js    # 包含 qiankun 生命周期
│   ├── package.json
│   └── vite.config.js
└── micro-app2/        # 微应用2 (端口: 8082)
    ├── src/
    │   ├── views/     # 页面组件
    │   │   ├── Home.vue
    │   │   └── Dashboard.vue
    │   ├── router/    # 路由配置
    │   ├── App.vue
    │   └── main.js    # 包含 qiankun 生命周期
    ├── package.json
    └── vite.config.js
```

## 技术栈

- **主应用**: Vue 3 + Vite + Vue Router + Element Plus + qiankun
- **微应用1**: Vue 3 + Vite + Vue Router + Element Plus + vite-plugin-qiankun
- **微应用2**: Vue 3 + Vite + Vue Router + Element Plus + vite-plugin-qiankun

## 功能特性

### 主应用功能
- ✅ 登录页面（用户认证）
- ✅ 子应用切换页面
- ✅ 路由守卫（登录验证）
- ✅ 用户信息管理
- ✅ 微应用注册与加载

### 微前端特性
- ✅ **JS 隔离**: 使用代理沙箱（Proxy Sandbox）
- ✅ **样式隔离**: 使用属性前缀（data-qiankun-app）
- ✅ **主子应用通信**: 通过 props 传递登录信息
- ✅ **生命周期管理**: bootstrap、mount、unmount
- ✅ **独立运行**: 微应用可独立开发和运行

## 安装依赖

分别进入三个应用目录安装依赖：

```powershell
# 主应用
cd main-app
npm install

# 微应用1
cd ../micro-app1
npm install

# 微应用2
cd ../micro-app2
npm install
```

## 启动项目

**重要**: 需要按顺序启动，先启动微应用，再启动主应用。

### 方式一：分别启动（推荐用于开发）

打开 3 个终端窗口，分别执行：

```powershell
# 终端1 - 启动微应用1
cd micro-app1
npm run dev

# 终端2 - 启动微应用2
cd micro-app2
npm run dev

# 终端3 - 启动主应用
cd main-app
npm run dev
```

### 方式二：使用命令行快速启动

```powershell
# 在项目根目录执行
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd micro-app1; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd micro-app2; npm run dev"
timeout /t 3
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd main-app; npm run dev"
```

## 访问地址

- **主应用**: http://localhost:8080
- **微应用1**: http://localhost:8081 (可独立访问)
- **微应用2**: http://localhost:8082 (可独立访问)

## 使用说明

### 1. 登录
- 访问 http://localhost:8080
- 输入任意用户名和密码
- 点击登录按钮

### 2. 切换微应用
- 登录成功后，点击左侧菜单
- 选择"微应用1"或"微应用2"
- 查看微应用接收到的登录信息

### 3. 查看功能
- **微应用1**:
  - 查看用户信息
  - 测试页面路由跳转
  - 测试样式隔离

- **微应用2**:
  - 查看用户信息
  - 查看统计数据
  - 访问仪表板页面

## 核心配置说明

### 1. 主应用 - qiankun 配置

```javascript
// main-app/src/micro-app.js
registerMicroApps([
  {
    name: 'micro-app1',
    entry: '//localhost:8081',
    container: '#subapp-container',
    activeRule: '/micro-app1',
    props: { userInfo, mainAppName }  // 传递登录信息
  }
])

start({
  sandbox: {
    experimentalStyleIsolation: true  // 样式隔离
  }
})
```

### 2. 微应用 - 生命周期配置

```javascript
// micro-app1/src/main.js
renderWithQiankun({
  mount(props) {
    // 接收主应用传递的数据
    const { userInfo } = props
    render(props)
  },
  unmount(props) {
    app?.unmount()
  }
})
```

### 3. 样式隔离实现

```vue
<!-- 微应用中使用 data-qiankun-app 属性 -->
<div id="micro-app1" data-qiankun-app="micro-app1">
  <!-- 内容 -->
</div>

<style>
#micro-app1[data-qiankun-app="micro-app1"] h1 {
  color: #409eff;
}
</style>
```

## 技术要点

### JS 隔离 - 代理沙箱
qiankun 默认使用代理沙箱（Proxy Sandbox），它会：
- 拦截并记录子应用的全局变量修改
- 在子应用卸载时恢复全局环境
- 防止子应用之间的变量污染

### 样式隔离 - 属性前缀
使用 `experimentalStyleIsolation: true` 后：
- qiankun 会为子应用的样式添加特定前缀
- 配合 `data-qiankun-app` 属性实现样式隔离
- 避免使用 Shadow DOM 带来的兼容性问题

### 主子应用通信
- **主应用传递数据**: 通过 `props` 传递登录信息
- **子应用接收数据**: 在 `mount` 生命周期中获取
- **全局状态**: 可扩展使用 actions 进行双向通信

## 常见问题

### 1. 子应用无法加载
- 检查子应用是否已启动
- 检查端口是否正确（8081, 8082）
- 查看浏览器控制台是否有 CORS 错误

### 2. 样式冲突
- 确保每个微应用使用唯一的 `data-qiankun-app` 属性
- 在样式中使用属性选择器限定作用域

### 3. 路由冲突
- 主应用和子应用使用不同的路由前缀
- 子应用使用相对路径配置

## 扩展学习

### 下一步可以学习的内容：
1. **全局状态管理**: 使用 qiankun 的 actions 实现主子应用通信
2. **预加载优化**: 配置子应用预加载策略
3. **错误处理**: 添加子应用加载失败的降级方案
4. **性能优化**: 使用懒加载、缓存等技术
5. **生产部署**: 配置 Nginx 代理和静态资源部署

## 参考文档

- [qiankun 官方文档](https://qiankun.umijs.org/zh)
- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Element Plus 文档](https://element-plus.org/zh-CN/)
- [Vite 官方文档](https://cn.vitejs.dev/)

## License

MIT
乾坤
