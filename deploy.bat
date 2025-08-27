@echo off
REM ArtistSiteussy Deployment Script for Windows
REM This script helps deploy the Next.js artist website to various hosting platforms

echo 🚀 ArtistSiteussy Deployment Script
echo ==================================

REM Colors for output (Windows CMD)
REM Note: Windows CMD doesn't support ANSI colors well, so we'll use plain text

echo [INFO] Starting deployment setup...

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] Please run this script from the root directory of the ArtistSiteussy project
    pause
    exit /b 1
)

if not exist "next.config.js" (
    echo [ERROR] Please run this script from the root directory of the ArtistSiteussy project
    pause
    exit /b 1
)

REM Function to setup environment variables
:setup_env
echo [INFO] Setting up environment variables...
if not exist ".env.local" (
    echo [WARNING] .env.local not found. Creating template...
    (
        echo # Admin Panel Credentials
        echo ADMIN_USER=admin
        echo ADMIN_PASS=cedric2024
        echo.
        echo # Stripe (for payment features)
        echo STRIPE_SECRET_KEY=sk_test_your_secret_key_here
        echo STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
        echo STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
        echo.
        echo # Next.js
        echo NEXTAUTH_SECRET=your-secret-key-here
        echo NEXTAUTH_URL=http://localhost:3000
    ) > .env.local
    echo [INFO] Created .env.local template. Please edit with your actual values.
    pause
) else (
    echo [INFO] Environment file already exists
)
goto :build_app

REM Function to build the application
:build_app
echo [INFO] Building the application...

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Build the application
echo [INFO] Building Next.js application...
call npm run build
if errorlevel 1 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)

echo [INFO] Build completed successfully!
goto :show_menu

REM Function to deploy to Vercel
:deploy_vercel
echo [INFO] Deploying to Vercel...

vercel --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Vercel CLI not found. Installing...
    call npm install -g vercel
    if errorlevel 1 (
        echo [ERROR] Failed to install Vercel CLI. Please install manually: npm install -g vercel
        goto :show_menu
    )
)

echo [INFO] Deploying to Vercel...
call vercel --prod
if errorlevel 1 (
    echo [ERROR] Vercel deployment failed
    goto :show_menu
)

echo [INFO] Vercel deployment completed!
goto :end

REM Function to deploy to Railway
:deploy_railway
echo [INFO] Deploying to Railway...

railway --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Railway CLI not found. Installing...
    call npm install -g @railway/cli
    if errorlevel 1 (
        echo [ERROR] Failed to install Railway CLI. Please install manually: npm install -g @railway/cli
        goto :show_menu
    )
)

echo [INFO] Please login to Railway (a browser window should open)...
call railway login
if errorlevel 1 (
    echo [ERROR] Railway login failed
    goto :show_menu
)

echo [INFO] Creating Railway project...
call railway init ArtistSiteussy
if errorlevel 1 (
    echo [ERROR] Failed to create Railway project
    goto :show_menu
)

echo [INFO] Setting up environment variables...
call railway variables set ADMIN_USER=admin
call railway variables set ADMIN_PASS=cedric2024
REM Generate a random secret for NextAuth
call railway variables set NEXTAUTH_SECRET=%RANDOM%%RANDOM%%RANDOM%%RANDOM%
call railway variables set NEXTAUTH_URL=https://%railway domain%

echo [INFO] Deploying to Railway...
call railway up
if errorlevel 1 (
    echo [ERROR] Railway deployment failed
    goto :show_menu
)

echo [INFO] Railway deployment completed!
goto :end

REM Function to deploy to Netlify
:deploy_netlify
echo [INFO] Deploying to Netlify...

netlify --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Netlify CLI not found. Installing...
    call npm install -g netlify-cli
    if errorlevel 1 (
        echo [ERROR] Failed to install Netlify CLI. Please install manually: npm install -g netlify-cli
        goto :show_menu
    )
)

echo [INFO] Deploying to Netlify...
call netlify deploy --prod --dir=.next
if errorlevel 1 (
    echo [ERROR] Netlify deployment failed
    goto :show_menu
)

echo [INFO] Netlify deployment completed!
goto :end

REM Function to create Docker setup
:setup_docker
echo [INFO] Setting up Docker deployment...

REM Create Dockerfile
(
    echo FROM node:18-alpine
    echo.
    echo WORKDIR /app
    echo.
    echo # Copy package files
    echo COPY package*.json ./
    echo.
    echo # Install dependencies
    echo RUN npm ci --only=production
    echo.
    echo # Copy built application
    echo COPY .next ./.next
    echo COPY public ./public
    echo COPY next.config.js ./
    echo COPY package*.json ./
    echo.
    echo # Expose port
    echo EXPOSE 3000
    echo.
    echo # Start the application
    echo CMD ["npm", "start"]
) > Dockerfile

REM Create docker-compose.yml
(
    echo version: '3.8'
    echo.
    echo services:
    echo   artistsiteussy:
    echo     build: .
    echo     ports:
    echo       - "3000:3000"
    echo     environment:
    echo       - NODE_ENV=production
    echo       - ADMIN_USER=admin
    echo       - ADMIN_PASS=cedric2024
    echo       - NEXTAUTH_SECRET=your-secret-key-here
    echo       - NEXTAUTH_URL=http://localhost:3000
    echo     volumes:
    echo       - ./public:/app/public
) > docker-compose.yml

REM Create .dockerignore
(
    echo node_modules
    echo .git
    echo .gitignore
    echo README.md
    echo .env.local
    echo .next
    echo .vercel
) > .dockerignore

echo [INFO] Docker setup completed!
echo [INFO] To deploy with Docker:
echo [INFO]   1. Make sure Docker is installed
echo [INFO]   2. Build: docker-compose build
echo [INFO]   3. Run: docker-compose up -d
echo [INFO]   4. Access: http://localhost:3000
goto :end

REM Function to show manual deployment options
:manual_deploy
echo [INFO] Manual Deployment Options
echo.
echo 1. Vercel (Recommended for Next.js):
echo    - Go to https://vercel.com
echo    - Connect your GitHub account
echo    - Import the ArtistSiteussy repository
echo    - Vercel will auto-deploy
echo.
echo 2. Netlify:
echo    - Go to https://netlify.com
echo    - Connect GitHub repository
echo    - Set build command: npm run build
echo    - Set publish directory: .next
echo.
echo 3. Railway:
echo    - Go to https://railway.app
echo    - Connect GitHub repository
echo    - Railway will auto-detect Next.js
echo.
echo 4. DigitalOcean App Platform:
echo    - Go to https://cloud.digitalocean.com/apps
echo    - Connect GitHub repository
echo    - Choose Next.js app type
echo.
echo 5. Heroku:
echo    - Install Heroku CLI: npm install -g heroku
echo    - heroku create your-app-name
echo    - git push heroku master
goto :end

REM Main menu
:show_menu
echo.
echo Choose deployment option:
echo 1) Vercel (Recommended)
echo 2) Railway
echo 3) Netlify
echo 4) Docker
echo 5) Manual Setup Instructions
echo 6) Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto deploy_vercel
if "%choice%"=="2" goto deploy_railway
if "%choice%"=="3" goto deploy_netlify
if "%choice%"=="4" goto setup_docker
if "%choice%"=="5" goto manual_deploy
if "%choice%"=="6" goto end

echo [ERROR] Invalid option. Please choose 1-6.
goto show_menu

:end
echo [INFO] Deployment setup completed!
echo [INFO] Your ArtistSiteussy website should now be live!
pause
exit /b 0
