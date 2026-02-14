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

# Detect OS
OS="$(uname -s)"
case "$OS" in
    Darwin*)
        PLATFORM="darwin"
        ;;
    Linux*)
        PLATFORM="linux"
        ;;
    *)
        echo -e "${RED}Unsupported OS: $OS${NC}"
        exit 1
        ;;
esac

# Detect architecture
ARCH="$(uname -m)"
case "$ARCH" in
    x86_64)
        ARCH="x86_64"
        ;;
    arm64|aarch64)
        ARCH="arm64"
        ;;
    *)
        echo -e "${RED}Unsupported architecture: $ARCH${NC}"
        exit 1
        ;;
esac

# Create install directory
INSTALL_DIR="${HOME}/.clawfactory/bin"
mkdir -p "$INSTALL_DIR"

# Download binary
BINARY_URL="https://github.com/mdscolour/clawfactory/releases/latest/download/clawfactory-${PLATFORM}-${ARCH}"
BINARY_PATH="${INSTALL_DIR}/clawfactory"

echo -e "${YELLOW}Downloading from ${BINARY_URL}...${NC}"

if command -v curl &> /dev/null; then
    curl -L -o "$BINARY_PATH" "$BINARY_URL" 2>/dev/null
elif command -v wget &> /dev/null; then
    wget -O "$BINARY_PATH" "$BINARY_URL" 2>/dev/null
else
    echo -e "${RED}Please install curl or wget first${NC}"
    exit 1
fi

chmod +x "$BINARY_PATH"

# Add to PATH (bash/zsh)
BASHRC="${HOME}/.bashrc"
ZSHRC="${HOME}/.zshrc"

PATH_EXPORT="export PATH=\"${INSTALL_DIR}:\$PATH\""
ADDED_BASH=false
ADDED_ZSH=false

if [ -f "$BASHRC" ]; then
    if ! grep -q "clawfactory/bin" "$BASHRC" 2>/dev/null; then
        echo "" >> "$BASHRC"
        echo "# ClawFactory CLI" >> "$BASHRC"
        echo "$PATH_EXPORT" >> "$BASHRC"
        ADDED_BASH=true
    fi
fi

if [ -f "$ZSHRC" ]; then
    if ! grep -q "clawfactory/bin" "$ZSHRC" 2>/dev/null; then
        echo "" >> "$ZSHRC"
        echo "# ClawFactory CLI" >> "$ZSHRC"
        echo "$PATH_EXPORT" >> "$ZSHRC"
        ADDED_ZSH=true
    fi
fi

# Also check and update existing shell config
for RC_FILE in "$HOME/.bash_profile" "$HOME/.profile"; do
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
