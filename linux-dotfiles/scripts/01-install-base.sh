#!/usr/bin/env bash
# ============================================================
# Catppuccin Abyss — 01-install-base.sh
# Passo 1: Pacotes oficiais + AUR helper (yay)
# Rode DEPOIS de já ter o Arch base instalado e logado no usuário normal
# (não como root).
# ============================================================
set -euo pipefail

DOTFILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> Atualizando sistema..."
sudo pacman -Syu --noconfirm

echo "==> Instalando pacotes oficiais (pacman)..."
sudo pacman -S --needed --noconfirm - < "$DOTFILES_DIR/packages/pacman.txt"

echo "==> Habilitando serviços essenciais..."
sudo systemctl enable --now NetworkManager
sudo systemctl enable --now bluetooth

echo "==> Configurando zram..."
sudo tee /etc/systemd/zram-generator.conf > /dev/null << 'ZRAM'
[zram0]
zram-size = min(ram / 2, 4096)
compression-algorithm = zstd
ZRAM
sudo systemctl daemon-reload
sudo systemctl start systemd-zram-setup@zram0.service || true

echo "==> Instalando yay (AUR helper)..."
if ! command -v yay &> /dev/null; then
    tmpdir=$(mktemp -d)
    git clone https://aur.archlinux.org/yay.git "$tmpdir/yay"
    (cd "$tmpdir/yay" && makepkg -si --noconfirm)
    rm -rf "$tmpdir"
else
    echo "yay já instalado, pulando."
fi

echo "==> Instalando pacotes AUR..."
yay -S --needed --noconfirm - < "$DOTFILES_DIR/packages/aur.txt"

echo ""
echo "✅ Etapa 1 concluída: pacotes base instalados."
echo "   Próximo passo: ./scripts/02-link-dotfiles.sh"
