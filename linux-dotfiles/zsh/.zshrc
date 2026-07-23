# ============================================================
# Catppuccin Abyss — .zshrc
# ============================================================

# ---- Histórico ----
HISTFILE=~/.zsh_history
HISTSIZE=10000
SAVEHIST=10000
setopt APPEND_HISTORY
setopt SHARE_HISTORY
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_SPACE

# ---- Completions ----
autoload -Uz compinit
compinit
zstyle ':completion:*' menu select
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}'

# ---- Plugins (instalados via pacman) ----
source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# ---- zoxide (cd inteligente) ----
eval "$(zoxide init zsh)"

# ---- fzf ----
source /usr/share/fzf/key-bindings.zsh
source /usr/share/fzf/completion.zsh
export FZF_DEFAULT_OPTS="
  --color=bg+:#242430,bg:#08080D,spinner:#CBA6F7,hl:#F38BA8
  --color=fg:#CDD6F4,header:#F38BA8,info:#89B4FA,pointer:#CBA6F7
  --color=marker:#A6E3A1,fg+:#CDD6F4,prompt:#89B4FA,hl+:#F38BA8
"
export FZF_DEFAULT_COMMAND="fd --type f --hidden --exclude .git"

# ---- Starship ----
eval "$(starship init zsh)"

# ---- Aliases: eza (ls moderno) ----
alias ls="eza --icons --group-directories-first"
alias ll="eza --icons --group-directories-first -l"
alias la="eza --icons --group-directories-first -la"
alias lt="eza --icons --group-directories-first --tree --level=2"

# ---- Aliases: bat (cat moderno) ----
alias cat="bat --paging=never"

# ---- Aliases: git ----
alias g="git"
alias gs="git status"
alias ga="git add"
alias gc="git commit -m"
alias gp="git push"
alias gl="git pull"
alias gd="git diff"
alias gco="git checkout"
alias lg="lazygit"

# ---- Aliases: docker ----
alias d="docker"
alias dc="docker compose"
alias dps="docker ps"
alias ld="lazydocker"

# ---- Aliases: sistema ----
alias update="sudo pacman -Syu && yay -Syu"
alias cls="clear"
alias vim="nvim"
alias c="code ."
alias ff="fastfetch"

# ---- Aliases: navegação ----
alias ..="cd .."
alias ...="cd ../.."
alias z="zoxide"

# ---- Python venv rápido (uv) ----
alias venv="uv venv && source .venv/bin/activate"

# ---- Editor padrão ----
export EDITOR="code --wait"
export VISUAL="code --wait"

# ---- Wayland env (garantia extra fora do Hyprland) ----
export MOZ_ENABLE_WAYLAND=1

# ---- fastfetch ao abrir terminal ----
if [[ -o interactive ]]; then
    fastfetch
fi
