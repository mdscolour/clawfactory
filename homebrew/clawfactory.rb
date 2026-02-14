class Clawfactory < Formula
  desc "OpenClaw Copy Registry CLI - Install and share OpenClaw configurations"
  homepage "https://github.com/你的用户名/clawfactory"
  url "https://github.com/你的用户名/clawfactory/releases/latest/download/clawfactory-darwin-x86_64"
  version "1.0.0"
  sha256 "your_binary_sha256_here"

  depends_on "curl" => :run

  def install
    bin.install "clawfactory-darwin-x86_64" => "clawfactory"
  end

  def caveats
    <<~EOS
      ClawFactory CLI is now installed!

      Usage:
        clawfactory list           - List all copies
        clawfactory search <query> - Search copies
        clawfactory install <id>   - Install a copy

      Website: https://clawhub.com
    EOS
  end
end
