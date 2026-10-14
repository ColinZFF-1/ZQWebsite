# 昭桥智能官网重构材料清单

本目录中的 `materials/` 已经整理了当前可以直接使用或作为参考的素材。

## 当前场景素材

| 文件 | 用途 | 状态 |
|---|---|---|
| `scene-agent.png` | 智能体定制场景 poster | 临时 poster，后续替换为视频 |
| `scene-tools.png` | AI 工具开发场景 poster | 临时 poster，后续替换为视频 |
| `scene-writing.png` | 智能写作场景 poster | 临时 poster，后续替换为视频 |
| `scene-marketing.png` | 智能营销场景 poster | 临时 poster，后续替换为视频 |
| `scene-agent-v2.png` | 智能体定制场景 V2 poster | 新生成，作为后续视频首帧方向 |
| `scene-tools-v2.png` | AI 工具开发场景 V2 poster | 新生成，作为后续视频首帧方向 |
| `scene-writing-v2.png` | 智能写作场景 V2 poster | 新生成，作为后续视频首帧方向 |
| `scene-marketing-v2.png` | 智能营销场景 V2 poster | 新生成，作为后续视频首帧方向 |

这些图用于理解“微缩玻璃办公世界”的视觉方向，不应被当作最终动效使用。

## Hero 与品牌参考

| 文件 | 用途 |
|---|---|
| `hero-ecosystem-v3.png` | 微缩办公生态 Hero 参考 |
| `hero-zhaoqiao-workflow-poster.png` | 现有工作流视频 poster |
| `workplace-hero-v3.png` | 企业工作场景参考 |
| `zhaoqiao-visual-hero-v1.png` | 早期品牌视觉 Hero 参考 |
| `ref-mini-office-ecosystem.png` | 用户提供的微缩办公生态参考图 |
| `ref-glass-ai-assistant.png` | 用户提供的透明玻璃 AI 助手参考图 |
| `hero-start-frame-v2.png` | 新 Hero 视频首帧：AI 中枢待机 |
| `hero-end-frame-v2.png` | 新 Hero 视频尾帧：AI 中枢完成连接 |

## 已有视频

| 文件 | 用途 | 状态 |
|---|---|---|
| `hero-zhaoqiao-workflow.mp4` | 现有 Hero / 工作流视频实验 | 可作为临时视频参考 |
| `zhaoqiao-capability-15s.mp4` | 能力展示视频实验 | 可作为临时视频参考 |

已有视频仅作为探索素材。使用前需要检查是否存在呼吸闪烁、加载旋转、构图跳动或不适合循环的问题。

## 官网视频接入

| 文件 | 用途 | 状态 |
|---|---|---|
| `dist/assets/videos/hero-latest.mp4` | 最新 Hero 背景视频 | 已接入首页 Hero，自动播放、静音、循环 |
| `dist/assets/videos/capability-agent.mp4` | 智能体定制能力视频 | 预留文件名，待生成 |
| `dist/assets/videos/capability-tools.mp4` | AI 工具开发能力视频 | 预留文件名，待生成 |
| `dist/assets/videos/capability-writing.mp4` | 智能写作能力视频 | 预留文件名，待生成 |
| `dist/assets/videos/capability-marketing.mp4` | 智能营销能力视频 | 预留文件名，待生成 |

四个能力区已经绑定以上四个文件名。把对应 MP4 放入 `dist/assets/videos/` 后，页面会在该能力区进入视口时自动加载、静音播放并循环；文件尚未生成时继续显示对应 poster，不会出现空白或破损画面。

## Logo 素材

| 文件 | 用途 |
|---|---|
| `zhaoqiao-lockup.png` | 现有 Logo 组合图 |
| `zhaoqiao-mark.png` | 现有 Logo 图形标 |

## 原始品牌资料

这些资料不在本目录中，但可从以下位置读取：

- `C:\Users\晶晶\Documents\xwechat_files\bushikongbai_280a\msg\file\2026-10\AI 企业培训及落地(1).pdf`
- `C:\Users\晶晶\Documents\xwechat_files\bushikongbai_280a\msg\file\2026-10\贤弟AI-产品体系(1).pdf`

资料用途：理解昭桥的服务范围、企业培训、AI 落地、智能体、工具开发、智能写作和智能营销能力。资料中的说明是业务参考，不是直接放到首页的长文案。

## 当前前端入口

- 当前原型：`dist/motionsites-layout.html`
- 当前预览：`http://127.0.0.1:8000/motionsites-layout.html`

新 Hero 视频提示词：`HERO_VIDEO_PROMPT_V3_10S.md`（约 10 秒版本）

四个能力场景提示词：`CAPABILITY_SCENE_PROMPTS_V2.md`

旧版提示词：`HERO_VIDEO_PROMPT_V2.md`（12–15 秒版本，仅作备份）

注意：当前入口是旧版布局，只能用于了解现有代码和品牌文字。新任务需要重构布局，不要继续扩展旧版静态卡片墙。

