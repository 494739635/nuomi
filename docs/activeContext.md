# activeContext.md

## 当前任务

- **任务**：参考 `https://nuomi.superdir.cn/#/home` 搭建完整平台前端复刻。
- **目的**：让用户在本地获得覆盖首页、创作、画布、工作流、模板、广场、素材和账户模块的可操作产品面。
- **分支 / 工作区**：`main`；完整平台本地演示版已提交。
- **head**：`81243bb`（部署文档提交前基线；当前提交为其后续交接文档更新）。

## 执行进度

- 已完成：读取项目规则；通过公开 HTML、JS、CSS 静态资源确认平台路由、接口命名与品牌基线；建立项目文档骨架并提交 `12af56b`、`b55997c`。
- 已完成：Vite + React + TypeScript 脚手架、全局壳层、8 个模块路由、首页、AI 创作、React Flow 画布、工作流、模板/广场、素材和账户页面。
- 已完成：本地模拟前端覆盖 8 个产品路由；画布节点编辑、工作流执行、模板筛选、素材过滤与账户套餐页面均可演示。
- 已完成：GitHub Pages 公开部署，仓库为 `494739635/nuomi`，Pages 使用 GitHub Actions 构建。
- 进行中：Safari 登录态视觉校准；窄屏仅完成响应式样式实现，未完成独立截图验收。
- 已处理：补充 README，说明 `index.html` 必须由 Vite 服务运行，不能直接双击打开。
- 卡在哪：Safari Computer Use 权限未授予，无法读取登录态页面截图。

## 下一步

1. 用户开启 Computer Use 权限后，读取 Safari 登录态页面做视觉对齐。
2. 按 Safari 的真实页面结构补全差异较大的区块与字段。
3. 后续若需要真实 AI/账号/支付接口，另建 spec 并确认接入服务。

## 未决问题与遗留风险

- 登录后首页是否包含账号专属项目、额度或团队信息，当前未知。
- 真实 AI 生成、上传、账号、支付和对象存储接口需后续逐域接入，当前先做可验收本地演示。

## 交接三要素

- **改了什么**：新增本地完整平台前端、React Flow 画布、mock 数据、响应式样式、运行配置与模板过滤测试；补充 GitHub Pages workflow、Vite `/nuomi/` base path 与部署说明。
- **验证情况**：`npm test`（2 tests）、`npm run build`、`npm audit`（0 vulnerabilities）、公开仓库可见性、Pages 配置与 Actions 部署结果均 `passed`；线上 curl 检查 `passed outside sandbox`（HTTP 200）。
- **遗留风险**：Safari 页面无法读取，页面精确布局与登录态专属数据仍未知；当前页面使用本地模拟数据，不包含真实 AI/账号/支付服务。首次访问若遇缓存，等待 GitHub Pages CDN 刷新后重试。
