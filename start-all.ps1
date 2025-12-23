# 微前端项目启动脚本

Write-Host "正在启动微前端项目..." -ForegroundColor Green
Write-Host ""

# 检查 Node.js 是否安装
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "错误: 未检测到 Node.js，请先安装 Node.js" -ForegroundColor Red
    exit 1
}

# 检测使用的包管理器
$usesPnpm = Test-Path "$PSScriptRoot\pnpm-workspace.yaml"
$runCmd = if ($usesPnpm) { "pnpm run dev" } else { "npm run dev" }

Write-Host "使用包管理器: $(if ($usesPnpm) { 'pnpm' } else { 'npm' })" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. 启动微应用1 (端口 8081)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\micro-app1'; Write-Host '微应用1 启动中...' -ForegroundColor Cyan; $runCmd"

Start-Sleep -Seconds 2

Write-Host "2. 启动微应用2 (端口 8082)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\micro-app2'; Write-Host '微应用2 启动中...' -ForegroundColor Cyan; $runCmd"

Start-Sleep -Seconds 2

Write-Host "3. 启动主应用 (端口 8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\main-app'; Write-Host '主应用启动中...' -ForegroundColor Cyan; $runCmd"

Write-Host ""
Write-Host "所有应用正在启动，请稍候..." -ForegroundColor Green
Write-Host ""
Write-Host "访问地址:" -ForegroundColor Cyan
Write-Host "  主应用:   http://localhost:8080" -ForegroundColor White
Write-Host "  微应用1:  http://localhost:8081" -ForegroundColor White
Write-Host "  微应用2:  http://localhost:8082" -ForegroundColor White
Write-Host ""
Write-Host "提示: 如果应用未安装依赖，请先在各应用目录下执行 'npm install'" -ForegroundColor Yellow
