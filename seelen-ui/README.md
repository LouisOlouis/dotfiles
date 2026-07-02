# Catppuccin Abyss — tema para Seelen UI

Tema escuro baseado em **Catppuccin Mocha**, estendido com duas camadas extras
de profundidade (**Abyss** `#08080D` e **Crust** `#0B0B12`) abaixo do "Base"
tradicional, criando hierarquia visual real entre wallpaper → dock/toolbar →
janelas flutuantes.

## Instalação

1. Copie a pasta inteira `Catppuccin-Abyss/` (mantendo a estrutura interna)
   para o diretório de temas do Seelen UI:

   ```
   C:\Users\<SEU_USUARIO>\AppData\Roaming\com.seelen.seelen-ui\themes\
   ```

   O nome da pasta em si não importa — o que importa é o `id` dentro de
   `metadata.yml`. Resultado esperado:

   ```
   ...\themes\Catppuccin-Abyss\
   ├── metadata.yml
   ├── i18n\
   │   ├── display_name.yml
   │   └── description.yml
   ├── shared\
   │   └── index.css
   └── styles\
       ├── weg.css
       ├── fancy-toolbar.css
       ├── launcher.css
       ├── task-switcher.css
       ├── window-manager.css
       ├── notifications.css      (referência/organização — ver nota abaixo)
       ├── media-module.css       (referência/organização — ver nota abaixo)
       ├── quick-settings.css
       └── power-menu.css
   ```

2. Abra o Seelen UI → **Settings → Themes** e ative "Catppuccin Abyss".
3. Se necessário, ative múltiplos temas em camadas (cascade layers) — o
   Catppuccin Abyss foi escrito para funcionar sozinho, mas não conflita com
   temas complementares que não also redefinam `.taskbar`, `.ft-bar`, etc.

## Nota de arquitetura importante: notifications.css e media-module.css

Na versão atual do Seelen UI (v2.7.x) **não existem** widget IDs próprios
`@seelen/notifications` ou `@seelen/media` para tematizar separadamente — os
toasts de notificação e o Media Module renderizam dentro do webview do
`@seelen/fancy-toolbar`. Por isso:

- O CSS real e efetivo dessas duas áreas está nas **Seções 2 e 3** de
  `styles/fancy-toolbar.css` (é esse arquivo que o `metadata.yml` carrega).
- `styles/notifications.css` e `styles/media-module.css` existem como
  **cópias organizadas/legíveis** desse mesmo CSS, conforme a estrutura de
  pastas solicitada — mas **não são referenciados no `metadata.yml`** porque
  não há um widget para apontá-los.
- Se você editar o visual de notificações ou do media module, edite nos dois
  lugares (ou apague os arquivos "espelho" e mantenha só as seções dentro de
  `fancy-toolbar.css`, que é funcionalmente equivalente).
- Caso uma versão futura do Seelen UI exponha esses widgets separadamente,
  basta adicionar em `metadata.yml`:

  ```yaml
  styles:
    "@seelen/notifications": !include styles/notifications.css
    "@seelen/media": !include styles/media-module.css
  ```

  e remover as seções correspondentes de `fancy-toolbar.css` para não duplicar.

## Personalização via Settings

O tema expõe variáveis ajustáveis direto no painel do Seelen UI (sem editar
CSS):

| Variável             | O que controla                          | Padrão      |
|-----------------------|------------------------------------------|-------------|
| `--ca-accent`         | Cor de destaque (bordas, itens ativos)   | `#CBA6F7` (Mauve) |
| `--ca-abyss`          | Fundo do dock/toolbar                    | `#08080D`   |
| `--ca-crust`          | Fundo secundário / bordas                | `#0B0B12`   |
| `--ca-base`           | Fundo de painéis/popovers                | `#181825`   |
| `--ca-surface0`       | Fundo de janelas flutuantes/cards        | `#242430`   |
| `--ca-bg-opacity`     | Opacidade geral dos painéis (40–100)     | `88`        |
| `--ca-blur`           | Intensidade do blur                      | `24px`      |
| `--ca-radius`         | Raio das bordas                          | `12`        |
| `--ca-border-width`   | Espessura da borda                       | `1`         |
| `--ca-font`           | Fonte principal                          | `Segoe UI Variable` |

## Ajuste fino / DevTools

Como recomenda a documentação oficial, os nomes exatos de classes podem
variar levemente entre builds do Seelen UI. Os seletores deste tema usam
tanto classes exatas confirmadas (`.taskbar`, `.taskbar-bg-layer-2`,
`.weg-item`, `.weg-item-icon`, `.ft-bar`, `.ft-bar-item`,
`.ft-bar-item-clickable`, `.wm-leaf`, `.launcher`, `.launcher-item`) quanto
seletores `[class*="..."]` como rede de segurança para módulos mais novos
(quick-settings, power-menu, task-switcher, notificações, media module).

Para depurar/ajustar ao vivo:

1. Clique na toolbar ou no dock para focar o widget.
2. Pressione `Ctrl+Shift+I` (ou `Ctrl+Shift+Alt+I`) para abrir o DevTools.
3. Inspecione o elemento, confirme a classe real e ajuste o seletor
   correspondente no arquivo `.css` deste tema.

## Paleta de referência

| Token       | Hex       | Uso                                   |
|-------------|-----------|----------------------------------------|
| Abyss       | `#08080D` | Fundo do dock/toolbar                 |
| Crust       | `#0B0B12` | Fundo secundário                      |
| Mantle      | `#11111B` | Inputs, campos de texto               |
| Base        | `#181825` | Painéis, popovers                     |
| Surface0    | `#242430` | Janelas flutuantes, cards             |
| Surface1    | `#313244` | Hover                                 |
| Surface2    | `#45475A` | Elemento ativo                        |
| Text        | `#CDD6F4` | Texto principal                       |
| Subtext1    | `#BAC2DE` | Texto secundário                      |
| Subtext0    | `#A6ADC8` | Texto terciário / legendas            |
| Mauve       | `#CBA6F7` | Accent (bordas, destaques)            |
