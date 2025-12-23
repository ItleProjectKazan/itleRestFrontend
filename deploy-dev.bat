@echo off
echo === Deploy to Development Server ===
echo.

:: Check if .next exists
if not exist ".next" (
    echo [ERROR] .next folder not found. Run 'npm run build' first.
    exit /b 1
)

echo [1/4] Creating archive...
tar -czf next-deploy.tar.gz -C .next .
if errorlevel 1 (
    echo [ERROR] Failed to create archive
    exit /b 1
)

echo [2/4] Uploading to server...
scp next-deploy.tar.gz itle@188.120.231.216:/tmp/
if errorlevel 1 (
    echo [ERROR] Failed to upload to server
    del next-deploy.tar.gz
    exit /b 1
)

echo [3/4] Extracting on server...
ssh itle@188.120.231.216 "rm -rf /var/www/itle/itle-rest/.next/* && tar -xzf /tmp/next-deploy.tar.gz -C /var/www/itle/itle-rest/.next && rm /tmp/next-deploy.tar.gz"
if errorlevel 1 (
    echo [ERROR] Failed to extract on server
    del next-deploy.tar.gz
    exit /b 1
)

echo [4/4] Cleaning up...
del next-deploy.tar.gz

echo.
echo === Deploy completed successfully! ===
echo Don't forget to restart Next.js on the server (e.g., via PM2)

