# 🍷 v0.5 需求速报：我的酒窖 + 拍照智能分流

## 拍照智能分流

拍照/上传酒的图片后，AI 先识别酒款，然后弹出选择：

### 🛒 想买这款酒
→ AI 评价 + 评分(/100) + 风味描述 + 同价位推荐
→ 提示"要加入心愿清单吗？" → 存入酒窖 wishlist

### 🍷 正在喝这款酒
→ AI 给 Tasting Notes
→ 追问用户体验："你觉得这款酒怎么样？给个分数吧（1-100）"
→ 用户回复后 AI 总结
→ 提示"要存入酒窖吗？" → 存入酒窖 drinking 记录

## 我的酒窖

### 数据结构（localStorage `wineCellar`）
```javascript
{
  wines: [
    {
      id: "uuid",
      name: "拉菲 2015",
      image: "base64_thumbnail",
      type: "drinking" | "wishlist",
      rating: 92,
      userNotes: "果味浓郁，单宁柔和",
      aiNotes: "AI的tasting notes...",
      date: "2026-02-27",
      region: "波尔多",
      grape: "赤霞珠",
      price: "¥500-800"
    }
  ]
}
```

### UI
- Header 右侧 📖 酒窖图标按钮
- 酒窖页面覆盖对话区域
- Tab：「品过的酒」/「想买的酒」
- 酒卡片：缩略图 + 酒名 + 评分 + 日期 + 笔记
- 空酒窖引导文案
- 返回按钮回到对话

### 交互按钮
- 分流选择以 AI 消息内嵌按钮形式呈现
- "存入酒窖" / "加入心愿清单" 确认按钮

### 自动更新味蕾画像
- 每次入窖时根据酒款信息更新 tasteProfile
