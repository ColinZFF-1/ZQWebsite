# 昭桥智能官网新版 · 交付说明

新版首页：`dist/zhaoqiao-v3.html`（同目录引用 `dist/assets/` 里的 poster 与视频）。
本地预览：在 `dist/` 目录运行 `python -m http.server 8000`，打开 <http://127.0.0.1:8000/zhaoqiao-v3.html>。
单文件、零依赖、无构建步骤；上线路径 = 把 `zhaoqiao-v3.html` 改名为 `index.html`（或由托管层指定首页）。

---

## 1. 视频素材替换说明

所有视频与 poster 都在一个配置对象里管理。打开 `zhaoqiao-v3.html`，找到 `<script>` 里的 `const SITE = { … }`（有注释标记 `SITE DATA`）。

### Hero

```js
hero: {
  poster: "assets/hero-zhaoqiao-workflow-poster.png",
  video:  "assets/hero-zhaoqiao-workflow.mp4",   // 当前是临时视频
  sub: "…"
}
```

当前接入的是现有实验视频 `hero-zhaoqiao-workflow.mp4`（约 3.5 秒，暗紫微缩办公岛缓慢推近，可循环）。最终视频做好后，替换 `video` 路径即可，文件名建议 `assets/hero-final.mp4`。

### 四个能力章节

每个能力对象里有三个媒体字段：

```js
poster: "assets/scene-agent.png",   // 必填：封面占位图
video:  null,                        // null = 只显示 poster；填路径 = 自动接入播放
alt:    "…"                          // 无障碍描述
```

当前四段能力视频均为 `null`（poster 占位状态），`<video>` 容器、播放控制、错误降级已全部就位。拿到视频后只需把 `video: null` 改成 `video: "assets/capability-agent.mp4"` 这样的路径，无需改任何 HTML。

### 视频规格建议

| 位置 | 时长 | 规格 |
|---|---|---|
| Hero | 12–15s，首尾构图接近，方便循环 | 1920×1080，H.264 MP4，≤ 8MB |
| 能力章节 | 8–12s，一段只讲一个完整动作 | 1600×1200（4:3），H.264 MP4，≤ 4MB |
| 案例 | 15–30s | 1600×900（16:9），H.264 MP4，≤ 6MB |

统一要求：无声（页面不播放音乐）、无文字水印、无加载转圈/呼吸闪烁、缓动运镜、可无缝循环。

### 降级机制（已实现，无需处理）

- 视频 `<video muted loop playsinline autoplay>`，进入视口才加载并播放，离开视口自动暂停。
- 视频成功播放前显示 poster；视频加载失败自动隐藏 `<video>`，页面退回 poster，不会出现黑块。
- poster 加 `loading="lazy"`，不影响首屏速度。

---

## 2. 四段能力视频分镜与生成提示词

统一视觉基调（每条提示词开头都带上）：

> Soft lavender and glass-white miniature office world floating among pastel clouds, translucent glass furniture, tiny green plants, warm golden rim light, gentle 3D diorama style, dreamy soft focus background, light purple-blue palette (#E2DBED, #79A7D9, #9A8EC3) with a hint of warm apricot (#F4C3A5), smooth slow camera, no text, no people talking, cinematic soft lighting, seamless loop.

### 01 智能体定制 / Agent Systems（8–12s，叙事：任务输入 → 检索判断 → 分发结果）

分镜：
1. (0–3s) 微缩办公岛俯瞰，一枚发光任务卡片从左侧文件堆飞起，落入岛中央的透明玻璃 AI 中枢。
2. (3–7s) 中枢内部：数据流沿玻璃管线流向四周的书架（知识库）、流程板（规则）、角色头像节点；中枢逐一检索并点亮对应节点。
3. (7–10s) 处理完成的结果卡片沿光桥飞向右侧两个工位，对应员工桌面亮起，员工抬头微笑点头。
4. (10–12s) 镜头轻轻拉回初始俯瞰角度，首尾构图一致。

英文提示词：

> Miniature glass office diorama among pastel clouds. A glowing task card lifts from a small document stack and flies into a translucent glass AI hub at the center of the island. Inside the hub, streams of light travel along glass tubes toward a tiny bookshelf, a flowchart board, and glowing role-avatar nodes, lighting each one up in turn. A finished result card then glides across a light bridge to two tiny desks where miniature workers nod. Camera slowly pulls back to the opening aerial view. Soft lavender palette, warm golden accents, smooth gentle motion, seamless loop, no text.

### 02 AI 工具开发 / AI Tools（8–12s，叙事：需求拆解 → 模块拼装 → 工具成型通过测试）

分镜：
1. (0–3s) 一张需求卡片在微缩工作台上自动拆成四个发光模块方块，整齐排列。
2. (3–8s) 模块方块依次被半透明的机械臂/光束拿起，嵌入中央玻璃主板；数据接口、表单、审批、自动化四种图标依次亮起并连线。
3. (8–10s) 主板上方升起一个完整的小工具界面（玻璃面板），自检绿灯逐格点亮，旁边出现一个小小的对勾光效。
4. (10–12s) 镜头环绕四分之一圈后回到起始角度，首尾衔接。

英文提示词：

> Miniature glass workshop floating in pastel clouds. A requirement card on a white workbench unfolds into four glowing translucent cubes. Gentle beams of light pick up each cube and slot them into a central glass mainboard; icons for data, forms, approvals and automation light up and connect with thin light lines. A finished glass tool interface rises above the board while green check lights blink across it in sequence. Camera orbits a quarter turn and returns to the start. Soft lavender and glass-white palette, apricot highlights, slow smooth motion, seamless loop, no text.

### 03 智能写作 / AI Writing（8–12s，叙事：资料导入 → 提炼结构化 → 文档输出）

分镜：
1. (0–3s) 一叠杂乱的文件、便签、截图从左侧飘入微缩玻璃书桌上方，被一道柔光卷入。
2. (3–7s) 桌面上方的悬浮屏里，杂乱文字块被拉直、分组、排成提纲，逐段变成整齐的段落卡片，颜色按重要度点亮。
3. (7–10s) 一份成型文档（报告样式）从悬浮屏滑到桌面右侧，自动装订发光封面。
4. (10–12s) 镜头轻轻前推停在文档特写，回到接近初始的构图。

英文提示词：

> Miniature glass writing desk among pastel clouds. A messy stack of papers, sticky notes and screenshots drifts in and dissolves into a soft beam of light. On a floating glass screen above the desk, chaotic text blocks straighten, group themselves into an outline, and settle into neat paragraph cards glowing in order of importance. A finished bound document with a softly glowing cover slides out onto the desk. Camera pushes in gently to the finished document. Soft lavender palette, warm desk-lamp glow, calm fluid motion, seamless loop, no text.

### 04 智能营销 / AI Marketing（8–12s，叙事：素材池 → 多版本内容 → 渠道分发 → 数据回流建议）

分镜：
1. (0–3s) 微缩广场中央的素材池（图片、视频、文案小卡）缓缓旋转。
2. (3–7s) AI 中枢从池中抽取素材，生成三张内容变体卡片，分别飞向环形排列的三个渠道玻璃塔（社媒、邮件、短视频），塔顶依次亮起。
3. (7–10s) 渠道塔下方升起细小的数据光点，回流汇入中枢，凝成一个上升的小箭头光效。
4. (10–12s) 镜头拉回初始全景，光点继续缓缓循环流动。

英文提示词：

> Miniature glass plaza among pastel clouds with a slowly rotating pool of content assets at its center — tiny images, video cards and text notes. A translucent AI hub draws assets from the pool and creates three glowing content variant cards that fly outward to three glass channel towers arranged in a ring; each tower top lights up as a card lands. Tiny particles of data rise from the towers and flow back into the hub, forming a small upward arrow of light. Camera pulls back to the opening wide view while the light particles keep flowing. Soft lavender palette, apricot and blue accents, gentle continuous motion, seamless loop, no text.

### Hero 重制方向（12–15s，可选）

现有 `hero-zhaoqiao-workflow.mp4` 可继续使用。若重制：延续暗紫微缩办公岛 + 彩虹光桥世界观，镜头从全景缓慢推近中央玻璃 AI 中枢，中枢把光桥依次点亮到四周办公室（对应四项能力），结尾镜头缓慢回到全景，首尾构图一致，方便无缝循环。

---

## 3. 案例框架字段说明

案例在 `SITE.cases` 数组里，每个对象一张卡片。**加第五、第六个案例 = 复制一个对象改内容**，布局自动适应（两列网格，奇数时最后一张占整行宽度自然留白）。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 唯一标识，用于锚点/后续详情页路由 |
| `industry` | string | 行业/客户类型，显示为左上角深色标签 |
| `sample` | boolean | `true` 时显示橙色 "Sample" 徽章；接入真实案例后改为 `false` |
| `title` | string | 案例一句话标题（结果导向） |
| `problem` | string | 客户的工作问题（一句话） |
| `solution` | string | 昭桥提供的 AI 方案（一句话，自动加 "ZHAOQIAO ·" 前缀） |
| `results` | [数值, 说明][] | 3 组结果数据，如 `["-60%","onboarding time"]` |
| `poster` | string | 案例封面图（16:9，可用视频 poster） |
| `video` | string \| null | 案例封面视频；`null` 表示仅 poster |
| `href` | string | 查看详情入口；现阶段指向 `#contact`，将来换成详情页 URL |
| `alt` | string | 封面图无障碍描述 |

当前三张均为明确标记的占位样例（Sample 徽章 + 案例区底注），数据结构已按真实交付标准搭好。

---

## 4. 预览

- 桌面端 1440×900 与移动端 390×844 均已在浏览器实测：Hero 视频播放、四个能力逐屏展示、案例网格、联系区、锚点导航、滚动淡入均正常；无横向滚动条；无背景音乐与闪烁动效。
- 预览地址：<http://127.0.0.1:8000/zhaoqiao-v3.html>（服务需在 `dist/` 目录保持运行）。

## 5. 与旧版的关系

- 旧版 `index.html`、`motionsites-layout.html`、`homepage-v2.html` 未改动，仅作为参考保留。
- 新版不包含旧版的四卡筛选器与静态卡片墙，符合任务书"不回退成静态图片卡片墙"的验收要求。
