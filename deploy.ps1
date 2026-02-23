# ===========================================
# Sakura Blog - 部署脚本 (PowerShell)
# ===========================================

param(
    [string]$Action = "start"
)

$ErrorActionPreference = "Stop"

function Show-Help {
    Write-Host @"
Sakura Blog 部署脚本

用法: .\deploy.ps1 -Action <命令>

命令:
  start       启动所有服务（默认）
  stop        停止所有服务
  restart     重启所有服务
  rebuild     重新构建并启动
  logs        查看日志
  status      查看服务状态
  init        初始化数据库
  clean       清理所有数据（危险操作）
  help        显示帮助信息

示例:
  .\deploy.ps1 -Action start
  .\deploy.ps1 -Action rebuild
  .\deploy.ps1 -Action logs

"@
}

function Test-EnvFile {
    if (-not (Test-Path ".env")) {
        Write-Host "⚠️  未找到 .env 文件，正在从模板创建..." -ForegroundColor Yellow
        Copy-Item ".env.docker.example" ".env"
        Write-Host "✅ 已创建 .env 文件，请根据需要修改配置" -ForegroundColor Green
    }
}

function Start-Services {
    Test-EnvFile
    Write-Host "🚀 启动服务..." -ForegroundColor Cyan
    docker compose up -d
    Show-Status
}

function Stop-Services {
    Write-Host "🛑 停止服务..." -ForegroundColor Cyan
    docker compose down
}

function Restart-Services {
    Stop-Services
    Start-Services
}

function Rebuild-Services {
    Test-EnvFile
    Write-Host "🔨 重新构建并启动..." -ForegroundColor Cyan
    docker compose up -d --build --force-recreate
    Show-Status
}

function Show-Logs {
    docker compose logs -f
}

function Show-Status {
    Write-Host ""
    Write-Host "📊 服务状态:" -ForegroundColor Cyan
    docker compose ps
    Write-Host ""
    Write-Host "🌐 访问地址:" -ForegroundColor Green
    Write-Host "   Blog:  http://localhost:3001"
    Write-Host "   Admin: http://localhost:3000"
    Write-Host "   API:   http://localhost:8080"
    Write-Host ""
    Write-Host "🔐 默认账户: admin / admin123" -ForegroundColor Yellow
}

function Init-Database {
    Write-Host "📊 初始化数据库..." -ForegroundColor Cyan
    $schemaPath = ".\api\src\main\resources\db\schema.sql"
    if (Test-Path $schemaPath) {
        Get-Content $schemaPath | docker exec -i sakura-mysql mysql -uroot -proot123 2>$null
        Write-Host "✅ 数据库初始化完成" -ForegroundColor Green
    } else {
        Write-Host "❌ 找不到 schema.sql 文件" -ForegroundColor Red
    }
}

function Clean-All {
    Write-Host "⚠️  警告：此操作将删除所有数据！" -ForegroundColor Red
    $confirm = Read-Host "确认继续？(yes/no)"
    if ($confirm -eq "yes") {
        docker compose down -v --remove-orphans
        Write-Host "✅ 所有数据已清理" -ForegroundColor Green
    } else {
        Write-Host "已取消" -ForegroundColor Yellow
    }
}

# 主逻辑
switch ($Action) {
    "start"   { Start-Services }
    "stop"    { Stop-Services }
    "restart" { Restart-Services }
    "rebuild" { Rebuild-Services }
    "logs"    { Show-Logs }
    "status"  { Show-Status }
    "init"    { Init-Database }
    "clean"   { Clean-All }
    "help"    { Show-Help }
    default   { Show-Help }
}
