# AGENTS.md（精简版）

> 本文件已从上游 47KB 原文精简，减少 AI 代理每轮注入的 token。
> 原文完整备份：`docs/AGENTS-upstream-full.md`；发版历史见 `CHANGELOG.md`；架构真相源见 `docs/PRD.md`。
> ⚠️ 合并上游 AnvilWiki 模板更新时**必须保留本精简版**（已配置 git merge=ours 自动规则）。

## 项目
AnvilWiki（MIT 开源模板）fork：Astro 5 纯静态游戏 wiki → Cloudflare Pages（零 adapter、免费带宽）。

## 技术栈（已验证，勿轻易变更）
- Astro 5 `output:‘static’`；Content Layer API + `glob()` loader + Zod schema（`src/content.config.ts`；frontmatter 非法 = build 失败，category 是 z.enum 硬门禁）
- MDX `@astrojs/mdx` ^4.3.x（mdx 3.x 与 Astro 5.18 不兼容；mdx 7 需 astro 7）
- Tailwind 3 + shadcn 风格 CSS 变量；图标只用 lucide（astro-icon）；无 reddit 图标（用 globe）
- UI 只用 Astro 原生组件（.astro），禁引入 React/Vue/Svelte 运行时（ADR-002）
- i18n：Astro 内置，`prefixDefaultLocale:false`（英文无前缀；`/` 就是英文首页，禁止重定向到 /en/）
- pnpm 11 + Node 22 LTS（≥22.13）；构建白名单在 `pnpm-workspace.yaml` 的 `allowBuilds:`（pnpm 11 写法，不是 onlyBuiltDependencies；esbuild/sharp 需批准否则 build 失败）
- 部署 Cloudflare Pages：`pnpm build` → dist/。`wrangler.toml` 存在时它是 Pages env 唯一真相源，构建变量必须写 `[vars]` 段（dashboard 环境变量 UI 被忽略）

## 三层分离（核心设计原则，每次编辑遵守）
- 代码层 `src/pages`/`src/components`/`src/lib`：fork 一次，不逐游戏改
- 配置层 `src/config`、`src/i18n/routing.ts`、`globals.css`、`public/`：每个游戏改一次
- 内容层 `src/content`、`src/locales`：每个游戏全量替换
- 框架层零游戏特定字符串；改内容不碰框架代码，改配置不重写框架。

## 工程约束
1. UI 文案全走 `src/locales/<locale>.json`，组件不硬编码文字。
2. 主题色只改 4 个变量：`--brand`/`--brand-light`/`--brand-h`/`--brand-s`（`:root` 与 `.dark` 各 4 行；`--brand-text` 自动派生），其余一律 `var(--brand)`，禁硬编码 hex/rgba。
3. sitemap 扫描实际 MDX 文件生成 URL，不从配置数组生成。
4. 分类 key 三处一致：`navigation.ts` 的 `NAVIGATION_CONFIG[].key` = `en.json` 的 `nav.<key>` = `src/content/<locale>/<key>/` 目录名。**新分类先有文章再进 navigation**（空分类列表页 = thin content，自动 noindex 且不进 sitemap）。
5. 语言列表三处一致：`routing.ts` 的 locales = `src/locales/*.json` 文件 = `src/content/<locale>/` 目录。
6. 文章正文从 H2 起，不写 H1（ArticlePage 用 frontmatter `title` 渲染 H1）。
7. og:image / twitter:image 用绝对路径 `${SITE_URL}/...`。
8. 广告/评论组件 key 全走 env，空值 = 不渲染（保 Lighthouse 4×100 开箱契约），不硬编码、不加默认值。
9. 域名走 `SITE_URL` env（必须含 `https://`，裸域名构建报错），代码不写死域名。
10. UI 不用 emoji；图标用 lucide（astro-icon 或 inline SVG）。

## i18n 回退规则
- 文章详情页：语言版本缺失时回退英文（不 404），frontmatter 也回退。
- 列表页：不回退，显示空状态（`shared.noArticles`）。不对称是有意的。

## 广告
Google AdSense 3 广告位（Sticky/Sidebar/InContent），各一个 `<AdSenseSlot position="...">`；按位读 `PUBLIC_ADSENSE_SLOT_*` env，`PUBLIC_ADSENSE_CLIENT` 为空则整组件不渲染，loader 由 BaseLayout 条件注入。详见 `docs/PRD.md` §10。站点另有 Adsterra 代码，以实际接入为准。

## AI 生成内容规则（Conversational Authoring）
1. **写之前先读**：`docs/content-format.md`（字段表+正文规则）、`src/content.config.ts`（Zod 硬门禁）、`src/config/navigation.ts`、同类型现有文章一篇。
2. **frontmatter 硬规则**：`description` 40–165 字符；`title` ≤80 字符；正文首标题为 H2（问句形）；`summary` 40–60 词直接答案（Quick Answer 卡片 + AI Overviews 候选，≤400 字符）；`tags` 复用已有词表（grep `src/content/wiki/` 下 `tags:`）；未验证草稿加 `draft: true`；快更新游戏加 `gameVersion`。
3. **正文内链**：站内链接以 `/` 结尾（`trailingSlash:‘always’`）；非默认语言正文每个内链加语言前缀（`/ja/bosses/x/`）；每篇 ≥3 个内链（`check-content` 低于此会警告）。
4. **媒体密度**：每篇配封面 `image`（`src/assets/covers/`，1200×675，`pnpm gen-covers` 生成）；Boss 攻略 ≥1 视频（`<Video>` + frontmatter `videos`）+ 2–4 张 gallery 机制图；指南用 16:9 正文配图（`public/images/articles/`）。完整表格见 `docs/content-format.md`。
5. **组件词汇**（`~/components/...`）：CodeBlock / StatBar / Callout(info|tip|warn|danger) / Accordion / Video / AffiliateLink，以及 frontmatter 驱动的 boss 卡、codes（Active+Expired 自动拆分）、videos、gallery。
6. **验证**：写完跑 `pnpm check-content && pnpm build`，双绿才算完成。**禁止编造游戏事实**（兑换码、数值），缺数据问用户。
7. **Skill**：`.agent/skills/` 下有 anvil-new-article / anvil-batch-articles / anvil-update-codes / anvil-refresh / anvil-adsense-audit。

## 常用命令
```bash
pnpm install            # 首次安装
pnpm check-content      # 内容硬校验（frontmatter/内链/媒体）
pnpm check-i18n         # i18n 校验（--strict-ui 严格 UI key）
pnpm build              # 构建 dist/
pnpm gen-covers         # 生成 og 封面（1200×675）
pnpm submit-indexnow    # build+deploy 后推送 IndexNow
pnpm bulk-new-posts     # 按 new-posts.csv 批量建草稿（--dry-run 预览）
pnpm new-post           # 交互式 MDX 脚手架
pnpm template-audit     # 模板健康检查
```
其余 ops/refresh-audit/apply-template/gen-assets 等命令见原文备份或 docs/。

## Ops 工具包 `tools/anvil-ops/`（anvilwiki-ops）
独立 npm 包：运维 CLI（`anvil-ops`）+ MCP server。命令：doctor / metrics / audit / insights / submit（支持 `--site`，submit 拒绝 `--all`）。GSC + CF Web Analytics 均 env 门控（空=禁用）。**写操作一律：校验 → 分支 → PR，永不直接 push main**。该目录有自己的 `pnpm-workspace.yaml`（allowBuilds，勿删，否则 install 被根 workspace 劫持）。根 tsconfig/eslint 排除 `tools/`。

## 偏离前必须先问用户的决策
- 引入 JS 框架运行时（ADR-002 禁止）；Pages → Workers（ADR-003 默认 Pages）；改 MIT 协议；替换演示游戏 “Anvil Quest”。

## Astro 5 坑（均已实机验证，节省排障时间）
1. `getCollection()` 的 id 含 `.mdx`，`getEntry()` 传参必须去掉扩展名（`src/i18n/content.ts` 已处理）。
2. Content Layer 没有 `entry.render()`，用 `import { render } from 'astro:content'`。
3. `getStaticPaths()` 编译为独立模块，文件顶层 const 在其中不可见，数据必须内联进函数体。
4. rest 参数读 `Astro.params.slug`，不是 `Astro.props`。
5. MDX 直接放 `src/content/<locale>/` 会触发 legacy 自动 collection（弃用警告）；内容必须放 `src/content/wiki/<locale>/`。
6. `prefixDefaultLocale:false` ⇒ `/` 是英文首页，不重定向到 `/en/`。

## 流量统计（站点级资产，勿动）
- **ShipSole Plausible**：`src/components/layout/BaseLayout.astro` 中 plausible.shipsolo.io 的 `<script defer data-domain="thebloodof-dawnwalker.wiki">` 段。
- **禁止删除/修改**：任何 head 结构优化、性能优化、模板升级都必须保留此段，否则流量面板归零。
