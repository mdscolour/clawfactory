#!/bin/bash
#
# ClawFactory CLI Uninstall Script
# Usage: curl -sL https://raw.githubusercontent.com/mdscolour/clawfactory/main/uninstall.sh | bash
#

set -e

echo "🦞 Uninstalling ClawFactory CLI..."

rm -f "$HOME/.clawfactory/bin/clawfactory"
rmdir "$HOME/.clawfactory/bin" 2>/dev/null || true

# Remove PATH from shell configs
for RC in "$HOME/.zshrc" "$HOME/.bashrc" "$HOME/.bash_profile"; do
    if [ -f "$RC" ]; then
        # Remove ClawFactory related lines
        sed -i '' '/# ClawFactory CLI/d' "$RC" 2>/dev/null || true
        sed -i '' "/\.clawfactory\/bin/d" "$RC" 2>/dev/null || true
    fi
done

echo "✅ ClawFactory CLI uninstalled!"
echo "Note: Shell config cleaned. Restart your terminal."
