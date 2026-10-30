# Runbook

## 环境前提

| 项 | 要求 | 校验命令 |
|---|---|---|
| Node.js | 25.x（本机实测） | `node --version` |
| npm | 11.x（本机实测） | `npm --version` |

## 命令

### 首次安装

```bash
npm install
```

- 预期输出：依赖安装完成并生成 `node_modules/`。
- 实测：2026-10-30 ✅ `npm install` 通过；`npm audit` 通过，0 vulnerabilities。

### 启动开发环境

```bash
npm run dev
```

- 预期输出：本地 Vite 服务地址。
- 实测：2026-10-30 ✅ 沙箱内监听端口被系统拦截；在沙箱外以 `http://127.0.0.1:4173/` 启动并通过浏览器核对。

> 直接双击 `index.html` 会绕过 Vite，导致 `/src/main.tsx` 无法被转换。请使用上面的命令，再访问 `http://127.0.0.1:4173/#/home`。

### 运行测试

```bash
npm run test
```

- 预期输出：测试通过。
- 实测：2026-10-30 ✅ `src/data/mock.test.ts` 的模板分类与关键词筛选测试通过。

### 构建

```bash
npm run build
```

- 预期输出：`dist/` 构建产物。
- 实测：2026-10-30 ✅ `npm run build` 通过。

### GitHub Pages 部署

```bash
git push origin main
gh run list --repo 494739635/nuomi --workflow deploy-pages.yml --limit 1
```

- 仓库：`https://github.com/494739635/nuomi`（公开）。
- Pages 地址：`https://494739635.github.io/nuomi/`。
- 触发条件：推送 `main` 后由 `.github/workflows/deploy-pages.yml` 构建并发布。
- 实测：2026-10-30 ✅ Pages `build_type=workflow`，最近一次 Actions run `success`；线上 HTTP 检查 `passed outside sandbox`（HTTP 200）。
