# 🌍 v0.6 需求速报：多语言支持 (i18n)

## 背景
主要面对人群是西方客户，需要英文版和中文版。

## 需求

### 1. 语言切换
- 左上角语言切换按钮（EN / 中）
- 默认语言：英文（面向西方市场）
- 语言偏好存 localStorage
- 切换时无需刷新，实时切换

### 2. UI 文案双语
所有界面文字需要中英文：
- Header 标题/副标题
- 欢迎页面文案
- 快捷按钮文字
- 猜你喜欢标签
- 酒窖页面（Tab、空状态、卡片）
- 输入框 placeholder
- 按钮文字（新对话、发送、拍照、存入酒窖等）
- 确认弹窗文字
- 错误提示
- 版权信息

### 3. AI System Prompt 双语
- 英文模式：AI 用英文回复
- 中文模式：AI 用中文回复
- 语言参数传到 API 路由，动态切换 system prompt

### 4. 实现方式
- 简单的 i18n 方案：一个 translations 对象 + useContext/useState
- 不需要重型框架（next-intl 等），项目还小
```typescript
const translations = {
  en: {
    title: "Raymo Wine Advisor",
    subtitle: "AI-Powered Professional Wine Experience",
    welcome: "Welcome to Raymo Wine Advisor",
    ...
  },
  zh: {
    title: "瑞莫品酒顾问",
    subtitle: "AI驱动的专业品酒体验",
    welcome: "欢迎来到瑞莫品酒顾问",
    ...
  }
}
```

### 5. 设计
- 语言切换按钮：简洁的文字按钮 "EN | 中"，当前语言高亮
- 位置：Header 左上角
- 样式：和品酒主题一致
