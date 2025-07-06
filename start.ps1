Write-Host "Starting P2P File Drop Zone..." -ForegroundColor Green
Write-Host ""

# Start Signaling Server
Write-Host "Starting Signaling Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev" -WindowStyle Normal

# Wait for server to start
Write-Host "Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start React Client
Write-Host "Starting React Client..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "P2P File Drop Zone is starting..." -ForegroundColor Green
Write-Host ""
Write-Host "Signaling Server: http://localhost:3001" -ForegroundColor Cyan
Write-Host "React Client: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opening application in browser..." -ForegroundColor Green

# Open browser
Start-Sleep -Seconds 2
Start-Process "http://localhost:5173" 