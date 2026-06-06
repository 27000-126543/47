const AppData = {
    eventTypes: {
        fire: { name: '火灾', icon: '🔥', color: 'fire', severity: 'high' },
        flood: { name: '洪水', icon: '🌊', color: 'flood', severity: 'high' },
        accident: { name: '交通事故', icon: '🚗', color: 'accident', severity: 'medium' },
        medical: { name: '医疗急救', icon: '🚑', color: 'medical', severity: 'medium' },
        earthquake: { name: '地震', icon: '🌋', color: 'fire', severity: 'critical' },
        chemical: { name: '化学品泄漏', icon: '☢️', color: 'accident', severity: 'critical' }
    },

    eventStatus: {
        pending: { name: '待调度', class: 'pending' },
        dispatched: { name: '已派单', class: 'dispatched' },
        processing: { name: '处置中', class: 'processing' },
        resolved: { name: '已解决', class: 'resolved' },
        closed: { name: '已归档', class: 'closed' }
    },

    districts: ['东城区', '西城区', '南城区', '北城区', '中心区', '高新区', '经开区', '滨湖区'],

    fireStations: [
        { id: 'FS001', name: '东城消防站', address: '东城区消防路1号', x: 15, y: 25, trucks: 8, crews: 24, available: 6 },
        { id: 'FS002', name: '西城消防站', address: '西城区安全街8号', x: 80, y: 30, trucks: 6, crews: 18, available: 4 },
        { id: 'FS003', name: '南城消防站', address: '南城区应急大道15号', x: 45, y: 75, trucks: 7, crews: 21, available: 5 },
        { id: 'FS004', name: '北城消防站', address: '北城区防护路22号', x: 30, y: 15, trucks: 5, crews: 15, available: 3 },
        { id: 'FS005', name: '中心消防站', address: '中心区紧急路5号', x: 50, y: 45, trucks: 10, crews: 30, available: 8 }
    ],

    hospitals: [
        { id: 'H001', name: '第一人民医院', address: '中心区健康路1号', x: 55, y: 50, ambulances: 6, beds: 120, available: 4 },
        { id: 'H002', name: '中心医院', address: '东城区医疗大道88号', x: 20, y: 40, ambulances: 5, beds: 80, available: 3 },
        { id: 'H003', name: '急救中心', address: '西城区生命街15号', x: 75, y: 55, ambulances: 8, beds: 200, available: 6 },
        { id: 'H004', name: '滨湖医院', address: '滨湖区救护路6号', x: 60, y: 80, ambulances: 4, beds: 60, available: 2 }
    ],

    warehouses: [
        { id: 'W001', name: '中心物资仓库', address: '中心区储备路100号', x: 40, y: 60, capacity: 5000 },
        { id: 'W002', name: '东城物资仓库', address: '东城区存储街50号', x: 25, y: 35, capacity: 3000 },
        { id: 'W003', name: '高新区物资仓库', address: '高新区供应大道200号', x: 85, y: 70, capacity: 4000 }
    ],

    staff: [
        { id: 'D001', name: '张建国', role: '队长', station: 'FS005', phone: '138****1234', status: 'available' },
        { id: 'D002', name: '李明辉', role: '消防员', station: 'FS005', phone: '139****5678', status: 'available' },
        { id: 'D003', name: '王志强', role: '消防员', station: 'FS001', phone: '137****9012', status: 'available' },
        { id: 'D004', name: '陈医生', role: '主治医师', station: 'H003', phone: '136****3456', status: 'available' },
        { id: 'D005', name: '刘护士', role: '急救护士', station: 'H001', phone: '135****7890', status: 'busy' },
        { id: 'D006', name: '赵志刚', role: '消防员', station: 'FS003', phone: '134****2345', status: 'available' }
    ],

    events: [
        {
            id: 'EVT-20260606-001',
            type: 'fire',
            title: '东城区居民楼火灾',
            description: '东城区幸福小区3号楼发生火灾，有人员被困',
            location: '东城区幸福小区3号楼',
            district: '东城区',
            x: 22, y: 32,
            reporter: '市民王先生',
            reporterPhone: '138****8888',
            severity: 'high',
            status: 'processing',
            reportedAt: '2026-06-06 09:15:30',
            dispatchedAt: '2026-06-06 09:16:45',
            arrivedAt: '2026-06-06 09:25:10',
            casualties: { injured: 3, trapped: 2 },
            dispatch: {
                station: 'FS001',
                trucks: 4,
                crews: 12,
                hospital: 'H002',
                ambulances: 2,
                warehouse: 'W002',
                supplies: ['灭火器 x20', '救生绳 x10', '呼吸面罩 x30']
            },
            progress: 65,
            photos: [
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
                'https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=300'
            ],
            timeline: [
                { time: '09:15:30', title: '接警上报', desc: '市民王先生报警称幸福小区3号楼发生火灾', type: 'info' },
                { time: '09:16:45', title: '调度派单', desc: '指挥中心派遣东城消防站4辆消防车、12名消防员', type: 'warning' },
                { time: '09:25:10', title: '到达现场', desc: '首批救援力量到达现场，开始疏散人员', type: 'success' },
                { time: '09:42:00', title: '火势控制', desc: '火势得到初步控制，成功救出5名被困人员', type: 'success' }
            ]
        },
        {
            id: 'EVT-20260606-002',
            type: 'medical',
            title: '中心区老人突发心脏病',
            description: '中心区公园内一名68岁老人突发心脏病，意识模糊',
            location: '中心区人民公园南门',
            district: '中心区',
            x: 52, y: 48,
            reporter: '监控系统AI识别',
            reporterPhone: '自动上报',
            severity: 'medium',
            status: 'dispatched',
            reportedAt: '2026-06-06 10:02:18',
            dispatchedAt: '2026-06-06 10:03:05',
            casualties: { injured: 1, trapped: 0 },
            dispatch: {
                hospital: 'H001',
                ambulances: 1,
                crews: 3
            },
            progress: 20,
            photos: [],
            timeline: [
                { time: '10:02:18', title: 'AI智能识别', desc: '监控系统AI识别到老人倒地，自动触发急救报警', type: 'info' },
                { time: '10:03:05', title: '急救派单', desc: '派遣第一人民医院1辆急救车前往处置', type: 'warning' }
            ]
        },
        {
            id: 'EVT-20260606-003',
            type: 'accident',
            title: '西城区多车连环追尾',
            description: '西城区快速路发生5车连环追尾事故，有人员受伤',
            location: '西城区快速路北段K12+500',
            district: '西城区',
            x: 78, y: 28,
            reporter: '市民李女士',
            reporterPhone: '139****6666',
            severity: 'medium',
            status: 'pending',
            reportedAt: '2026-06-06 10:18:42',
            casualties: { injured: 4, trapped: 1 },
            progress: 0,
            photos: [],
            timeline: [
                { time: '10:18:42', title: '接警上报', desc: '市民报警称西城区快速路发生多车追尾事故', type: 'info' }
            ]
        },
        {
            id: 'EVT-20260605-015',
            type: 'flood',
            title: '滨湖区河水倒灌',
            description: '滨湖区部分区域因连续降雨导致河水倒灌',
            location: '滨湖区沿河路周边',
            district: '滨湖区',
            x: 65, y: 82,
            reporter: '监控系统',
            severity: 'high',
            status: 'resolved',
            reportedAt: '2026-06-05 14:30:00',
            resolvedAt: '2026-06-05 20:15:00',
            progress: 100,
            photos: [],
            timeline: [
                { time: '14:30:00', title: '汛情预警', desc: '水位监测系统触发洪水预警', type: 'danger' },
                { time: '14:35:00', title: '紧急调度', desc: '调度消防、应急、医疗多方力量', type: 'warning' },
                { time: '20:15:00', title: '险情排除', desc: '积水排空，群众安全转移', type: 'success' }
            ]
        }
    ],

    inventory: [
        { id: 'I001', name: '消防灭火器', category: '消防装备', icon: '🧯', stock: 156, minStock: 200, unit: '个', lastRestock: '2026-05-28' },
        { id: 'I002', name: '消防水带', category: '消防装备', icon: '🚿', stock: 320, minStock: 150, unit: '米', lastRestock: '2026-05-20' },
        { id: 'I003', name: '救生衣', category: '救援装备', icon: '🦺', stock: 85, minStock: 100, unit: '件', lastRestock: '2026-05-15' },
        { id: 'I004', name: '救援绳索', category: '救援装备', icon: '🪢', stock: 280, minStock: 100, unit: '米', lastRestock: '2026-05-10' },
        { id: 'I005', name: '急救包', category: '医疗物资', icon: '🩹', stock: 450, minStock: 300, unit: '个', lastRestock: '2026-06-01' },
        { id: 'I006', name: '防护口罩', category: '医疗物资', icon: '😷', stock: 5200, minStock: 2000, unit: '个', lastRestock: '2026-05-25' },
        { id: 'I007', name: '呼吸面罩', category: '防护装备', icon: '😷', stock: 180, minStock: 300, unit: '个', lastRestock: '2026-04-28' },
        { id: 'I008', name: '应急照明设备', category: '通用装备', icon: '🔦', stock: 245, minStock: 150, unit: '套', lastRestock: '2026-05-30' },
        { id: 'I009', name: '应急帐篷', category: '生活物资', icon: '⛺', stock: 120, minStock: 80, unit: '顶', lastRestock: '2026-05-05' },
        { id: 'I010', name: '应急饮用水', category: '生活物资', icon: '💧', stock: 850, minStock: 1000, unit: '箱', lastRestock: '2026-05-18' },
        { id: 'I011', name: '压缩饼干', category: '生活物资', icon: '🍪', stock: 680, minStock: 500, unit: '箱', lastRestock: '2026-05-22' },
        { id: 'I012', name: '防护服', category: '防护装备', icon: '🥼', stock: 95, minStock: 200, unit: '套', lastRestock: '2026-04-15' }
    ],

    purchaseOrders: [
        { id: 'PO-20260603-001', items: [{ name: '消防灭火器', qty: 100, price: 120 }], total: 12000, status: 'approved', supplier: '安消防装备有限公司', createdAt: '2026-06-03 10:30:00', expectedDate: '2026-06-10' },
        { id: 'PO-20260604-002', items: [{ name: '呼吸面罩', qty: 200, price: 85 }, { name: '防护服', qty: 150, price: 180 }], total: 44000, status: 'pending', supplier: '防护科技有限公司', createdAt: '2026-06-04 14:20:00', expectedDate: '2026-06-12' },
        { id: 'PO-20260605-003', items: [{ name: '应急饮用水', qty: 500, price: 45 }], total: 22500, status: 'shipping', supplier: '清泉饮品有限公司', createdAt: '2026-06-05 09:15:00', expectedDate: '2026-06-08' }
    ],

    riskLevels: {
        '东城区': { level: 'high', name: '高风险', fireTrucks: 8, ambulances: 4, supplies: '高等级配置', population: 85 },
        '西城区': { level: 'medium', name: '中风险', fireTrucks: 6, ambulances: 3, supplies: '标准配置', population: 72 },
        '南城区': { level: 'medium', name: '中风险', fireTrucks: 6, ambulances: 3, supplies: '标准配置', population: 68 },
        '北城区': { level: 'low', name: '低风险', fireTrucks: 4, ambulances: 2, supplies: '基础配置', population: 45 },
        '中心区': { level: 'high', name: '高风险', fireTrucks: 10, ambulances: 5, supplies: '高等级配置', population: 120 },
        '高新区': { level: 'medium', name: '中风险', fireTrucks: 6, ambulances: 3, supplies: '标准配置', population: 58 },
        '经开区': { level: 'low', name: '低风险', fireTrucks: 4, ambulances: 2, supplies: '基础配置', population: 38 },
        '滨湖区': { level: 'high', name: '高风险', fireTrucks: 7, ambulances: 4, supplies: '高等级配置', population: 52 }
    },

    monthlyReports: [
        { month: '2026-05', districts: [
            { name: '东城区', responseRate: 94.5, resourceUsage: 72, eventRate: 88, events: 42 },
            { name: '西城区', responseRate: 96.2, resourceUsage: 65, eventRate: 91, events: 35 },
            { name: '南城区', responseRate: 92.8, resourceUsage: 58, eventRate: 85, events: 28 },
            { name: '北城区', responseRate: 98.1, resourceUsage: 42, eventRate: 95, events: 18 },
            { name: '中心区', responseRate: 95.7, resourceUsage: 85, eventRate: 90, events: 56 },
            { name: '高新区', responseRate: 93.4, resourceUsage: 55, eventRate: 87, events: 24 },
            { name: '经开区', responseRate: 97.2, resourceUsage: 38, eventRate: 93, events: 15 },
            { name: '滨湖区', responseRate: 89.6, resourceUsage: 68, eventRate: 82, events: 31 }
        ]}
    ],

    notifications: [
        { id: 'N001', type: 'danger', icon: '🔥', title: '新的紧急事件', desc: 'EVT-20260606-001 东城区居民楼火灾，请尽快处理', time: '10分钟前', unread: true, role: 'commander' },
        { id: 'N002', type: 'warning', icon: '📦', title: '库存预警', desc: '消防灭火器库存已低于安全线，请及时补货', time: '25分钟前', unread: true, role: 'supplier' },
        { id: 'N003', type: 'info', icon: '📋', title: '新任务指派', desc: '您已被指派至 EVT-20260606-001 火灾处置任务', time: '35分钟前', unread: true, role: 'dispatcher' },
        { id: 'N004', type: 'success', icon: '✅', title: '事件已解决', desc: 'EVT-20260605-015 滨湖区河水倒灌已成功处置', time: '2小时前', unread: false, role: 'manager' },
        { id: 'N005', type: 'warning', icon: '⚠', title: '月度报表', desc: '5月份各区域响应达标率报表已生成，请查收', time: '5小时前', unread: false, role: 'manager' }
    ],

    responseTimeHistory: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        fire: [8.5, 7.8, 7.2, 6.9, 6.5, 5.8],
        medical: [6.2, 5.8, 5.5, 5.2, 4.9, 4.5],
        accident: [10.2, 9.5, 8.8, 8.2, 7.9, 7.5],
        flood: [12.5, 11.8, 10.5, 9.8, 9.2, 8.8]
    },

    heatmapData: (() => {
        const data = [];
        for (let i = 0; i < 80; i++) {
            data.push(Math.floor(Math.random() * 10));
        }
        return data;
    })(),

    eventTypeDistribution: [
        { type: '火灾', count: 45, color: '#e74c3c' },
        { type: '医疗急救', count: 78, color: '#9b59b6' },
        { type: '交通事故', count: 62, color: '#f39c12' },
        { type: '洪水', count: 23, color: '#3498db' },
        { type: '其他', count: 19, color: '#95a5a6' }
    ]
};

const Utils = {
    MAP_RANGE: {
        minX: 0, maxX: 100,
        minY: 0, maxY: 100,
        realWidthKm: 15,
        realHeightKm: 15
    },

    generateEventId() {
        const now = new Date();
        const dateStr = now.getFullYear().toString() +
            (now.getMonth() + 1).toString().padStart(2, '0') +
            now.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 900 + 100);
        return `EVT-${dateStr}-${random}`;
    },

    formatTime(date) {
        const d = new Date(date);
        return d.toLocaleString('zh-CN', { hour12: false });
    },

    getCurrentTime() {
        return new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    },

    distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },

    coordDistanceToKm(coordDist) {
        const { realWidthKm, realHeightKm, maxX, maxY } = this.MAP_RANGE;
        const kmPerX = realWidthKm / maxX;
        const kmPerY = realHeightKm / maxY;
        const avgKmPerCoord = (kmPerX + kmPerY) / 2;
        return coordDist * avgKmPerCoord;
    },

    findNearest(x, y, list) {
        return list.map(item => {
            const coordDist = this.distance(x, y, item.x, item.y);
            const realDistKm = this.coordDistanceToKm(coordDist);
            return {
                ...item,
                distance: +realDistKm.toFixed(1),
                coordDistance: +coordDist.toFixed(2)
            };
        }).sort((a, b) => a.distance - b.distance);
    },

    generateDispatchPlan(eventType, severity) {
        const plans = {
            fire: {
                high: { trucks: 4, crews: 12, ambulances: 2 },
                medium: { trucks: 3, crews: 9, ambulances: 1 },
                low: { trucks: 2, crews: 6, ambulances: 1 }
            },
            medical: {
                high: { ambulances: 2, crews: 4 },
                medium: { ambulances: 1, crews: 3 },
                low: { ambulances: 1, crews: 2 }
            },
            accident: {
                high: { trucks: 2, crews: 6, ambulances: 2 },
                medium: { trucks: 1, crews: 3, ambulances: 1 },
                low: { ambulances: 1, crews: 2 }
            },
            flood: {
                high: { trucks: 3, crews: 10, ambulances: 2, boats: 3 },
                medium: { trucks: 2, crews: 6, ambulances: 1, boats: 2 },
                low: { trucks: 1, crews: 4, boats: 1 }
            },
            earthquake: {
                critical: { trucks: 6, crews: 20, ambulances: 4, dogs: 4 },
                high: { trucks: 5, crews: 15, ambulances: 3 }
            },
            chemical: {
                critical: { trucks: 5, crews: 15, ambulances: 3, hazmat: 2 },
                high: { trucks: 4, crews: 12, ambulances: 2, hazmat: 1 }
            }
        };
        return plans[eventType]?.[severity] || plans.fire.medium;
    },

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};
