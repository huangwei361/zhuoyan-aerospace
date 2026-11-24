# 逐焰航天 · 官网

> 纯静态单页官网 · 中英双语 · 无后端
> 线上地址：https://huangwei361.github.io/zhuoyan-aerospace/

## 结构

```
website/
├── index.html          首页（单页，锚点导航）
├── 404.html            404 页
├── robots.txt          爬虫策略
├── sitemap.xml         站点地图
├── css/styles.css      样式（深空主题 · 响应式）
├── js/main.js          交互（i18n 切换 / 导航 / 视差 / 滚动揭示）
└── assets/             图片（WebP）与 SVG 图表
```

## 区块

| # | 区块 | id |
|---|---|---|
| 1 | Hero | `#top` |
| 2 | 三大使命 | `#missions` |
| 3 | 蓝焰-1 发动机 | `#engine` |
| 4 | 卫星与数据 | `#data` |
| 5 | 中国超级航天港 | `#port` |
| 6 | 三年路线图 | `#roadmap` |
| 7 | 招贤 | `#careers` |
| 8 | 联系我们 | `#contact` |

## 改文案

**中文**直接改 `index.html`（已是内联的最终形态）。

**英文**改 `js/main.js` 里的 `I18N.en` 字典，键名与中文一一对应：

```js
I18N.en = {
  "hero.title1": "From one engine",
  ...
};
```

切换逻辑在 `applyLang()`：切英文用 `I18N.en` 覆盖 `innerHTML`，切回中文用 `I18N.zh` 还原。

> ⚠️ 不要再加 `display:none` 的 i18n CSS —— 中文是内联的，隐藏会导致 JS 未执行时整页无字。

## 换图片

1. 把新图放进 `assets/`（建议 WebP，≤ 2000px 宽）
2. 改 `index.html` 里的 `src`
3. 跑压缩脚本

## 本地预览

```bash
python -m http.server 8000
# 或双击 open-site.cmd
```

## 校验

```bash
python check_site.py    # i18n 键 / 资源 / 锚点 / 结构
python shoot.py         # Edge headless 截图（desktop/tablet/mobile）
```

## 部署

GitHub Pages，通过 `.github/workflows/deploy.yml` 自动发布。

## 联系方式占位

以下为占位信息，正式上线前需替换：

- `info@zhuoyan-aerospace.com`
- `+86 010-0000-0000`
- `北京市 · 海淀区 · 中关村`

## 合规

站内不出现任何外部公司、产品、人名、地名。
AI 生成的照片不含真实商标、标识或可识别人物特征。
公司处于筹备阶段，页脚已声明参数为规划量级、不构成承诺。
