# 案例 01｜房修小匠

这是基于项目文档制作的三栏案例信息图，不再使用上一版的虚构示例文案。

## 内容分区

- 左栏：项目起点、维修知识碎片化、平台迁移原因
- 中栏：知识来源、领域回答链路、私有化部署与治理体系
- 右栏：检索延迟、首字延迟、格式支持、并发保护、交付物和审计能力
- 底部：从提问到沉淀的业务闭环

## 数据口径

维修案例数按原文建议使用 `500+`，没有直接把待核实的 454 / 551 印入物料；103 条维修规范保留。工程指标使用项目文档中的 100 毫秒级、0.6 秒、秒回、5 种格式、8 路流式等口径。

## 素材

背景图为根据物业维修场景生成的无文字背景图，仅作为视觉氛围层；所有标题、指标、业务流程和架构关系均由代码绘制，避免图片中的文字或结构不可控。

## 输出

- `build/case01_fangxiu_three_column_2480x3508.png`
- `build/case01_fangxiu_three_column_2480x3508_web.png`
- `build/case01_fangxiu_three_column_2480x3508.pdf`
- `build/case01_fangxiu_contact_sheet.png`
- `build/verify_case01_report.txt`

## GitHub skill 试用

本案例的解决方案架构另按 `infographic-architect` 的 `layered-agent-platform` 模板做了一张可编辑 SVG：

- `assets/fangxiu_architecture_infographic.svg`
- `build/fangxiu_architecture_infographic.png`

SVG 已通过该 skill 自带的 `svg_infographic_lint.py`，适合作为方案页、PPT 架构页或案例图中栏的独立架构资产。

运行 `compose_case01.py` 可重新生成全部输出，运行 `verify_case01.py` 可检查尺寸和安全区域。

## 完整横版案例
compose_case01_complete.py 将架构图、项目起点和可验证结果组合成 16:9 完整案例页：uild/case01_fangxiu_complete_landscape_2560x1440.png、网页版 PNG 和 PDF。
