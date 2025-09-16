import { createApp } from 'vue'
import './style.css'
import './styles/themes.css'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import { useSettingsStore } from './stores/useSettingsStore'
import logger from './services/LoggerService'
import errorHandler from './services/ErrorHandler'

// 初始化日志和错误处理
logger.info('应用启动中...')
errorHandler.initialize()

const app = createApp(App)

// 设置Vue错误处理
app.config.errorHandler = (error, instance, info) => {
  errorHandler.handleVueError(error, instance, info)
}

app.config.warnHandler = (msg, instance, trace) => {
  errorHandler.handleVueWarning(msg, instance, trace)
}

// 使用Pinia状态管理
app.use(pinia)

// 使用路由
app.use(router)

// 路由错误处理
router.onError((error) => {
  errorHandler.handleVueError(error, null, 'router_error')
})

// 初始化设置
try {
  const settingsStore = useSettingsStore()
  settingsStore.loadSettings()
  settingsStore.applyTheme(settingsStore.theme)
  logger.info('设置初始化完成')
} catch (error) {
  errorHandler.captureError(error, { module: 'settings', function: 'initialize' })
}

// 挂载应用
try {
  app.mount('#app')
  logger.info('应用挂载成功')
} catch (error) {
  errorHandler.captureError(error, { module: 'app', function: 'mount' })
}