#!/bin/bash
#
# ClawFactory CLI Uninstall Script
# Usage: curl -sL https://raw.githubusercontent.com/mdscolour/clawfactory/main/uninstall.sh | bash
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🦞 Uninstalling ClawFactory CLI...${NC}"

INSTALL_DIR="${HOME}/.clawfactory/bin"
CLI_PATH="${INSTALL_DIR}/clawfactory"

# Remove CLI binary
if [ -f "$CLI_PATH" ]; then
    rm -f "$CLI_PATH"
    echo -e "${GREEN}✅ Removed ${CLI_PATH}${NC}"
else
    echo -e "${YELLOW}CLI not found at ${INSTALL_DIR}${NC}"
fi

# Remove install directory if empty
if [ -d "$INSTALL_DIR" ] && [ -z "$(ls -A "$INSTALL_DIR" 2>/dev/null)" ]; then
    rmdir "$INSTALL_DIR"
    echo -e "${GREEN}✅ Removed empty directory ${INSTALL_DIR}${NC}"
fi

# Remove PATH from shell configs
for RC_FILE in "$HOME/.bashrc" "$HOME/.zshrc" "$HOME/.bash_profile" "$HOME/.profile"; do
    if [ -f "$RC_FILE" ]; then
        # Remove ClawFactory PATH export lines
        sed -i '' '/# ClawFactory CLI/d' "$RC_FILE" 2>/dev/null
        sed -i '' "/export PATH=\"${INSTALL_DIR}:/d" "$RC_FILE" 2>/dev/null
        echo -e "${GREEN}✅ Cleaned ${RC_FILE}${NC}"
    fi
done

echo ""
echo -e "${GREEN}✅ ClawFactory CLI uninstalled!${NC}"
echo ""
echo -e "${YELLOW}Note: You may need to restart your terminal.${NC}"
echo ""
