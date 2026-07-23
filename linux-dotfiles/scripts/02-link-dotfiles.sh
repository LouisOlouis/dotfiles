#!/usr/bin/env bash
# ============================================================
# Catppuccin Abyss — 02-link-dotfiles.sh
# Passo 2: Criar symlinks dos arquivos deste repo para os
# diretórios reais de configuração (~/.config etc.)
#
# Usamos symlink (não cópia) de propósito: editar os arquivos
# aqui dentro de ~/dotfiles/ já reflete direto no sistema, e dá
# pra versionar tudo com git.
# ============================================================
set -euo pipefail

DOTFILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG_DIR="$HOME/.config"

link() {
    local src="$1" dst="$2"
    mkdir -p "$(dirname "$dst")"
    if [ -e "$dst" ] && [ ! -L "$dst" ]; then
        echo "  Backup: $dst -> $dst.bak"
        mv "$dst" "$dst.bak"
    fi
    ln -sfn "$src" "$dst"
    echo "  Linkado: $dst -> $src"
}

echo "==> Linkando Hyprland..."
link "$DOTFILES_DIR/hypr" "$CONFIG_DIR/hypr"

echo "==> Linkando Waybar..."
link "$DOTFILES_DIR/waybar" "$CONFIG_DIR/waybar"

echo "==> Linkando AGS..."
link "$DOTFILES_DIR/ags" "$CONFIG_DIR/ags"

echo "==> Linkando Kitty..."
link "$DOTFILES_DIR/kitty" "$CONFIG_DIR/kitty"

echo "==> Linkando Fastfetch..."
link "$DOTFILES_DIR/fastfetch" "$CONFIG_DIR/fastfetch"

echo "==> Linkando Starship..."
mkdir -p "$CONFIG_DIR"
link "$DOTFILES_DIR/starship/starship.toml" "$CONFIG_DIR/starship.toml"

echo "==> Linkando GTK 3/4..."
link "$DOTFILES_DIR/gtk-3.0" "$CONFIG_DIR/gtk-3.0"
link "$DOTFILES_DIR/gtk-4.0" "$CONFIG_DIR/gtk-4.0"

echo "==> Linkando wlogout..."
link "$DOTFILES_DIR/wlogout" "$CONFIG_DIR/wlogout"

echo "==> Linkando .zshrc..."
link "$DOTFILES_DIR/zsh/.zshrc" "$HOME/.zshrc"

echo "==> Definindo zsh como shell padrão..."
if [ "$SHELL" != "$(which zsh)" ]; then
    chsh -s "$(which zsh)"
fi

echo "==> Criando pasta de wallpapers e screenshots..."
mkdir -p "$HOME/Pictures/Screenshots"
if [ ! -f "$HOME/Pictures/wallpaper.png" ]; then
    echo "  ⚠ Nenhum wallpaper encontrado em ~/Pictures/wallpaper.png"
    echo "    Coloque sua imagem (tema Catppuccin Abyss / dark) nesse caminho."
fi

echo "==> Linkando VS Code settings.json..."
VSCODE_USER_DIR="$CONFIG_DIR/Code/User"
mkdir -p "$VSCODE_USER_DIR"
link "$DOTFILES_DIR/vscode/settings.json" "$VSCODE_USER_DIR/settings.json"

echo "==> Zen Browser: integração visual"
ZEN_PROFILES_DIR="$HOME/.zen"
if [ -d "$ZEN_PROFILES_DIR" ]; then
    for profile in "$ZEN_PROFILES_DIR"/*.Default\ \(release\)* "$ZEN_PROFILES_DIR"/*.default*; do
        [ -d "$profile" ] || continue
        mkdir -p "$profile/chrome"
        link "$DOTFILES_DIR/zen-browser/chrome/userChrome.css" "$profile/chrome/userChrome.css"
        echo "  → Ative em about:config: toolkit.legacyUserProfileCustomizations.stylesheets = true"
    done
else
    echo "  ⚠ Perfil do Zen Browser ainda não existe — abra o Zen Browser uma vez,"
    echo "    feche, e rode este script de novo para linkar o userChrome.css."
fi

echo ""
echo "✅ Etapa 2 concluída: dotfiles linkados."
echo "   Próximo passo: ./scripts/03-post-install.sh"
