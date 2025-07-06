@echo off
echo Starting P2P File Drop Zone...
echo.

echo Starting Signaling Server...
start "Signaling Server" cmd /k "cd server && npm run dev"

echo Waiting 3 seconds for server to start...
timeout /t 3 /nobreak > nul

echo Starting React Client...
start "React Client" cmd /k "cd client && npm run dev"

echo.
echo P2P File Drop Zone is starting...
echo.
echo Signaling Server: http://localhost:3001
echo React Client: http://localhost:5173
echo.
echo Press any key to open the application in your browser...
pause > nul
start http://localhost:5173 