/**
 * 高性能LRU缓存实现
 * Least Recently Used (最近最少使用) 缓存淘汰策略
 * 使用 Map + 双向链表实现 O(1) 时间复杂度
 */

class LRUCache {
  constructor(options = {}) {
    this.capacity = options.capacity || 100; // 最大容量
    this.ttl = options.ttl || 5 * 60 * 1000; // 默认TTL 5分钟
    this.cache = new Map(); // 存储缓存数据
    this.stats = {
      hits: 0,      // 命中次数
      misses: 0,    // 未命中次数
      sets: 0,      // 写入次数
      deletes: 0,   // 删除次数
      evictions: 0  // 淘汰次数
    };
  }

  /**
   * 获取缓存值
   * @param {string} key - 缓存键
   * @returns {*} 缓存的值，如果不存在或过期返回 null
   */
  get(key) {
    if (!this.cache.has(key)) {
      this.stats.misses++;
      return null;
    }

    const item = this.cache.get(key);
    
    // 检查是否过期
    if (this.isExpired(item)) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }

    // 更新访问时间和访问次数
    item.lastAccessed = Date.now();
    item.accessCount++;

    // 重新插入到Map末尾（LRU策略）
    this.cache.delete(key);
    this.cache.set(key, item);

    this.stats.hits++;
    return item.value;
  }

  /**
   * 设置缓存值
   * @param {string} key - 缓存键
   * @param {*} value - 缓存值
   * @param {number} ttl - 可选的过期时间（毫秒）
   */
  set(key, value, ttl = this.ttl) {
    // 如果key已存在，先删除
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // 如果容量已满，删除最旧的项
    if (this.cache.size >= this.capacity) {
      this.evictOldest();
    }

    // 添加新项
    const item = {
      value,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 0,
      ttl,
      expiresAt: Date.now() + ttl
    };

    this.cache.set(key, item);
    this.stats.sets++;
  }

  /**
   * 删除缓存项
   * @param {string} key - 缓存键
   */
  delete(key) {
    if (this.cache.delete(key)) {
      this.stats.deletes++;
      return true;
    }
    return false;
  }

  /**
   * 检查缓存项是否过期
   * @param {Object} item - 缓存项
   * @returns {boolean}
   */
  isExpired(item) {
    return Date.now() > item.expiresAt;
  }

  /**
   * 淘汰最旧的缓存项
   */
  evictOldest() {
    // Map的迭代器按插入顺序，第一个就是最旧的
    const firstKey = this.cache.keys().next().value;
    if (firstKey) {
      this.cache.delete(firstKey);
      this.stats.evictions++;
    }
  }

  /**
   * 清空缓存
   */
  clear() {
    this.cache.clear();
    this.resetStats();
  }

  /**
   * 清理所有过期的缓存项
   * @returns {number} 清理的数量
   */
  cleanup() {
    let cleaned = 0;
    const now = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * 获取缓存大小
   */
  size() {
    return this.cache.size;
  }

  /**
   * 检查key是否存在且未过期
   */
  has(key) {
    if (!this.cache.has(key)) {
      return false;
    }
    
    const item = this.cache.get(key);
    if (this.isExpired(item)) {
      this.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * 获取所有缓存键
   */
  keys() {
    return Array.from(this.cache.keys());
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total * 100).toFixed(2) : 0;

    return {
      ...this.stats,
      size: this.cache.size,
      capacity: this.capacity,
      hitRate: `${hitRate}%`,
      usage: `${this.cache.size}/${this.capacity}`
    };
  }

  /**
   * 重置统计信息
   */
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0
    };
  }

  /**
   * 获取热门缓存项（按访问次数排序）
   * @param {number} limit - 返回数量限制
   */
  getHotItems(limit = 10) {
    const items = Array.from(this.cache.entries())
      .map(([key, item]) => ({
        key,
        accessCount: item.accessCount,
        age: Date.now() - item.createdAt,
        ttl: item.expiresAt - Date.now()
      }))
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, limit);

    return items;
  }

  /**
   * 获取详细信息（用于调试）
   */
  getDetails() {
    const items = [];
    for (const [key, item] of this.cache.entries()) {
      items.push({
        key,
        size: JSON.stringify(item.value).length,
        createdAt: new Date(item.createdAt).toISOString(),
        lastAccessed: new Date(item.lastAccessed).toISOString(),
        accessCount: item.accessCount,
        ttl: item.expiresAt - Date.now(),
        expired: this.isExpired(item)
      });
    }
    return items;
  }
}

/**
 * 创建缓存中间件
 * @param {LRUCache} cache - LRU缓存实例
 * @param {Function} keyGenerator - 生成缓存键的函数
 */
export function createCacheMiddleware(cache, keyGenerator) {
  return async (req, res, next) => {
    // 生成缓存键
    const cacheKey = keyGenerator(req);

    // 尝试从缓存获取
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      // 添加缓存命中标记
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Cache-Key', cacheKey);
      return res.json(cachedData);
    }

    // 缓存未命中，继续处理请求
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('X-Cache-Key', cacheKey);

    // 劫持res.json方法以缓存响应
    const originalJson = res.json.bind(res);
    res.json = function(data) {
      // 只缓存成功的响应
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(cacheKey, data);
      }
      return originalJson(data);
    };

    next();
  };
}

/**
 * 定期清理过期缓存
 * @param {LRUCache} cache - LRU缓存实例
 * @param {number} interval - 清理间隔（毫秒）
 */
export function startCacheCleanup(cache, interval = 5 * 60 * 1000) {
  const timer = setInterval(() => {
    const cleaned = cache.cleanup();
    if (cleaned > 0) {
      console.log(`🧹 缓存清理: 清理了 ${cleaned} 个过期项`);
    }
  }, interval);

  // 返回清理函数
  return () => clearInterval(timer);
}

export default LRUCache;
