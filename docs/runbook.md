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
- 实测：未验证（项目尚未创建 `package.json`）。

### 启动开发环境

```bash
npm run dev
```

- 预期输出：本地 Vite 服务地址。
- 实测：未验证。

### 运行测试

```bash
npm run test
```

- 预期输出：测试通过。
- 实测：未验证。

### 构建

```bash
npm run build
```

- 预期输出：`dist/` 构建产物。
- 实测：未验证。
