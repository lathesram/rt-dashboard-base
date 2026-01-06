# RT Dashboard - Quick Start Script
# This script starts all micro frontends in separate PowerShell windows

Write-Host "Starting RT Dashboard Micro Frontends..." -ForegroundColor Cyan
Write-Host ""

# Start Shell (Host Application)
Write-Host "Starting Shell Application..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; nx serve shell"

# Wait a bit before starting remotes
Start-Sleep -Seconds 2

# Start Order Producer
Write-Host "Starting Order Producer..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; nx serve order_producer"

# Wait a bit
Start-Sleep -Seconds 1

# Start Order List
Write-Host "Starting Order List..." -ForegroundColor Magenta
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; nx serve order_list"

# Wait a bit
Start-Sleep -Seconds 1

# Start Order Summary
Write-Host "Starting Order Summary..." -ForegroundColor Blue
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; nx serve order_summary"

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "All services are starting!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access the applications at:" -ForegroundColor White
Write-Host "  Shell (Host):     http://localhost:4200" -ForegroundColor Cyan
Write-Host "  Order Producer:   http://localhost:4200/order_producer" -ForegroundColor Yellow
Write-Host "  Order List:       http://localhost:4200/order_list" -ForegroundColor Magenta
Write-Host "  Order Summary:    http://localhost:4200/order_summary" -ForegroundColor Blue
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
