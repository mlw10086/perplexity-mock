/**
 * API配置
 * 根据环境自动切换API地址
 */

// 获取API基础URL
export const getApiUrl = () => {
  // 生产环境（Vercel）使用相对路径
  if (import.meta.env.PROD) {
    return '';  // 使用相对路径，API在同一域名下的/api路径
  }
  
  // 开发环境使用环境变量或默认localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:3001';
};

// API端点
export const API_ENDPOINTS = {
  // 音乐相关
  MUSIC_SEARCH: '/api/music/search',
  MUSIC_DETAIL: '/api/music/detail',
  
  // 状态监控
  STATUS_LIMITER: '/api/status/limiter',
  STATUS_CACHE: '/api/status/cache',
  STATUS_CACHE_HOT: '/api/status/cache/hot',
  
  // 缓存管理
  CACHE_CLEAR: '/api/cache/clear'
};

// 构建完整URL
export const buildApiUrl = (endpoint, params = {}) => {
  const baseUrl = getApiUrl();
  const url = new URL(endpoint, baseUrl || window.location.origin);
  
  // 添加查询参数
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
};

// API请求封装
export const apiRequest = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint, options.params);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
};

export default {
  getApiUrl,
  API_ENDPOINTS,
  buildApiUrl,
  apiRequest
};
