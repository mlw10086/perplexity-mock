/**
 * 并发请求限流器中间件
 * 支持多种限流策略：IP限流、全局限流、路径限流
 */

class RateLimiter {
  constructor(options = {}) {
    // 默认配置
    this.windowMs = options.windowMs || 60000; // 时间窗口，默认1分钟
    this.maxRequests = options.maxRequests || 100; // 最大请求数
    this.maxConcurrent = options.maxConcurrent || 50; // 最大并发数
    this.message = options.message || '请求过于频繁，请稍后再试';
    this.statusCode = options.statusCode || 429;
    this.skipSuccessfulRequests = options.skipSuccessfulRequests || false;
    this.skipFailedRequests = options.skipFailedRequests || false;
    
    // 存储请求记录
    this.requests = new Map(); // IP -> 请求时间戳数组
    this.concurrent = new Map(); // IP -> 当前并发数
    this.globalConcurrent = 0; // 全局当前并发数
  }

  /**
   * 清理过期的请求记录
   */
  cleanExpiredRequests(ip) {
    const now = Date.now();
    const records = this.requests.get(ip) || [];
    const validRecords = records.filter(time => now - time < this.windowMs);
    
    if (validRecords.length > 0) {
      this.requests.set(ip, validRecords);
    } else {
      this.requests.delete(ip);
    }
    
    return validRecords.length;
  }

  /**
   * 获取客户端IP
   */
  getClientIp(req) {
    return (
      req.ip ||
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.headers['x-real-ip'] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      'unknown'
    );
  }

  /**
   * 检查是否超过频率限制
   */
  isRateLimited(ip) {
    const requestCount = this.cleanExpiredRequests(ip);
    return requestCount >= this.maxRequests;
  }

  /**
   * 检查是否超过并发限制
   */
  isConcurrentLimited(ip) {
    const ipConcurrent = this.concurrent.get(ip) || 0;
    return ipConcurrent >= this.maxConcurrent || this.globalConcurrent >= this.maxConcurrent * 2;
  }

  /**
   * 增加并发计数
   */
  incrementConcurrent(ip) {
    const current = this.concurrent.get(ip) || 0;
    this.concurrent.set(ip, current + 1);
    this.globalConcurrent++;
  }

  /**
   * 减少并发计数
   */
  decrementConcurrent(ip) {
    const current = this.concurrent.get(ip) || 0;
    if (current > 0) {
      this.concurrent.set(ip, current - 1);
      if (current - 1 === 0) {
        this.concurrent.delete(ip);
      }
    }
    if (this.globalConcurrent > 0) {
      this.globalConcurrent--;
    }
  }

  /**
   * 记录请求
   */
  recordRequest(ip) {
    const records = this.requests.get(ip) || [];
    records.push(Date.now());
    this.requests.set(ip, records);
  }

  /**
   * 中间件函数
   */
  middleware() {
    return async (req, res, next) => {
      const ip = this.getClientIp(req);
      
      // 检查频率限制
      if (this.isRateLimited(ip)) {
        return res.status(this.statusCode).json({
          error: this.message,
          retryAfter: Math.ceil(this.windowMs / 1000)
        });
      }

      // 检查并发限制
      if (this.isConcurrentLimited(ip)) {
        return res.status(this.statusCode).json({
          error: '当前并发请求过多，请稍后再试',
          retryAfter: 5
        });
      }

      // 增加并发计数
      this.incrementConcurrent(ip);

      // 记录请求
      this.recordRequest(ip);

      // 监听响应结束事件，减少并发计数
      const originalEnd = res.end;
      let ended = false;

      res.end = function(...args) {
        if (!ended) {
          ended = true;
          // 减少并发计数
          this.decrementConcurrent(ip);
        }
        return originalEnd.apply(res, args);
      }.bind(this);

      // 处理连接关闭
      req.on('close', () => {
        if (!ended) {
          ended = true;
          this.decrementConcurrent(ip);
        }
      });

      next();
    };
  }

  /**
   * 获取当前状态
   */
  getStatus() {
    return {
      globalConcurrent: this.globalConcurrent,
      totalIPs: this.requests.size,
      concurrentIPs: this.concurrent.size,
      config: {
        windowMs: this.windowMs,
        maxRequests: this.maxRequests,
        maxConcurrent: this.maxConcurrent
      }
    };
  }

  /**
   * 重置限流器
   */
  reset() {
    this.requests.clear();
    this.concurrent.clear();
    this.globalConcurrent = 0;
  }
}

/**
 * 创建限流器实例
 */
export function createRateLimiter(options) {
  const limiter = new RateLimiter(options);
  return limiter.middleware();
}

/**
 * 创建限流器实例（带状态访问）
 */
export function createRateLimiterWithStatus(options) {
  const limiter = new RateLimiter(options);
  return {
    middleware: limiter.middleware(),
    getStatus: () => limiter.getStatus(),
    reset: () => limiter.reset(),
    limiter
  };
}

export default RateLimiter;
