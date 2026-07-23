# Catppuccin Abyss — Arch Linux + Hyprland

Desktop completo inspirado no Seelen UI / Windows 11 / Catppuccin, com
Hyprland, AGS (dock + notificações + launcher + power menu), Waybar,
Kitty, Zsh e integração visual no VS Code e Zen Browser.

## Estrutura do repositório

```
dotfiles/
├── packages/
│   ├── pacman.txt          # pacotes oficiais
│   └── aur.txt              # pacotes AUR
├── hypr/
│   ├── hyprland.conf
│   ├── hyprpaper.conf
│   ├── hyprlock.conf
│   └── hypridle.conf
├── waybar/
│   ├── config.jsonc
│   └── style.css
├── ags/
│   ├── config.js
│   ├── style.css
│   └── widgets/
│       ├── dock.js
│       ├── notifications.js
│       ├── launcher.js
│       └── powermenu.js
├── kitty/kitty.conf
├── fastfetch/config.jsonc
├── starship/starship.toml
├── zsh/.zshrc
├── gtk-3.0/settings.ini
├── gtk-4.0/settings.ini + gtk.css
├── wlogout/layout + style.css
├── vscode/settings.json
├── zen-browser/chrome/userChrome.css
└── scripts/
    ├── 01-install-base.sh
    ├── 02-link-dotfiles.sh
    └── 03-post-install.sh
```

## Ordem de instalação

### 0. Pré-requisito: Arch Linux já instalado

Este repositório assume que você já passou pela instalação base do
Arch (particionamento, `pacstrap`, bootloader, usuário criado) e está
logado **como usuário normal** (não root) num terminal TTY, sem
ambiente gráfico ainda.

### 1. Clonar o repositório

```bash
sudo pacman -S --needed git
git clone https://github.com/LouisOlouis/dotfiles.git ~/dotfiles
cd ~/dotfiles/linux-dotfiles
```

### 2. Instalar pacotes (script 01)

```bash
./scripts/01-install-base.sh
```

Isso instala: Hyprland + utilitários, PipeWire, Bluetooth,
NetworkManager, Waybar, AGS, Kitty, Zsh, ferramentas de terminal,
GTK/tema, fontes Nerd Font, toolchains de C/C++/Python/Node/Rust,
Docker, e configura zram. No final instala o `yay` (AUR helper) e os
pacotes do AUR (Zen Browser, tema Catppuccin GTK, VS Code, etc.)

### 3. Linkar os dotfiles (script 02)

```bash
./scripts/02-link-dotfiles.sh
```

Isso cria **symlinks** de cada configuração deste repositório para o
lugar real onde o sistema espera encontrá-la (`~/.config/hypr`,
`~/.config/waybar`, `~/.zshrc`, etc.). Arquivos que já existiam são
renomeados para `.bak` antes, então nada é perdido.

Também tenta linkar o `userChrome.css` do Zen Browser — se o Zen
ainda não tiver sido aberto uma vez (e portanto não tiver um perfil
criado), o script avisa e você roda essa parte de novo depois.

### 4. Ferramentas de desenvolvimento (script 03)

```bash
./scripts/03-post-install.sh
```

Configura Rust (`rustup default stable`), Docker (habilita serviço +
adiciona seu usuário ao grupo `docker`), Git (nome/email/editor/delta
como pager), e instala as extensões do VS Code. Ele pede seu nome e
email do Git de forma interativa.

### 5. Wallpaper

Coloque uma imagem de fundo escura (idealmente já dentro da paleta
Catppuccin/Abyss) em:

```bash
~/Pictures/wallpaper.png
```

O `hyprpaper.conf` e o `hyprlock.conf` já apontam para esse caminho.

### 6. Reiniciar a sessão

```bash
reboot
```

No gerenciador de login (ou direto no TTY, se não tiver um), selecione
a sessão **Hyprland** e faça login. Nesse primeiro boot, o
`exec-once` do `hyprland.conf` já sobe Waybar, AGS (dock +
notificações), hyprpaper, hypridle, applets de rede/bluetooth e o
polkit agent.

### 7. Ajustes finais

- **Docker sem sudo**: como o grupo `docker` só passa a valer numa
  sessão nova, confirme com `docker ps` sem `sudo` — se der erro de
  permissão, faça logout/login de novo.
- **Zen Browser**: abra `about:config`, procure
  `toolkit.legacyUserProfileCustomizations.stylesheets` e mude para
  `true`. Reinicie o navegador para o `userChrome.css` pegar.
- **VS Code tema**: `Ctrl+Shift+P → Preferences: Color Theme →
  Catppuccin Mocha` (o `settings.json` já define isso, mas confirme
  se a extensão instalou certo).
- **NVIDIA**: se sua GPU for NVIDIA, abra `hypr/hyprland.conf` e
  descomente o bloco de `env =` marcado com `--- NVIDIA ---` perto do
  fim do arquivo, e instale os drivers proprietários
  (`nvidia-dkms`, `nvidia-utils`, `nvidia-settings`) além de
  configurar o `mkinitcpio.conf` com os módulos `nvidia nvidia_modeset
  nvidia_uvm nvidia_drm` — isso está fora do escopo deste roteiro de
  dotfiles porque varia por modelo de placa; consulte a Arch Wiki
  "NVIDIA" + "Hyprland" para o passo a passo específico da sua GPU.

## Atalhos principais (Hyprland)

| Atalho | Ação |
|---|---|
| `Super + Return` | Abrir terminal (Kitty) |
| `Super + B` | Abrir Zen Browser |
| `Super + Shift + E` | Abrir VS Code |
| `Super + E` | Abrir gerenciador de arquivos |
| `Super + Space` | Abrir launcher (AGS) |
| `Super + Q` | Fechar janela ativa |
| `Super + F` | Fullscreen |
| `Super + Shift + F` | Alternar flutuante |
| `Super + [1-0]` | Trocar workspace |
| `Super + Shift + [1-0]` | Mover janela para workspace |
| `Super + Shift + S` | Print de área (clipboard) |
| `Super + Escape` | Bloquear tela |
| `Super + Shift + M` | Sair do Hyprland |
| Clique no ícone de energia (Waybar) | Abre `wlogout` |

## Workspaces nomeados

| # | Nome | Uso sugerido |
|---|---|---|
| 1 | Browser | Navegação |
| 2 | Code | VS Code |
| 3 | Terminal | Kitty |
| 4 | Git | LazyGit, GitHub CLI |
| 5 | Database | Clientes de banco |
| 6 | Docker | LazyDocker, containers |
| 7 | Docs | Documentação, notas |
| 8 | Chat | Discord |
| 9 | VM | Máquinas virtuais |
| 10 | Free | Livre |

## Debugar algo que não carregou

- **Waybar não aparece**: `pkill waybar && waybar` num terminal, veja o
  erro no stdout.
- **AGS não aparece**: `pkill ags && ags` num terminal — erros de
  JavaScript aparecem ali direto.
- **Hyprland não reconhece uma tecla**: `hyprctl reload` recarrega o
  `hyprland.conf` sem precisar reiniciar a sessão inteira.
- **Fonte Nerd Font não mostra ícones**: confirme com `fc-list | grep -i
  jetbrains` que a fonte está instalada, e rode `fc-cache -fv`.
