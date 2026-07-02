# VS Code

Minhas configurações do VS Code (extraídas do profile export `Louis-profile.code-profile`).

## Estrutura

```
vscode/
├── settings.json      # user settings
├── keybindings.json   # atalhos customizados
├── extensions.txt     # lista de IDs das extensões instaladas
├── install.sh         # symlink + instalação de extensões (Linux/macOS/WSL)
├── install.ps1         # symlink + instalação de extensões (Windows/PowerShell)
└── README.md
```

## O que tem aqui

- **Tema:** Catppuccin Mocha (dark) / Dark Modern (light), com overrides de cor customizados
- **Ícones:** Catppuccin Mocha icon theme
- **Fonte do editor:** JetBrainsMono Nerd Font Propo
- **Extensões principais:** PHP (Intelephense + DEVSense PHP Tools), C/C++ (cpptools, clangd, CodeLLDB), Rust (rust-analyzer), Python, Godot, Five Server, SQLTools, GitLens/Git History, Error Lens
- **Nota:** `fiveServer.php.executable` e `fiveServer.php.ini` apontam para um caminho local do XAMPP (`C:\xampp\php\...`). Ajuste esse caminho se for restaurar em outra máquina.

## Como aplicar

### Linux / macOS / WSL
```bash
./install.sh
```

### Windows (PowerShell)
```powershell
.\install.ps1
```

Os scripts criam **symlinks** de `settings.json` e `keybindings.json` para a pasta `User` do VS Code, e instalam todas as extensões listadas em `extensions.txt` via `code --install-extension`.

## Atualizar o dotfiles com as configs atuais

Depois de mexer nas configs do VS Code, para exportar de novo:

1. `Ctrl+Shift+P` → **Preferences: Open User Settings (JSON)** → copie o conteúdo para `settings.json`
2. `Ctrl+Shift+P` → **Preferences: Open Keyboard Shortcuts (JSON)** → copie para `keybindings.json`
3. `code --list-extensions > extensions.txt`
