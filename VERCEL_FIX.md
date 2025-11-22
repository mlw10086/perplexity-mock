# Vercel 路由修复说明

## 🔧 修复的问题

### 问题1: API路由404
**现象**: 访问 `/api/music/search` 返回404

**原因**: Vercel配置中没有正确指定Serverless Function的build配置

**解决方案**:
```json
{
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ]
}
```

### 问题2: 前端路由404
**现象**: 刷新 `/discover` 页面返回404

**原因**: SPA应用需要所有路由fallback到index.html

**解决方案**:
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 📝 新的 vercel.json 配置

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 路由规则说明

1. **`/api/(.*) → /api/index.js`**
   - 所有API请求路由到Serverless Function
   - 示例: `/api/music/search` → `api/index.js`

2. **`/assets/(.*) → /assets/$1`**
   - 静态资源直接访问
   - 示例: `/assets/logo.png` → `dist/assets/logo.png`

3. **`/(.*) → /index.html`**
   - 其他所有路由fallback到index.html
   - 示例: `/discover` → `dist/index.html`

## 🔄 部署后验证

### 测试API路由
```bash
# 测试搜索接口
curl "https://perplexity-mock.vercel.app/api/music/search?name=稻香&limit=50"

# 测试详情接口
curl "https://perplexity-mock.vercel.app/api/music/detail?id=123456&level=standard"

# 测试缓存状态
curl "https://perplexity-mock.vercel.app/api/status/cache"
```

### 测试前端路由
在浏览器中测试：
1. 访问 `https://perplexity-mock.vercel.app/discover`
2. 刷新页面（F5）
3. 应该正常显示，不是404

## 📊 Vercel构建流程

```
1. 检测 vercel.json
   ↓
2. 执行 builds
   - 构建 api/index.js 为 Serverless Function
   - 执行 npm run build（Vite构建前端）
   ↓
3. 部署资源
   - Serverless Function → Lambda
   - 前端静态文件 → CDN
   ↓
4. 配置路由规则
   - API路由 → Serverless Function
   - 其他路由 → index.html
```

## ⚡ 工作原理

### API请求流程
```
浏览器请求: /api/music/search
    ↓
Vercel路由: 匹配到 /api/(.*)
    ↓
转发到: api/index.js (Serverless Function)
    ↓
Express处理: 返回JSON数据
```

### 前端路由流程
```
浏览器请求: /discover
    ↓
Vercel路由: 匹配到 /(.*)
    ↓
返回: dist/index.html
    ↓
React Router: 客户端路由到 DiscoverPage
```

## 🎯 关键修改

### 1. api/index.js 导出方式
```javascript
// 修改前
export default app;

// 修改后
export default (req, res) => {
  return app(req, res);
};
```

这确保Express应用能被Vercel的Serverless环境正确调用。

### 2. src/pages/DiscoverPage.jsx API调用
```javascript
// 修改前
fetch(`http://localhost:3001/api/music/search?...`)

// 修改后
const apiUrl = getApiUrl();
fetch(`${apiUrl}/api/music/search?...`)
```

这确保开发和生产环境使用正确的API地址。

## 🐛 故障排查

### API仍然404
1. 检查Vercel构建日志
2. 确认 `api/index.js` 文件存在
3. 查看 Functions 标签页是否有部署

### 前端路由仍然404
1. 检查 `dist/index.html` 是否生成
2. 确认路由配置顺序（API路由要在fallback之前）
3. 清除浏览器缓存

### CORS错误
API已配置允许所有来源：
```javascript
app.use(cors({
  origin: '*'
}));
```

如需限制，修改 `api/index.js` 中的CORS配置。

## 📈 性能优化

Vercel会自动提供：
- ✅ Edge Caching
- ✅ Gzip压缩
- ✅ HTTP/2
- ✅ 全球CDN

建议：
- API响应添加适当的 `Cache-Control` 头
- 使用LRU缓存减少外部API调用
- 监控Serverless Function执行时间

## 🔗 相关文档

- [Vercel Configuration](https://vercel.com/docs/configuration)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [SPA Routing](https://vercel.com/docs/configuration#routes/spa)

---

**已推送到GitHub，Vercel会自动重新部署！**

等待2-3分钟后测试：https://perplexity-mock.vercel.app
