# 安装所有应用的依赖

Write-Host "开始安装所有应用的依赖..." -ForegroundColor Green
Write-Host ""

# 检测使用的包管理器
$usesPnpm = Test-Path "$PSScriptRoot\pnpm-workspace.yaml"
$packageManager = if ($usesPnpm) { "pnpm" } else { "npm" }

Write-Host "检测到包管理器: $packageManager" -ForegroundColor Cyan
Write-Host ""

if ($usesPnpm) {
    # 使用 pnpm workspace 一次性安装所有依赖
    Write-Host "使用 pnpm workspace 安装所有应用依赖..." -ForegroundColor Yellow
    Set-Location -Path $PSScriptRoot
    pnpm install

    if ($LASTEXITCODE -ne 0) {
        Write-Host "依赖安装失败" -ForegroundColor Red
        exit 1
    }
} else {
    # 使用 npm 分别安装
    # 主应用
    Write-Host "1. 安装主应用依赖..." -ForegroundColor Yellow
    Set-Location -Path "$PSScriptRoot\main-app"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "主应用依赖安装失败" -ForegroundColor Red
        exit 1
    }

    Write-Host ""

    # 微应用1
    Write-Host "2. 安装微应用1依赖..." -ForegroundColor Yellow
    Set-Location -Path "$PSScriptRoot\micro-app1"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "微应用1依赖安装失败" -ForegroundColor Red
        exit 1
    }

    Write-Host ""

    # 微应用2
    Write-Host "3. 安装微应用2依赖..." -ForegroundColor Yellow
    Set-Location -Path "$PSScriptRoot\micro-app2"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "微应用2依赖安装失败" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "所有依赖安装完成！" -ForegroundColor Green
Write-Host ""
Write-Host "接下来可以执行 .\start-all.ps1 启动项目" -ForegroundColor Cyan

Set-Location -Path $PSScriptRoot
