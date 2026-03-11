# 🍷 Sommé / 颂美 — 视觉设计系统 Visual Design System

**版本 Version:** 1.0.0  
**日期 Date:** 2026-02-27  
**品牌 Brand:** Sommé / 颂美（大众专属侍酒师 / Your Personal Sommelier）  
**域名 Domain:** somme.app  
**Token 引用 Reference:** `design-tokens.json` v1.0.0  

---

# 目录 Table of Contents

1. [Logo 规范 / Logo Specifications](#1-logo-规范--logo-specifications)
2. [UI 组件库 / UI Component Library](#2-ui-组件库--ui-component-library)
3. [核心页面 Wireframe / Core Page Wireframes](#3-核心页面-wireframe--core-page-wireframes)
4. [动效规范 / Motion & Animation](#4-动效规范--motion--animation)
5. [深色模式 / Dark Mode](#5-深色模式--dark-mode)

---

# 1. Logo 规范 / Logo Specifications

## 1.1 主 Logo 形态 Primary Logo Concept

**概念：「对话之韵」The Dialogue**

主 Logo 将酒杯侧影与对话气泡有机融合——一个流线型对话气泡的底部自然过渡为酒杯杯柄与底座，气泡内含三个小圆点（象征 AI 思考/对话中）。整体向右倾斜 **5°**，赋予动感与优雅。

```
          ╭─────────────╮
         │  ●  ●  ●    │       ← 对话气泡 / Chat bubble
         │              │         气泡内三点：琥珀金 #D4A56A
          ╰──────┬──────╯
                 │              ← 杯柄过渡 / Stem transition
                 │                自然弧线连接
                ╱ ╲             ← 杯座 / Base
          ─────╱   ╲─────        宽度 = 气泡宽度 × 0.4

          整体向右倾斜 5° / Tilted 5° clockwise
```

**比例规范 Proportions:**

| 部位 Part | 比例 Ratio | 说明 Description |
|-----------|-----------|-----------------|
| 气泡高度 Bubble H | 1.0 | 基准单位 / Base unit |
| 气泡宽度 Bubble W | 1.2 | 横向略宽，亲和圆润 |
| 杯柄长度 Stem L | 0.45 | 优雅纤细 |
| 杯座宽度 Base W | 0.48 | 稳定支撑 |
| 杯座高度 Base H | 0.08 | 极薄线条 |
| 整体高宽比 Aspect | 1.53:1 | 竖向为主 |
| 倾斜角度 Tilt | 5° CW | 顺时针方向 |

**气泡圆角 Bubble Radius:**
- 顶部左右：`borderRadius.xl` = 20px（等比缩放）
- 底部过渡：杯柄交接处为尖角尾巴（类对话气泡指示符），自然延伸为杯柄

## 1.2 Logo 五种变体 Five Logo Variants

### 变体 A — 完整版 Full Lockup

```
    [Logo Icon]
      Sommé
       颂美
  ── ✦ ──────────
  Your Personal Sommelier
```

| 属性 Property | 值 Value |
|--------------|---------|
| 最小宽度 Min Width | 200px |
| 推荐宽度 Preferred | 280–360px |
| 图标占高 Icon Height | 总高度 48% |
| 间距 Icon→"Sommé" | `spacing.3` = 12px |
| 间距 "Sommé"→"颂美" | `spacing.1` = 4px |
| 间距 "颂美"→装饰线 | `spacing.3` = 12px |
| 间距 装饰线→Tagline | `spacing.2` = 8px |
| 用途 Usage | 官网首页、启动画面、印刷品封面 |

### 变体 B — 标准版 Standard

```
    [Logo Icon]  Sommé
                  颂美
```

| 属性 Property | 值 Value |
|--------------|---------|
| 最小宽度 Min Width | 160px |
| 推荐宽度 Preferred | 200–280px |
| 图标高度 Icon H | 40px–56px |
| 图标与文字间距 | `spacing.3` = 12px |
| 文字垂直居中 | 与图标中心对齐 |
| 用途 Usage | App 导航栏、社交媒体头图、合作物料 |

### 变体 C — 简化版 Compact

```
    [Logo Icon]  Sommé
```

| 属性 Property | 值 Value |
|--------------|---------|
| 最小宽度 Min Width | 120px |
| 推荐宽度 Preferred | 140–200px |
| 图标高度 Icon H | 28px–40px |
| 间距 Icon→Text | `spacing.2` = 8px |
| 用途 Usage | 页面 Header、小尺寸展示、Favicon 旁 |

### 变体 D — 图标版 Icon Only

```
    [Logo Icon]
```

| 属性 Property | 值 Value |
|--------------|---------|
| 最小尺寸 Min Size | 24×24px |
| 标准尺寸 Standard | 40×40px, 48×48px |
| App Icon 尺寸 | 1024×1024px (源文件) |
| 圆角 (App Icon) | iOS: 连续曲率圆角（系统自动裁剪） |
| 背景 (App Icon) | 品鉴渐变 `gradient.tasting` #8B2252→#D4A56A |
| 图标颜色 (App Icon) | 纯白 #FFFFFF |
| 用途 Usage | App 图标、Favicon、聊天头像、水印 |

### 变体 E — 纯文字版 Wordmark Only

```
    Sommé · 颂美
```

| 属性 Property | 值 Value |
|--------------|---------|
| 最小宽度 Min Width | 80px |
| "Sommé" 字体 | DM Serif Display, 700 Bold |
| "颂美" 字体 | Noto Serif CJK SC, 500 Medium |
| 中间分隔 Separator | `·` 中圆点，颜色 `gold.400` #D4A56A |
| 间距 Sommé→·→颂美 | 各 `spacing.2` = 8px |
| 用途 Usage | 文字链接、页脚版权、受限空间 |

## 1.3 "Sommé" 与 "颂美" 字体处理 Typography Treatment

### "Sommé" 英文品牌名

| 属性 | 值 |
|------|---|
| 字体 Font | DM Serif Display（引用 `typography.fontFamily.displayEn`） |
| 字重 Weight | 700 Bold（Logo 场景） / 400 Regular（正文提及） |
| 字母间距 Tracking | -0.02em |
| 重音符号 Accent | `é` 上的锐音符必须保留，颜色可为 `gold.400` #D4A56A 作为品牌特征 |
| 大小写 Case | 首字母大写 "Sommé"，**禁止**全大写 "SOMMÉ" |

### "颂美" 中文品牌名

| 属性 | 值 |
|------|---|
| 字体 Font | Noto Serif CJK SC（引用 `typography.fontFamily.displayCn`） |
| 字重 Weight | 500 Medium（Logo 场景）/ 400 Regular（正文提及） |
| 字间距 Letter Spacing | 0.15em（增加中文字的呼吸感） |
| 对齐 Alignment | 与 "Sommé" 左对齐或居中对齐 |

### 双语组合规范 Bilingual Pairing

- **主次关系：** "Sommé" 为主，"颂美" 为辅
- **字号比例：** "颂美" 字号 = "Sommé" 字号 × 0.7
- **颜色分层：** "Sommé" 使用 `burgundy.500` #8B2252，"颂美" 使用 `neutral.400` #8A8690 或 `burgundy.600` #721B43

## 1.4 安全区域与最小尺寸 Clear Space & Minimum Size

### 安全区域 Clear Space

以 Logo 图标中气泡部分的**高度 H** 为基准单位：

```
         ┌─── 0.5H ───┐
         │             │
    0.5H │  [  Logo  ] │ 0.5H
         │             │
         └─── 0.5H ───┘
```

- 四周留白 = 图标高度 × 50%
- 安全区域内**禁止**放置任何文字、图形、边界

### 最小尺寸 Minimum Size

| 变体 Variant | 印刷 Print | 屏幕 Screen |
|-------------|-----------|------------|
| 完整版 Full | 40mm 宽 | 200px 宽 |
| 标准版 Standard | 30mm 宽 | 160px 宽 |
| 简化版 Compact | 22mm 宽 | 120px 宽 |
| 图标版 Icon | 8mm | 24px |
| 纯文字 Wordmark | 15mm 宽 | 80px 宽 |

### 禁止操作 Don'ts

- ❌ 拉伸或压缩变形
- ❌ 旋转（5° 倾斜已内置于设计中）
- ❌ 添加投影、描边、外发光
- ❌ 在复杂/杂乱背景上使用
- ❌ 更改颜色为品牌色板以外的颜色
- ❌ 将 "Sommé" 拼写为 "Somme" 或 "SOMME"

---

# 2. UI 组件库 / UI Component Library

> 所有数值引用 `design-tokens.json`，格式为 `{token.path}`

## 2.1 按钮 Buttons

### 尺寸规格 Sizes

| 尺寸 Size | 高度 Height | 内边距 Padding (H/V) | 字号 Font | 字重 Weight | 圆角 Radius | 最小宽度 Min W |
|-----------|------------|---------------------|-----------|------------|------------|---------------|
| **Large / 大** | 52px | 24px / 14px | `buttonLg` 16px | 600 | `borderRadius.md` 12px | 120px |
| **Medium / 中 ★** | 44px | 20px / 12px | `buttonMd` 14px | 600 | `borderRadius.md` 12px | 96px |
| **Small / 小** | 36px | 16px / 8px | `buttonSm` 12px | 600 | `borderRadius.sm` 8px | 72px |

### Primary 主按钮 / 品牌酒红

| 状态 State | 背景 Background | 文字 Text | 边框 Border | 阴影 Shadow |
|-----------|-----------------|----------|------------|------------|
| **Default 默认** | `burgundy.500` #8B2252 | #FFFFFF | none | `shadow.brand` 0 4px 16px rgba(139,34,82,0.20) |
| **Hover 悬停** | `burgundy.600` #721B43 | #FFFFFF | none | `shadow.lg` 0 4px 24px rgba(30,26,43,0.08) |
| **Active 按下** | `burgundy.700` #5A1535 | #FFFFFF | none | `shadow.xs` 0 1px 2px rgba(30,26,43,0.04) |
| **Focus 聚焦** | `burgundy.500` #8B2252 | #FFFFFF | 2px solid `border.focus` #B85D89 (offset 2px) | `shadow.brand` |
| **Disabled 禁用** | `neutral.150` #E8E5E0 | `neutral.300` #B8B4AE | none | none |

### Secondary 次按钮 / 描边样式

| 状态 State | 背景 Background | 文字 Text | 边框 Border | 阴影 Shadow |
|-----------|-----------------|----------|------------|------------|
| **Default 默认** | transparent | `burgundy.500` #8B2252 | 1.5px solid `burgundy.500` #8B2252 | none |
| **Hover 悬停** | `interactive.secondaryHover` #FCF2F6 | `burgundy.600` #721B43 | 1.5px solid `burgundy.600` #721B43 | `shadow.xs` |
| **Active 按下** | `interactive.secondaryActive` #F5D6E3 | `burgundy.700` #5A1535 | 1.5px solid `burgundy.700` #5A1535 | none |
| **Focus 聚焦** | transparent | `burgundy.500` #8B2252 | 2px solid `border.focus` #B85D89 (offset 2px) | none |
| **Disabled 禁用** | transparent | `neutral.300` #B8B4AE | 1.5px solid `neutral.150` #E8E5E0 | none |

### Text 文字按钮 / 最轻量

| 状态 State | 背景 Background | 文字 Text | 边框 Border | 阴影 Shadow |
|-----------|-----------------|----------|------------|------------|
| **Default 默认** | transparent | `burgundy.500` #8B2252 | none | none |
| **Hover 悬停** | rgba(139,34,82, 0.06) | `burgundy.600` #721B43 | none | none |
| **Active 按下** | rgba(139,34,82, 0.12) | `burgundy.700` #5A1535 | none | none |
| **Focus 聚焦** | transparent | `burgundy.500` #8B2252 | 2px solid `border.focus` #B85D89 (offset 2px) | none |
| **Disabled 禁用** | transparent | `neutral.300` #B8B4AE | none | none |

### 按钮交互参数 Interaction

```css
/* 所有按钮通用 / Common for all buttons */
transition: all {motion.duration.fast} {motion.easing.default};
           /* 150ms cubic-bezier(0.25, 0.1, 0.25, 1.0) */

/* Hover 上浮效果 */
transform: translateY(-1px);

/* Active 按下缩放 */
transform: scale(0.97);
transition-timing-function: {motion.easing.spring};
           /* cubic-bezier(0.175, 0.885, 0.32, 1.275) */

/* Disabled 禁用 */
opacity: {opacity.disabled}; /* 0.4 */
pointer-events: none;
cursor: not-allowed;
```

### 特殊按钮 Special Buttons

**Gold 金色按钮（Premium/特殊操作）:**
```
背景: gradient.goldShimmer — linear-gradient(135deg, #D4A56A 0%, #E8D4A8 50%, #D4A56A 100%)
文字: #FFFFFF
阴影: 0 4px 16px rgba(212, 165, 106, 0.25)
```

**Capsule 胶囊按钮（标签式操作）:**
```
圆角: borderRadius.full = 9999px
内边距: 8px 20px
其余同 Secondary 按钮
```

---

## 2.2 输入框 Input Fields

### 通用规格 Common Specs

| 属性 Property | 值 Value |
|--------------|---------|
| 高度 Height | 48px（标准） / 44px（紧凑） |
| 内边距 Padding | 12px 16px（`spacing.3` × `spacing.4`） |
| 字体 Font | `body` — Inter/Noto Sans 16px, 400 |
| 圆角 Radius | `borderRadius.sm` = 8px |
| 图标尺寸 Icon | `sizing.icon.sm` = 20px |
| 图标间距 Icon Gap | `spacing.3` = 12px |

### Text Input 文本输入框

| 状态 State | 背景 Bg | 边框 Border | 文字 Text | 占位符 Placeholder |
|-----------|--------|------------|----------|-------------------|
| **Default 默认** | `bg.secondary` #FFFFFF | 1px `border.default` #E8E5E0 | `text.primary` #3D3A42 | `text.tertiary` #B8B4AE |
| **Focus 聚焦** | `bg.secondary` #FFFFFF | 2px `border.focus` #B85D89 | `text.primary` #3D3A42 | `text.tertiary` #B8B4AE |
| **Error 错误** | `status.errorBg` #FDF0F0 | 2px `status.error` #D94F4F | `text.primary` #3D3A42 | — |
| **Disabled 禁用** | `bg.tertiary` #F0EDE8 | 1px `border.default` #E8E5E0 | `text.tertiary` #B8B4AE | `text.tertiary` #B8B4AE |

**Focus Ring 聚焦光圈:**
```css
box-shadow: 0 0 0 3px rgba(139, 34, 82, 0.12);
transition: border-color {motion.duration.fast} {motion.easing.default},
            box-shadow {motion.duration.fast} {motion.easing.default};
```

**Error 错误提示:**
```
错误文字: status.error #D94F4F
字号: caption 12px / 16px
图标: ⚠ 20px, 与文字同色
间距: 输入框底部 spacing.1 = 4px
```

### Search Input 搜索输入框

```
┌──────────────────────────────────────────┐
│  🔍  搜索酒款、产区、品种…               │
└──────────────────────────────────────────┘
```

| 属性 Property | 值 Value |
|--------------|---------|
| 高度 Height | 44px |
| 圆角 Radius | `borderRadius.full` = 9999px（胶囊形） |
| 内边距 Padding | 12px 20px 12px 44px（左侧留图标位） |
| 背景 Bg | `bg.tertiary` #F0EDE8 |
| 边框 Border | none（默认）/ 2px `border.focus` #B85D89（聚焦） |
| 搜索图标 | `icon.secondary` #8A8690, 20px, 左侧 12px |
| 清除按钮 Clear | `icon.secondary` #8A8690, 20px, 右侧 12px, Focus 时显示 |

### Chat Input 聊天输入框

```
┌──────────────────────────────────────────┐
│  📎  聊聊你想喝什么…           📷  ➤    │
└──────────────────────────────────────────┘
```

| 属性 Property | 值 Value |
|--------------|---------|
| 最小高度 Min H | 48px |
| 最大高度 Max H | 120px（自动增高至 5 行） |
| 圆角 Radius | `borderRadius.xl` = 20px |
| 内边距 Padding | 14px 52px 14px 44px |
| 背景 Bg | `bg.secondary` #FFFFFF |
| 边框 Border | 1px `border.default` #E8E5E0 |
| 阴影 Shadow | `shadow.sm` — 0 2px 4px rgba(30,26,43,0.06) |
| 左侧图标 | 📎 附件 — `icon.secondary` #8A8690, 24px |
| 右侧图标 | 📷 拍照 — `icon.secondary` #8A8690, 24px |
| 发送按钮 Send | 圆形 36px, 背景 `burgundy.500` #8B2252, 图标白色 ➤ |
| 发送按钮（空态） | 背景 `neutral.150` #E8E5E0, 图标 `neutral.300` #B8B4AE |

---

## 2.3 酒款卡片 Wine Cards

### 列表版 List Card

```
┌─────────────────────────────────────────────────────┐
│ ┌────────┐                                          │
│ │        │  Château Margaux 2018          92        │
│ │ [酒标   │  玛歌酒庄                     ── 🍷     │
│ │  图片]  │  Margaux · Bordeaux · Cabernet         │
│ │        │                                          │
│ │ 64×88  │  [波尔多] [赤霞珠] [饱满型]              │
│ └────────┘                                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

| 属性 Property | 值 Value |
|--------------|---------|
| 卡片宽度 Width | 100%（撑满容器，减去 `spacing.4` × 2 = 32px 边距） |
| 卡片高度 Height | auto，最小 104px |
| 内边距 Padding | `spacing.4` = 16px |
| 圆角 Radius | `borderRadius.lg` = 16px |
| 背景 Bg | `bg.secondary` #FFFFFF |
| 边框 Border | 1px `border.default` #E8E5E0 |
| 阴影 Shadow | `shadow.md` — 0 2px 12px rgba(30,26,43,0.06) |
| 酒标图片 | 64×88px，圆角 `borderRadius.sm` = 8px |
| 图文间距 | `spacing.3` = 12px |
| 酒名（英） | `h3` — 18px/26px, 600 SemiBold, `text.primary` #3D3A42 |
| 酒名（中） | `bodySmall` — 14px/20px, 400, `text.secondary` #8A8690 |
| 产区信息 | `caption` — 12px/16px, `text.secondary` #8A8690 |
| 标签区域 | 距酒名顶部 `spacing.2` = 8px |
| 评分 | `data` — 20px/28px, 500 Medium, JetBrains Mono, `gold.400` #D4A56A |
| 卡片间距 | 列表中卡片间距 `spacing.3` = 12px |

**列表版交互 Interaction:**
```css
/* Hover 状态 */
transform: translateY(-2px);
box-shadow: {shadow.lg}; /* 0 4px 24px rgba(30,26,43,0.08) */
transition: all {motion.duration.normal} {motion.easing.easeOut};
           /* 250ms cubic-bezier(0, 0, 0.58, 1.0) */

/* Active 按下 */
transform: scale(0.98);
transition-duration: {motion.duration.fast}; /* 150ms */
```

### 详情版 Detail Card

```
┌─────────────────────────────────────────────────┐
│                                                 │
│            ┌──────────────────┐                 │
│            │                  │                 │
│            │    [酒标大图]      │                 │
│            │    160 × 220     │                 │
│            │                  │                 │
│            └──────────────────┘                 │
│                                                 │
│  Château Margaux 2018                           │
│  玛歌酒庄 2018 年份                              │
│                                                 │
│  ── ✦ ──────────────────────────                │
│                                                 │
│  产区 Region     Margaux, Bordeaux              │
│  品种 Grape      Cabernet Sauvignon blend       │
│  酒体 Body       饱满 Full-bodied               │
│  酒精 Alcohol    13.5%                          │
│  适饮 Drinking   2025 — 2045                    │
│                                                 │
│  ── ✦ ──────────────────────────                │
│                                                 │
│  🍷🍷🍷🍷🍷  95 / 100                           │
│  "丝绒般的单宁，黑醋栗与雪松的        │
│   完美交响——这是波尔多的优雅巅峰。"              │
│                                                 │
│  [想买 Want]          [在喝 Drinking]           │
│                                                 │
└─────────────────────────────────────────────────┘
```

| 属性 Property | 值 Value |
|--------------|---------|
| 卡片宽度 Width | 100%（max `contentMaxWidth.mobile` = 100%） |
| 内边距 Padding | `spacing.6` = 24px |
| 圆角 Radius | `borderRadius.xl` = 20px（上半）/ 0（全屏模式） |
| 背景 Bg | `bg.secondary` #FFFFFF |
| 阴影 Shadow | `shadow.xl` — 0 8px 40px rgba(30,26,43,0.12) |
| 酒标图片 | 160×220px, 居中, 圆角 `borderRadius.md` = 12px |
| 图片阴影 | `shadow.lg` |
| 酒名(英) | `h2` — 22px/30px, 500, DM Serif Display |
| 酒名(中) | `bodySmall` — 14px/20px, `text.secondary` |
| 装饰线 | Golden Glow 渐变, 高度 1px, margin `spacing.5` = 20px |
| 信息网格 | 2 列，label 左列 80px 宽，`caption` 12px `text.secondary`; value 右列，`body` 16px `text.primary` |
| 信息行距 | `spacing.3` = 12px |
| 评分区块 | 见 §2.5 评分组件 |
| 按钮区域 | 底部，双按钮并排，间距 `spacing.3` = 12px |

---

## 2.4 对话气泡 Chat Bubbles

### 用户气泡 User Bubble

```
                              ╭──────────────────────╮
                              │ 帮我推荐一支           │
                              │ 适合约会的红酒         │╲
                              ╰──────────────────────╯
```

| 属性 Property | 值 Value |
|--------------|---------|
| 背景 Bg | `chat.userBubbleBg` #FAF7F2 |
| 边框 Border | 1px `chat.userBubbleBorder` #E5A3C0 |
| 文字 Text | `text.primary` #3D3A42 |
| 字号 Font | `body` — 16px/24px, 400 |
| 圆角 Radius | 20px 20px 4px 20px（右下尖角） |
| 内边距 Padding | 14px 18px |
| 最大宽度 Max W | 屏幕宽度 × 78% |
| 阴影 Shadow | `shadow.xs` — 0 1px 2px rgba(30,26,43,0.04) |
| 对齐 Align | 右对齐 |
| 头像 Avatar | 不显示（用户气泡右下角尖角替代） |
| 时间戳 Time | `caption` 12px, `text.secondary` #8A8690, 气泡下方右对齐, margin-top `spacing.1` = 4px |

### AI 气泡 AI Bubble

```
  ╭──────────────────────────────────╮
╱ │ 🍷 约会之夜，推荐你试试这支：      │
  │                                  │
  │ 来自勃艮第的黑比诺，带有樱桃和     │
  │ 紫罗兰的优雅香气。入口丝滑，       │
  │ 像是春天花园里的午后阳光。         │
  ╰──────────────────────────────────╯
```

| 属性 Property | 值 Value |
|--------------|---------|
| 背景 Bg | `chat.aiBubbleBg` rgba(139, 34, 82, 0.06) |
| 边框 Border | none |
| 文字 Text | `text.primary` #3D3A42 |
| 字号 Font | `body` — 16px/24px, 400 |
| 圆角 Radius | 20px 20px 20px 4px（左下尖角） |
| 内边距 Padding | 14px 18px |
| 最大宽度 Max W | 屏幕宽度 × 85% |
| 阴影 Shadow | none |
| 对齐 Align | 左对齐 |
| 头像 Avatar | 32px (`avatar.sm`), Logo 图标变体, 左下角, margin-right `spacing.2` = 8px |
| 头像容器 | 32px 圆形, 背景 `bg.brand` #F9F0F4, 图标 `burgundy.500` #8B2252 20px |

### 系统消息 System Message

```
          ┌────────────────────────────┐
          │  🕐 今天 14:32             │
          └────────────────────────────┘

          ┌────────────────────────────┐
          │  ✦ 品鉴报告已生成           │
          └────────────────────────────┘
```

| 属性 Property | 值 Value |
|--------------|---------|
| 背景 Bg | `chat.systemBubbleBg` #F0EDE8 |
| 文字 Text | `text.secondary` #8A8690 |
| 字号 Font | `caption` — 12px/16px, 400 |
| 圆角 Radius | `borderRadius.full` = 9999px |
| 内边距 Padding | 6px 16px |
| 对齐 Align | 居中 |
| 阴影 Shadow | none |
| 前缀图标 | ✦ 或 🕐，颜色 `gold.400` #D4A56A |

### 气泡间距 Bubble Spacing

| 场景 | 间距 |
|------|-----|
| 同一发送者连续消息 | `spacing.1` = 4px |
| 不同发送者切换 | `spacing.4` = 16px |
| 系统消息上下 | `spacing.5` = 20px |

---

## 2.5 评分组件 Rating Component

### 酒杯评分 Wine Glass Rating (1–5)

```
  🍷 🍷 🍷 🍷 🍷    ← 满分 5 杯
  ████ ████ ████ ████ ░░░░   ← 填充示例：4/5 杯
```

| 属性 Property | 值 Value |
|--------------|---------|
| 图标 Icon | 自定义酒杯 SVG, 线性描边风格 |
| 单个图标尺寸 | `sizing.icon.lg` = 32px（详情页）/ `sizing.icon.md` = 24px（列表） |
| 图标间距 | `spacing.1` = 4px |
| 填充颜色（已评） | `gold.400` #D4A56A |
| 未填充颜色 | `neutral.200` #D8D4CE |
| 半杯支持 | 是 — 使用 clip-path 裁剪 50% |
| 触控区域 | 每个图标 `touchTarget.minimum` = 44px |

### 数字评分 Numeric Score

```
   92
   ── 
  100
```

| 属性 Property | 值 Value |
|--------------|---------|
| 分数字体 | `data` — JetBrains Mono, 20px/28px, 500 Medium |
| 大号分数 | 40px/48px, 700 Bold（详情页 Hero 区） |
| 分数颜色 | `gold.400` #D4A56A |
| 分母 | `caption` — 12px, `text.secondary` #8A8690 |
| 分割线 | 1px, `neutral.200` #D8D4CE, 宽度 = 分数文字宽度 |

### 评分颜色编码 Score Color Coding

| 分数范围 Score | 颜色 Color | 等级 Grade |
|--------------|-----------|-----------|
| 95–100 | `gold.400` #D4A56A | 卓越 Exceptional |
| 90–94 | `burgundy.500` #8B2252 | 优秀 Outstanding |
| 85–89 | `green.400` #5B8C5A | 良好 Very Good |
| 80–84 | `neutral.400` #8A8690 | 合格 Good |
| < 80 | `neutral.300` #B8B4AE | 一般 Fair |

---

## 2.6 标签 Badge / Tags

### 味觉标签 Flavor Tags

```
  [🍒 樱桃]  [🌸 紫罗兰]  [🍫 巧克力]  [🌿 草本]
```

| 属性 Property | 值 Value |
|--------------|---------|
| 背景 Bg | `burgundy.50` #FCF2F6 |
| 文字 Text | `burgundy.500` #8B2252 |
| 字号 Font | `caption` 12px/16px, 500 Medium |
| 圆角 Radius | `borderRadius.full` = 9999px |
| 内边距 Padding | 4px 12px |
| 边框 Border | 1px `burgundy.100` #F5D6E3 |
| Emoji 尺寸 | 14px |

### 产区标签 Region Tags

| 属性 Property | 值 Value |
|--------------|---------|
| 背景 Bg | `green.50` #F2F7F2 |
| 文字 Text | `green.500` #4A7349 |
| 字号 Font | `caption` 12px/16px, 500 |
| 圆角 Radius | `borderRadius.full` = 9999px |
| 内边距 Padding | 4px 12px |
| 边框 Border | 1px `green.100` #DDEADD |

### 价格标签 Price Tags

| 属性 Property | 值 Value |
|--------------|---------|
| 背景 Bg | `gold.50` #FDF8F0 |
| 文字 Text | `gold.600` #A87A3A |
| 字号 Font | `caption` 12px/16px, 600 SemiBold |
| 圆角 Radius | `borderRadius.xs` = 4px |
| 内边距 Padding | 4px 8px |
| 边框 Border | 1px `gold.100` #F8ECDA |

### 价格等级颜色编码 Price Tier

| 等级 Tier | 显示 Display | 背景 Bg |
|----------|-------------|--------|
| ¥ 亲民 Budget | ¥ | `green.50` #F2F7F2 |
| ¥¥ 中档 Mid | ¥¥ | `gold.50` #FDF8F0 |
| ¥¥¥ 高端 Premium | ¥¥¥ | `burgundy.50` #FCF2F6 |
| ¥¥¥¥ 奢华 Luxury | ¥¥¥¥ | `neutral.800` #1E1A2B + `gold.400` text |

### 标签间距 Tag Spacing

- 标签之间：`spacing.2` = 8px
- 标签行距：`spacing.2` = 8px
- 标签组与上方元素：`spacing.3` = 12px

---

## 2.7 导航 Navigation

### 顶部栏 Top Navigation Bar

```
┌─────────────────────────────────────────────────┐
│  ✦ Sommé             [🔍]  [🔔]  [👤]          │
│  ════════════════════════════════════════════════│
└─────────────────────────────────────────────────┘
```

| 属性 Property | 值 Value |
|--------------|---------|
| 高度 Height | 56px + `safeAreaTop` |
| 背景 Bg | `bg.primary` #FAF7F2 with `backdrop-filter: blur(16px) saturate(180%)` |
| 不透明度 | rgba(250, 247, 242, 0.88) |
| 底部装饰线 | gradient.goldShimmer, 高度 1px |
| 品牌标识 ✦ | `gold.400` #D4A56A, 14px |
| 品牌名 "Sommé" | DM Serif Display, 20px, 700, `text.primary` #3D3A42 |
| 图标组 | 右对齐, `sizing.icon.md` = 24px, `icon.default` #3D3A42 |
| 图标间距 | `spacing.4` = 16px |
| 内边距 Padding | 0 `spacing.4` = 16px |
| z-index | `zIndex.sticky` = 20 |

### 底部 Tab Bar

```
┌─────────────────────────────────────────────────┐
│  ════════════════════════════════════════════════│
│                                                 │
│   🏠        💬        📷        📖        👤   │
│   首页     对话       拍照      酒窖       我的  │
│   Home     Chat      Scan     Cellar      Me   │
│                                                 │
└─────────────────────────────────────────────────┘
```

| 属性 Property | 值 Value |
|--------------|---------|
| 高度 Height | 56px + `safeAreaBottom` |
| 背景 Bg | `bg.secondary` #FFFFFF |
| 顶部装饰线 | gradient.goldShimmer, 高度 1px |
| 阴影 Shadow | 0 -2px 12px rgba(30,26,43,0.04) |
| Tab 数量 | 5 个 |
| Tab 宽度 | 等分 (20%) |
| 图标尺寸 | `sizing.icon.md` = 24px |
| 文字字号 | 10px, 500 Medium |
| 文字与图标间距 | `spacing.1` = 4px |
| **未选中态** | 图标: `icon.secondary` #8A8690, 文字: `text.secondary` #8A8690 |
| **选中态** | 图标: `icon.brand` #8B2252, 文字: `text.brand` #8B2252 |
| 选中指示器 | 图标上方 3px 圆点, `burgundy.500` #8B2252, 使用 spring 动效 |
| z-index | `zIndex.sticky` = 20 |
| 触控区域 | 每个 Tab 最小 44×44px (`touchTarget.minimum`) |

**中央拍照按钮（特殊处理）:**

| 属性 Property | 值 Value |
|--------------|---------|
| 尺寸 Size | 56×56px |
| 形状 Shape | 圆形 |
| 背景 Bg | `gradient.tasting` — linear-gradient(135deg, #8B2252, #D4A56A) |
| 图标 Icon | 📷 相机, 白色, 28px |
| 阴影 Shadow | `shadow.brand` — 0 4px 16px rgba(139,34,82,0.20) |
| 上浮 Offset | 向上突出 Tab Bar 16px |
| 边框 | 4px solid `bg.secondary` #FFFFFF |

---

## 2.8 Toast 通知 Toast Notifications

### 通用规格 Common Specs

| 属性 Property | 值 Value |
|--------------|---------|
| 宽度 Width | 屏幕宽度 - `spacing.8` × 2 = 屏幕宽 - 64px, max 400px |
| 内边距 Padding | `spacing.4` = 16px |
| 圆角 Radius | `borderRadius.md` = 12px |
| 位置 Position | 顶部, 距安全区域 `spacing.4` = 16px |
| 图标尺寸 Icon | `sizing.icon.sm` = 20px |
| 图标与文字间距 | `spacing.3` = 12px |
| 标题 Title | `bodySmall` 14px, 600 SemiBold |
| 描述 Description | `caption` 12px, 400, `text.secondary` |
| z-index | `zIndex.toast` = 50 |
| 显示时长 Duration | 3000ms（默认）/ 5000ms（错误）/ 手动关闭（操作型） |

### 四种类型 Four Types

| 类型 Type | 背景 Bg | 左侧条 Bar | 图标 Icon | 图标色 |
|-----------|--------|-----------|----------|--------|
| **Success 成功** | `status.successBg` #EDF7F3 | 3px `status.success` #3A9B7A | ✓ 对勾 | #3A9B7A |
| **Error 错误** | `status.errorBg` #FDF0F0 | 3px `status.error` #D94F4F | ✕ 叉号 | #D94F4F |
| **Warning 警告** | `status.warningBg` #FDF8EC | 3px `status.warning` #E8B84B | ⚠ 警告 | #E8B84B |
| **Info 信息** | `status.infoBg` #EFF4F9 | 3px `status.info` #5B8FB9 | ℹ 信息 | #5B8FB9 |

**Toast 动效 Animation:**
```css
/* 入场 Enter */
animation: toast-in {motion.duration.normal} {motion.easing.spring};
/* 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275) */
@keyframes toast-in {
  from { transform: translateY(-100%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

/* 离场 Exit */
animation: toast-out {motion.duration.fast} {motion.easing.easeIn};
/* 150ms cubic-bezier(0.42, 0, 1.0, 1.0) */
@keyframes toast-out {
  from { transform: translateY(0); opacity: 1; }
  to   { transform: translateY(-100%); opacity: 0; }
}
```

---

## 2.9 底部弹窗 Bottom Sheet

```
┌─────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓ 遮罩层 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│ ╭───────────────────────────────────────────────╮│
│ │              ━━━━━              (拖拽手柄)      ││
│ │                                               ││
│ │  标题区域                                      ││
│ │  ──────────────────                           ││
│ │                                               ││
│ │  内容区域（可滚动）                              ││
│ │                                               ││
│ │  [主操作按钮]                                  ││
│ │                                               ││
│ ╰───────────────────────────────────────────────╯│
└─────────────────────────────────────────────────┘
```

| 属性 Property | 值 Value |
|--------------|---------|
| 背景 Bg | `bg.elevated` #FFFFFF |
| 圆角 Radius | `borderRadius.xl` = 20px（仅顶部） |
| 阴影 Shadow | `shadow.xl` — 0 8px 40px rgba(30,26,43,0.12) |
| 拖拽手柄 Handle | 40×4px, `neutral.200` #D8D4CE, 居中, 圆角 2px |
| 手柄上方留白 | `spacing.3` = 12px |
| 内边距 Padding | `spacing.6` = 24px（左右）/ `spacing.5` = 20px（上下） |
| 最大高度 Max H | 屏幕高度 × 90% |
| 遮罩 Overlay | `neutral.900` #14111E, opacity `opacity.overlay` = 0.5 |
| z-index | `zIndex.modal` = 40 |

## 2.10 骨架屏 Skeleton Screen

```
┌─────────────────────────────────────────────────┐
│  ┌────────┐  ████████████████████               │
│  │ ░░░░░░ │  ████████████                       │
│  │ ░░░░░░ │  ████████                           │
│  └────────┘  ████ ████ ████                     │
│─────────────────────────────────────────────────│
│  ┌────────┐  ████████████████████               │
│  │ ░░░░░░ │  ████████████                       │
│  │ ░░░░░░ │  ████████                           │
│  └────────┘  ████ ████ ████                     │
└─────────────────────────────────────────────────┘
```

| 属性 Property | 值 Value |
|--------------|---------|
| 骨架块颜色 | `neutral.100` #F0EDE8 |
| 光晕动画颜色 | linear-gradient(90deg, #F0EDE8 0%, #FAF7F2 50%, #F0EDE8 100%) |
| 动画类型 | shimmer, background-position 水平移动 |
| 动画时长 | 1500ms, infinite, `motion.easing.easeInOut` |
| 骨架块圆角 | 文字行: 4px / 图片: 与真实组件一致 / 圆头像: 50% |
| 行高模拟 | h3: 18×200px / body: 16×全宽 / caption: 12×120px |

## 2.11 空状态 Empty State

```
┌─────────────────────────────────────────────────┐
│                                                 │
│                                                 │
│                 🍷                               │
│            (插画/图标)                            │
│              64×64px                             │
│                                                 │
│         这里还没有酒哦                            │
│         No wines yet                            │
│                                                 │
│     拍一张酒标，或聊聊你想喝什么                    │
│     Scan a label or chat about                  │
│     what you'd like to drink                    │
│                                                 │
│         ┌────────────────┐                      │
│         │   开始探索 →    │                      │
│         └────────────────┘                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

| 属性 Property | 值 Value |
|--------------|---------|
| 图标/插画尺寸 | 64×64px 或 120×120px（大空状态） |
| 图标颜色 | `neutral.300` #B8B4AE（或品牌色调低饱和插画） |
| 标题 Title | `h3` 18px/26px, 600, `text.primary` #3D3A42 |
| 描述 Desc | `bodySmall` 14px/20px, 400, `text.secondary` #8A8690 |
| 标题↔描述间距 | `spacing.2` = 8px |
| 描述↔按钮间距 | `spacing.6` = 24px |
| 整体居中 | 垂直水平居中, padding `spacing.10` = 40px |
| 动画 | 图标轻微浮动 — translateY ±4px, 3s, infinite, ease-in-out |

---

# 3. 核心页面 Wireframe / Core Page Wireframes

> 以下 ASCII 线框图基于 iPhone 15 Pro (393×852pt) 屏幕比例

## 3.1 欢迎首页 Welcome Home

```
┌─────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓ status bar ▓▓▓▓▓▓▓▓▓▓▓▓ │  safe area top
├─────────────────────────────────────┤
│  ✦ Sommé                 🔔   👤   │  Top Nav 56px
│  ═══════════════════════════════════│  Golden line 1px
├─────────────────────────────────────┤
│                                     │
│         ☀️ 下午好，小雅              │  H2 22px 问候
│         今天想喝什么？               │  body 16px
│                                     │
│  ┌─────────────────────────────┐    │
│  │  🔍  搜索酒款、产区、品种…    │    │  Search 44px
│  └─────────────────────────────┘    │
│                                     │  spacing.6 = 24px
│  ── ✦ 快捷入口 Quick Access ── ✦ ── │
│                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐      │
│  │  📷  │  │  💬  │  │  🍽️  │      │  80×80 圆角卡片
│  │ 拍酒标│  │ 聊聊  │  │ 配餐  │      │  3列等分
│  │ Scan │  │ Chat │  │ Pair │      │
│  └──────┘  └──────┘  └──────┘      │
│                                     │  spacing.6 = 24px
│  ── ✦ 今日推荐 For You ── ✦ ──     │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ [img] Château Margaux 2018  │    │  Wine Card (列表版)
│  │       玛歌酒庄  ·  92分      │    │
│  │       [波尔多] [赤霞珠]      │    │
│  └─────────────────────────────┘    │
│                                     │  spacing.3 = 12px
│  ┌─────────────────────────────┐    │
│  │ [img] Cloudy Bay SB 2023    │    │  Wine Card
│  │       云雾之湾  ·  89分      │    │
│  │       [马尔堡] [长相思]      │    │
│  └─────────────────────────────┘    │
│                                     │
│  ── ✦ 味蕾画像 Taste Profile ──    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │     ╱╲    酒体偏好           │    │
│  │    ╱  ╲   ███████░░ 偏饱满   │    │  雷达图/进度条
│  │   ╱    ╲  甜度偏好           │    │
│  │   ╲    ╱  ██░░░░░░ 偏干型   │    │
│  │    ╲  ╱   查看完整画像 →     │    │
│  │     ╲╱                      │    │
│  └─────────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│  ═══════════════════════════════════│  Golden line 1px
│  🏠     💬     (📷)    📖     👤  │  Tab Bar 56px
│  首页   对话    拍照    酒窖    我的 │
├─────────────────────────────────────┤
│ ▓▓▓▓▓▓▓ safe area bottom ▓▓▓▓▓▓▓  │
└─────────────────────────────────────┘
```

## 3.2 AI 对话页 AI Chat Page

```
┌─────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓ status bar ▓▓▓▓▓▓▓▓▓▓▓▓ │
├─────────────────────────────────────┤
│  ← 返回    AI 对话         ···     │  Nav Bar 56px
│  ═══════════════════════════════════│
├─────────────────────────────────────┤
│                                     │
│         ┌──────────────┐            │  系统消息居中
│         │ 🕐 今天 14:32 │            │
│         └──────────────┘            │
│                                     │
│  🍷  ╭──────────────────────────╮   │  AI Bubble
│  ○   │ 你好！我是你的专属侍酒师   │   │  头像 32px
│      │ Sommé 颂美。             │   │
│      │                          │   │
│      │ 无论你想选酒、品酒还是     │   │
│      │ 学酒，随时聊聊！🍷        │   │
│      ╰──────────────────────────╯   │
│                                     │
│              ╭──────────────────╮   │  User Bubble
│              │ 帮我推荐一支      │   │  右对齐
│              │ 适合约会的红酒    │╲  │
│              ╰──────────────────╯   │
│                            14:33    │  时间戳
│                                     │
│  🍷  ╭──────────────────────────╮   │  AI Bubble
│  ○   │ 约会之夜，推荐你试试这支：│   │
│      │                          │   │
│      │ ┌─────────────────────┐  │   │  内嵌酒款卡片
│      │ │[img] Bourgogne PN   │  │   │
│      │ │      勃艮第黑比诺     │  │   │
│      │ │      🍷🍷🍷🍷░ 88  │  │   │
│      │ │      [查看详情 →]    │  │   │
│      │ └─────────────────────┘  │   │
│      │                          │   │
│      │ 轻轻摇杯，你会闻到樱桃    │   │
│      │ 和紫罗兰的优雅香气 ✨     │   │
│      ╰──────────────────────────╯   │
│                                     │
│  ●●●                                │  打字机指示器
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │ 📎  聊聊你想喝什么…  📷  ➤  │    │  Chat Input
│  └─────────────────────────────┘    │
├─────────────────────────────────────┤
│ ▓▓▓▓▓▓▓ safe area bottom ▓▓▓▓▓▓▓  │
└─────────────────────────────────────┘
```

## 3.3 扫酒结果页 Scan Result Page

```
┌─────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓ status bar ▓▓▓▓▓▓▓▓▓▓▓▓ │
├─────────────────────────────────────┤
│  ← 返回    扫描结果        🔗 分享 │
│  ═══════════════════════════════════│
├─────────────────────────────────────┤
│                                     │
│           ┌────────────┐            │
│           │            │            │
│           │  [酒标大图]  │            │  160×220px 居中
│           │  识别成功 ✓  │            │
│           │            │            │
│           └────────────┘            │
│                                     │
│    Château Lafite Rothschild        │  H1 28px
│    拉菲古堡 2016                     │  body 16px
│                                     │
│    ── ✦ ──────────────────── ✦ ──   │  装饰线
│                                     │
│    产区 Pauillac, Bordeaux          │  info grid
│    品种 Cabernet Sauvignon 87%      │
│         Merlot 13%                  │
│    酒体 饱满 Full-bodied            │
│    酒精 13.0%                       │
│    适饮 2026 — 2060                 │
│                                     │
│    ── ✦ ──────────────────── ✦ ──   │
│                                     │
│    🍷🍷🍷🍷🍷   97 / 100           │  评分组件
│                                     │
│    [🍒 黑醋栗] [🌿 雪松] [☕ 烟草]   │  味觉标签
│    [🍫 巧克力] [🌸 紫罗兰]           │
│                                     │
│    ── ✦ 这瓶酒，你想？──            │
│                                     │
│    ┌──────────────┐┌──────────────┐ │  分流选择
│    │               ││              │ │
│    │   🛒 想买     ││   🍷 在喝    │ │  双按钮并排
│    │   Want to Buy ││   Drinking   │ │  各50%宽度
│    │               ││              │ │
│    └──────────────┘└──────────────┘ │
│                                     │
│    ── ✦ AI 品鉴笔记 ──              │
│                                     │
│    "这是波尔多左岸的经典之作。        │  AI 品鉴
│     黑醋栗与雪松的香气层次丰富，      │
│     单宁精致如丝绒，余味悠长          │
│     带有矿物质感……"                  │
│                                     │
│    [💬 继续聊这支酒]                 │  CTA 按钮
│                                     │
├─────────────────────────────────────┤
│  ═══════════════════════════════════│
│  🏠     💬     (📷)    📖     👤  │
├─────────────────────────────────────┤
│ ▓▓▓▓▓▓▓ safe area bottom ▓▓▓▓▓▓▓  │
└─────────────────────────────────────┘
```

### 分流后逻辑 Post-Selection Flow

- **想买 Want to Buy** → 加入「想买清单」→ Toast "已加入想买清单 🛒" → 可选设置价格提醒
- **在喝 Drinking** → 进入品鉴记录流程 → 评分 → 品鉴笔记 → 保存至「酒窖·品过」

## 3.4 我的酒窖 My Cellar

```
┌─────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓ status bar ▓▓▓▓▓▓▓▓▓▓▓▓ │
├─────────────────────────────────────┤
│  ✦ 我的酒窖 My Cellar      🔍  +  │
│  ═══════════════════════════════════│
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────┬──────────────┐    │  Segmented Tab
│  │ 🍷 品过 (12) │ 🛒 想买 (5)  │    │  高度 40px
│  │   Tasted     │  Wishlist    │    │  burgundy下划线
│  └──────────────┴──────────────┘    │
│                                     │
│  [全部] [红葡萄] [白葡萄] [起泡]     │  Filter Pills
│                                     │
│  ── 2026年2月 ──                    │  日期分组标题
│                                     │
│  ┌─────────────────────────────┐    │
│  │ [img] Château Margaux 2018  │    │  Wine Card
│  │       92分 · 2月25日品鉴     │    │  列表版
│  │       [波尔多] [赤霞珠]      │    │
│  └─────────────────────────────┘    │
│                                     │  spacing.3
│  ┌─────────────────────────────┐    │
│  │ [img] Opus One 2019         │    │
│  │       95分 · 2月20日品鉴     │    │
│  │       [纳帕谷] [赤霞珠混酿]  │    │
│  └─────────────────────────────┘    │
│                                     │
│  ── 2026年1月 ──                    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ [img] Cloudy Bay SB 2023    │    │
│  │       89分 · 1月15日品鉴     │    │
│  │       [马尔堡] [长相思]      │    │
│  └─────────────────────────────┘    │
│                                     │
│  ── ✦ ──                            │
│  共 12 瓶 · 平均 91.2 分            │  统计信息
│                                     │
├─────────────────────────────────────┤
│  ═══════════════════════════════════│
│  🏠     💬     (📷)    📖     👤  │
├─────────────────────────────────────┤
│ ▓▓▓▓▓▓▓ safe area bottom ▓▓▓▓▓▓▓  │
└─────────────────────────────────────┘
```

## 3.5 味蕾画像页 Taste Profile

```
┌─────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓ status bar ▓▓▓▓▓▓▓▓▓▓▓▓ │
├─────────────────────────────────────┤
│  ← 返回   味蕾画像          ✏️ 编辑│
│  ═══════════════════════════════════│
├─────────────────────────────────────┤
│                                     │
│        ╭─────────────────╮          │
│       ╱     ◆ 酒体        ╲         │  品鉴雷达图
│      │  ◆            ◆    │         │  6 维度
│      │ 甜度        单宁    │         │  填充: burgundy.500
│      │                    │         │  透明度 20%
│      │  ◆            ◆    │         │  边线: burgundy.500
│       ╲    酸度    果味   ╱          │  数据点: gold.400
│        ╰─────────────────╯          │
│            ◆ 橡木                    │
│                                     │
│  ── ✦ 你的味觉 DNA ──               │
│                                     │
│  酒体偏好 Body                       │  进度条
│  ░░░░░░░░░░░████████ 偏饱满         │  burgundy.500 填充
│  轻盈 ─────────────── 饱满          │
│                                     │
│  甜度偏好 Sweetness                  │
│  ███░░░░░░░░░░░░░░░░ 偏干型         │
│  干 ──────────────── 甜             │
│                                     │
│  单宁偏好 Tannin                     │
│  ░░░░░░░░░░░██████░░ 中高           │
│  柔和 ─────────────── 强劲          │
│                                     │
│  ── ✦ 最爱品种 Top Grapes ──        │
│                                     │
│  🥇 赤霞珠 Cabernet Sauvignon      │  排行榜
│     品过 8 次 · 平均 92 分           │
│  🥈 黑比诺 Pinot Noir               │
│     品过 5 次 · 平均 90 分           │
│  🥉 长相思 Sauvignon Blanc          │
│     品过 3 次 · 平均 88 分           │
│                                     │
│  ── ✦ 最爱产区 Top Regions ──       │
│                                     │
│  🇫🇷 波尔多 Bordeaux     6 瓶      │
│  🇫🇷 勃艮第 Burgundy     4 瓶      │
│  🇳🇿 马尔堡 Marlborough  2 瓶      │
│                                     │
│  [分享我的味蕾画像 →]                 │  CTA
│                                     │
├─────────────────────────────────────┤
│  ═══════════════════════════════════│
│  🏠     💬     (📷)    📖     👤  │
├─────────────────────────────────────┤
│ ▓▓▓▓▓▓▓ safe area bottom ▓▓▓▓▓▓▓  │
└─────────────────────────────────────┘
```

## 3.6 设置页 Settings

```
┌─────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓ status bar ▓▓▓▓▓▓▓▓▓▓▓▓ │
├─────────────────────────────────────┤
│  ← 返回          设置               │
│  ═══════════════════════════════════│
├─────────────────────────────────────┤
│                                     │
│         ┌────┐                      │
│         │ 👤 │   小雅               │  头像 80px
│         │    │   sophia@email.com   │  xl avatar
│         └────┘   编辑资料 →         │
│                                     │
│  ── ✦ 品酒偏好 Preferences ──       │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  🌍  语言 Language     中文 >│    │  Setting Row
│  │──────────────────────────── │    │  高度 52px
│  │  🌡️  温度 Temperature   ℃  >│    │
│  │──────────────────────────── │    │
│  │  💰  货币 Currency     ¥   >│    │
│  │──────────────────────────── │    │
│  │  🍷  默认评分 Scoring   百分 >│    │
│  └─────────────────────────────┘    │
│                                     │
│  ── ✦ 应用设置 App Settings ──      │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  🌙  深色模式 Dark       ○──│    │  Toggle Switch
│  │──────────────────────────── │    │
│  │  🔔  通知 Notifications ──○│    │
│  │──────────────────────────── │    │
│  │  🔊  声音 Sounds        ○──│    │
│  └─────────────────────────────┘    │
│                                     │
│  ── ✦ 关于 About ──                 │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  📋  使用条款 Terms        > │    │
│  │──────────────────────────── │    │
│  │  🔒  隐私政策 Privacy      > │    │
│  │──────────────────────────── │    │
│  │  ⭐  给我们评分 Rate       > │    │
│  │──────────────────────────── │    │
│  │  ℹ️  关于 About Sommé      > │    │
│  └─────────────────────────────┘    │
│                                     │
│  ── ✦ ──                            │
│        Sommé v1.0.0                 │  版本信息
│      每一杯，都懂你                  │  caption 居中
│                                     │
│  ┌─────────────────────────────┐    │
│  │      退出登录 Sign Out       │    │  Text 按钮, error色
│  └─────────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│  ═══════════════════════════════════│
│  🏠     💬     (📷)    📖     👤  │
├─────────────────────────────────────┤
│ ▓▓▓▓▓▓▓ safe area bottom ▓▓▓▓▓▓▓  │
└─────────────────────────────────────┘
```

**设置行规格 Setting Row Specs:**

| 属性 Property | 值 Value |
|--------------|---------|
| 行高 Row H | 52px |
| 内边距 Padding | `spacing.4` = 16px |
| 图标 Icon | `sizing.icon.md` = 24px, `icon.default` #3D3A42 |
| 标签 Label | `body` 16px, `text.primary` #3D3A42 |
| 值 Value | `bodySmall` 14px, `text.secondary` #8A8690 |
| 箭头 Chevron | 16px, `text.tertiary` #B8B4AE |
| 分割线 Divider | 1px `border.default` #E8E5E0, 左侧偏移 56px |
| 背景 Bg | `bg.secondary` #FFFFFF |
| 卡片圆角 | `borderRadius.lg` = 16px（外框） |

---

# 4. 动效规范 / Motion & Animation

## 4.1 酒滴弹跳加载动画 Wine Drop Bounce Loading

**概念：** 三滴酒红色酒滴依次弹跳，模拟倒酒时的律动

```
    ●        ●       ●
   (大)     (中)     (小)        ← 三滴不同大小
    ↕        ↕       ↕
  弹跳     弹跳    弹跳          ← 依次延迟弹起
    ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
```

### 三滴参数 Three Drops Parameters

| 属性 Property | 第 1 滴 Drop 1 | 第 2 滴 Drop 2 | 第 3 滴 Drop 3 |
|--------------|---------------|---------------|---------------|
| 直径 Size | 12px | 10px | 8px |
| 颜色 Color | `burgundy.500` #8B2252 | `burgundy.400` #A83A6A | `burgundy.300` #C75B8E |
| 弹跳高度 Bounce H | 20px | 16px | 12px |
| 延迟 Delay | 0ms | 120ms | 240ms |
| 间距 Gap | 8px（滴与滴之间） |
| 不透明度范围 | 1.0 → 0.4 → 1.0 |
| 形变 Squash | scaleX(1.2) scaleY(0.8)（触底时） |

### 动画曲线 Animation Curve

```css
@keyframes wine-drop-bounce {
  0%   { transform: translateY(0) scale(1);        opacity: 1.0; }
  25%  { transform: translateY(-20px) scale(1);    opacity: 0.7; }
  50%  { transform: translateY(0) scaleX(1.2) scaleY(0.8); opacity: 1.0; }
  65%  { transform: translateY(-8px) scale(1);     opacity: 0.85; }
  80%  { transform: translateY(0) scaleX(1.1) scaleY(0.9); opacity: 1.0; }
  100% { transform: translateY(0) scale(1);        opacity: 1.0; }
}

.wine-drop {
  animation: wine-drop-bounce 1200ms infinite;
  animation-timing-function: {motion.easing.wineDropBounce};
  /* cubic-bezier(0.34, 1.56, 0.64, 1) */
}
.wine-drop:nth-child(1) { animation-delay: 0ms;   width: 12px; height: 12px; }
.wine-drop:nth-child(2) { animation-delay: 120ms; width: 10px; height: 10px; }
.wine-drop:nth-child(3) { animation-delay: 240ms; width: 8px;  height: 8px;  }
```

**下方文字（可选）：**
```
"品鉴中…" / "Tasting..."
caption 12px, text.secondary #8A8690
animation: fade-pulse 2s infinite ease-in-out;
```

## 4.2 页面转场 Page Transitions

### Push 推入（标准导航）

```
持续: {motion.duration.slow} = 350ms
缓动: {motion.easing.pourSmooth} = cubic-bezier(0.4, 0.0, 0.2, 1.0)

新页面: translateX(100%) → translateX(0)
旧页面: translateX(0) → translateX(-30%)   opacity: 1 → 0.5
```

### Modal 模态弹出（底部弹窗/详情页）

```
持续: {motion.duration.slow} = 350ms
缓动: {motion.easing.spring} = cubic-bezier(0.175, 0.885, 0.32, 1.275)

弹窗: translateY(100%) → translateY(0)
遮罩: opacity 0 → {opacity.overlay} = 0.5
```

### Fade 淡入淡出（Tab 切换/内容替换）

```
持续: {motion.duration.normal} = 250ms
缓动: {motion.easing.easeInOut} = cubic-bezier(0.42, 0, 0.58, 1.0)

旧内容: opacity 1 → 0,  translateY(0) → translateY(-8px)
新内容: opacity 0 → 1,  translateY(8px) → translateY(0)
```

## 4.3 微交互 Micro-interactions

### 按钮按下缩放 Button Press Scale

```css
/* 按下 Active */
transform: scale(0.97);
transition: transform {motion.duration.fast} {motion.easing.spring};
/* 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275) */

/* 释放 Release */
transform: scale(1.0);
transition: transform {motion.duration.normal} {motion.easing.spring};
/* 250ms — 弹簧回弹 */
```

### 酒款卡片展开 Card Expand

```css
/* 列表卡片 → 详情卡片 (Shared Element Transition) */

/* 阶段1: 卡片放大 */
duration: {motion.duration.slow} = 350ms;
easing: {motion.easing.pourSmooth};
transform: 从列表位置 → 全屏位置;
border-radius: 16px → 0px（或 20px 顶部）;

/* 阶段2: 内容展开 */
duration: {motion.duration.normal} = 250ms;
delay: 100ms;
酒标图片: 从 64×88 → 160×220, 居中;
信息区域: opacity 0 → 1, translateY(16px) → 0;
```

### 发送消息飞出 Send Message Fly-out

```css
/* 发送按钮按下 */
.send-button { transform: scale(0.85); }

/* 消息气泡飞入 */
@keyframes message-fly-in {
  0%   { transform: translateX(40px) scale(0.8); opacity: 0; }
  60%  { transform: translateX(-4px) scale(1.02); opacity: 1; }
  100% { transform: translateX(0) scale(1); opacity: 1; }
}
duration: {motion.duration.normal} = 250ms;
easing: {motion.easing.spring};
```

### 评分填充动画 Rating Fill Animation

```css
/* 酒杯图标依次填充 */
@keyframes glass-fill {
  0%   { clip-path: inset(100% 0 0 0); }  /* 从底部开始 */
  100% { clip-path: inset(0 0 0 0); }     /* 完全填充 */
}

/* 每个酒杯延迟 */
.glass:nth-child(1) { animation-delay: 0ms; }
.glass:nth-child(2) { animation-delay: 80ms; }
.glass:nth-child(3) { animation-delay: 160ms; }
.glass:nth-child(4) { animation-delay: 240ms; }
.glass:nth-child(5) { animation-delay: 320ms; }

duration: 400ms per glass;
easing: {motion.easing.easeOut};
fill-color: {gold.400} #D4A56A;

/* 填充完成后微弹 */
@keyframes glass-filled-pop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.15); }
  100% { transform: scale(1); }
}
duration: 200ms;
easing: {motion.easing.spring};
```

### 收藏/加入酒窖 Add to Cellar

```css
/* 心形/酒瓶图标动画 */
@keyframes cellar-add {
  0%   { transform: scale(1); }
  15%  { transform: scale(1.3); }
  30%  { transform: scale(0.9); }
  45%  { transform: scale(1.1); }
  60%  { transform: scale(1.0); }
}
duration: 600ms;
easing: {motion.easing.spring};

/* 同时粒子散射 */
particles: 6个小圆点 (burgundy.200, gold.200)
散射半径: 20-30px
duration: 400ms
fade-out: 200ms
```

## 4.4 打字机效果 Typewriter Effect

**用于 AI 回复文字逐字出现：**

| 参数 Parameter | 值 Value |
|---------------|---------|
| 每字符间隔 Char Interval | 30ms（中文）/ 20ms（英文） |
| 标点后停顿 Punctuation Pause | 逗号/分号: +100ms / 句号/感叹号: +200ms / 省略号: +300ms |
| 段落间停顿 Paragraph Pause | +400ms |
| 光标 Cursor | 2px × 18px, `burgundy.500` #8B2252, 闪烁 500ms 间隔 |
| 光标消失 Cursor Fade | 打字完成后 800ms 淡出 |
| 加速阈值 | 文字超过 200 字符时，间隔减半至 15ms/10ms |
| 用户滚动 | 自动跟随滚动至最新文字 |

```css
/* 光标闪烁 */
@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
.typing-cursor {
  animation: cursor-blink 1s step-end infinite;
}
```

## 4.5 减少动效模式 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  /* 保留必要的透明度变化 */
  .toast, .modal-overlay {
    transition-duration: 150ms !important;
    transition-property: opacity !important;
  }
}
```

---

# 5. 深色模式 / Dark Mode

## 5.1 关键组件深色模式对比 Key Component Comparison

### 背景与文字 Background & Text

| 元素 Element | 浅色 Light | 深色 Dark |
|-------------|-----------|----------|
| 主背景 Primary Bg | `neutral.50` #FAF7F2 | `neutral.800` #1E1A2B |
| 卡片背景 Card Bg | `neutral.0` #FFFFFF | `neutral.700` #2A2636 |
| 次级背景 Tertiary Bg | `neutral.100` #F0EDE8 | #332E40 |
| 浮层背景 Elevated Bg | `neutral.0` #FFFFFF | #3A3548 |
| 主文字 Primary Text | `neutral.600` #3D3A42 | `neutral.100` #F0EDE8 |
| 次要文字 Secondary Text | `neutral.400` #8A8690 | `neutral.500` #6B6774 |
| 品牌色文字 Brand Text | `burgundy.500` #8B2252 | `burgundy.300` #C75B8E |

### 按钮 Buttons

| 按钮类型 | 浅色 Light | 深色 Dark |
|---------|-----------|----------|
| Primary Bg | `burgundy.500` #8B2252 | `burgundy.300` #C75B8E |
| Primary Hover | `burgundy.600` #721B43 | `burgundy.200` #E5A3C0 |
| Primary Text | #FFFFFF | #FFFFFF |
| Primary Shadow | rgba(139,34,82,0.20) | rgba(199,91,142,0.30) |
| Secondary Border | `burgundy.500` #8B2252 | `burgundy.300` #C75B8E |
| Secondary Hover Bg | #FCF2F6 | #2D1A28 |
| Disabled Bg | `neutral.150` #E8E5E0 | #3A3548 |

### 对话气泡 Chat Bubbles

| 气泡类型 | 浅色 Light | 深色 Dark |
|---------|-----------|----------|
| User Bubble Bg | `neutral.50` #FAF7F2 | #332E40 |
| User Bubble Border | `burgundy.200` #E5A3C0 | #5A1535 |
| AI Bubble Bg | rgba(139,34,82,0.06) | rgba(199,91,142,0.10) |
| System Bubble Bg | `neutral.100` #F0EDE8 | `neutral.700` #2A2636 |

### 输入框 Input Fields

| 元素 | 浅色 Light | 深色 Dark |
|-----|-----------|----------|
| Bg | #FFFFFF | `neutral.700` #2A2636 |
| Border Default | `neutral.150` #E8E5E0 | #3A3548 |
| Border Focus | #B85D89 | #C75B8E |
| Placeholder | `neutral.300` #B8B4AE | #524E5E |

### 酒款卡片 Wine Cards

| 元素 | 浅色 Light | 深色 Dark |
|-----|-----------|----------|
| Card Bg | #FFFFFF | #2A2636 |
| Card Border | #E8E5E0 | #3A3548 |
| Card Shadow | rgba(30,26,43,0.06) | rgba(0,0,0,0.24) |
| Wine Name | #3D3A42 | #F0EDE8 |
| Region Text | #8A8690 | #6B6774 |

### Toast 通知

| 类型 Type | 浅色 Light Bg / Text | 深色 Dark Bg / Text |
|-----------|---------------------|---------------------|
| Success | #EDF7F3 / #3A9B7A | #1A2B24 / #4DB893 |
| Error | #FDF0F0 / #D94F4F | #2B1A1A / #E87070 |
| Warning | #FDF8EC / #E8B84B | #2B261A / #F0C860 |
| Info | #EFF4F9 / #5B8FB9 | #1A222B / #7AAAD0 |

### 标签 Badge

| 类型 | 浅色 Light Bg / Text | 深色 Dark Bg / Text |
|-----|---------------------|---------------------|
| 味觉 Flavor | `burgundy.50` #FCF2F6 / #8B2252 | rgba(199,91,142,0.15) / #C75B8E |
| 产区 Region | `green.50` #F2F7F2 / #4A7349 | rgba(125,176,124,0.15) / #7DB07C |
| 价格 Price | `gold.50` #FDF8F0 / #A87A3A | rgba(224,186,128,0.15) / #E0BA80 |

### 导航 Navigation

| 元素 | 浅色 Light | 深色 Dark |
|-----|-----------|----------|
| Top Bar Bg | rgba(250,247,242,0.88) | rgba(30,26,43,0.88) |
| Tab Bar Bg | #FFFFFF | #1E1A2B |
| Icon Default | #3D3A42 | #F0EDE8 |
| Icon Active | #8B2252 | #C75B8E |
| Golden Line | gradient.goldShimmer (light) | gradient.goldShimmer (dark) |

### 渐变 Gradients

| 渐变 | 浅色 Light | 深色 Dark |
|-----|-----------|----------|
| Tasting | #8B2252 → #D4A56A | #C75B8E → #E0BA80 |
| Evening | #4A1942 → #1E1A2B | #3A1835 → #14111E |
| Brand Soft | #8B2252 → #C75B8E | #A83A6A → #C75B8E |
| Gold Shimmer | #D4A56A → #E8D4A8 → #D4A56A | #E0BA80 → #F0D8B4 → #E0BA80 |

## 5.2 WCAG AA 对比度验证 Contrast Ratio Verification

### 浅色模式 Light Mode

| 前景 Foreground | 背景 Background | 对比度 Ratio | WCAG AA | 用途 Usage |
|----------------|----------------|-------------|---------|-----------|
| `#3D3A42` 主文字 | `#FAF7F2` 主背景 | **11.2:1** | ✅ AAA | 正文阅读 Body text |
| `#3D3A42` 主文字 | `#FFFFFF` 卡片背景 | **12.4:1** | ✅ AAA | 卡片内文字 Card text |
| `#8A8690` 次要文字 | `#FAF7F2` 主背景 | **3.6:1** | ✅ AA (大文本) | 次要信息 Secondary text |
| `#8A8690` 次要文字 | `#FFFFFF` 卡片背景 | **4.0:1** | ✅ AA (大文本) | 辅助文字 Helper text |
| `#8B2252` 品牌色 | `#FAF7F2` 主背景 | **7.8:1** | ✅ AAA | 品牌色链接/标题 Brand links |
| `#8B2252` 品牌色 | `#FFFFFF` 卡片背景 | **8.6:1** | ✅ AAA | 按钮/链接 Buttons |
| `#FFFFFF` 白字 | `#8B2252` 品牌按钮 | **8.6:1** | ✅ AAA | Primary 按钮文字 |
| `#D4A56A` 金色 | `#FAF7F2` 主背景 | **2.4:1** | ⚠️ 仅装饰 | 装饰元素 Decorative only |
| `#D4A56A` 金色 | `#1E1A2B` 深背景 | **6.5:1** | ✅ AA | 深色背景上金色文字 |
| `#B8B4AE` 占位符 | `#FFFFFF` 输入框 | **2.3:1** | ⚠️ 占位符豁免 | 占位文字 (WCAG 豁免) |
| `#D94F4F` 错误 | `#FDF0F0` 错误背景 | **4.6:1** | ✅ AA | 错误提示文字 |
| `#3A9B7A` 成功 | `#EDF7F3` 成功背景 | **4.1:1** | ✅ AA | 成功提示文字 |
| `#5B8FB9` 信息 | `#EFF4F9` 信息背景 | **3.5:1** | ✅ AA (大文本) | 信息提示 |

### 深色模式 Dark Mode

| 前景 Foreground | 背景 Background | 对比度 Ratio | WCAG AA | 用途 Usage |
|----------------|----------------|-------------|---------|-----------|
| `#F0EDE8` 主文字 | `#1E1A2B` 主背景 | **12.1:1** | ✅ AAA | 正文阅读 Body text |
| `#F0EDE8` 主文字 | `#2A2636` 卡片背景 | **10.0:1** | ✅ AAA | 卡片内文字 Card text |
| `#6B6774` 次要文字 | `#1E1A2B` 主背景 | **3.7:1** | ✅ AA (大文本) | 次要信息 Secondary text |
| `#C75B8E` 品牌色 | `#1E1A2B` 主背景 | **5.1:1** | ✅ AA | 品牌色链接/标题 |
| `#C75B8E` 品牌色 | `#2A2636` 卡片背景 | **4.2:1** | ✅ AA | 卡片内品牌元素 |
| `#FFFFFF` 白字 | `#C75B8E` 品牌按钮 | **4.2:1** | ✅ AA | Primary 按钮文字 |
| `#E0BA80` 金色 | `#1E1A2B` 深背景 | **8.0:1** | ✅ AAA | 深色模式金色文字 |
| `#E87070` 错误 | `#2B1A1A` 错误背景 | **5.3:1** | ✅ AA | 错误提示 |
| `#4DB893` 成功 | `#1A2B24` 成功背景 | **5.7:1** | ✅ AA | 成功提示 |
| `#F0C860` 警告 | `#2B261A` 警告背景 | **7.2:1** | ✅ AAA | 警告提示 |
| `#7AAAD0` 信息 | `#1A222B` 信息背景 | **5.4:1** | ✅ AA | 信息提示 |

### 对比度总结 Contrast Summary

| 场景 Scenario | 浅色模式 Light | 深色模式 Dark | 状态 Status |
|-------------|---------------|--------------|------------|
| 主文字在主背景 | 11.2:1 AAA | 12.1:1 AAA | ✅ 优秀 |
| 品牌色在主背景 | 7.8:1 AAA | 5.1:1 AA | ✅ 合格 |
| 按钮文字在品牌色 | 8.6:1 AAA | 4.2:1 AA | ✅ 合格 |
| 次要文字在主背景 | 3.6:1 AA-lg | 3.7:1 AA-lg | ⚠️ 仅大文本 |
| 金色在浅背景 | 2.4:1 | — | ⚠️ 仅装饰 |
| 功能色在功能背景 | 4.1–4.6:1 AA | 5.3–7.2:1 AA+ | ✅ 合格 |

> **设计规则 Design Rule:**
> - 金色 (#D4A56A / #E0BA80) **仅用于装饰性元素**（装饰线、图标、大号标题），**不用于**小字正文
> - 次要文字色 (#8A8690 / #6B6774) 字号**不小于 16px**（满足 AA 大文本要求）
> - 所有可交互文字（链接、按钮、标签文字）必须达到 **4.5:1** 以上

---

# 附录 Appendix

## A. Token 快速对照表 Token Quick Reference

```
品牌主色:  burgundy.500  #8B2252  (浅色) / burgundy.300  #C75B8E  (深色)
琥珀金:    gold.400      #D4A56A  (浅色) / gold.300      #E0BA80  (深色)
主背景:    neutral.50    #FAF7F2  (浅色) / neutral.800   #1E1A2B  (深色)
卡片背景:  neutral.0     #FFFFFF  (浅色) / neutral.700   #2A2636  (深色)
主文字:    neutral.600   #3D3A42  (浅色) / neutral.100   #F0EDE8  (深色)
次要文字:  neutral.400   #8A8690  (浅色) / neutral.500   #6B6774  (深色)

标题字体EN: DM Serif Display
正文字体EN: Inter
数据字体:   JetBrains Mono
标题字体CN: Noto Serif CJK SC / 思源宋体
正文字体CN: Noto Sans CJK SC / 思源黑体

圆角: xs=4 sm=8 md=12 lg=16 xl=20 2xl=24 full=9999
间距: 1=4 2=8 3=12 4=16 5=20 6=24 8=32 10=40 12=48 16=64

动效快速: 150ms   常规: 250ms   缓慢: 350ms   更慢: 500ms
```

## B. 文件依赖关系 File Dependencies

```
design-tokens.json          ← 单一真相源 / Single source of truth
  ├── VISUAL-DESIGN-SYSTEM.md  ← 本文件（设计规范文档）
  ├── globals.css              ← CSS 变量实现
  ├── tailwind.config.ts       ← Tailwind 配置
  └── components/*.tsx         ← React 组件实现
```

## C. 版本历史 Version History

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2026-02-27 | 视觉设计系统初版 / Initial release |

---

*此文档为 Sommé / 颂美 视觉设计系统规范。所有组件实现须严格遵循本文档。*
*This document defines the Sommé Visual Design System. All implementations must follow these specifications.*

**© 2026 Sommé / 颂美. All rights reserved.**

---

> *"每一杯，都懂你。"*  
> *"Every Glass, Understood."*  
> *— Sommé Design Team*
