import express from 'express';
import cors from 'cors';
import { createRateLimiter, createRateLimiterWithStatus } from './middleware/rateLimiter.js';
import LRUCache, { createCacheMiddleware, startCacheCleanup } from './middleware/lruCache.js';

const app = express();
const PORT = 3001;

// 创建限流器实例
const globalLimiter = createRateLimiterWithStatus({
  windowMs: 60000, // 1分钟
  maxRequests: 200, // 每分钟最多200个请求
  maxConcurrent: 50, // 最大并发50
  message: '请求过于频繁，请稍后再试'
});

const apiLimiter = createRateLimiter({
  windowMs: 60000, // 1分钟
  maxRequests: 100, // 每分钟最多100个请求
  maxConcurrent: 30, // 最大并发30
  message: 'API请求过于频繁，请稍后再试'
});

const strictLimiter = createRateLimiter({
  windowMs: 60000, // 1分钟
  maxRequests: 50, // 每分钟最多50个请求
  maxConcurrent: 10, // 最大并发10
  message: '请求过于频繁，请降低请求频率'
});

// 创建LRU缓存实例
const searchCache = new LRUCache({
  capacity: 500,           // 最多缓存500个搜索结果
  ttl: 10 * 60 * 1000     // 缓存10分钟
});

const detailCache = new LRUCache({
  capacity: 1000,          // 最多缓存1000个音乐详情
  ttl: 30 * 60 * 1000     // 缓存30分钟
});

// 启动定期清理
startCacheCleanup(searchCache, 5 * 60 * 1000); // 每5分钟清理一次
startCacheCleanup(detailCache, 10 * 60 * 1000); // 每10分钟清理一次

// 创建缓存中间件
const searchCacheMiddleware = createCacheMiddleware(
  searchCache,
  (req) => `search:${req.query.name}:${req.query.limit || 50}`
);

const detailCacheMiddleware = createCacheMiddleware(
  detailCache,
  (req) => `detail:${req.query.id}:${req.query.level || 'standard'}`
);

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const method = req.method;
    const url = req.url;
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    
    console.log(`[${timestamp}] ${ip} - ${method} ${url} - ${status} (${duration}ms)`);
    
    // 警告慢请求
    if (duration > 5000) {
      console.warn(`⚠️  慢请求警告: ${method} ${url} 耗时 ${duration}ms`);
    }
    
    // 警告错误响应
    if (status >= 400) {
      console.warn(`❌ 错误响应: ${method} ${url} - ${status}`);
    }
  });
  
  next();
});

// 全局限流器
app.use(globalLimiter.middleware);

// 限流器状态监控接口
app.get('/api/status/limiter', (req, res) => {
  const status = globalLimiter.getStatus();
  res.json({
    success: true,
    data: {
      ...status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  });
});

// 缓存状态监控接口
app.get('/api/status/cache', (req, res) => {
  res.json({
    success: true,
    data: {
      searchCache: searchCache.getStats(),
      detailCache: detailCache.getStats(),
      timestamp: new Date().toISOString()
    }
  });
});

// 缓存热门项接口
app.get('/api/status/cache/hot', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  res.json({
    success: true,
    data: {
      searchCache: searchCache.getHotItems(limit),
      detailCache: detailCache.getHotItems(limit)
    }
  });
});

// 清空缓存接口（需要认证，这里简化处理）
app.post('/api/cache/clear', (req, res) => {
  const { type } = req.body;
  
  if (type === 'search' || type === 'all') {
    searchCache.clear();
  }
  
  if (type === 'detail' || type === 'all') {
    detailCache.clear();
  }
  
  res.json({
    success: true,
    message: `缓存已清空: ${type || 'all'}`
  });
});

// 音乐搜索接口（应用缓存和限流器）
app.get('/api/music/search', searchCacheMiddleware, apiLimiter, async (req, res) => {
  try {
    const { name, limit = 50 } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: '歌曲名称不能为空' });
    }

    const url = `https://api.kxzjoker.cn/api/163_search?name=${encodeURIComponent(name)}&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    
    // 去除 tips 字段
    const { tips, ...filteredData } = data;
    
    res.json(filteredData);
  } catch (error) {
    console.error('音乐搜索错误:', error);
    res.status(500).json({ error: '搜索失败' });
  }
});

// 获取音乐详情接口（应用缓存和限流器）
app.get('/api/music/detail', detailCacheMiddleware, apiLimiter, async (req, res) => {
  try {
    const { id, level = 'standard', type = 'json' } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: '音乐ID不能为空' });
    }

    // 构建网易云音乐链接
    const musicUrl = `https://y.music.163.com/m/song?id=${id}`;
    const url = `https://api.kxzjoker.cn/api/163_music?url=${encodeURIComponent(musicUrl)}&level=${level}&type=${type}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    res.json(data);
  } catch (error) {
    console.error('获取音乐详情错误:', error);
    res.status(500).json({ error: '获取音乐详情失败' });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 服务器启动成功!`);
  console.log(`📍 地址: http://localhost:${PORT}`);
  console.log(`\n📊 限流配置:`);
  console.log(`   - 全局限流: ${globalLimiter.limiter.maxRequests}次/分钟, ${globalLimiter.limiter.maxConcurrent}并发`);
  console.log(`   - API限流: 100次/分钟, 30并发`);
  console.log(`\n💾 缓存配置:`);
  console.log(`   - 搜索缓存: ${searchCache.capacity}项, TTL ${searchCache.ttl / 1000}秒`);
  console.log(`   - 详情缓存: ${detailCache.capacity}项, TTL ${detailCache.ttl / 1000}秒`);
  console.log(`\n📈 监控接口:`);
  console.log(`   - 限流状态: GET /api/status/limiter`);
  console.log(`   - 缓存状态: GET /api/status/cache`);
  console.log(`   - 热门缓存: GET /api/status/cache/hot`);
  console.log(`\n✅ 准备就绪!\n`);
});
