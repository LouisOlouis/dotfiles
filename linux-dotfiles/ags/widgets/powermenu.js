// ============================================================
// Catppuccin Abyss — ags/widgets/powermenu.js
// Menu de energia (toggle: ags -t powermenu)
// ============================================================

import Widget       from 'resource:///com/github/Aylur/ags/widget.js';
import App          from 'resource:///com/github/Aylur/ags/app.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';

const close = () => App.closeWindow('powermenu');

const PowerBtn = ({ icon, label, command, colorClass }) => Widget.Button({
    class_name: `power-btn ${colorClass || ''}`,
    tooltip_text: label,
    on_clicked: () => { close(); execAsync(['bash', '-c', command]); },
    child: Widget.Box({
        vertical: true,
        spacing: 8,
        hpack: 'center',
        children: [
            Widget.Label({ label: icon,  class_name: 'power-icon'  }),
            Widget.Label({ label: label, class_name: 'power-label' }),
        ],
    }),
});

const ACTIONS = [
    { icon: '󰌾', label: 'Bloquear',  command: 'hyprlock',                  colorClass: 'blue'   },
    { icon: '󰒲', label: 'Suspender', command: 'systemctl suspend',           colorClass: 'teal'   },
    { icon: '󰑓', label: 'Reiniciar', command: 'systemctl reboot',            colorClass: 'yellow' },
    { icon: '󰐥', label: 'Desligar',  command: 'systemctl poweroff',          colorClass: 'red'    },
    { icon: '󰗽', label: 'Sair',      command: 'hyprctl dispatch exit',       colorClass: 'mauve'  },
];

export default () => Widget.Window({
    name:    'powermenu',
    anchor:  ['top', 'right'],
    layer:   'overlay',
    margins: [55, 10, 0, 0],
    visible: false,
    keymode: 'exclusive',

    child: Widget.Box({
        class_name: 'powermenu-box',
        vertical: true,
        spacing: 12,
        children: [
            Widget.Label({ label: '󰐥  Sessão', class_name: 'powermenu-title' }),
            Widget.Box({
                spacing: 10,
                homogeneous: true,
                children: ACTIONS.map(PowerBtn),
            }),
        ],
    }),

    setup: self => self.keybind('Escape', close),
});
