# activeContext.md

## 当前任务

- **任务**：参考 `https://nuomi.superdir.cn/#/home` 搭建首页前端原型。
- **目的**：让用户在本地先获得与参考产品一致的首页工作台体验。
- **分支 / 工作区**：`main`；当前为文档草案阶段。
- **head**：`12af56b`（文档草案提交）。

## 执行进度

- 已完成：读取项目规则；通过公开 HTML、JS、CSS 静态资源确认产品模块与品牌基线；建立项目文档骨架并提交 `12af56b`。
- 进行中：等待首页复刻 spec 确认。
- 卡在哪：Safari Computer Use 权限未授予，无法读取登录态页面截图。

## 下一步

1. 用户确认 `docs/specs/home-replica.md` 的范围。
2. 初始化 Vite 前端并实现 M1 首页结构。
3. 启动开发服务并进行桌面/窄屏验证。

## 未决问题与遗留风险

- 登录后首页是否包含账号专属项目、额度或团队信息，当前未知。
- 真实 AI 生成、上传和账号接口不在当前 spec 范围。

## 交接三要素

- **改了什么**：新增项目规则、架构、计划、runbook、交接状态和首页 spec 草案；文档草案提交为 `12af56b`。
- **验证情况**：`node --version`、`npm --version`、`git --version`、`git diff --cached --check` passed；构建 `not run — 尚未创建前端脚手架`。
- **遗留风险**：Safari 页面无法读取；spec 尚未确认。
