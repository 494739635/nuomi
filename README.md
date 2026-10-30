# 超级编导本地复刻

这是一个 Vite + React + TypeScript 单页应用。请通过本地开发服务器打开，不能从访达直接双击 `index.html`：入口引用了需要 Vite 转换的 `/src/main.tsx` 模块。

## 启动

```bash
npm install
npm run dev
```

然后打开终端输出的本地地址，默认是 `http://127.0.0.1:4173/#/home`。

生产构建使用 `npm run build`，构建产物位于 `dist/`；部署时也需要通过 HTTP 静态服务器托管 `dist/`，不要直接打开 `dist/index.html`。

本项目使用本地模拟数据，不需要登录、密钥或外部 API。

## GitHub Pages

公开部署地址：[https://494739635.github.io/nuomi/](https://494739635.github.io/nuomi/)
