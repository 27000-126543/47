const ManagerPages = {
    'manager-dashboard'(main) {
        const avgResponse = 93.2;
        const avgResource = 65.8;
        const avgEvent = 89.5;
        const activeEvents = AppData.events.filter(e => e.status !== 'resolved' && e.status !== 'closed').length;

        main.innerHTML = App.renderPageHeader('决策总览', '全局应急管理态势与关键指标监控') + `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon green">⚡</div>
                    <div class="stat-info">
                        <h4>平均响应达标率</h4>
                        <div class="stat-value">${avgResponse}<span style="font-size:14px">%</span></div>
                        <div class="stat-change">较上月 +2.1%</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue">📦</div>
                    <div class="stat-info">
                        <h4>资源使用率</h4>
                        <div class="stat-value">${avgResource}<span style="font-size:14px">%</span></div>
                        <div class="stat-change">较上月 +3.5%</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">✅</div>
                    <div class="stat-info">
                        <h4>事件处理率</h4>
                        <div class="stat-value">${avgEvent}<span style="font-size:14px">%</span></div>
                        <div class="stat-change">较上月 +1.3%</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon red">🚨</div>
                    <div class="stat-info">
                        <h4>进行中事件</h4>
                        <div class="stat-value">${activeEvents}</div>
                        <div class="stat-change ${activeEvents > 0 ? 'down' : ''}">${activeEvents > 0 ? '需重点关注' : '运行平稳'}</div>
                    </div>
                </div>
            </div>

            <div class="charts-grid">
                <div class="card">
                    <div class="card-header"><h3>🏙️ 各区域风险等级分布</h3></div>
                    <div class="card-body"><div class="chart-container"><canvas id="mgr-risk"></canvas></div></div>
                </div>
                <div class="card">
                    <div class="card-header"><h3>📊 近6月综合指标趋势</h3></div>
                    <div class="card-body"><div class="chart-container"><canvas id="mgr-trend"></canvas></div></div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>🔔 待处理事项</h3>
                    <span class="tag tag-red">5 项待办</span>
                </div>
                <div class="card-body" style="padding:0">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>事项</th>
                                <th>类型</th>
                                <th>优先级</th>
                                <th>提交时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>5月份月度统计报表待审核</td>
                                <td><span class="tag tag-blue">报表审批</span></td>
                                <td><span class="tag tag-orange">高</span></td>
                                <td>2026-06-01 10:30</td>
                                <td><button class="btn btn-sm btn-primary" onclick="App.navigateTo('monthly-report')">处理</button></td>
                            </tr>
                            <tr>
                                <td>消防灭火器补货申请（100个）</td>
                                <td><span class="tag tag-orange">补货审批</span></td>
                                <td><span class="tag tag-orange">高</span></td>
                                <td>2026-06-06 08:30</td>
                                <td><button class="btn btn-sm btn-primary">审批</button></td>
                            </tr>
                            <tr>
                                <td>呼吸面罩补货申请（200个）</td>
                                <td><span class="tag tag-orange">补货审批</span></td>
                                <td><span class="tag tag-yellow">中</span></td>
                                <td>2026-06-05 14:20</td>
                                <td><button class="btn btn-sm btn-primary">审批</button></td>
                            </tr>
                            <tr>
                                <td>滨湖区风险等级调整建议</td>
                                <td><span class="tag tag-purple">风险调整</span></td>
                                <td><span class="tag tag-yellow">中</span></td>
                                <td>2026-06-04 16:00</td>
                                <td><button class="btn btn-sm btn-primary" onclick="App.navigateTo('risk')">处理</button></td>
                            </tr>
                            <tr>
                                <td>应急饮用水采购订单（PO-20260605-003）</td>
                                <td><span class="tag tag-green">采购审批</span></td>
                                <td><span class="tag tag-green">低</span></td>
                                <td>2026-06-05 09:15</td>
                                <td><button class="btn btn-sm btn-primary">审批</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card">
                <div class="card-header"><h3>📱 近期推送记录</h3></div>
                <div class="card-body" style="padding:0">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>推送时间</th>
                                <th>接收人</th>
                                <th>推送内容</th>
                                <th>类型</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2026-06-06 09:16</td>
                                <td>张局长、李副局长</td>
                                <td>【紧急事件】EVT-20260606-001 东城区居民楼火灾</td>
                                <td><span class="tag tag-red">事件告警</span></td>
                                <td><span class="tag tag-green">已送达</span></td>
                            </tr>
                            <tr>
                                <td>2026-06-06 08:00</td>
                                <td>全体管理层</td>
                                <td>【日报】昨日共处置事件12起，响应达标率95.8%</td>
                                <td><span class="tag tag-blue">日常推送</span></td>
                                <td><span class="tag tag-green">已送达</span></td>
                            </tr>
                            <tr>
                                <td>2026-06-01 09:00</td>
                                <td>张局长、王主任</td>
                                <td>【月报】5月份各区域响应达标率、资源使用率报表已生成</td>
                                <td><span class="tag tag-purple">月度报表</span></td>
                                <td><span class="tag tag-green">已送达</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        setTimeout(() => ManagerPages.initDashboardCharts(), 100);
    },

    initDashboardCharts() {
        const riskCtx = document.getElementById('mgr-risk');
        if (riskCtx) {
            const levels = Object.values(AppData.riskLevels);
            const counts = { high: 0, medium: 0, low: 0 };
            levels.forEach(l => counts[l.level]++);
            new Chart(riskCtx, {
                type: 'doughnut',
                data: {
                    labels: ['高风险', '中风险', '低风险'],
                    datasets: [{
                        data: [counts.high, counts.medium, counts.low],
                        backgroundColor: ['#e74c3c', '#f39c12', '#27ae60'],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'right' } }
                }
            });
        }

        const trendCtx = document.getElementById('mgr-trend');
        if (trendCtx) {
            new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                    datasets: [
                        { label: '响应达标率 %', data: [88, 90, 91, 92, 93, 94], borderColor: '#27ae60', tension: 0.4, fill: false },
                        { label: '资源使用率 %', data: [58, 60, 62, 63, 65, 66], borderColor: '#3498db', tension: 0.4, fill: false },
                        { label: '事件处理率 %', data: [85, 87, 88, 89, 90, 91], borderColor: '#f39c12', tension: 0.4, fill: false }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top' } },
                    scales: { y: { min: 50, max: 100 } }
                }
            });
        }
    },

    risk(main) {
        main.innerHTML = App.renderPageHeader('风险等级设置', '设置各区域风险等级，系统自动调整资源预置方案') + `
            <div class="card" style="background:#fff3e0;border-color:#ffe0b2">
                <div class="card-body">
                    <div style="display:flex;align-items:center;gap:12px">
                        <div style="font-size:32px">💡</div>
                        <div>
                            <strong>智能提示：</strong>调整区域风险等级后，系统将自动计算并推荐该区域的资源预置方案。高风险区域将配置更多的消防车辆、急救资源和应急物资储备。
                        </div>
                    </div>
                </div>
            </div>

            <div class="risk-grid">
                ${AppData.districts.map(d => {
                    const r = AppData.riskLevels[d];
                    return `
                    <div class="risk-card ${r.level}">
                        <h4>${d}</h4>
                        <p>人口：${r.population} 万 | 当前等级：<span class="tag tag-${r.level === 'high' ? 'red' : r.level === 'medium' ? 'yellow' : 'green'}">${r.name}</span></p>
                        <div class="form-group">
                            <label class="form-label">风险等级</label>
                            <select class="form-control" data-district="${d}" onchange="ManagerPages.changeRiskLevel('${d}', this.value)">
                                <option value="high" ${r.level === 'high' ? 'selected' : ''}>🔴 高风险</option>
                                <option value="medium" ${r.level === 'medium' ? 'selected' : ''}>🟡 中风险</option>
                                <option value="low" ${r.level === 'low' ? 'selected' : ''}>🟢 低风险</option>
                            </select>
                        </div>
                        <div class="resource-allocation">
                            <div class="resource-allocation-item">
                                <label>🚒 预置消防车</label>
                                <input type="number" value="${r.fireTrucks}" min="1" max="20" onchange="ManagerPages.updateResource('${d}', 'fireTrucks', this.value)">
                            </div>
                            <div class="resource-allocation-item">
                                <label>🚑 预置救护车</label>
                                <input type="number" value="${r.ambulances}" min="1" max="10" onchange="ManagerPages.updateResource('${d}', 'ambulances', this.value)">
                            </div>
                            <div class="resource-allocation-item">
                                <label>📦 物资等级</label>
                                <span style="font-size:13px;color:var(--gray-600)">${r.supplies}</span>
                            </div>
                        </div>
                        <button class="btn btn-sm btn-primary" style="margin-top:12px;width:100%" onclick="ManagerPages.applyPreset('${d}')">🔄 按风险等级应用默认配置</button>
                    </div>
                    `;
                }).join('')}
            </div>

            <div class="card" style="margin-top:20px">
                <div class="card-header"><h3>📋 风险等级配置标准</h3></div>
                <div class="card-body" style="padding:0">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>风险等级</th>
                                <th>适用场景</th>
                                <th>消防车配置</th>
                                <th>救护车配置</th>
                                <th>物资储备标准</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="tag tag-red">🔴 高风险</span></td>
                                <td>人口密集区、化工园区、历史高发区</td>
                                <td>8-12 辆</td>
                                <td>4-6 辆</td>
                                <td>高等级配置（5000人/3天用量）</td>
                            </tr>
                            <tr>
                                <td><span class="tag tag-yellow">🟡 中风险</span></td>
                                <td>普通城区、商业区、交通枢纽</td>
                                <td>5-7 辆</td>
                                <td>3-4 辆</td>
                                <td>标准配置（3000人/3天用量）</td>
                            </tr>
                            <tr>
                                <td><span class="tag tag-green">🟢 低风险</span></td>
                                <td>郊区、新建城区、人口稀疏区</td>
                                <td>3-4 辆</td>
                                <td>1-2 辆</td>
                                <td>基础配置（1500人/3天用量）</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    changeRiskLevel(district, level) {
        AppData.riskLevels[district].level = level;
        AppData.riskLevels[district].name = level === 'high' ? '高风险' : level === 'medium' ? '中风险' : '低风险';
        showToast('风险等级已更新', `${district} 风险等级已调整为${AppData.riskLevels[district].name}`, 'info');
    },

    updateResource(district, field, value) {
        AppData.riskLevels[district][field] = parseInt(value);
    },

    applyPreset(district) {
        const level = AppData.riskLevels[district].level;
        const presets = {
            high: { fireTrucks: 10, ambulances: 5, supplies: '高等级配置' },
            medium: { fireTrucks: 6, ambulances: 3, supplies: '标准配置' },
            low: { fireTrucks: 4, ambulances: 2, supplies: '基础配置' }
        };
        const p = presets[level];
        AppData.riskLevels[district] = { ...AppData.riskLevels[district], ...p };

        showToast('配置已应用', `${district} 已按${AppData.riskLevels[district].name}标准应用资源预置方案`, 'success');

        NotificationSystem.add({
            type: 'info',
            icon: '⚙️',
            title: '资源预置方案已调整',
            desc: `${district} 已调整为${AppData.riskLevels[district].name}配置`,
            role: 'commander'
        });
        NotificationSystem.add({
            type: 'info',
            icon: '📦',
            title: '物资预置方案更新',
            desc: `请按新的预置方案调整${district}的物资储备`,
            role: 'supplier'
        });

        App.navigateTo('risk');
    },

    'resource-plan'(main) {
        main.innerHTML = App.renderPageHeader('资源预置方案', '基于区域风险等级的自动资源预置与优化建议',
            `<button class="btn btn-primary" onclick="ManagerPages.runOptimization()">🔬 执行智能优化</button>`) + `

            <div class="card">
                <div class="card-header"><h3>🚒 消防车辆预置分布</h3></div>
                <div class="card-body">
                    <div style="height:320px"><canvas id="res-trucks"></canvas></div>
                </div>
            </div>

            <div class="charts-grid">
                <div class="card">
                    <div class="card-header"><h3>🚑 急救车辆预置分布</h3></div>
                    <div class="card-body"><div class="chart-container"><canvas id="res-ambulances"></canvas></div></div>
                </div>
                <div class="card">
                    <div class="card-header"><h3>📦 物资储备等级分布</h3></div>
                    <div class="card-body"><div class="chart-container"><canvas id="res-supplies"></canvas></div></div>
                </div>
            </div>

            <div class="card">
                <div class="card-header"><h3>💡 资源优化建议</h3></div>
                <div class="card-body">
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px">
                        <div style="padding:16px;background:#ffebee;border-radius:8px;border-left:4px solid var(--danger)">
                            <div style="font-weight:600;margin-bottom:8px;color:#c62828">🚨 滨湖区建议增配</div>
                            <p style="font-size:13px;color:#b71c1c;margin:0">近三月洪涝事件上升12%，建议增加救援艇3艘、防汛物资储备增加50%，预置消防车增至7辆。</p>
                        </div>
                        <div style="padding:16px;background:#fff3e0;border-radius:8px;border-left:4px solid var(--warning)">
                            <div style="font-weight:600;margin-bottom:8px;color:#e65100">⚡ 高新区可优化</div>
                            <p style="font-size:13px;color:#bf360c;margin:0">当前资源使用率仅55%，可将1辆消防车调往东城区支援，提升整体利用率约8%。</p>
                        </div>
                        <div style="padding:16px;background:#e3f2fd;border-radius:8px;border-left:4px solid var(--info)">
                            <div style="font-weight:600;margin-bottom:8px;color:#1565c0">🏥 急救资源建议</div>
                            <p style="font-size:13px;color:#0d47a1;margin:0">中心区晚高峰急救需求较大，建议17-19时增派2辆救护车机动待命，预计可缩短响应时间1.5分钟。</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        setTimeout(() => ManagerPages.initResourceCharts(), 100);
    },

    initResourceCharts() {
        const districts = AppData.districts;
        const trucks = districts.map(d => AppData.riskLevels[d]?.fireTrucks || 5);
        const ambulances = districts.map(d => AppData.riskLevels[d]?.ambulances || 3);

        const trucksCtx = document.getElementById('res-trucks');
        if (trucksCtx) {
            new Chart(trucksCtx, {
                type: 'bar',
                data: {
                    labels: districts,
                    datasets: [
                        { label: '当前配置', data: trucks, backgroundColor: '#e67e22', borderRadius: 4 },
                        { label: '建议配置', data: trucks.map(v => v + (Math.random() > 0.5 ? 1 : 0)), backgroundColor: '#bdc3c7', borderRadius: 4 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top' } }
                }
            });
        }

        const ambCtx = document.getElementById('res-ambulances');
        if (ambCtx) {
            new Chart(ambCtx, {
                type: 'bar',
                data: {
                    labels: districts,
                    datasets: [{
                        label: '救护车数量',
                        data: ambulances,
                        backgroundColor: '#27ae60',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }

        const suppliesCtx = document.getElementById('res-supplies');
        if (suppliesCtx) {
            const supplyCounts = { '高等级配置': 0, '标准配置': 0, '基础配置': 0 };
            districts.forEach(d => supplyCounts[AppData.riskLevels[d]?.supplies]++);
            new Chart(suppliesCtx, {
                type: 'pie',
                data: {
                    labels: Object.keys(supplyCounts),
                    datasets: [{
                        data: Object.values(supplyCounts),
                        backgroundColor: ['#e74c3c', '#f39c12', '#27ae60']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'right' } }
                }
            });
        }
    },

    runOptimization() {
        showModal({
            title: '🔬 智能资源优化分析',
            showFooter: false,
            width: '560px',
            content: `
                <div style="text-align:center;padding:20px 0">
                    <div style="font-size:64px;margin-bottom:16px">🤖</div>
                    <h3 style="margin-bottom:8px">AI 资源优化分析完成</h3>
                    <p style="color:var(--gray-500);margin-bottom:24px">基于近6个月历史数据和实时运行态势分析</p>
                    <div style="text-align:left;background:var(--gray-50);border-radius:8px;padding:20px">
                        <p style="margin-bottom:8px">✅ <strong>整体资源利用率预计提升：</strong>+12.3%</p>
                        <p style="margin-bottom:8px">✅ <strong>平均响应时间预计缩短：</strong>-0.8 分钟</p>
                        <p style="margin-bottom:8px">✅ <strong>建议调整区域：</strong>3 个</p>
                        <p style="margin-bottom:8px">✅ <strong>建议调增车辆：</strong>消防车 +2，救护车 +1</p>
                        <p>✅ <strong>预计节约年度采购成本：</strong>¥18.5万</p>
                    </div>
                    <div style="margin-top:24px;display:flex;gap:12px;justify-content:center">
                        <button class="btn btn-ghost" onclick="document.querySelector('#modal-close').click()">取消</button>
                        <button class="btn btn-primary" onclick="ManagerPages.applyOptimization()">应用优化方案</button>
                    </div>
                </div>
            `
        });
    },

    applyOptimization() {
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) modalOverlay.remove();
        showToast('优化方案已应用', '资源预置方案已按AI建议更新', 'success');

        NotificationSystem.add({
            type: 'info',
            icon: '🎯',
            title: '资源预置方案已优化',
            desc: 'AI智能优化方案已执行，资源利用率预计提升12.3%',
            role: 'commander'
        });
    },

    'monthly-report'(main) {
        const report = AppData.monthlyReports[0];

        main.innerHTML = App.renderPageHeader('月度报表', '每月1号自动统计生成的各区域综合指标对比报表',
            `<div>
                <button class="btn btn-ghost" style="margin-right:8px">📥 下载PDF</button>
                <button class="btn btn-primary" onclick="ManagerPages.pushToMobile()">📱 推送到手机端</button>
            </div>`) + `

            <div class="card">
                <div class="card-header">
                    <h3>📊 ${report.month} 月度综合报表</h3>
                    <span class="tag tag-blue">每月1号自动生成</span>
                </div>
                <div class="card-body">
                    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">
                        <div class="stat-card">
                            <div class="stat-icon green">⚡</div>
                            <div class="stat-info">
                                <h4>全市平均响应达标率</h4>
                                <div class="stat-value">94.7<span style="font-size:14px">%</span></div>
                                <div class="stat-change">较上月 +1.5%</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon blue">📦</div>
                            <div class="stat-info">
                                <h4>全市平均资源使用率</h4>
                                <div class="stat-value">60.4<span style="font-size:14px">%</span></div>
                                <div class="stat-change">较上月 +2.8%</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon orange">✅</div>
                            <div class="stat-info">
                                <h4>全市平均事件处理率</h4>
                                <div class="stat-value">89.4<span style="font-size:14px">%</span></div>
                                <div class="stat-change">较上月 +0.9%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="charts-grid">
                <div class="card">
                    <div class="card-header"><h3>📈 各区域响应达标率对比</h3></div>
                    <div class="card-body"><div class="chart-container"><canvas id="report-response"></canvas></div></div>
                </div>
                <div class="card">
                    <div class="card-header"><h3>📦 各区域资源使用率对比</h3></div>
                    <div class="card-body"><div class="chart-container"><canvas id="report-resource"></canvas></div></div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>🏙️ 各区域指标对比明细</h3>
                    <span style="font-size:12px;color:var(--gray-500)">统计周期：${report.month}</span>
                </div>
                <div class="card-body" style="padding:0">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>区域</th>
                                <th>事件数量</th>
                                <th>响应达标率</th>
                                <th>资源使用率</th>
                                <th>事件处理率</th>
                                <th>综合排名</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${report.districts
                                .sort((a, b) => (b.responseRate + b.eventRate) / 2 - (a.responseRate + a.eventRate) / 2)
                                .map((d, i) => `
                                <tr>
                                    <td><strong>${d.name}</strong></td>
                                    <td>${d.events} 件</td>
                                    <td>
                                        <div style="display:flex;align-items:center;gap:8px">
                                            <div class="progress-bar" style="width:80px;flex:none">
                                                <div class="progress-fill ${d.responseRate >= 95 ? 'success' : d.responseRate >= 90 ? 'info' : 'warning'}" style="width:${d.responseRate}%"></div>
                                            </div>
                                            <span class="tag tag-${d.responseRate >= 95 ? 'green' : d.responseRate >= 90 ? 'blue' : 'yellow'}">${d.responseRate}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style="display:flex;align-items:center;gap:8px">
                                            <div class="progress-bar" style="width:80px;flex:none">
                                                <div class="progress-fill ${d.resourceUsage >= 70 ? 'warning' : d.resourceUsage >= 50 ? 'info' : 'success'}" style="width:${d.resourceUsage}%"></div>
                                            </div>
                                            <span>${d.resourceUsage}%</span>
                                        </div>
                                    </td>
                                    <td><span class="tag tag-${d.eventRate >= 90 ? 'green' : d.eventRate >= 85 ? 'blue' : 'orange'}">${d.eventRate}%</span></td>
                                    <td>
                                        ${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `<strong style="color:var(--gray-500)">第 ${i + 1} 名</strong>`}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card">
                <div class="card-header"><h3>📋 月度总结与下月计划</h3></div>
                <div class="card-body">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
                        <div>
                            <h4 style="margin-bottom:12px;color:var(--gray-700)">📝 本月工作总结</h4>
                            <div style="font-size:13px;color:var(--gray-600);line-height:1.9">
                                <p>✅ 本月共处置各类应急事件 <strong>249</strong> 起，较上月增加 8.3%</p>
                                <p>✅ 全市平均响应达标率 <strong>94.7%</strong>，超过 90% 的年度目标</p>
                                <p>✅ 成功处置 EVT-20260605-015 滨湖区洪水事件，无人员伤亡</p>
                                <p>✅ 新增高新区消防站投入运行，东南区域响应时间缩短 22%</p>
                                <p style="color:var(--warning)">⚠️ 滨湖区洪涝事件较上月上升 12%，需加强防汛物资储备</p>
                            </div>
                        </div>
                        <div>
                            <h4 style="margin-bottom:12px;color:var(--gray-700)">🎯 下月工作计划</h4>
                            <div style="font-size:13px;color:var(--gray-600);line-height:1.9">
                                <p>📌 完成滨湖区防汛物资增配，新增救援艇 5 艘</p>
                                <p>📌 组织全市应急演练 2 次，检验跨区域协同能力</p>
                                <p>📌 推进 AI 智能调度系统二期上线，提升派单效率</p>
                                <p>📌 完成各消防站第三季度装备巡检工作</p>
                                <p>📌 开展应急物资盘点，确保库存准确率达到 99% 以上</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        setTimeout(() => ManagerPages.initReportCharts(report), 100);
    },

    initReportCharts(report) {
        const respCtx = document.getElementById('report-response');
        if (respCtx) {
            new Chart(respCtx, {
                type: 'bar',
                data: {
                    labels: report.districts.map(d => d.name),
                    datasets: [{
                        label: '响应达标率 %',
                        data: report.districts.map(d => d.responseRate),
                        backgroundColor: report.districts.map(d => d.responseRate >= 95 ? '#27ae60' : d.responseRate >= 90 ? '#3498db' : '#f39c12'),
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { min: 80, max: 100 } }
                }
            });
        }

        const resCtx = document.getElementById('report-resource');
        if (resCtx) {
            new Chart(resCtx, {
                type: 'bar',
                data: {
                    labels: report.districts.map(d => d.name),
                    datasets: [{
                        label: '资源使用率 %',
                        data: report.districts.map(d => d.resourceUsage),
                        backgroundColor: '#3498db',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { min: 0, max: 100 } }
                }
            });
        }
    },

    pushToMobile() {
        showModal({
            title: '📱 推送报表到手机端',
            confirmText: '确认推送',
            onConfirm: () => {
                showToast('推送成功', '月度报表已推送至管理层手机端', 'success');

                NotificationSystem.add({
                    type: 'info',
                    icon: '📱',
                    title: '月度报表已推送',
                    desc: '5月份月度综合报表已推送到您的手机端，请查收',
                    role: 'manager'
                });
            },
            content: `
                <p style="margin-bottom:16px">确认将 2026年5月 月度综合报表推送到以下人员手机端？</p>
                <div style="display:flex;flex-direction:column;gap:10px">
                    <label style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--gray-50);border-radius:6px">
                        <input type="checkbox" checked> <strong>张局长</strong>（138****8888）
                    </label>
                    <label style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--gray-50);border-radius:6px">
                        <input type="checkbox" checked> <strong>李副局长</strong>（139****6666）
                    </label>
                    <label style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--gray-50);border-radius:6px">
                        <input type="checkbox"> <strong>王主任</strong>（137****5555）
                    </label>
                    <label style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--gray-50);border-radius:6px">
                        <input type="checkbox"> <strong>赵科长</strong>（136****4444）
                    </label>
                </div>
            `
        });
    }
};
