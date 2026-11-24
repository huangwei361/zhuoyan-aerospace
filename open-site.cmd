@echo off
REM ============================================================
REM   逐焰航天官网 · 本地预览
REM   双击此文件会在浏览器打开官网首页。
REM   需要先运行本机已有的 http-server（若未安装会提示）。
REM ============================================================

setlocal
cd /d "%~dp0"

REM 优先用 Python 自带的简易服务器
where python >nul 2>&1
if %errorlevel%==0 (
  echo [1/2] 启动本地服务器 http://localhost:8000 ...
  start "" http://localhost:8000
  python -m http.server 8000
  goto :eof
)

where py >nul 2>&1
if %errorlevel%==0 (
  echo [1/2] 启动本地服务器 http://localhost:8000 ...
  start "" http://localhost:8000
  py -m http.server 8000
  goto :eof
)

echo [1/2] 未找到 Python，尝试直接打开文件 ...
start "" "%~dp0index.html"
echo.
echo [提示] 直接打开文件时，浏览器的同源策略可能影响部分功能；
echo        建议安装 Python 3 后重试本脚本。
echo.
pause
