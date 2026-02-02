# Remove Original Git History and Create Fresh Repository

# This script will:
# 1. Remove the original .git directory
# 2. Initialize a new Git repository
# 3. Make you the only contributor

Write-Host "🔄 Removing original Git history..." -ForegroundColor Yellow

# Remove the .git directory
if (Test-Path ".git") {
    Remove-Item -Path ".git" -Recurse -Force
    Write-Host "✅ Original Git history removed" -ForegroundColor Green
} else {
    Write-Host "⚠️  No .git directory found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🆕 Initializing new Git repository..." -ForegroundColor Yellow

# Initialize new Git repository
git init

Write-Host "✅ New Git repository initialized" -ForegroundColor Green
Write-Host ""

# Configure Git user (update with your details)
Write-Host "👤 Configuring Git user..." -ForegroundColor Yellow
git config user.name "Avishek Giri"
git config user.email "avishekgiri31@gmail.com"

Write-Host "✅ Git user configured" -ForegroundColor Green
Write-Host ""

# Create .gitignore if it doesn't exist
if (-not (Test-Path ".gitignore")) {
    Write-Host "📝 Creating .gitignore..." -ForegroundColor Yellow
    
    $gitignoreContent = @"
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Expo
.expo/
.expo-shared/

# Metro
.metro-health-check*

# Debug
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/

# Misc
*.log
*.pid
*.seed
*.pid.lock
"@
    
    $gitignoreContent | Out-File -FilePath ".gitignore" -Encoding utf8
    Write-Host "✅ .gitignore created" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Adding all files..." -ForegroundColor Yellow

# Add all files
git add .

Write-Host "✅ All files added" -ForegroundColor Green
Write-Host ""

# Create initial commit
Write-Host "💾 Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Full-stack e-commerce application

- React Native mobile app with local storage
- React admin dashboard
- Node.js/Express REST API
- MongoDB database
- Complete shopping experience without authentication"

Write-Host "✅ Initial commit created" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Done! Your repository is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "📌 Next steps:" -ForegroundColor Cyan
Write-Host "1. Create a new repository on GitHub" -ForegroundColor White
Write-Host "2. Run: git remote add origin <your-repo-url>" -ForegroundColor White
Write-Host "3. Run: git branch -M main" -ForegroundColor White
Write-Host "4. Run: git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "✨ You will be the only contributor!" -ForegroundColor Green
