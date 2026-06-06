const NotificationSystem = {
    notifications: [...AppData.notifications],

    add(notification) {
        notification.id = 'N' + Date.now();
        notification.time = '刚刚';
        notification.unread = true;
        this.notifications.unshift(notification);
        this.renderBadge();
        this.renderList();
        if (typeof App !== 'undefined' && App.currentRole === notification.role) {
            this.showToast(notification);
        }
    },

    showToast(notification) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${notification.type}`;
        toast.innerHTML = `
            <div class="toast-icon">${notification.icon}</div>
            <div class="toast-content">
                <div class="toast-title">${notification.title}</div>
                <div class="toast-msg">${notification.desc}</div>
            </div>
        `;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(40px)';
            toast.style.transition = 'all 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    markAllRead() {
        this.notifications.forEach(n => n.unread = false);
        this.renderBadge();
        this.renderList();
    },

    markRead(id) {
        const n = this.notifications.find(x => x.id === id);
        if (n) {
            n.unread = false;
            this.renderBadge();
            this.renderList();
        }
    },

    getUnreadCount(role) {
        if (!role) return this.notifications.filter(n => n.unread).length;
        return this.notifications.filter(n => n.unread && n.role === role).length;
    },

    renderBadge() {
        const badge = document.getElementById('notification-badge');
        if (!badge) return;
        const count = this.getUnreadCount(App?.currentRole);
        if (count > 0) {
            badge.textContent = count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    },

    renderList() {
        const list = document.getElementById('notification-list');
        if (!list) return;
        const filtered = App?.currentRole
            ? this.notifications.filter(n => n.role === App.currentRole || n.role === undefined)
            : this.notifications;

        if (filtered.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔔</div>
                    <div>暂无通知消息</div>
                </div>
            `;
            return;
        }

        list.innerHTML = filtered.map(n => `
            <div class="notification-item ${n.unread ? 'unread' : ''}" data-id="${n.id}">
                <div class="notification-icon-wrap ${n.type}">${n.icon}</div>
                <div class="notification-content">
                    <div class="notification-title">${n.title}</div>
                    <div class="notification-desc">${n.desc}</div>
                    <div class="notification-time">${n.time}</div>
                </div>
            </div>
        `).join('');

        list.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                this.markRead(item.dataset.id);
            });
        });
    },

    init() {
        document.getElementById('notification-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('notification-panel').classList.toggle('show');
        });

        document.getElementById('mark-all-read')?.addEventListener('click', () => {
            this.markAllRead();
        });

        document.addEventListener('click', (e) => {
            const panel = document.getElementById('notification-panel');
            const btn = document.getElementById('notification-btn');
            if (panel && !panel.contains(e.target) && !btn.contains(e.target)) {
                panel.classList.remove('show');
            }
        });

        this.renderBadge();
        this.renderList();
    }
};

function showToast(title, msg, type = 'info') {
    const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', danger: '❌' };
    NotificationSystem.showToast({ icon: icons[type] || 'ℹ️', title, desc: msg, type });
}

function showModal({ title, content, width = '600px', onConfirm, confirmText = '确定', cancelText = '取消', showFooter = true }) {
    const container = document.getElementById('modal-container');
    container.innerHTML = `
        <div class="modal-overlay" id="modal-overlay">
            <div class="modal" style="max-width: ${width}">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" id="modal-close">&times;</button>
                </div>
                <div class="modal-body">${content}</div>
                ${showFooter ? `
                <div class="modal-footer">
                    <button class="btn btn-ghost" id="modal-cancel">${cancelText}</button>
                    <button class="btn btn-primary" id="modal-confirm">${confirmText}</button>
                </div>` : ''}
            </div>
        </div>
    `;

    const close = () => container.innerHTML = '';
    document.getElementById('modal-close')?.addEventListener('click', close);
    document.getElementById('modal-cancel')?.addEventListener('click', close);
    document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') close();
    });

    if (onConfirm) {
        document.getElementById('modal-confirm')?.addEventListener('click', () => {
            if (onConfirm() !== false) close();
        });
    }

    return { close };
}
