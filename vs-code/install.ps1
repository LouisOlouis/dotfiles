# Instala as configs do VS Code via symlink e reinstala as extensoes.
# Rode como Administrador (symlinks no Windows exigem privilegio, a menos
# que o "Modo de Desenvolvedor" esteja ativado).

$ErrorActionPreference = "Stop"

$DotfilesDir = $PSScriptRoot
$UserDir = "$env:APPDATA\Code\User"

New-Item -ItemType Directory -Force -Path $UserDir | Out-Null

function New-SymbolicLink {
    param($Source, $Dest)

    if ((Test-Path $Dest) -and -not ((Get-Item $Dest).LinkType -eq "SymbolicLink")) {
        Rename-Item -Path $Dest -NewName "$(Split-Path $Dest -Leaf).bak" -Force
        Write-Host "Backup criado: $Dest.bak"
    }

    if (Test-Path $Dest) {
        Remove-Item $Dest -Force
    }

    New-Item -ItemType SymbolicLink -Path $Dest -Target $Source | Out-Null
    Write-Host "Linkado: $Dest -> $Source"
}

New-SymbolicLink "$DotfilesDir\settings.json" "$UserDir\settings.json"
New-SymbolicLink "$DotfilesDir\keybindings.json" "$UserDir\keybindings.json"

if (Get-Command code -ErrorAction SilentlyContinue) {
    Write-Host "Instalando extensoes..."
    Get-Content "$DotfilesDir\extensions.txt" | ForEach-Object {
        if ($_.Trim() -ne "") {
            code --install-extension $_.Trim() --force
        }
    }
} else {
    Write-Host "Comando 'code' nao encontrado no PATH. Pulei a instalacao de extensoes."
}

Write-Host "Concluido."
