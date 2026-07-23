// ============================================================
// Catppuccin Abyss — ags/widgets/notifications.js
// ============================================================

import Widget        from 'resource:///com/github/Aylur/ags/widget.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import App           from 'resource:///com/github/Aylur/ags/app.js';
import { timeout }   from 'resource:///com/github/Aylur/ags/utils.js';

// Mapa de urgência para cor Catppuccin
const URGENCY_COLOR = {
    low:      'blue',
    normal:   'mauve',
    critical: 'red',
};

// Card de uma notificação
const NotificationCard = (n) => {
    const urgencyClass = URGENCY_COLOR[n.urgency] || 'mauve';

    const icon = Widget.Box({
        class_name: `notif-icon ${urgencyClass}`,
        vpack: 'start',
        child: n.app_icon
            ? Widget.Icon({ icon: n.app_icon, size: 32 })
            : Widget.Label({ label: '󰂚', class_name: 'notif-icon-fallback' }),
    });

    const title = Widget.Label({
        class_name: 'notif-title',
        label:      n.summary || 'Notificação',
        xalign:     0,
        max_width_chars: 38,
        truncate: 'end',
    });

    const body = Widget.Label({
        class_name: 'notif-body',
        label:      n.body || '',
        xalign:     0,
        max_width_chars: 38,
        wrap: true,
        visible: !!(n.body),
    });

    const closeBtn = Widget.Button({
        class_name: 'notif-close',
        label: '󰅖',
        on_clicked: () => n.close(),
    });

    const actions = n.actions.length > 0
        ? Widget.Box({
            class_name: 'notif-actions',
            spacing: 6,
            children: n.actions.map(action =>
                Widget.Button({
                    class_name: 'notif-action-btn',
                    label: action.label,
                    on_clicked: () => {
                        n.invoke(action.id);
                        n.close();
                    },
                })
            ),
        })
        : null;

    const content = Widget.Box({
        vertical: true,
        spacing: 4,
        hexpand: true,
        children: [
            Widget.Box({
                spacing: 6,
                children: [
                    Widget.Label({
                        class_name: 'notif-app-name',
                        label: n.app_name || '',
                        xalign: 0,
                        hexpand: true,
                    }),
                    closeBtn,
                ],
            }),
            title,
            body,
            ...(actions ? [actions] : []),
        ],
    });

    return Widget.Box({
        class_name: `notification-card ${urgencyClass}`,
        spacing: 10,
        children: [icon, content],
    });
};

// Popup de notificações (canto superior direito)
export default () => {
    const list = Widget.Box({
        vertical: true,
        spacing: 8,
        children: [],
    });

    const win = Widget.Window({
        name:   'notifications',
        anchor: ['top', 'right'],
        layer:  'overlay',
        margins: [60, 14, 0, 0],
        child: Widget.Box({
            vertical: true,
            class_name: 'notifications-container',
            child: list,
        }),
    });

    // Adicionar nova notificação
    Notifications.connect('notified', (_, id) => {
        const n = Notifications.getNotification(id);
        if (!n) return;

        const card = NotificationCard(n);
        list.add(card);

        // Auto-remover após 5s (ou 8s se critical)
        const delay = n.urgency === 'critical' ? 8000 : 5000;
        timeout(delay, () => {
            if (card.get_parent()) card.destroy();
        });

        n.connect('closed', () => {
            if (card.get_parent()) card.destroy();
        });
    });

    return win;
};
