# Low Code Common

一个基于 Vue 3 + TypeScript + Vite 的低代码平台。

## 功能特性

- 🎨 可视化组件编辑器
- 🔧 属性面板配置
- 📱 响应式设计
- 🎯 拖拽排序
- 💾 项目保存/加载
- 🗑️ 组件删除功能
- 🎞️ 高级轮播图组件
  - 自动播放（3000ms默认间隔）
  - 平滑过渡动画效果
  - 首尾衔接轮播
  - 独立图片链接配置
  - 指示器和控制按钮
  - 可自定义尺寸

## 技术栈

- Vue 3
- TypeScript
- Vite
- Pinia (状态管理)
- Tailwind CSS
- Less

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 部署

本项目已配置 GitHub Actions 自动部署到 GitHub Pages。

### 自动部署

当代码推送到 `master` 分支时，GitHub Actions 会自动：

1. 安装依赖
2. 构建项目
3. 部署到 GitHub Pages

### 手动部署

你也可以手动触发部署：

1. 在 GitHub 仓库页面，点击 "Actions" 标签
2. 选择 "Deploy to GitHub Pages" 工作流
3. 点击 "Run workflow" 按钮

## 项目结构

```
src/
├── components/          # 组件
│   ├── editor/         # 编辑器组件
│   ├── properties/     # 属性面板
│   └── renderer/       # 渲染器
├── stores/             # 状态管理
├── types/              # 类型定义
└── utils/              # 工具函数
```

## 许可证

MIT
