@echo off
echo ========================================
echo    检查 .gitignore 文件状态
echo ========================================
echo.

echo 📁 当前目录: %CD%
echo.

echo 🔍 检查 .gitignore 文件是否存在...
if exist ".gitignore" (
    echo ✅ .gitignore 文件存在
    echo.
    echo 📄 文件内容预览:
    echo ----------------------------------------
    type .gitignore
    echo ----------------------------------------
    echo.
    echo 📊 文件信息:
    dir /a .gitignore
) else (
    echo ❌ .gitignore 文件不存在
    echo.
    echo 🔧 正在创建 .gitignore 文件...
    (
        echo # 依赖包
        echo node_modules/
        echo npm-debug.log*
        echo yarn-debug.log*
        echo yarn-error.log*
        echo.
        echo # 环境变量文件
        echo .env
        echo .env.local
        echo .env.development.local
        echo .env.test.local
        echo .env.production.local
        echo.
        echo # 日志文件
        echo *.log
        echo logs/
        echo.
        echo # 操作系统文件
        echo .DS_Store
        echo Thumbs.db
        echo.
        echo # IDE文件
        echo .vscode/
        echo .idea/
        echo *.swp
        echo *.swo
        echo.
        echo # 临时文件
        echo *.tmp
        echo *.temp
        echo.
        echo # 构建输出
        echo dist/
        echo build/
        echo.
        echo # Vercel
        echo .vercel
    ) > .gitignore
    echo ✅ .gitignore 文件已创建
)

echo.
echo 🔧 Git 操作建议:
echo    如果您已经初始化了Git仓库，请运行:
echo    git add .gitignore
echo    git commit -m "Add .gitignore file"
echo    git push
echo.
echo 💡 在GitHub中查看 .gitignore:
echo    方法1: 直接访问 https://github.com/yourusername/yourrepo/blob/main/.gitignore
echo    方法2: 在仓库文件列表中寻找（可能需要显示隐藏文件）
echo    方法3: 使用GitHub搜索功能搜索 ".gitignore"
echo.
pause