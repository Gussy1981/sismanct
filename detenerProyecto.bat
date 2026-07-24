@echo off
echo Deteniendo SisManCT...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM mongod.exe >nul 2>&1
echo Servidor detenido correctamente.
pause
