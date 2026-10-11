# 光圈科技实验室官网

光圈科技实验室的黑白静态官网，提供项目目录与筛选、成员墙、开发文档、资料下载及协作入口。

- 官网：https://aperturelab.space/
- 站内开发文档：https://aperturelab.space/docs/
- 项目状态：v4 已上线。成员墙目前为六个无名空白展示位。

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
