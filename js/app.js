const App = {
    currentRole: null,
    currentUser: null,
    currentPage: null,

    roleConfig: {
        commander: {
            name: '指挥中心',
            icon: '🎯',
            pages: [
                { id: 'dashboard', name: '指挥大屏', icon: '📊' },
                { id: 'events', name: '事件管理', icon: '📋' },
                { id: 'dispatch', name: '调度派单', icon: '🚨' },
                { id: 'map', name: '资源地图', icon: '🗺️' },
                { id: 'new-event', name: '事件上报', icon: '📝' }
            ]
        },
        dispatcher: {
            name: '现场处置员',
            icon: '🚒',
            pages: [
                { id: 'my-tasks', name: '我的任务', icon: '📋' },
                { id: 'check-in', name: '签到打卡', icon: '📍' },
                { id: 'report', name: '进度上报', icon: '📸' }
            ]
        },
        supplier: {
            name: '物资管理员',
            icon: '📦',
            pages: [
                { id: 'inventory', name: '库存管理', icon: '📦' },
                { id: 'replenish', name: '补货申请', icon: '🔄' },
                { id: 'purchase', name: '采购订单', icon: '📑' }
            ]
        },
        analyst: {
            name: '数据分析员',
            icon: '📊',
            pages: [
                { id: 'overview', name: '数据总览', icon: '📊' },
                { id: 'heatmap', name: '热力分布', icon: '🔥' },
                { id: 'trends', name: '趋势分析', icon: '📈' },
                { id: 'reports', name: '统计报表', icon: '📋' }
            ]
        },
        manager: {
            name: '管理层',
            icon: '👔',
            pages: [
                { id: 'manager-dashboard', name: '决策总览', icon: '📊' },
                { id: 'risk', name: '风险等级设置', icon: '⚠️' },
                { id: 'resource-plan', name: '资源预置方案', icon: '🎯' },
                { id: 'monthly-report', name: '月度报表', icon: '📑' }
            ]
        }
    },

    login(role) {
        this.currentRole = role;
        this.currentUser = {
            name: document.getElementById('username').value || '管理员',
            role: role
        };

        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');

        this.renderHeader();
        this.renderSidebar();
        this.navigateTo(this.roleConfig[role].pages[0].id);

        NotificationSystem.init();
        this.startClock();

        showToast('登录成功', `欢迎回来，${this.currentUser.name}`, 'success');
    },

    logout() {
        this.currentRole = null;
        this.currentUser = null;
        document.getElementById('main-app').classList.add('hidden');
        document.getElementById('login-page').classList.remove('hidden');
        document.querySelectorAll('.role-card').forEach(c => c.classList.remove('active'));
    },

    startClock() {
        const update = () => {
            document.getElementById('current-time').textContent = Utils.getCurrentTime();
        };
        update();
        setInterval(update, 1000);
    },

    renderHeader() {
        const role = this.roleConfig[this.currentRole];
        document.getElementById('current-role-label').textContent = role.name;
        document.getElementById('user-name').textContent = this.currentUser.name;
        document.getElementById('user-role-text').textContent = role.name;
        document.getElementById('user-avatar').textContent = this.currentUser.name.charAt(0).toUpperCase();

        const activeCount = AppData.events.filter(e => e.status !== 'resolved' && e.status !== 'closed').length;
        document.getElementById('active-events-count').textContent = activeCount;
        document.getElementById('online-staff').textContent = AppData.staff.filter(s => s.status === 'available').length;
    },

    renderSidebar() {
        const role = this.roleConfig[this.currentRole];
        const menu = document.getElementById('side-menu');

        menu.innerHTML = role.pages.map(page => `
            <div class="menu-item" data-page="${page.id}">
                <span class="menu-icon">${page.icon}</span>
                <span>${page.name}</span>
            </div>
        `).join('');

        menu.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                this.navigateTo(item.dataset.page);
            });
        });
    },

    setActiveMenu(pageId) {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === pageId);
        });
    },

    navigateTo(pageId) {
        this.currentPage = pageId;
        this.setActiveMenu(pageId);
        const main = document.getElementById('main-content');

        const router = {
            commander: CommanderPages,
            dispatcher: DispatcherPages,
            supplier: SupplierPages,
            analyst: AnalystPages,
            manager: ManagerPages
        };

        const pageModule = router[this.currentRole];
        if (pageModule && typeof pageModule[pageId] === 'function') {
            pageModule[pageId](main);
        } else {
            main.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔨</div><div>页面开发中...</div></div>';
        }
    },

    renderPageHeader(title, subtitle, actions = '') {
        return `
            <div class="page-header">
                <div class="page-title">
                    <h2>${title}</h2>
                    <p>${subtitle}</p>
                </div>
                <div class="page-actions">${actions}</div>
            </div>
        `;
    },

    init() {
        document.querySelectorAll('.role-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.role-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });

        document.querySelector('.role-card')?.classList.add('active');

        document.getElementById('login-btn').addEventListener('click', () => {
            const activeRole = document.querySelector('.role-card.active');
            if (!activeRole) {
                showToast('请选择角色', '请先选择您的登录角色', 'warning');
                return;
            }
            this.login(activeRole.dataset.role);
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
