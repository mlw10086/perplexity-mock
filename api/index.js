/**
 * Vercel Serverless Function
 * 将Express应用适配为Vercel Serverless Functions
 */

import express from 'express';
import cors from 'cors';
import { createRateLimiter, createRateLimiterWithStatus } from '../server/middleware/rateLimiter.js';
import LRUCache, { createCacheMiddleware } from '../server/middleware/lruCache.js';

const app = express();

// 创建限流器实例（Serverless环境使用更宽松的配置）
const globalLimiter = createRateLimiterWithStatus({
  windowMs: 60000,
  maxRequests: 300,
  maxConcurrent: 100,
  message: '请求过于频繁，请稍后再试'
});

const apiLimiter = createRateLimiter({
  windowMs: 60000,
  maxRequests: 150,
  maxConcurrent: 50,
  message: 'API请求过于频繁，请稍后再试'
});

// 创建缓存实例（注意：Serverless环境缓存会在函数冷启动时重置）
const searchCache = new LRUCache({
  capacity: 200,
  ttl: 5 * 60 * 1000  // 5分钟
});

const detailCache = new LRUCache({
  capacity: 500,
  ttl: 15 * 60 * 1000  // 15分钟
});

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
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 全局限流
app.use(globalLimiter.middleware);

// 健康检查
app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Perplexity API - Vercel Serverless',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 限流器状态
app.get('/api/status/limiter', (req, res) => {
  const status = globalLimiter.getStatus();
  res.json({
    success: true,
    data: {
      ...status,
      timestamp: new Date().toISOString(),
      environment: 'vercel-serverless'
    }
  });
});

// 缓存状态
app.get('/api/status/cache', (req, res) => {
  res.json({
    success: true,
    data: {
      searchCache: searchCache.getStats(),
      detailCache: detailCache.getStats(),
      timestamp: new Date().toISOString(),
      note: 'Serverless环境缓存在冷启动时会重置'
    }
  });
});

// 缓存热门项
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

// 清空缓存
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

// 音乐搜索接口
app.get('/api/music/search', searchCacheMiddleware, apiLimiter, async (req, res) => {
  try {
    const { name, limit = 50 } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: '歌曲名称不能为空' });
    }

    const url = `https://api.kxzjoker.cn/api/163_search?name=${encodeURIComponent(name)}&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    
    const { tips, ...filteredData } = data;
    
    res.json(filteredData);
  } catch (error) {
    console.error('音乐搜索错误:', error);
    res.status(500).json({ error: '搜索失败' });
  }
});

// 音乐详情接口
app.get('/api/music/detail', detailCacheMiddleware, apiLimiter, async (req, res) => {
  try {
    const { id, level = 'standard', type = 'json' } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: '音乐ID不能为空' });
    }

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

// 404处理
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    message: '请求的API端点不存在'
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : '服务器内部错误'
  });
});

// 导出为Vercel Serverless Function
// Vercel需要一个处理函数，而不是Express实例
export default (req, res) => {
  // 让Express处理请求
  return app(req, res);
};
