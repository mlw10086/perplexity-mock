#!/bin/bash

echo "🚀 开始部署到 Vercel..."
echo ""

# 检查是否安装了Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装"
    echo "📦 正在安装 Vercel CLI..."
    npm install -g vercel
fi

# 检查是否登录
echo "🔐 检查登录状态..."
if ! vercel whoami &> /dev/null; then
    echo "📝 请登录 Vercel..."
    vercel login
fi

# 构建测试
echo "🔨 测试本地构建..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

echo "✅ 构建成功!"
echo ""

# 询问部署类型
echo "📋 选择部署类型:"
echo "  1) 预览部署 (Preview)"
echo "  2) 生产部署 (Production)"
read -p "请选择 (1/2): " choice

case $choice in
    1)
        echo "🚀 开始预览部署..."
        vercel
        ;;
    2)
        echo "🚀 开始生产部署..."
        vercel --prod
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "✅ 部署完成!"
echo ""
echo "💡 提示:"
echo "  - 访问 Vercel Dashboard 查看部署详情"
echo "  - 查看日志: vercel logs <deployment-url>"
echo "  - 查看缓存状态: curl <your-url>/api/status/cache"
