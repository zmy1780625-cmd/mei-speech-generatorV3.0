@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    晖总演讲稿生成器 V4.0 企业版
echo ========================================
echo.

echo 🔍 检查Node.js环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到Node.js，请先安装Node.js
    echo 📥 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js环境正常

echo.
echo 🔧 检查依赖包...
if not exist "node_modules" (
    echo 📦 正在安装依赖包...
    npm install
    if errorlevel 1 (
        echo ❌ 依赖包安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖包安装完成
) else (
    echo ✅ 依赖包已存在
)

echo.
echo 🔑 API配置状态:
echo ✅ GLM-4 Plus: 已预配置
echo ✅ 通义千问Max: 已预配置
echo 🔒 API密钥已安全存储在后端

echo.
echo 🚀 启动后端服务器...
echo 📡 服务地址: http://localhost:3000
echo 🌐 网页地址: http://localhost:3000/index.html
echo.
echo 💡 提示: 按 Ctrl+C 停止服务器
echo 🎯 功能: 预配置API，只需选择模型即可使用
echo.

node server.js