const AnalystPages = {
    charts: {},

    overview(main) {
        const totalEvents = AppData.events.length;
        const resolvedEvents = AppData.events.filter(e => e.status === 'resolved' || e.status === 'closed').length;
        const avgResponseTime = 6.8;

        main.innerHTML = App.renderPageHeader('数据总览', '全市应急事件综合数据分析概览') + `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon red">📋</div>
                    <div class="stat-info">
                        <h4>事件总数</h4>
                        <div class="stat-value">227</div>
                        <div class="stat-change down">较上月 +8.3%</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">✅</div>
                    <div class="stat-info">
                        <h4>处置完成</h4>
                        <div class="stat-value">208</div>
                        <div class="stat-change">处置率 91.6%</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue">⏱️</div>
                    <div class="stat-info">
                        <h4>平均响应</h4>
                        <div class="stat-value">${avgResponseTime}<span style="font-size:14px">分钟</span></div>
                        <div class="stat-change">较上月 -0.6 分钟</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">📦</div>
                    <div class="stat-info">
                        <h4>物资使用率</h4>
                        <div class="stat-value">68.5<span style="font-size:14px">%</span></div>
                        <div class="stat-change down">较上月 +3.2%</div>
                    </div>
                </div>
            </div>

            <div class="charts-grid">
                <div class="card">
                    <div class="card-header"><h3>📊 事件类型分布</h3></div>
                    <div class="card-body"><div class="chart-container"><canvas id="chart-type"></canvas></div></div>
                </div>
                <div class="card">
                    <div class="card-header"><h3>📈 月度事件趋势</h3></div>
                    <div class="card-body"><div class="chart-container"><canvas id="chart-monthly"></canvas></div></div>
                </div>
            </div>

            <div class="card">
                <div class="card-header"><h3>🏙️ 各区域事件统计</h3></div>
                <div class="card-body" style="padding:0">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>区域</th>
                                <th>事件数量</th>
                                <th>占比</th>
                                <th>平均响应时间</th>
                                <th>处置率</th>
                                <th>风险等级</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${AppData.districts.map((d, i) => {
                                const counts = [56, 42, 38, 28, 31, 24, 18, 30];
                                const rates = [92.5, 94.2, 89.8, 96.1, 93.7, 91.4, 97.2, 88.6];
                                const times = [7.2, 6.5, 8.1, 5.8, 6.2, 7.5, 5.2, 8.8];
                                const level = AppData.riskLevels[d]?.level;
                                const count = counts[i] || 25;
                                return `
                                    <tr>
                                        <td>${d}</td>
                                        <td><strong>${count}</strong> 件</td>
                                        <td>
                                            <div style="display:flex;align-items:center;gap:8px">
                                                <div class="progress-bar" style="width:100px;flex:none">
                                                    <div class="progress-fill info" style="width:${(count / 56 * 100).toFixed(0)}%"></div>
                                                </div>
                                                <span style="font-size:12px">${(count / 227 * 100).toFixed(1)}%</span>
                                            </div>
                                        </td>
                                        <td>${times[i]} 分钟</td>
                                        <td><span class="tag tag-${rates[i] >= 95 ? 'green' : rates[i] >= 90 ? 'blue' : 'orange'}">${rates[i]}%</span></td>
                                        <td><span class="tag tag-${level === 'high' ? 'red' : level === 'medium' ? 'yellow' : 'green'}">${AppData.riskLevels[d]?.name || '-'}</span></td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        setTimeout(() => AnalystPages.initOverviewCharts(), 100);
    },

    initOverviewCharts() {
        const typeCtx = document.getElementById('chart-type');
        if (typeCtx) {
            AnalystPages.charts.type = new Chart(typeCtx, {
                type: 'doughnut',
                data: {
                    labels: AppData.eventTypeDistribution.map(d => d.type),
                    datasets: [{
                        data: AppData.eventTypeDistribution.map(d => d.count),
                        backgroundColor: AppData.eventTypeDistribution.map(d => d.color),
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'right' }
                    }
                }
            });
        }

        const monthlyCtx = document.getElementById('chart-monthly');
        if (monthlyCtx) {
            AnalystPages.charts.monthly = new Chart(monthlyCtx, {
                type: 'line',
                data: {
                    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                    datasets: [
                        {
                            label: '事件数量',
                            data: [28, 35, 32, 41, 38, 45],
                            borderColor: '#e74c3c',
                            backgroundColor: 'rgba(231,76,60,0.1)',
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: '已完成',
                            data: [26, 32, 30, 38, 35, 41],
                            borderColor: '#27ae60',
                            backgroundColor: 'rgba(39,174,96,0.1)',
                            fill: true,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top' } }
                }
            });
        }
    },

    heatmap(main) {
        main.innerHTML = App.renderPageHeader('热力分布', '按区域和类型展示历史事件分布热力图') + `
            <div class="card">
                <div class="card-header">
                    <h3>🔥 全市事件分布热力图</h3>
                    <div style="display:flex;gap:10px">
                        <select class="form-control" style="width:140px" id="heatmap-type">
                            <option value="all">全部类型</option>
                            ${Object.entries(AppData.eventTypes).map(([k, v]) => `<option value="${k}">${v.icon} ${v.name}</option>`).join('')}
                        </select>
                        <select class="form-control" style="width:140px" id="heatmap-period">
                            <option value="month">近一月</option>
                            <option value="quarter">近三月</option>
                            <option value="year">近一年</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="heatmap-grid" id="heatmap-grid">
                        ${AnalystPages.renderHeatmap()}
                    </div>
                    <div class="heatmap-labels">
                        <span>西南</span>
                        <span>东南</span>
                        <span>东北</span>
                        <span>西北</span>
                    </div>
                    <div style="display:flex;justify-content:center;gap:20px;margin-top:16px;align-items:center">
                        <span style="font-size:12px;color:var(--gray-500)">事件密度：</span>
                        <span style="font-size:11px;color:var(--gray-500)">低</span>
                        ${['#e3f2fd', '#90caf9', '#42a5f5', '#1e88e5', '#1565c0', '#0d47a1'].map(c =>
                            `<span style="display:inline-block;width:24px;height:16px;background:${c};border-radius:2px"></span>`
                        ).join('')}
                        <span style="font-size:11px;color:var(--gray-500)">高</span>
                    </div>
                </div>
            </div>

            <div class="charts-grid">
                <div class="card">
                    <div class="card-header"><h3>🏙️ 区域事件热力排名</h3></div>
                    <div class="card-body"><div class="chart-container"><canvas id="chart-district"></canvas></div></div>
                </div>
                <div class="card">
                    <div class="card-header"><h3>⏰ 时段事件分布</h3></div>
                    <div class="card-body"><div class="chart-container"><canvas id="chart-hour"></canvas></div></div>
                </div>
            </div>
        `;

        document.getElementById('heatmap-type')?.addEventListener('change', () => {
            document.getElementById('heatmap-grid').innerHTML = AnalystPages.renderHeatmap();
        });

        setTimeout(() => AnalystPages.initHeatmapCharts(), 100);
    },

    renderHeatmap() {
        let html = '';
        for (let i = 0; i < 80; i++) {
            const val = Math.random();
            let color;
            if (val < 0.15) color = '#e3f2fd';
            else if (val < 0.3) color = '#90caf9';
            else if (val < 0.5) color = '#42a5f5';
            else if (val < 0.7) color = '#1e88e5';
            else if (val < 0.85) color = '#1565c0';
            else color = '#0d47a1';
            html += `<div class="heatmap-cell" style="background:${color}" title="区域密度：${(val * 100).toFixed(0)}%"></div>`;
        }
        return html;
    },

    initHeatmapCharts() {
        const districtCtx = document.getElementById('chart-district');
        if (districtCtx) {
            AnalystPages.charts.district = new Chart(districtCtx, {
                type: 'bar',
                data: {
                    labels: AppData.districts,
                    datasets: [{
                        label: '事件数量',
                        data: [56, 42, 38, 28, 31, 24, 18, 30],
                        backgroundColor: ['#e74c3c', '#e67e22', '#f39c12', '#27ae60', '#3498db', '#9b59b6', '#1abc9c', '#34495e'],
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: { legend: { display: false } }
                }
            });
        }

        const hourCtx = document.getElementById('chart-hour');
        if (hourCtx) {
            AnalystPages.charts.hour = new Chart(hourCtx, {
                type: 'line',
                data: {
                    labels: ['0时', '3时', '6时', '9时', '12时', '15时', '18时', '21时'],
                    datasets: [{
                        label: '事件数量',
                        data: [8, 5, 12, 28, 35, 42, 38, 22],
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231,76,60,0.2)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }
    },

    trends(main) {
        main.innerHTML = App.renderPageHeader('趋势分析', '响应时间、处置效率等关键指标趋势分析') + `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon red">🔥</div>
                    <div class="stat-info">
                        <h4>火灾平均响应</h4>
                        <div class="stat-value">5.8<span style="font-size:14px">分钟</span></div>
                        <div class="stat-change">较上月 -0.7 分钟</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">🚑</div>
                    <div class="stat-info">
                        <h4>医疗平均响应</h4>
                        <div class="stat-value">4.5<span style="font-size:14px">分钟</span></div>
                        <div class="stat-change">较上月 -0.4 分钟</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">🚗</div>
                    <div class="stat-info">
                        <h4>事故平均响应</h4>
                        <div class="stat-value">7.5<span style="font-size:14px">分钟</span></div>
                        <div class="stat-change">较上月 -0.4 分钟</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue">🌊</div>
                    <div class="stat-info">
                        <h4>洪涝平均响应</h4>
                        <div class="stat-value">8.8<span style="font-size:14px">分钟</span></div>
                        <div class="stat-change">较上月 -0.4 分钟</div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header"><h3>📈 各类型事件响应时间趋势（近6个月）</h3></div>
                <div class="card-body">
                    <div style="height:380px"><canvas id="chart-response"></canvas></div>
                </div>
            </div>

            <div class="charts-grid">
                <div class="card">
                    <div class="card-header"><h3>⚡ 响应达标率趋势</h3></div>
                    <div class="card-body"><div class="chart-container"><canvas id="chart-compliance"></canvas></div></div>
                </div>
                <div class="card">
                    <div class="card-header"><h3>🎯 处置效率对比</h3></div>
                    <div class="card-body"><div class="chart-container"><canvas id="chart-efficiency"></canvas></div></div>
                </div>
            </div>

            <div class="card">
                <div class="card-header"><h3>📊 数据分析结论</h3></div>
                <div class="card-body">
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px">
                        <div style="padding:16px;background:#e8f5e9;border-radius:8px">
                            <div style="font-size:20px;margin-bottom:6px">✅ 响应效率提升</div>
                            <p style="font-size:13px;color:#2e7d32">各类型事件平均响应时间较上月均有下降，整体响应效率提升8.5%。新增的高新区消防站有效缩短了东南区域的响应时间。</p>
                        </div>
                        <div style="padding:16px;background:#fff3e0;border-radius:8px">
                            <div style="font-size:20px;margin-bottom:6px">⚠️ 滨湖区需关注</div>
                            <p style="font-size:13px;color:#e65100">滨湖区近三月事件数量上升12%，洪涝事件占比高，建议增加该区域救援艇和防汛物资储备。</p>
                        </div>
                        <div style="padding:16px;background:#e3f2fd;border-radius:8px">
                            <div style="font-size:20px;margin-bottom:6px">💡 资源优化建议</div>
                            <p style="font-size:13px;color:#1565c0">晚高峰（17-19时）交通事故高发，建议该时段在西城区和中心区增派巡逻车辆和应急人员待命。</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        setTimeout(() => AnalystPages.initTrendCharts(), 100);
    },

    initTrendCharts() {
        const responseCtx = document.getElementById('chart-response');
        if (responseCtx) {
            AnalystPages.charts.response = new Chart(responseCtx, {
                type: 'line',
                data: {
                    labels: AppData.responseTimeHistory.labels,
                    datasets: [
                        { label: '火灾', data: AppData.responseTimeHistory.fire, borderColor: '#e74c3c', backgroundColor: 'transparent', tension: 0.4, borderWidth: 2 },
                        { label: '医疗急救', data: AppData.responseTimeHistory.medical, borderColor: '#9b59b6', backgroundColor: 'transparent', tension: 0.4, borderWidth: 2 },
                        { label: '交通事故', data: AppData.responseTimeHistory.accident, borderColor: '#f39c12', backgroundColor: 'transparent', tension: 0.4, borderWidth: 2 },
                        { label: '洪水', data: AppData.responseTimeHistory.flood, borderColor: '#3498db', backgroundColor: 'transparent', tension: 0.4, borderWidth: 2 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top' } },
                    scales: {
                        y: {
                            title: { display: true, text: '响应时间（分钟）' },
                            min: 0
                        }
                    }
                }
            });
        }

        const complianceCtx = document.getElementById('chart-compliance');
        if (complianceCtx) {
            AnalystPages.charts.compliance = new Chart(complianceCtx, {
                type: 'line',
                data: {
                    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                    datasets: [{
                        label: '响应达标率 %',
                        data: [88.5, 90.2, 92.1, 93.5, 94.8, 95.6],
                        borderColor: '#27ae60',
                        backgroundColor: 'rgba(39,174,96,0.1)',
                        fill: true,
                        tension: 0.4
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

        const efficiencyCtx = document.getElementById('chart-efficiency');
        if (efficiencyCtx) {
            AnalystPages.charts.efficiency = new Chart(efficiencyCtx, {
                type: 'radar',
                data: {
                    labels: ['响应速度', '处置效率', '资源利用', '协同配合', '群众满意'],
                    datasets: [
                        { label: '本月', data: [92, 88, 78, 85, 90], borderColor: '#1e88e5', backgroundColor: 'rgba(30,136,229,0.2)' },
                        { label: '上月', data: [85, 82, 75, 80, 85], borderColor: '#95a5a6', backgroundColor: 'rgba(149,165,166,0.1)' }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    },

    reports(main) {
        main.innerHTML = App.renderPageHeader('统计报表', '各类数据报表生成与导出',
            `<button class="btn btn-primary">📥 导出报表</button>`) + `
            <div class="card">
                <div class="card-header">
                    <h3>📋 可生成报表</h3>
                </div>
                <div class="card-body">
                    <div class="quick-actions">
                        <div class="quick-action-btn" onclick="AnalystPages.generateReport('monthly')">
                            <div class="icon">📅</div>
                            <div class="label">月度综合报表</div>
                        </div>
                        <div class="quick-action-btn" onclick="AnalystPages.generateReport('event')">
                            <div class="icon">📋</div>
                            <div class="label">事件统计报表</div>
                        </div>
                        <div class="quick-action-btn" onclick="AnalystPages.generateReport('response')">
                            <div class="icon">⏱️</div>
                            <div class="label">响应时间分析</div>
                        </div>
                        <div class="quick-action-btn" onclick="AnalystPages.generateReport('resource')">
                            <div class="icon">📦</div>
                            <div class="label">资源使用报表</div>
                        </div>
                        <div class="quick-action-btn" onclick="AnalystPages.generateReport('district')">
                            <div class="icon">🏙️</div>
                            <div class="label">区域对比报表</div>
                        </div>
                        <div class="quick-action-btn" onclick="AnalystPages.generateReport('custom')">
                            <div class="icon">⚙️</div>
                            <div class="label">自定义报表</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header"><h3>📄 历史报表</h3></div>
                <div class="card-body" style="padding:0">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>报表名称</th>
                                <th>类型</th>
                                <th>统计周期</th>
                                <th>生成时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2026年5月应急管理综合报表</td>
                                <td><span class="tag tag-blue">月度综合</span></td>
                                <td>2026-05</td>
                                <td>2026-06-01 09:00</td>
                                <td>
                                    <button class="btn btn-sm btn-primary">查看</button>
                                    <button class="btn btn-sm btn-ghost">下载</button>
                                </td>
                            </tr>
                            <tr>
                                <td>中心区事件分布分析报告</td>
                                <td><span class="tag tag-purple">区域分析</span></td>
                                <td>2026-04 ~ 2026-05</td>
                                <td>2026-06-02 14:30</td>
                                <td>
                                    <button class="btn btn-sm btn-primary">查看</button>
                                    <button class="btn btn-sm btn-ghost">下载</button>
                                </td>
                            </tr>
                            <tr>
                                <td>上半年响应时间趋势分析</td>
                                <td><span class="tag tag-green">趋势分析</span></td>
                                <td>2026-01 ~ 2026-05</td>
                                <td>2026-06-03 11:15</td>
                                <td>
                                    <button class="btn btn-sm btn-primary">查看</button>
                                    <button class="btn btn-sm btn-ghost">下载</button>
                                </td>
                            </tr>
                            <tr>
                                <td>应急物资使用情况统计</td>
                                <td><span class="tag tag-orange">资源使用</span></td>
                                <td>2026-05</td>
                                <td>2026-06-01 10:20</td>
                                <td>
                                    <button class="btn btn-sm btn-primary">查看</button>
                                    <button class="btn btn-sm btn-ghost">下载</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    generateReport(type) {
        const names = {
            monthly: '月度综合报表',
            event: '事件统计报表',
            response: '响应时间分析报表',
            resource: '资源使用报表',
            district: '区域对比报表',
            custom: '自定义报表'
        };

        showModal({
            title: `📊 生成${names[type]}`,
            confirmText: '生成报表',
            onConfirm: () => {
                showToast('生成成功', `${names[type]} 已生成，可以查看或下载`, 'success');

                NotificationSystem.add({
                    type: 'info',
                    icon: '📄',
                    title: '报表已生成',
                    desc: `${names[type]} 已生成，请及时查看`,
                    role: 'manager'
                });
            },
            content: `
                <div class="form-row">
                    <div>
                        <label class="form-label">开始时间</label>
                        <input class="form-control" type="date" value="2026-05-01">
                    </div>
                    <div>
                        <label class="form-label">结束时间</label>
                        <input class="form-control" type="date" value="2026-05-31">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">统计维度</label>
                    <div style="display:flex;gap:16px;flex-wrap:wrap">
                        <label style="display:flex;align-items:center;gap:6px"><input type="checkbox" checked> 事件数量</label>
                        <label style="display:flex;align-items:center;gap:6px"><input type="checkbox" checked> 响应时间</label>
                        <label style="display:flex;align-items:center;gap:6px"><input type="checkbox" checked> 处置效率</label>
                        <label style="display:flex;align-items:center;gap:6px"><input type="checkbox"> 资源消耗</label>
                        <label style="display:flex;align-items:center;gap:6px"><input type="checkbox"> 区域对比</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">导出格式</label>
                    <div style="display:flex;gap:16px">
                        <label style="display:flex;align-items:center;gap:6px"><input type="radio" name="format" checked> PDF</label>
                        <label style="display:flex;align-items:center;gap:6px"><input type="radio" name="format"> Excel</label>
                        <label style="display:flex;align-items:center;gap:6px"><input type="radio" name="format"> Word</label>
                    </div>
                </div>
            `
        });
    }
};
