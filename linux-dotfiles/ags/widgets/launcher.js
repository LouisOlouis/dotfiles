// ============================================================
// Catppuccin Abyss — ags/widgets/launcher.js
// App launcher (toggle: ags -t launcher)
// ============================================================

import Widget       from 'resource:///com/github/Aylur/ags/widget.js';
import App          from 'resource:///com/github/Aylur/ags/app.js';
import Applications from 'resource:///com/github/Aylur/ags/service/applications.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';

const MAX_RESULTS = 8;

// Item de resultado
const AppItem = (app, onClose) => Widget.Button({
    class_name: 'launcher-item',
    on_clicked: () => {
        app.launch();
        onClose();
    },
    child: Widget.Box({
        spacing: 14,
        children: [
            Widget.Icon({
                icon: app.icon_name || 'application-x-executable',
                size: 36,
                class_name: 'launcher-item-icon',
            }),
            Widget.Box({
                vertical: true,
                vpack: 'center',
                children: [
                    Widget.Label({
                        label:  app.name || '',
                        xalign: 0,
                        class_name: 'launcher-item-name',
                        max_width_chars: 30,
                        truncate: 'end',
                    }),
                    Widget.Label({
                        label:  app.description || '',
                        xalign: 0,
                        class_name: 'launcher-item-desc',
                        max_width_chars: 36,
                        truncate: 'end',
                        visible: !!(app.description),
                    }),
                ],
            }),
        ],
    }),
});

export default () => {
    let query = '';

    const resultsList = Widget.Box({
        vertical: true,
        spacing: 2,
        class_name: 'launcher-results',
    });

    const close = () => App.closeWindow('launcher');

    const updateResults = (q) => {
        query = q;
        const apps = q.length === 0
            ? Applications.list.slice(0, MAX_RESULTS)
            : Applications.query(q).slice(0, MAX_RESULTS);

        resultsList.children = apps.map(a => AppItem(a, close));
    };

    const searchEntry = Widget.Entry({
        class_name: 'launcher-entry',
        hexpand: true,
        placeholder_text: ' Buscar apps...',
        on_change: ({ text }) => updateResults(text || ''),
        on_accept: () => {
            const apps = query
                ? Applications.query(query)
                : Applications.list;
            if (apps.length > 0) {
                apps[0].launch();
                close();
            }
        },
    });

    // Preencher com apps populares ao abrir
    updateResults('');

    return Widget.Window({
        name:   'launcher',
        anchor: ['top'],
        layer:  'overlay',
        margins: [60, 0, 0, 0],
        visible: false,
        keymode: 'exclusive',

        child: Widget.Box({
            class_name: 'launcher-box',
            vertical: true,
            spacing: 10,
            children: [
                Widget.Box({
                    class_name: 'launcher-search-row',
                    children: [
                        Widget.Label({ label: ' ', class_name: 'launcher-search-icon' }),
                        searchEntry,
                    ],
                }),
                resultsList,
            ],
        }),

        setup: self => {
            self.keybind('Escape', close);
            self.connect('notify::visible', () => {
                if (self.visible) {
                    searchEntry.text = '';
                    updateResults('');
                    searchEntry.grab_focus();
                }
            });
        },
    });
};
