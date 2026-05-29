# TradeTally - 交易日志与分析平台

[English](README.md) | **简体中文**

[![Docker Pulls](https://img.shields.io/docker/pulls/potentialmidas/tradetally)](https://hub.docker.com/r/potentialmidas/tradetally)
[![License](https://img.shields.io/github/license/GeneBO98/tradetally)](https://github.com/GeneBO98/tradetally/blob/main/LICENSE)
[![GitHub Release](https://img.shields.io/github/v/release/GeneBO98/tradetally)](https://github.com/GeneBO98/tradetally/releases)

**用数据主导交易**

<img width="2801" height="2022" alt="SCR-20260313-knpu" src="https://github.com/user-attachments/assets/e66044ad-6405-4990-b0d7-2ac3f20609f8" />

TradeTally 是一款功能完整的交易日志与分析平台，采用 Vue.js 前端与 Node.js 后端构建。支持记录交易、分析绩效，并从多券商导入数据中洞察你的交易模式。

## 快速链接

- **在线演示**：[tradetally.io](https://tradetally.io)
- **文档**：[docs.tradetally.io](https://docs.tradetally.io)
- **论坛**：[forum.tradetally.io](https://forum.tradetally.io)
- **iOS 应用**：[App Store 下载](https://apps.apple.com/us/app/tradetally/id6748022992)
- **Docker Hub**：[potentialmidas/tradetally](https://hub.docker.com/r/potentialmidas/tradetally)

### 演示账号

- **用户名**：demo@example.com
- **密码**：DemoUser25

## 核心功能

### 交易日志与分析

- **多券商支持** — 从 Lightspeed、Charles Schwab、ThinkorSwim、IBKR、E*TRADE、ProjectX 等导入交易
- **期权与期货** — 完整支持期权、期货合约及专项分析
- **实时行情** — 实时报价与未实现盈亏跟踪
- **交易可视化** — 交互式 K 线图，标注进出场点位

### 分析与洞察

- **AI 驱动分析** — 基于 Google Gemini 的个性化交易建议
- **高级图表** — 按持仓时长、星期、行业等维度分析绩效
- **行为分析** — 报复性交易、过度自信等行为检测（Pro）
- **健康追踪** — 关联睡眠、心率等健康指标与交易表现（Pro）

### 市场与提醒

- **自选股** — 跟踪关注标的的实时价格与新闻（Pro）
- **价格提醒** — 目标价位邮件与浏览器通知（Pro）
- **新闻整合** — 自动为交易标的补充相关新闻
- **财报追踪** — 监控自选股即将发布的财报（Pro）

### 社区与成就

- **排行榜** — 追踪成就，与同行竞技
- **公开交易** — 分享交易、向社区学习
- **成就系统** — 解锁徽章、记录里程碑
- **论坛** — 参与讨论：[forum.tradetally.io](https://forum.tradetally.io)

### 移动应用

- **iOS 应用** — App Store 原生客户端
- 与 Web 端功能对齐
- 针对移动端优化的交易日志体验
- 健康追踪功能需使用 iOS 应用

## 部署方式

### SaaS 平台

全托管方案，访问 [tradetally.io](https://tradetally.io)

### 自托管

免费开源部署，包含全部 Pro 功能，适合：

- 注重隐私的用户
- 个人或团队使用
- 完全掌控自己的数据
- 无需订阅费用

**说明**：若要使用完整功能（实时报价、高级图表、行业分析等），需要 [Finnhub.io Basic 计划](https://finnhub.io/pricing)。免费套餐可用，但功能有限。

## 技术栈

**后端**：Node.js、Express、PostgreSQL  
**前端**：Vue.js 3、Tailwind CSS、Pinia  
**API**：Finnhub、Alpha Vantage、Google Gemini  
**基础设施**：Docker、Nginx

## 快速开始

详细安装与配置说明请见[官方文档](https://docs.tradetally.io)。

### 本地开发

TradeTally 使用 pnpm 管理依赖。安装 pnpm 后，在仓库根目录执行：

```bash
npm install -g pnpm@10.13.1
pnpm install
pnpm --dir backend run dev
pnpm --dir frontend run dev
```

### Docker 快速启动

```bash
docker pull potentialmidas/tradetally:latest
docker run -d -p 80:80 potentialmidas/tradetally:latest
```

生产环境部署请参阅 [Docker 部署指南](https://docs.tradetally.io/deployment/docker/)。

## 文档

完整文档见 [docs.tradetally.io](https://docs.tradetally.io)：

- [安装指南](https://docs.tradetally.io/getting-started/installation/)
- [快速入门](https://docs.tradetally.io/getting-started/quick-start/)
- [API 配置](https://docs.tradetally.io/getting-started/api-keys/)
- [Docker 部署](https://docs.tradetally.io/deployment/docker/)
- [导入交易](https://docs.tradetally.io/usage/importing-trades/)
- [功能指南](https://docs.tradetally.io/features/)

## 社区与支持

- **论坛**：加入 [TradeTally Discourse](https://forum.tradetally.io) — 若已有 tradetally.io 账号，可直接使用该账号登录
- **GitHub Issues**：报告 Bug 或提交功能建议
- **文档**：[docs.tradetally.io](https://docs.tradetally.io)
- **iOS TestFlight**：[加入 Beta 测试](https://testflight.apple.com/join/11shUY3t)

## 截图

<img width="2794" height="1498" alt="SCR-20260313-kodz" src="https://github.com/user-attachments/assets/05920745-4694-4ec2-aff3-baecb036ec44" />
<img width="2809" height="1558" alt="SCR-20260313-kogp" src="https://github.com/user-attachments/assets/5601b16d-64f7-47ac-987f-13fdae3f7794" />
<img width="1257" height="765" alt="SCR-20251016-inwc" src="https://github.com/user-attachments/assets/9e7697b5-39e2-4982-899b-ed5f4a781a30" />
<img width="1249" height="1320" alt="SCR-20251016-inyh" src="https://github.com/user-attachments/assets/55d893dd-fd82-49a4-9340-2496945e0844" />
<img width="1243" height="664" alt="SCR-20251016-iohf" src="https://github.com/user-attachments/assets/d0593bdd-e9d0-4d77-86bd-eda7b7c25e71" />
<img width="1242" height="867" alt="SCR-20251016-ioih" src="https://github.com/user-attachments/assets/8139d229-c1a8-4889-a7e1-2ab598611f24" />
<img width="1232" height="954" alt="SCR-20251016-iolb" src="https://github.com/user-attachments/assets/19be38eb-c2fa-40a4-843d-b38a5a1129cd" />
<img width="1301" alt="Leaderboards" src="https://github.com/user-attachments/assets/659c6bf8-4624-4cf1-bb27-0ec80a8dadc7" />
<img width="1320" alt="Achievements" src="https://github.com/user-attachments/assets/ea2266fe-72ee-4722-99be-f29f3930bdf5" />

## Star 历史

<a href="https://star-history.com/#GeneBO98/tradetally&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=GeneBO98/tradetally&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=GeneBO98/tradetally&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=GeneBO98/tradetally&type=Date" />
 </picture>
</a>

## 许可证

本项目为开源软件。

## 支持开发

若本项目对你有帮助，欢迎 [请我喝杯咖啡](https://buymeacoffee.com/BrennonO)。
