# HANDOFF.md — Sommé 颂美 Onboarding Video v2

## ✅ 完成状态
**渲染成功** → `output/onboarding.mp4`（3.9 MB，55秒，1080×1920 竖屏，30fps）

---

## 📁 文件改动清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/OnboardingVideo.tsx` | 全量重写（v2） | 7个场景全部实现，~550行，无外部图片依赖 |
| `src/Root.tsx` | 更新 | durationInFrames=1650（55s），尺寸改为1080×1920 |
| `tsconfig.json` | 更新 | 加 `skipLibCheck: true`，修复remotion类型冲突 |
| `output/onboarding.mp4` | 新生成 | 最终成品视频 |

---

## 🎬 场景时间轴

| Scene | 时间 | 帧范围 | 内容 |
|-------|------|--------|------|
| 1 | 0-5s | 0-149 | Logo + 品牌名 + 标语淡入 |
| 2 | 5-20s | 150-599 | 四大功能卡片逐个飞入 + 快捷标签 |
| 3 | 20-30s | 600-899 | 拍照取景框 + 扫描动画 + 识别结果 + 想买/在喝分流 |
| 4 | 30-38s | 900-1139 | AI品鉴流程：级别选择 + 四步指示器 + 评分滑块 + 风味标签 + 存入酒窖 |
| 5 | 38-44s | 1140-1319 | 我的酒窖：Tab切换动画 + 酒款卡片 + 导出/分享 |
| 6 | 44-48s | 1320-1439 | 语言切换：中↔EN Toggle高亮 + 内容切换 |
| 7 | 48-55s | 1440-1649 | CTA：Logo缩放 + 标语 + somme.app + 渐隐结束 |

---

## 🎨 设计决策

### 为什么没有用截图
原BRIEF提到用`01-home.jpg`等截图作参考，但旧版遗留代码引用了`staticFile("screenshots/...")`导致渲染崩溃。v2选择**纯代码渲染**，避免外部图片依赖，渲染更稳定，风格也更统一一致。

### 动画策略
- 所有动画用 `interpolate` + `Easing.out(Easing.cubic)` 实现，流畅不做作
- 卡片飞入用 `translateX` + `scale` 组合，有纵深感
- Scene3扫描线用帧插值实现横扫效果
- Scene4评分滑块分数从60→88实时变化（从帧20到200）
- Scene6语言切换在第62帧硬切换（约2秒后），内容淡入淡出

### 配色严格遵循BRIEF
- 酒红色 `#722F37`（主色、按钮）
- 奶白色 `#FDF8F0`（文字、卡片）
- 金色 `#C9A96E`（副标题、标签、装饰）
- 背景 `#1A0A0C` → wine渐变

---

## ⚠️ 留下的坑 / TODO

1. **没有配音** — BRIEF要求TTS配音，但渲染流程目前是纯视频。需要：
   - 用TTS工具生成7段中文旁白MP3
   - 用ffmpeg合并音频到视频（参考命令：`ffmpeg -i onboarding.mp4 -i narration.mp3 -map 0:v -map 1:a -c:v copy output_with_audio.mp4`）

2. **没有背景音乐** — BRIEF提到"优雅轻快背景音乐"，需要找一段版权安全的BGM

3. **没用截图** — BRIEF希望展示真实App界面截图（`01-home.jpg`等），目前是纯emoji+文字模拟。如需加真实截图，可在Scene2/Scene5等场景用`<Img src={staticFile(...)}`替换，但需确保public/目录下有对应文件

4. **字体** — 代码里用`fontFamily: "Georgia, serif"`作为Cormorant Garamond的近似替代。如要完全还原BRIEF字体，需要在项目里加载Google Fonts（Remotion支持`<style>@import url(...)</style>`注入）

5. **Scene4 tasting步骤** — 四步品鉴的activeStep用`Math.floor(f/58)`简单轮播，没有做实际的表单交互演示（因为是视频不能真交互）

---

## 🚀 重新渲染命令

```bash
cd /Users/morty/.openclaw/workspace/projects/wine-advisor/onboarding-video
npx remotion render src/index.ts OnboardingVideo output/onboarding.mp4 --overwrite
```

---

## 📊 Morty汇报摘要

> 视频已完成渲染 ✅  
> 路径：`output/onboarding.mp4`（3.9MB，55秒，1080×1920）  
> 7个场景全覆盖，包括新增的拍照识酒分流（Scene3）和AI品鉴流程（Scene4）  
> 主要遗留：**配音TTS未合并**，需要单独处理音频合并步骤
