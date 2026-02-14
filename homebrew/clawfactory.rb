class Clawfactory < Formula
  desc "OpenClaw Copy Registry CLI - Install and share OpenClaw configurations"
  homepage "https://github.com/mdscolour/clawfactory"
  url "https://github.com/mdscolour/clawfactory/releases/download/v1.0.0/clawfactory-darwin-x86_64.tar.gz"
  version "1.0.0"
  sha256 "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

  depends_on :curl => :run

  def install
    bin.install "clawfactory" => "clawfactory"
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
