# 光圈科技实验室官网

光圈科技实验室的黑白静态官网，提供项目目录与筛选、成员墙、开发文档、资料下载及协作入口。

- 官网：https://aperturelab.space/
- GitHub 组织：https://github.com/tgai-aperturelab
- 源码仓库：https://github.com/tgai-aperturelab/aperturelab-site
- 站内开发文档：https://aperturelab.space/docs/
- 项目状态：多页面版本 v5。成员墙目前为六个无名空白展示位。

## 本地开发

需要 Node.js 22.13 或更新版本。构建使用 Node 内置模块，图标测试使用 sharp。

```sh
npm ci
npm run build
npm run check
npm test
npm run dev
```

打开 http://127.0.0.1:8765 。修改模板或数据后重新构建，再刷新浏览器。

## 修改入口

| 内容 | 文件 |
| --- | --- |
| 首页 | `src/index.template.html` |
| 站内开发文档 | `src/docs.template.html` |
| 项目目录 | `content/projects.json` |
| 成员墙 | `content/members.json` |
| 联系方式与二维码有效期 | `site.config.json` |
| 页面布局 | `public/assets/portal.css` |
| 基础样式与成员卡 | `public/assets/styles.css` |

完整说明见 [开发文档](docs/开发文档.md) 和 [贡献指南](CONTRIBUTING.md)。

## 提交与发布

Windows 下运行 `npm run package`，生成包含源码、静态网站 ZIP、开发文档及校验清单的交付包。默认流程为打包发送给负责人，由负责人决定发布；本仓库没有自动部署工作流，不需要提交 Cloudflare Token。

`public` 是构建产物及静态资源。历史部署记录、备份、凭据、依赖目录和无关社团资料不进入仓库。二维码已过期，替换时应使用真实新码。

## 许可证与素材

项目自有代码按 [MIT](LICENSE) 许可。第三方 Logo、品牌、二维码与相关素材不属于 MIT 代码授权范围，详见 [第三方素材说明](THIRD_PARTY_NOTICES.md)。本项目与 Valve Corporation 无关联，也不表示获得其认可。

## 页面路由

首页仅保留品牌与入口；独立页面为 /projects/、/members/、/resources/、/about/、/collaborate/、/contact/，开发文档为 /docs/。

二级页面由 src/pages.json 定义，内容在 src/pages/，公共布局为 src/page.template.html，共用页头页脚在 src/partials/。

## 技术要点与验证

- **零框架静态构建与渐进增强**：不依赖外部字体、CDN 或后端接口。`scripts/build.cjs` 仅使用 Node 内置模块读取 `site.config.json`、`content/*.json` 与 `src/` 模板，经 `scripts/projects.cjs`、`scripts/members.cjs` 校验与 HTML 转义后直出 `public/` 静态页、`sitemap.xml`、`robots.txt` 及 `public/assets/contact-config.js`；关闭 JavaScript 仍可浏览全部内容，前端原生 ES Modules（`public/assets/site.js`、`projects.js`、`members.js`）负责搜索筛选、菜单与二维码过期切换。
- **光圈刚体几何与交互**：`scripts/logo-leaves.cjs` 从 `source-assets/valve-aperture-science-original.svg` 派生八片固定叶片与支点，`public/assets/iris-geometry.js` 与 `iris-animation.js` 驱动刚体旋转动画，支持 hover、触控、键盘操作及减少动态效果。
- **静态校验（`npm run check`）**：`scripts/check.cjs` 检查所有构建后 HTML 无未渲染变量、无重复 `id`、无 `<form>`，校验全部站内路径与锚点、文件扩展名白名单，以及 `public/` 总大小不超过 1 MB。
- **单元测试（`npm test`）**：`scripts/*.test.mjs` 共 8 个文件、17 项 `node:test` 用例，覆盖页面路由、项目与成员数据校验/筛选、二维码北京时间过期判断、光圈刚体几何与交互动画，以及多尺寸透明 ICO 图标校验（`scripts/static-brand.test.mjs` 依赖 `sharp`）。
