#!/bin/bash
#
# ClawFactory CLI Uninstall Script
# Usage: curl -sL https://raw.githubusercontent.com/mdscolour/clawfactory/main/uninstall.sh | bash
#

set -e

echo "🦞 Uninstalling ClawFactory CLI..."

rm -f "$HOME/.clawfactory/bin/clawfactory"
rmdir "$HOME/.clawfactory/bin" 2>/dev/null || true

echo "✅ ClawFactory CLI uninstalled!"
echo ""
echo "Note: Remove 'export PATH=\"~/.clawfactory/bin:\$PATH\"' from ~/.zshrc or ~/.bashrc if needed."
