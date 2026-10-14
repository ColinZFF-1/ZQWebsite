# 案例 01｜昭桥 One-pager

这是一张按《案例图（One-pager）多图拼装方案》修订版落地的第一版示例案例图。

主题是“把 AI 接进企业营销内容流程”。由于工作区没有客户案例原文，本版不使用客户名称、真实编号或虚构业绩数字，价值区展示的是可验收交付物：工作流、内容资产和协作方法。

## 文件

- `build/caseA_zhaoqiao_onepager_2480x3508.png`：A4 打印母版
- `build/caseA_zhaoqiao_onepager_2480x3508_web.png`：网页 50% 版本
- `build/caseA_zhaoqiao_onepager_2480x3508.pdf`：A4 PDF
- `build/contact_sheet.png`：快速目检联络表
- `build/verify_report.txt`：自动验收结果
- `compose.py`：可复现拼装脚本
- `verify.py`：尺寸、安全边距和接缝基础检查

第一版只使用代码绘制的背景、图标、卡片、文字和演示二维码，没有加入 AI 内容插画。演示二维码目前指向 `https://example.com/zhaoqiao-demo`，拿到真实体验地址后在 `draw_demo_qr()` 中替换目标并重新生成即可。
