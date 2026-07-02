#!/usr/bin/env bash
# Instala as configs do VS Code via symlink e reinstala as extensões.
set -euo pipefail

DOTFILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Descobre a pasta "User" do VS Code de acordo com o SO
if [[ "$OSTYPE" == "darwin"* ]]; then
    USER_DIR="$HOME/Library/Application Support/Code/User"
elif grep -qi microsoft /proc/version 2>/dev/null; then
    # WSL: aponta para o VS Code do Windows via /mnt/c
    WIN_USER=$(cmd.exe /c "echo %USERNAME%" 2>/dev/null | tr -d '\r')
    USER_DIR="/mnt/c/Users/$WIN_USER/AppData/Roaming/Code/User"
else
    USER_DIR="$HOME/.config/Code/User"
fi

mkdir -p "$USER_DIR"

link() {
    local src="$1"
    local dest="$2"
    if [[ -e "$dest" && ! -L "$dest" ]]; then
        mv "$dest" "$dest.bak"
        echo "Backup criado: $dest.bak"
    fi
    ln -sf "$src" "$dest"
    echo "Linkado: $dest -> $src"
}

link "$DOTFILES_DIR/settings.json" "$USER_DIR/settings.json"
link "$DOTFILES_DIR/keybindings.json" "$USER_DIR/keybindings.json"

if command -v code &> /dev/null; then
    echo "Instalando extensões..."
    while IFS= read -r ext; do
        [[ -z "$ext" ]] && continue
        code --install-extension "$ext" --force
    done < "$DOTFILES_DIR/extensions.txt"
else
    echo "Comando 'code' não encontrado no PATH. Pulei a instalação de extensões."
fi

echo "Concluído."
