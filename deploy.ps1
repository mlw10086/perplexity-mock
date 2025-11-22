# PowerShell 部署脚本

Write-Host "🚀 开始部署到 Vercel..." -ForegroundColor Green
Write-Host ""

# 检查是否安装了Vercel CLI
try {
    $null = Get-Command vercel -ErrorAction Stop
} catch {
    Write-Host "❌ Vercel CLI 未安装" -ForegroundColor Red
    Write-Host "📦 正在安装 Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# 检查是否登录
Write-Host "🔐 检查登录状态..." -ForegroundColor Yellow
try {
    $null = vercel whoami 2>&1
} catch {
    Write-Host "📝 请登录 Vercel..." -ForegroundColor Yellow
    vercel login
}

# 构建测试
Write-Host "🔨 测试本地构建..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 构建失败，请检查错误信息" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 构建成功!" -ForegroundColor Green
Write-Host ""

# 询问部署类型
Write-Host "📋 选择部署类型:" -ForegroundColor Cyan
Write-Host "  1) 预览部署 (Preview)"
Write-Host "  2) 生产部署 (Production)"
$choice = Read-Host "请选择 (1/2)"

switch ($choice) {
    1 {
        Write-Host "🚀 开始预览部署..." -ForegroundColor Green
        vercel
    }
    2 {
        Write-Host "🚀 开始生产部署..." -ForegroundColor Green
        vercel --prod
    }
    default {
        Write-Host "❌ 无效选择" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ 部署完成!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 提示:" -ForegroundColor Cyan
Write-Host "  - 访问 Vercel Dashboard 查看部署详情"
Write-Host "  - 查看日志: vercel logs <deployment-url>"
Write-Host "  - 查看缓存状态: Invoke-RestMethod <your-url>/api/status/cache"
