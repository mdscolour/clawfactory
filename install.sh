#!/bin/bash
#
# ClawFactory CLI Installation Script
# Usage: curl -sL https://raw.githubusercontent.com/mdscolour/clawfactory/main/install.sh | bash
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🦞 Installing ClawFactory CLI...${NC}"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed.${NC}"
    echo -e "${YELLOW}Please install Node.js first: https://nodejs.org/${NC}"
    exit 1
fi

echo -e "${YELLOW}Node.js version: $(node -v)${NC}"

# Create install directory
INSTALL_DIR="${HOME}/.clawfactory/bin"
mkdir -p "$INSTALL_DIR"

# Download CLI script
CLI_URL="https://raw.githubusercontent.com/mdscolour/clawfactory/main/cli.js"
CLI_PATH="${INSTALL_DIR}/clawfactory"

echo -e "${YELLOW}Downloading ClawFactory CLI...${NC}"

if command -v curl &> /dev/null; then
    curl -sL -o "$CLI_PATH" "$CLI_URL"
elif command -v wget &> /dev/null; then
    wget -q -O "$CLI_PATH" "$CLI_URL"
else
    echo -e "${RED}Please install curl or wget first${NC}"
    exit 1
fi

chmod +x "$CLI_PATH"

# Add to PATH (bash/zsh)
BASHRC="${HOME}/.bashrc"
ZSHRC="${HOME}/.zshrc"

PATH_EXPORT="export PATH=\"${INSTALL_DIR}:\$PATH\""

for RC_FILE in "$BASHRC" "$ZSHRC" "$HOME/.bash_profile" "$HOME/.profile"; do
    if [ -f "$RC_FILE" ]; then
        if ! grep -q "clawfactory/bin" "$RC_FILE" 2>/dev/null; then
            echo "" >> "$RC_FILE"
            echo "# ClawFactory CLI" >> "$RC_FILE"
            echo "$PATH_EXPORT" >> "$RC_FILE"
        fi
    fi
done

echo ""
echo -e "${GREEN}✅ ClawFactory CLI installed successfully!${NC}"
echo ""
echo -e "${YELLOW}To use immediately, run:${NC}"
echo -e "  ${GREEN}export PATH=\"${INSTALL_DIR}:\$PATH\"${NC}"
echo ""
echo -e "${YELLOW}Or restart your terminal.${NC}"
echo ""
echo -e "${YELLOW}Usage:${NC}"
echo -e "  ${GREEN}clawfactory list${NC}         - List all copies"
echo -e "  ${GREEN}clawfactory search <query>${NC} - Search copies"
echo -e "  ${GREEN}clawfactory install <id>${NC}  - Install a copy"
echo ""
echo -e "${YELLOW}Website:${NC} https://clawhub.com"
echo ""
