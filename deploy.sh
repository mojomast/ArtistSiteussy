#!/bin/bash

# ArtistSiteussy Deployment Script
# This script helps deploy the Next.js artist website to various hosting platforms

set -e  # Exit on any error

echo "🚀 ArtistSiteussy Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "next.config.js" ]; then
    print_error "Please run this script from the root directory of the ArtistSiteussy project"
    exit 1
fi

# Function to setup environment variables
setup_env() {
    print_header "Setting up environment variables..."
    
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local not found. Creating template..."
        cat > .env.local << 'EOF'
# Admin Panel Credentials
ADMIN_USER=admin
ADMIN_PASS=cedric2024

# Stripe (for payment features)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Next.js
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
EOF
        print_status "Created .env.local template. Please edit with your actual values."
        read -p "Press Enter after editing .env.local to continue..."
    else
        print_status "Environment file already exists"
    fi
}

# Function to build the application
build_app() {
    print_header "Building the application..."
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi
    
    # Build the application
    print_status "Building Next.js application..."
    npm run build
    
    print_status "Build completed successfully!"
}

# Function to deploy to Vercel
deploy_vercel() {
    print_header "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    if ! vercel --version &> /dev/null; then
        print_error "Failed to install Vercel CLI. Please install manually: npm install -g vercel"
        return 1
    fi
    
    print_status "Deploying to Vercel..."
    vercel --prod
    
    print_status "Vercel deployment completed!"
}

# Function to deploy to Railway
deploy_railway() {
    print_header "Deploying to Railway..."
    
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI not found. Installing..."
        npm install -g @railway/cli
    fi
    
    if ! railway --version &> /dev/null; then
        print_error "Failed to install Railway CLI. Please install manually: npm install -g @railway/cli"
        return 1
    fi
    
    print_status "Logging into Railway..."
    railway login
    
    print_status "Creating Railway project..."
    railway init ArtistSiteussy
    
    print_status "Setting up environment variables..."
    railway variables set ADMIN_USER=admin
    railway variables set ADMIN_PASS=cedric2024
    railway variables set NEXTAUTH_SECRET=$(openssl rand -base64 32)
    railway variables set NEXTAUTH_URL=https://$(railway domain)
    
    print_status "Deploying to Railway..."
    railway up
    
    print_status "Railway deployment completed!"
}

# Function to deploy to Netlify
deploy_netlify() {
    print_header "Deploying to Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    if ! netlify --version &> /dev/null; then
        print_error "Failed to install Netlify CLI. Please install manually: npm install -g netlify-cli"
        return 1
    fi
    
    print_status "Deploying to Netlify..."
    netlify deploy --prod --dir=.next
    
    print_status "Netlify deployment completed!"
}

# Function to create Docker setup
setup_docker() {
    print_header "Setting up Docker deployment..."
    
    # Create Dockerfile
    cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built application
COPY .next ./.next
COPY public ./public
COPY next.config.js ./
COPY package*.json ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
EOF
    
    # Create docker-compose.yml
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  artistsiteussy:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - ADMIN_USER=admin
      - ADMIN_PASS=cedric2024
      - NEXTAUTH_SECRET=your-secret-key-here
      - NEXTAUTH_URL=http://localhost:3000
    volumes:
      - ./public:/app/public
EOF
    
    # Create .dockerignore
    cat > .dockerignore << 'EOF'
node_modules
.git
.gitignore
README.md
.env.local
.next
.vercel
EOF
    
    print_status "Docker setup completed!"
    print_status "To deploy with Docker:"
    echo "  1. Build: docker-compose build"
    echo "  2. Run: docker-compose up -d"
    echo "  3. Access: http://localhost:3000"
}

# Function to show manual deployment options
manual_deploy() {
    print_header "Manual Deployment Options"
    echo ""
    echo "1. Vercel (Recommended for Next.js):"
    echo "   - Go to https://vercel.com"
    echo "   - Connect your GitHub account"
    echo "   - Import the ArtistSiteussy repository"
    echo "   - Vercel will auto-deploy"
    echo ""
    echo "2. Netlify:"
    echo "   - Go to https://netlify.com"
    echo "   - Connect GitHub repository"
    echo "   - Set build command: npm run build"
    echo "   - Set publish directory: .next"
    echo ""
    echo "3. Railway:"
    echo "   - Go to https://railway.app"
    echo "   - Connect GitHub repository"
    echo "   - Railway will auto-detect Next.js"
    echo ""
    echo "4. DigitalOcean App Platform:"
    echo "   - Go to https://cloud.digitalocean.com/apps"
    echo "   - Connect GitHub repository"
    echo "   - Choose Next.js app type"
    echo ""
    echo "5. Heroku:"
    echo "   - Install Heroku CLI: npm install -g heroku"
    echo "   - heroku create your-app-name"
    echo "   - git push heroku master"
}

# Main menu
show_menu() {
    echo ""
    print_header "Choose deployment option:"
    echo "1) Vercel (Recommended)"
    echo "2) Railway"
    echo "3) Netlify"
    echo "4) Docker"
    echo "5) Manual Setup Instructions"
    echo "6) Exit"
    echo ""
    read -p "Enter your choice (1-6): " choice
}

# Main script
main() {
    setup_env
    build_app
    
    while true; do
        show_menu
        
        case $choice in
            1)
                deploy_vercel
                break
                ;;
            2)
                deploy_railway
                break
                ;;
            3)
                deploy_netlify
                break
                ;;
            4)
                setup_docker
                break
                ;;
            5)
                manual_deploy
                break
                ;;
            6)
                print_status "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please choose 1-6."
                ;;
        esac
    done
    
    print_status "Deployment setup completed!"
    print_status "Your ArtistSiteussy website should now be live!"
}

# Run main function
main
