# AGENTS.md（极简单）—— 只留安全红线，细节见 docs/AGENTS-project-full.md
# 合并上游模板更新时必须保留本文件（git merge=ours 已配置）

## 令牌（config.toml 每轮自动注入，勿索要）
- GitHub PAT = env GH_TOKEN；Cloudflare Token = env CLOUDFLARE_API_TOKEN

## 进程安全铁律（血泪教训）
- 禁止按进程名/命令行模糊匹配批量杀 node 进程（会杀 Codex 自身终端助手，误杀后本会话命令永久不可用）。
- 杀 dev/preview 服务器必须按 PID：netstat -ano | findstr :端口 → Stop-Process -Id <PID> -Force。
- 终端助手已挂（helper_unknown_error）时不要重试 exec，立即告知用户重开对话。

## 建仓铁律
- git clone / git init 必须 require_escalated 提权执行；日常读写/构建/部署走沙箱。

## 内容硬规则（写页面必须遵守）
- frontmatter：description 40-165 字符；title ≤80；summary 40-60 词；tags 复用现有词表。
- 正文从 H2 起（不写 H1）；每篇 ≥3 个内链，站内链接以 / 结尾。
- 每篇配封面，新文章 image 留空跑 pnpm gen-covers。
- 禁止编造游戏事实；查不到的标 community verification in progress。
- 已上线页面 TDK 冻结：只改正文/加内链/加新页，不改 title/description/URL。

## 站点资产勿动
- BaseLayout.astro 中 plausible.shipsolo.io 统计段，删除/修改会让流量面板归零。

## 验证与命令
- 写完跑 pnpm check-content && pnpm build，双绿才算完成。
- 部署：pnpm build → dist/（Cloudflare Pages）；push 用 -c http.sslBackend=openssl。
- 完整技术栈/工程约束/Astro 坑/工具包：docs/AGENTS-project-full.md 或 docs/PRD.md，需要时再读。
