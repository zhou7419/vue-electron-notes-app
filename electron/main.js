import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const isDev = process.env.NODE_ENV !== 'production'

function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 1000, // 设置最小宽度
    minHeight: 700, // 设置最小高度
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true, // 自动隐藏菜单栏
    frame: false, // 完全移除窗口边框
    titleBarStyle: 'hidden', // 隐藏标题栏
    titleBarOverlay: false // 禁用标题栏覆盖
  })

  // 完全移除菜单栏
  mainWindow.setMenu(null)

  // 处理窗口控制事件
  ipcMain.on('window-control', (event, command) => {
    switch (command) {
      case 'minimize':
        mainWindow.minimize()
        break
      case 'maximize':
        if (mainWindow.isMaximized()) {
          mainWindow.unmaximize()
        } else {
          mainWindow.maximize()
        }
        break
      case 'close':
        mainWindow.close()
        break
    }
  })

  // 加载应用
  if (isDev) {
    // 开发环境下，加载开发服务器地址
    mainWindow.loadURL('http://localhost:5173')
    // 打开开发者工具
    mainWindow.webContents.openDevTools()
  } else {
    // 生产环境下，加载打包后的index.html文件
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

// 当Electron完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // 在macOS上，当点击dock图标并且没有其他窗口打开时，通常会在应用程序中重新创建一个窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 当所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  // 在macOS上，除非用户使用Cmd + Q确定地退出，否则应用和它们的菜单栏会保持活动状态
  if (process.platform !== 'darwin') app.quit()
})