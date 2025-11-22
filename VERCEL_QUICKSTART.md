# Vercel 快速部署指南

## 🎯 三步完成部署

### 步骤 1: 安装 Vercel CLI
```bash
npm install -g vercel
```

### 步骤 2: 登录
```bash
vercel login
```

### 步骤 3: 部署
```bash
# 预览部署
vercel

# 或生产部署
vercel --prod
```

## 🚀 自动化脚本

### Windows (PowerShell)
```bash
.\deploy.ps1
```

### Linux/Mac (Bash)
```bash
chmod +x deploy.sh
./deploy.sh
```

## 📦 部署内容

✅ **前端**: React + Vite 应用  
✅ **后端**: Serverless Functions (Express API)  
✅ **功能**: 
- 🔒 限流保护
- 💾 LRU缓存
- 📊 性能监控
- 🌐 全球CDN

## 🌐 部署后

访问你的应用：
```
https://your-app.vercel.app
```

测试API：
```bash
# 健康检查
curl https://your-app.vercel.app/api

# 搜索音乐
curl "https://your-app.vercel.app/api/music/search?name=告白气球"

# 查看缓存状态
curl https://your-app.vercel.app/api/status/cache
```

## 📚 完整文档

详细配置和故障排查请查看: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 💡 提示

- ✅ 首次部署约需 2-3 分钟
- ✅ 后续Git推送自动部署
- ✅ 每个PR自动创建预览环境
- ✅ 免费HTTPS证书

## 🔗 相关链接

- 📊 [Vercel Dashboard](https://vercel.com/dashboard)
- 📖 [Vercel文档](https://vercel.com/docs)
- 🎓 [Serverless Functions](https://vercel.com/docs/functions)

---

**部署遇到问题？** 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 的故障排查章节
