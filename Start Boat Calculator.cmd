@echo off
setlocal
set "PATH=C:\Users\Kohlc\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"
start "Cardboard Boat Float Lab Server" /D "%~dp0" cmd /k node_modules\.bin\vinext.cmd start
timeout /t 3 /nobreak >nul
start "" "http://localhost:3000"
