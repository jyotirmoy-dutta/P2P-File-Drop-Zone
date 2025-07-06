Write-Host "Testing P2P File Drop Zone Application..." -ForegroundColor Green
Write-Host ""

# Test Signaling Server
Write-Host "Testing Signaling Server..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Signaling Server is running on http://localhost:3001" -ForegroundColor Green
        $health = $response.Content | ConvertFrom-Json
        Write-Host "   Status: $($health.status)" -ForegroundColor Cyan
        Write-Host "   Timestamp: $($health.timestamp)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Signaling Server is not responding" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test React Client
Write-Host "Testing React Client..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ React Client is running on http://localhost:5173" -ForegroundColor Green
        if ($response.Content -match "P2P File Drop Zone") {
            Write-Host "   ✅ Application title found" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️ Application title not found" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "❌ React Client is not responding" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test WebSocket Connection
Write-Host "Testing WebSocket Connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/status" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ WebSocket API is accessible" -ForegroundColor Green
        $status = $response.Content | ConvertFrom-Json
        Write-Host "   Connected Peers: $($status.peers)" -ForegroundColor Cyan
        Write-Host "   Active Rooms: $($status.rooms)" -ForegroundColor Cyan
        Write-Host "   Uptime: $([math]::Round($status.uptime, 2)) seconds" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ WebSocket API is not accessible" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Application Test Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To use the application:" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host "2. Click 'Connect' to join the network" -ForegroundColor White
Write-Host "3. Open the same URL on other devices on your LAN" -ForegroundColor White
Write-Host "4. Start transferring files between peers" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to open the application in your browser..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Start-Process "http://localhost:5173" 