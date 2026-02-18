#!/bin/bash
# Push work-manager-optimized to GitHub

cd /root/.openclaw/workspace

# Check if already a git repo
if [ -d "work-manager-optimized/.git" ]; then
    echo "Repository already exists"
    cd work-manager-optimized
    git add .
    git commit -m "Update: Optimized structure with documentation"
    git push origin main
    exit 0
fi

# Initialize git repo
cd work-manager-optimized
git init
git add .
git commit -m "Initial commit: Work Manager optimized

- Modular structure (HTML/CSS/JS separated)
- Internationalization (ES/DE)
- PWA support
- Documentation and deploy script
- Price list data extracted"

# Add remote (user will need to provide their repo URL)
echo ""
echo "✅ Git repository initialized locally"
echo ""
echo "To push to GitHub, run:"
echo "  git remote add origin https://github.com/jarl9801/work-manager-optimized.git"
echo "  git branch -M main"
echo "  git push -u origin main"
echo ""
echo "Or use GitHub CLI:"
echo "  gh repo create work-manager-optimized --public --source=. --push"
