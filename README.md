使用trae+claude-4-sonnet开发的一个笔记应用，几乎全是ai生成的代码，只修改过一点样式。

# 📝 智能笔记管理应用

一个基于 Vue 3 + Electron 构建的现代化桌面笔记管理应用，提供优雅的界面和强大的功能。

> 🤖 **本项目由 [Trae AI](https://trae.ai) 智能生成和开发**

## ✨ 功能特性

- 📁 **文件夹管理** - 支持多层级文件夹结构，灵活组织笔记
- 🔍 **智能搜索** - 快速搜索笔记内容和标题
- 📝 **富文本编辑** - 基于 Vditor 的 Markdown 编辑器
- 🗑️ **回收站功能** - 安全删除和恢复笔记
- 📊 **最新笔记** - 快速访问最近编辑的笔记
- 🎨 **现代化界面** - 简洁美观的用户界面设计
- 💾 **本地存储** - 基于 SQLite 的可靠数据存储
- ⚡ **高性能** - 虚拟滚动优化，支持大量笔记

## 🛠️ 技术栈

### 前端框架
- **Vue 3** - 渐进式 JavaScript 框架
- **Vue Router** - 官方路由管理器
- **Pinia** - 现代化状态管理

### 桌面应用
- **Electron** - 跨平台桌面应用框架
- **Vite** - 快速构建工具

### 编辑器
- **Vditor** - 所见即所得 Markdown 编辑器

### 数据存储
- **Better SQLite3** - 高性能 SQLite 数据库
- **SQL.js** - 浏览器端 SQLite 支持

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Electron Builder** - 应用打包工具

## 📦 项目结构

```
├── electron/                 # Electron 主进程
│   ├── main.js              # 主进程入口
│   └── preload.js           # 预加载脚本
├── src/
│   ├── components/          # Vue 组件
│   ├── views/               # 页面视图
│   ├── stores/              # Pinia 状态管理
│   ├── services/            # 业务服务
│   ├── database/            # 数据库相关
│   └── router/              # 路由配置
├── public/                  # 静态资源
└── dist/                    # 构建输出
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
# 启动开发服务器
npm run dev

# 启动Electron开发模式
npm run electron:dev
```

### 构建应用
```bash
# 构建Web版本
npm run build

# 构建Electron应用
npm run electron:build
```

### 代码规范
```bash
# 检查代码规范
npm run code:check

# 自动修复代码规范
npm run code:fix
```

## 📱 应用截图

*即将添加应用界面截图*

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Electron](https://www.electronjs.org/) - 跨平台桌面应用开发
- [Vditor](https://github.com/Vanessa219/vditor) - 优秀的Markdown编辑器
- [Trae AI](https://trae.ai) - 智能代码生成平台

---

**由 [Trae AI](https://trae.ai) 智能生成 🤖**
