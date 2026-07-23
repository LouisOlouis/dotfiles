// ============================================================
// Catppuccin Abyss — ags/widgets/dock.js
// Dock centralizada, inspirada no Seelen UI / Windows 11
// ============================================================

import Widget      from 'resource:///com/github/Aylur/ags/widget.js';
import Hyprland    from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Applications from 'resource:///com/github/Aylur/ags/service/applications.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';

// Apps fixos na dock (class/executable do app)
const PINNED = [
    { id: 'zen-browser',          icon: 'zen-browser',           name: 'Zen Browser'   },
    { id: 'code',                  icon: 'code',                  name: 'VS Code'       },
    { id: 'kitty',                 icon: 'kitty',                 name: 'Terminal'      },
    { id: 'org.gnome.Nautilus',   icon: 'org.gnome.Nautilus',   name: 'Arquivos'      },
    { id: 'discord',               icon: 'discord',               name: 'Discord'       },
    { id: 'steam',                 icon: 'steam',                 name: 'Steam'         },
    { id: 'lazygit',               icon: 'git',                   name: 'LazyGit'       },
];

// Verifica se um app está rodando comparando pelo class do cliente
function clientMatchesId(client, id) {
    const cls  = (client.class || '').toLowerCase();
    const idlo = id.toLowerCase();
    return cls === idlo || cls.includes(idlo) || idlo.includes(cls);
}

// Retorna lista de janelas que pertencem a este id
function getWindows(id) {
    return Hyprland.clients.filter(c => clientMatchesId(c, id));
}

// Foca ou lança o app
function activateApp(id, appEntry) {
    const windows = getWindows(id);
    if (windows.length === 0) {
        // Tentar lançar via .desktop
        const app = Applications.list.find(a =>
            (a.name  || '').toLowerCase().includes(id.toLowerCase()) ||
            (a.executable || '').toLowerCase().includes(id.toLowerCase())
        );
        if (app) app.launch();
        else execAsync(['bash', '-c', id]).catch(() => {});
    } else if (windows.length === 1) {
        Hyprland.dispatch('focuswindow', `address:${windows[0].address}`);
    } else {
        // Múltiplas janelas: foca a próxima em sequência
        const active = Hyprland.active.client.address;
        const idx    = windows.findIndex(w => w.address === active);
        const next   = windows[(idx + 1) % windows.length];
        Hyprland.dispatch('focuswindow', `address:${next.address}`);
    }
}

// Um item da dock
const DockItem = ({ id, icon, name }) => {
    // Reativo: está rodando?
    const isRunning = Hyprland.bind('clients').transform(
        clients => clients.some(c => clientMatchesId(c, id))
    );

    // Reativo: está focado?
    const isFocused = Hyprland.bind('active-client').transform(
        active => active && clientMatchesId(active, id)
    );

    const indicator = Widget.Box({
        class_name: 'dock-indicator',
        hpack: 'center',
    });

    // Atualizar classe do indicador reativamente
    indicator.hook(isRunning, () => {
        indicator.toggleClassName('running', isRunning.value);
    });
    indicator.hook(isFocused, () => {
        indicator.toggleClassName('focused', isFocused.value);
    });

    const btn = Widget.Button({
        class_name: 'dock-item',
        tooltip_text: name,
        on_clicked: () => activateApp(id, null),
        child: Widget.Box({
            vertical: true,
            spacing: 3,
            children: [
                Widget.Icon({
                    class_name: 'dock-icon',
                    icon: icon,
                    size: 44,
                }),
                indicator,
            ],
        }),
    });

    btn.hook(isRunning, () => btn.toggleClassName('running', isRunning.value));
    btn.hook(isFocused, () => btn.toggleClassName('focused', isFocused.value));

    return btn;
};

// Separador vertical
const Separator = () => Widget.Box({ class_name: 'dock-separator' });

// Apps não-fixos que estão rodando
const DynamicItems = () => Widget.Box({
    spacing: 4,
    setup: self => {
        const update = () => {
            const pinnedIds = PINNED.map(p => p.id.toLowerCase());

            // Classes únicas de janelas abertas que NÃO são pinned
            const seen = new Set();
            const dynamic = Hyprland.clients
                .filter(c => {
                    const cls = (c.class || '').toLowerCase();
                    if (!cls || seen.has(cls)) return false;
                    const isPinned = pinnedIds.some(id =>
                        cls === id || cls.includes(id) || id.includes(cls)
                    );
                    if (isPinned) return false;
                    seen.add(cls);
                    return true;
                });

            if (dynamic.length === 0) {
                self.children = [];
                self.visible  = false;
                return;
            }

            self.visible = true;
            self.children = [
                Separator(),
                ...dynamic.map(c => {
                    const app = Applications.list.find(a =>
                        (a.name       || '').toLowerCase().includes(c.class.toLowerCase()) ||
                        (a.executable || '').toLowerCase().includes(c.class.toLowerCase())
                    );
                    return DockItem({
                        id:   c.class,
                        icon: app?.icon_name || 'application-x-executable',
                        name: app?.name || c.title || c.class,
                    });
                }),
            ];
        };

        self.hook(Hyprland, update, 'notify::clients');
        update();
    },
});

// Janela principal da dock
export default () => Widget.Window({
    name:        'dock',
    anchor:      ['bottom'],
    layer:       'top',
    exclusivity: 'exclusive',
    margins:     [0, 0, 10, 0],

    child: Widget.Box({
        class_name: 'dock-outer',
        child: Widget.Box({
            class_name: 'dock-inner',
            spacing: 4,
            children: [
                // Apps fixos
                ...PINNED.map(DockItem),
                // Apps dinâmicos (não-fixos abertos)
                DynamicItems(),
            ],
        }),
    }),
});
