# Vercel 部署指南

## 🚀 快速开始

### 方式一：通过 Vercel CLI 部署（推荐）

1. **安装 Vercel CLI**
```bash
npm install -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
# 在项目根目录执行
vercel

# 或直接部署到生产环境
vercel --prod
```

4. **跟随CLI提示配置项目**
   - Set up and deploy? **Y**
   - Which scope? 选择你的账户
   - Link to existing project? **N** (首次部署)
   - What's your project's name? 输入项目名称
   - In which directory is your code located? **./** 
   - Want to override settings? **N**

### 方式二：通过 Vercel Dashboard 部署

1. **访问 Vercel**
   - 前往 [vercel.com](https://vercel.com)
   - 使用 GitHub/GitLab/Bitbucket 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择你的 Git 仓库
   - 点击 "Import"

3. **配置项目**
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成（通常 2-3 分钟）

## 📁 项目结构

```
perplexity-dashboard/
├── api/                      # Vercel Serverless Functions
│   └── index.js             # API路由处理
├── server/                   # 本地开发服务器
│   ├── middleware/          # 中间件（限流器、缓存）
│   └── index.js            # 本地Express服务器
├── src/                     # 前端源码
│   ├── components/
│   ├── pages/
│   └── config/
│       └── api.js          # API配置（自动适配环境）
├── dist/                    # 构建输出（自动生成）
├── vercel.json             # Vercel配置
├── .vercelignore           # 部署忽略文件
└── package.json
```

## ⚙️ 配置说明

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### 环境变量（可选）

在 Vercel Dashboard 中设置环境变量：

1. 进入项目 Settings → Environment Variables
2. 添加以下变量：

```
# 如果需要自定义配置
NODE_ENV=production
```

## 🔄 自动部署

### Git 集成自动部署

1. **连接 Git 仓库**
   - 在 Vercel Dashboard 中关联你的 Git 仓库

2. **自动部署触发**
   - `main` 分支推送 → 生产环境部署
   - 其他分支推送 → 预览环境部署
   - Pull Request → 自动创建预览

3. **部署通知**
   - 每次部署会收到邮件通知
   - 可在 Vercel Dashboard 查看部署历史

## 🌐 API 路由

部署后，API 路由会自动映射：

```
本地开发:
http://localhost:3001/api/music/search

Vercel部署:
https://your-app.vercel.app/api/music/search
```

### 可用端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api` | GET | 健康检查 |
| `/api/music/search` | GET | 搜索音乐 |
| `/api/music/detail` | GET | 获取音乐详情 |
| `/api/status/limiter` | GET | 限流器状态 |
| `/api/status/cache` | GET | 缓存状态 |
| `/api/status/cache/hot` | GET | 热门缓存 |
| `/api/cache/clear` | POST | 清空缓存 |

## 🔧 本地开发 vs Vercel部署

### 本地开发
```bash
# 启动前端和后端
npm run dev:all

# 前端: http://localhost:5173
# 后端: http://localhost:3001
```

### Vercel部署
- 前端和API都在同一域名下
- API通过 `/api/*` 路由访问
- 自动HTTPS支持
- 全球CDN加速

## 📊 性能优化

### 已启用功能

✅ **限流保护**
- 全局限流: 300次/分钟, 100并发
- API限流: 150次/分钟, 50并发

✅ **LRU缓存**
- 搜索缓存: 200项, TTL 5分钟
- 详情缓存: 500项, TTL 15分钟
- ⚠️ 注意：Serverless环境缓存在冷启动时会重置

✅ **自动优化**
- 代码分割
- Tree Shaking
- 资源压缩
- 图片优化

### Vercel自带功能

✅ **全球CDN**
- 自动边缘缓存
- 最近节点响应

✅ **自动HTTPS**
- 免费SSL证书
- 自动续期

✅ **性能监控**
- 实时分析面板
- Core Web Vitals

## 🐛 故障排查

### 部署失败

**问题**: 构建错误
```bash
# 解决方案
1. 检查 package.json 依赖是否完整
2. 本地运行 npm run build 测试
3. 查看 Vercel 构建日志
```

**问题**: API 404错误
```bash
# 解决方案
1. 确认 api/index.js 文件存在
2. 检查 vercel.json 路由配置
3. 重新部署项目
```

### API 请求失败

**问题**: CORS 错误
```javascript
// api/index.js 已配置CORS，允许所有来源
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
```

**问题**: 外部API超时
```bash
# Vercel Serverless Functions 默认超时: 10秒
# Hobby计划: 10秒
# Pro计划: 60秒
# Enterprise计划: 900秒
```

### 冷启动问题

Serverless Functions 可能会遇到冷启动（~1-3秒）

**优化方案**:
1. 升级到 Pro 计划（减少冷启动）
2. 使用预热请求保持函数热启动
3. 考虑关键API使用专用服务器

## 📈 监控和日志

### 查看日志
```bash
# 通过CLI查看实时日志
vercel logs your-deployment-url

# 或在 Vercel Dashboard 查看
Settings → Functions → View Logs
```

### 性能监控
```bash
# 访问监控面板
https://vercel.com/your-username/your-project/analytics
```

### 缓存状态
```bash
# 查看缓存统计
curl https://your-app.vercel.app/api/status/cache

# 查看限流状态
curl https://your-app.vercel.app/api/status/limiter
```

## 🔒 安全建议

1. **API密钥保护**
   - 使用 Vercel 环境变量存储敏感信息
   - 不要在代码中硬编码API密钥

2. **速率限制**
   - 已启用全局和API级别限流
   - 可根据需求调整配置

3. **CORS配置**
   - 生产环境建议限制允许的域名
   - 修改 `api/index.js` 中的CORS设置

## 🎯 自定义域名

1. **添加域名**
   - Vercel Dashboard → Settings → Domains
   - 输入你的域名

2. **配置DNS**
   ```
   类型: CNAME
   名称: www (或其他子域名)
   值: cname.vercel-dns.com
   ```

3. **自动HTTPS**
   - Vercel 会自动配置SSL证书
   - 通常在几分钟内生效

## 💰 费用说明

### Hobby 计划（免费）
- ✅ 无限部署
- ✅ 100GB 带宽/月
- ✅ 自动HTTPS
- ✅ 预览部署
- ⚠️ Serverless Functions: 10秒超时

### Pro 计划（$20/月）
- ✅ Hobby所有功能
- ✅ 1TB 带宽/月
- ✅ 60秒超时
- ✅ 更快的构建
- ✅ 优先支持

## 🔗 有用链接

- [Vercel 文档](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Serverless Functions](https://vercel.com/docs/functions)
- [环境变量](https://vercel.com/docs/environment-variables)

## ✅ 部署检查清单

部署前确认：

- [ ] `npm run build` 本地构建成功
- [ ] 所有依赖已添加到 `package.json`
- [ ] API路由测试通过
- [ ] 环境变量已配置
- [ ] Git仓库已推送
- [ ] `.vercelignore` 已配置
- [ ] `vercel.json` 配置正确

## 🎉 完成！

部署成功后，你会得到：
- 🌐 生产环境URL
- 🔄 自动部署（Git推送）
- 📊 性能监控
- 🔒 HTTPS支持
- 🚀 全球CDN

访问你的应用：`https://your-app.vercel.app`

---

如有问题，请查看 [Vercel文档](https://vercel.com/docs) 或提交 Issue。
