# AGENTS.md

## 项目是什么

复刻“超级编导”完整产品面的前端原型，面向需要使用 AI 商品视频创作工具的内容运营人员。当前阶段为探索，按产品壳层、创作核心、内容资产和账户域分阶段实现；真实 AI 生成、账号、支付与后端接口按域逐步接入。

## 快速命令

| 操作 | 命令 |
|---|---|
| 安装依赖 | `npm install` |
| 启动开发 | `npm run dev` |
| 运行测试 | `npm run test` |
| 构建 | `npm run build` |

完整实测命令见 `docs/runbook.md`。

## 目录结构

```
src/       # 页面与交互
public/    # 静态资源
docs/      # 计划、spec、运行与交接文档
```

## 必读文档

1. `docs/activeContext.md`
2. `docs/plan.md`
3. `docs/runbook.md`
4. `docs/architecture.md`
5. `docs/specs/platform-replica.md`

## 新功能工作流

跨文件行为变更先更新 spec，经用户确认后再写代码。任务清单是唯一进度源；每项任务应能在半天内完成并用一条命令或一次操作判定。

## 硬规则

- 禁止提交密钥、token、密码或 `.env`。
- 只改当前完整平台复刻范围，不顺手接入未规划的真实账号、支付或 AI 服务。
- 参考站内容只用于视觉与交互研究，项目不复制其后端数据或用户隐私。
- 行为结论写入文档时标注证据等级；未知内容不写成事实。

## 完成定义

- [ ] `npm run build` 通过。
- [ ] 首页关键交互可在本地开发服务中操作。
- [ ] spec 任务清单与代码一致。
- [ ] `docs/activeContext.md` 含改动、验证结论、遗留风险与 head sha。

## 交接协议

会话结束前清理工作区或在 activeContext 记录未提交文件，更新三要素和 head sha。验证只使用 `passed`、`passed outside sandbox`、`not run — 原因`、`expected to pass, unverified`。
