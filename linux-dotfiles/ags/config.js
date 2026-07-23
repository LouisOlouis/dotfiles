// ============================================================
// Catppuccin Abyss — ags/config.js
// AGS v1 (aylurs-gtk-shell) — entry point
// ============================================================

import App from 'resource:///com/github/Aylur/ags/app.js';
import Dock from './widgets/dock.js';
import Notifications from './widgets/notifications.js';
import PowerMenu from './widgets/powermenu.js';
import Launcher from './widgets/launcher.js';

export default {
    style: App.configDir + '/style.css',

    windows: [
        Dock(),
        Notifications(),
        PowerMenu(),
        Launcher(),
    ],

    closeWindowDelay: {
        'powermenu':     300,
        'launcher':      200,
        'notifications': 0,
    },
};
