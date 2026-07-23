#!/usr/bin/env bash
# ============================================================
# Catppuccin Abyss — 03-post-install.sh
# Passo 3: Ferramentas de desenvolvimento + toolchains
# ============================================================
set -euo pipefail

echo "==> Rust (via rustup)..."
if ! command -v cargo &> /dev/null; then
    rustup default stable
    rustup component add rust-analyzer
fi

echo "==> Python: uv já vem via AUR. Criando alias de ambiente global..."
python -m pip install --user --upgrade pip || true

echo "==> Node: configurando pnpm..."
if command -v pnpm &> /dev/null; then
    pnpm setup || true
fi

echo "==> Docker: habilitando serviço e adicionando usuário ao grupo..."
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
echo "  ⚠ Você precisa deslogar e logar de novo para o grupo 'docker' ter efeito."

echo "==> Configurando Git (interativo)..."
read -rp "Nome para o Git (git config user.name): " GIT_NAME
read -rp "Email para o Git (git config user.email): " GIT_EMAIL
git config --global user.name  "$GIT_NAME"
git config --global user.email "$GIT_EMAIL"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"
git config --global pager.diff  "delta"
git config --global pager.show  "delta"
git config --global interactive.diffFilter "delta --color-only"
git config --global delta.navigate true
git config --global delta.line-numbers true
git config --global delta.side-by-side true
git config --global merge.conflictstyle diff3

echo "==> Instalando extensões do VS Code..."
if command -v code &> /dev/null; then
    code --install-extension Catppuccin.catppuccin-vsc
    code --install-extension Catppuccin.catppuccin-vsc-icons
    code --install-extension ms-vscode.cpptools
    code --install-extension ms-python.python
    code --install-extension rust-lang.rust-analyzer
    code --install-extension ms-azuretools.vscode-docker
    code --install-extension eamodio.gitlens
    code --install-extension esbenp.prettier-vscode
    code --install-extension dbaeumer.vscode-eslint
else
    echo "  ⚠ 'code' não encontrado no PATH ainda. Rode este bloco manualmente depois:"
    echo "    code --install-extension Catppuccin.catppuccin-vsc"
fi

echo "==> Configurando fontconfig (garante fallback correto de Nerd Font)..."
fc-cache -fv > /dev/null

echo ""
echo "✅ Etapa 3 concluída: toolchains e ferramentas configuradas."
echo "   Próximo passo: reiniciar a sessão e rodar hyprland."
