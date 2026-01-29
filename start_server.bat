@echo off
echo Stopping all existing Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
echo Cleanup complete.

echo Starting Medical System...
cd medical-system

echo Clearing cache...
rmdir /s /q .next >nul 2>&1

echo Starting Server on PORT 3005...
echo Access the app at: http://localhost:3005
npx next dev -p 3005
pause
