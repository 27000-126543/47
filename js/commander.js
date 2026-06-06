const CommanderPages = {
    dashboard(main) {
        const pending = AppData.events.filter(e => e.status === 'pending').length;
        const processing = AppData.events.filter(e => e.status === 'dispatched' || e.status === 'processing').length;
        const resolved = AppData.events.filter(e => e.status === 'resolved' || e.status === 'closed').length;
        const today = AppData.events.filter(e => e.reportedAt.startsWith('2026-06-06')).length;

        main.innerHTML = App.renderPageHeader('指挥大屏', '实时监控全市应急事件态势与资源调度',
            '<button class="btn btn-primary" onclick="App.navigateTo(\'new-event\')">📝 快速上报事件</button>') + `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon red">🚨</div>
                    <div class="stat-info">
                        <h4>待调度事件</h4>
                        <div class="stat-value">${pending}</div>
                        <div class="stat-change ${pending > 0 ? 'down' : ''}">${pending > 0 ? '需紧急处理' : '暂无待办'}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">🚒</div>
                    <div class="stat-info">
                        <h4>处置中事件</h4>
                        <div class="stat-value">${processing}</div>
                        <div class="stat-change">实时追踪中</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">✅</div>
                    <div class="stat-info">
                        <h4>已解决事件</h4>
                        <div class="stat-value">${resolved}</div>
                        <div class="stat-change">处置效率优秀</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue">📅</div>
                    <div class="stat-info">
                        <h4>今日新增</h4>
                        <div class="stat-value">${today}</div>
                        <div class="stat-change">较昨日 -12%</div>
                    </div>
                </div>
            </div>

            <div class="charts-grid">
                <div class="card">
                    <div class="card-header">
                        <h3>🗺️ 实时资源分布地图</h3>
                    </div>
                    <div class="card-body">
                        ${CommanderPages.renderMap()}
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3>📋 最新事件列表</h3>
                        <button class="btn-link" onclick="App.navigateTo('events')">查看全部 →</button>
                    </div>
                    <div class="card-body" style="padding:0">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>事件编号</th>
                                    <th>类型</th>
                                    <th>位置</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${AppData.events.slice(0, 5).map(e => `
                                    <tr>
                                        <td style="font-family:monospace;font-size:12px">${e.id}</td>
                                        <td><span class="tag tag-${e.type === 'fire' ? 'red' : e.type === 'flood' ? 'blue' : e.type === 'medical' ? 'purple' : 'orange'}">${AppData.eventTypes[e.type]?.icon} ${AppData.eventTypes[e.type]?.name}</span></td>
                                        <td>${e.district}</td>
                                        <td><span class="status-indicator ${e.status}">${AppData.eventStatus[e.status]?.name}</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-primary" onclick="CommanderPages.viewEvent('${e.id}')">详情</button>
                                            ${e.status === 'pending' ? `<button class="btn btn-sm btn-warning" onclick="CommanderPages.dispatchEvent('${e.id}')">派单</button>` : ''}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>📊 资源实时状态</h3>
                </div>
                <div class="card-body">
                    <div class="charts-grid">
                        <div>
                            <h4 style="margin-bottom:12px;color:var(--gray-600)">🚒 消防站出动情况</h4>
                            <table class="data-table">
                                <thead><tr><th>站点</th><th>可用车辆</th><th>在勤人员</th><th>状态</th></tr></thead>
                                <tbody>
                                    ${AppData.fireStations.map(s => `
                                        <tr>
                                            <td>${s.name}</td>
                                            <td>${s.available}/${s.trucks} 辆</td>
                                            <td>${s.crews} 人</td>
                                            <td><span class="tag tag-${s.available > s.trucks * 0.5 ? 'green' : 'orange'}">${s.available > s.trucks * 0.5 ? '充足' : '紧张'}</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h4 style="margin-bottom:12px;color:var(--gray-600)">🏥 医院急救资源</h4>
                            <table class="data-table">
                                <thead><tr><th>医院</th><th>可用救护车</th><th>空余床位</th><th>状态</th></tr></thead>
                                <tbody>
                                    ${AppData.hospitals.map(h => `
                                        <tr>
                                            <td>${h.name}</td>
                                            <td>${h.available}/${h.ambulances} 辆</td>
                                            <td>${h.beds} 张</td>
                                            <td><span class="tag tag-${h.available > h.ambulances * 0.4 ? 'green' : 'orange'}">${h.available > h.ambulances * 0.4 ? '正常' : '繁忙'}</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderMap() {
        let markers = '';
        AppData.events.forEach(e => {
            if (e.status !== 'resolved' && e.status !== 'closed') {
                markers += `
                    <div class="map-marker event ${e.type}" style="left:${e.x}%;top:${e.y}%" title="${e.title}">
                        <div class="marker-pin"><span>${AppData.eventTypes[e.type]?.icon}</span></div>
                        <div class="marker-label">${AppData.eventTypes[e.type]?.name}</div>
                    </div>
                `;
            }
        });
        AppData.fireStations.forEach(s => {
            markers += `
                <div class="map-marker station" style="left:${s.x}%;top:${s.y}%" title="${s.name}">
                    <div class="marker-pin"><span>🚒</span></div>
                    <div class="marker-label">${s.name.replace('消防站', '')}</div>
                </div>
            `;
        });
        AppData.hospitals.forEach(h => {
            markers += `
                <div class="map-marker hospital" style="left:${h.x}%;top:${h.y}%" title="${h.name}">
                    <div class="marker-pin"><span>🏥</span></div>
                    <div class="marker-label">${h.name.replace('医院', '').replace('急救中心', '急救')}</div>
                </div>
            `;
        });
        AppData.warehouses.forEach(w => {
            markers += `
                <div class="map-marker warehouse" style="left:${w.x}%;top:${w.y}%" title="${w.name}">
                    <div class="marker-pin"><span>📦</span></div>
                    <div class="marker-label">${w.name.replace('物资仓库', '仓库')}</div>
                </div>
            `;
        });

        return `
            <div class="resource-map">
                <div class="map-grid"></div>
                ${markers}
                <div class="map-legend">
                    <h5>图例说明</h5>
                    <div class="legend-item"><span class="legend-dot" style="background:#e74c3c"></span> 紧急事件</div>
                    <div class="legend-item"><span class="legend-dot" style="background:#e67e22"></span> 消防站</div>
                    <div class="legend-item"><span class="legend-dot" style="background:#27ae60"></span> 医院</div>
                    <div class="legend-item"><span class="legend-dot" style="background:#34495e"></span> 物资仓库</div>
                </div>
            </div>
        `;
    },

    events(main) {
        main.innerHTML = App.renderPageHeader('事件管理', '管理全市所有突发事件，查看详情与处理进度',
            `<button class="btn btn-primary" onclick="App.navigateTo('new-event')">➕ 新增事件</button>`) + `
            <div class="card">
                <div class="card-header">
                    <div style="display:flex;gap:12px;align-items:center">
                        <select class="form-control" style="width:160px" id="filter-type">
                            <option value="">全部类型</option>
                            ${Object.entries(AppData.eventTypes).map(([k, v]) => `<option value="${k}">${v.icon} ${v.name}</option>`).join('')}
                        </select>
                        <select class="form-control" style="width:160px" id="filter-status">
                            <option value="">全部状态</option>
                            ${Object.entries(AppData.eventStatus).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('')}
                        </select>
                        <select class="form-control" style="width:160px" id="filter-district">
                            <option value="">全部区域</option>
                            ${AppData.districts.map(d => `<option value="${d}">${d}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="card-body" style="padding:0">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>事件编号</th>
                                <th>类型</th>
                                <th>标题</th>
                                <th>区域</th>
                                <th>严重度</th>
                                <th>上报时间</th>
                                <th>状态</th>
                                <th>进度</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody id="events-tbody">
                            ${CommanderPages.renderEventRows(AppData.events)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        ['filter-type', 'filter-status', 'filter-district'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', CommanderPages.filterEvents);
        });
    },

    renderEventRows(events) {
        return events.map(e => {
            const typeColor = e.type === 'fire' ? 'red' : e.type === 'flood' ? 'blue' : e.type === 'medical' ? 'purple' : 'orange';
            const sevColor = e.severity === 'critical' ? 'red' : e.severity === 'high' ? 'orange' : e.severity === 'medium' ? 'yellow' : 'green';
            const progColor = e.progress >= 80 ? 'success' : e.progress >= 40 ? 'warning' : 'danger';
            return `
                <tr>
                    <td style="font-family:monospace;font-size:12px">${e.id}</td>
                    <td><span class="tag tag-${typeColor}">${AppData.eventTypes[e.type]?.icon} ${AppData.eventTypes[e.type]?.name}</span></td>
                    <td style="max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${e.title}">${e.title}</td>
                    <td>${e.district}</td>
                    <td><span class="tag tag-${sevColor}">${e.severity === 'critical' ? '极严重' : e.severity === 'high' ? '严重' : e.severity === 'medium' ? '中等' : '一般'}</span></td>
                    <td>${e.reportedAt}</td>
                    <td><span class="status-indicator ${e.status}">${AppData.eventStatus[e.status]?.name}</span></td>
                    <td style="width:120px">
                        <div class="progress-bar"><div class="progress-fill ${progColor}" style="width:${e.progress}%"></div></div>
                        <div style="font-size:11px;color:var(--gray-500);margin-top:2px">${e.progress}%</div>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="CommanderPages.viewEvent('${e.id}')">详情</button>
                        ${e.status === 'pending' ? `<button class="btn btn-sm btn-warning" onclick="CommanderPages.dispatchEvent('${e.id}')">派单</button>` : ''}
                    </td>
                </tr>
            `;
        }).join('');
    },

    filterEvents() {
        const type = document.getElementById('filter-type').value;
        const status = document.getElementById('filter-status').value;
        const district = document.getElementById('filter-district').value;
        const filtered = AppData.events.filter(e =>
            (!type || e.type === type) &&
            (!status || e.status === status) &&
            (!district || e.district === district)
        );
        document.getElementById('events-tbody').innerHTML = CommanderPages.renderEventRows(filtered);
    },

    viewEvent(id) {
        const e = AppData.events.find(x => x.id === id);
        if (!e) return;
        const typeInfo = AppData.eventTypes[e.type];

        showModal({
            title: `${typeInfo.icon} ${e.title}`,
            width: '720px',
            showFooter: false,
            content: `
                <div class="info-grid">
                    <div class="info-item"><label>事件编号</label><div class="value" style="font-family:monospace">${e.id}</div></div>
                    <div class="info-item"><label>事件类型</label><div class="value">${typeInfo.icon} ${typeInfo.name}</div></div>
                    <div class="info-item"><label>发生区域</label><div class="value">${e.district}</div></div>
                    <div class="info-item"><label>当前状态</label><div class="value"><span class="status-indicator ${e.status}">${AppData.eventStatus[e.status]?.name}</span></div></div>
                    <div class="info-item"><label>上报人</label><div class="value">${e.reporter}</div></div>
                    <div class="info-item"><label>联系电话</label><div class="value">${e.reporterPhone}</div></div>
                    <div class="info-item"><label>上报时间</label><div class="value">${e.reportedAt}</div></div>
                    <div class="info-item"><label>受伤/被困</label><div class="value">受伤 ${e.casualties?.injured || 0} 人 / 被困 ${e.casualties?.trapped || 0} 人</div></div>
                    <div class="info-item full"><label>详细位置</label><div class="value">${e.location}</div></div>
                    <div class="info-item full"><label>事件描述</label><div class="value">${e.description}</div></div>
                </div>

                ${e.dispatch ? `
                <div style="margin-top:24px">
                    <h4 style="margin-bottom:12px;color:var(--gray-700)">🚨 调度方案</h4>
                    <div class="info-grid">
                        <div class="info-item"><label>派出消防站</label><div class="value">${AppData.fireStations.find(s => s.id === e.dispatch.station)?.name || '-'}</div></div>
                        <div class="info-item"><label>消防车</label><div class="value">${e.dispatch.trucks || 0} 辆</div></div>
                        <div class="info-item"><label>救援人员</label><div class="value">${e.dispatch.crews || 0} 人</div></div>
                        <div class="info-item"><label>救护车</label><div class="value">${e.dispatch.ambulances || 0} 辆</div></div>
                    </div>
                </div>
                ` : ''}

                ${e.timeline && e.timeline.length > 0 ? `
                <div style="margin-top:24px">
                    <h4 style="margin-bottom:16px;color:var(--gray-700)">📜 处置时间线</h4>
                    <div class="timeline">
                        ${e.timeline.map(t => `
                            <div class="timeline-item ${t.type}">
                                <div class="timeline-time">${t.time}</div>
                                <div class="timeline-title">${t.title}</div>
                                <div class="timeline-desc">${t.desc}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                ${e.photos && e.photos.length > 0 ? `
                <div style="margin-top:24px">
                    <h4 style="margin-bottom:12px;color:var(--gray-700)">📸 现场照片</h4>
                    <div class="photos-grid">
                        ${e.photos.map(p => `<div class="photo-thumb"><img src="${p}" alt=""></div>`).join('')}
                    </div>
                </div>
                ` : ''}
            `
        });
    },

    dispatch(main) {
        const pending = AppData.events.filter(e => e.status === 'pending');
        main.innerHTML = App.renderPageHeader('调度派单', '对待处理事件进行智能调度和资源指派') + `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon red">⏰</div>
                    <div class="stat-info">
                        <h4>待派单事件</h4>
                        <div class="stat-value">${pending.length}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">🚒</div>
                    <div class="stat-info">
                        <h4>可用消防车</h4>
                        <div class="stat-value">${AppData.fireStations.reduce((s, x) => s + x.available, 0)}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue">🚑</div>
                    <div class="stat-info">
                        <h4>可用救护车</h4>
                        <div class="stat-value">${AppData.hospitals.reduce((s, x) => s + x.available, 0)}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">👷</div>
                    <div class="stat-info">
                        <h4>待命中人员</h4>
                        <div class="stat-value">${AppData.staff.filter(s => s.status === 'available').length}</div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header"><h3>📋 待调度事件列表</h3></div>
                <div class="card-body" style="padding:0">
                    ${pending.length === 0 ? `
                        <div class="empty-state" style="padding:48px">
                            <div class="empty-state-icon">🎉</div>
                            <div>暂无待调度事件，所有事件已处理！</div>
                        </div>
                    ` : `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>事件编号</th>
                                <th>类型</th>
                                <th>位置</th>
                                <th>严重度</th>
                                <th>上报时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pending.map(e => `
                                <tr>
                                    <td style="font-family:monospace;font-size:12px">${e.id}</td>
                                    <td><span class="tag tag-${e.type === 'fire' ? 'red' : e.type === 'flood' ? 'blue' : 'orange'}">${AppData.eventTypes[e.type]?.icon} ${AppData.eventTypes[e.type]?.name}</span></td>
                                    <td>${e.location}</td>
                                    <td><span class="tag tag-${e.severity === 'high' ? 'red' : 'yellow'}">${e.severity === 'high' ? '严重' : '中等'}</span></td>
                                    <td>${e.reportedAt}</td>
                                    <td><button class="btn btn-sm btn-warning" onclick="CommanderPages.dispatchEvent('${e.id}')">生成调度方案</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>`}
                </div>
            </div>
        `;
    },

    dispatchEvent(id) {
        const e = AppData.events.find(x => x.id === id);
        if (!e) return;

        const nearestStation = Utils.findNearest(e.x, e.y, AppData.fireStations)[0];
        const nearestHospital = Utils.findNearest(e.x, e.y, AppData.hospitals)[0];
        const nearestWarehouse = Utils.findNearest(e.x, e.y, AppData.warehouses)[0];
        const plan = Utils.generateDispatchPlan(e.type, e.severity);

        const recStation = Utils.findNearest(e.x, e.y, AppData.fireStations).slice(0, 2);
        const recHospital = Utils.findNearest(e.x, e.y, AppData.hospitals).slice(0, 2);

        showModal({
            title: `🚨 智能调度方案 - ${e.id}`,
            width: '720px',
            confirmText: '确认派遣',
            onConfirm: () => {
                e.status = 'dispatched';
                e.dispatchedAt = Utils.getCurrentTime();
                e.dispatch = {
                    station: nearestStation.id,
                    trucks: plan.trucks || 2,
                    crews: plan.crews || 6,
                    hospital: nearestHospital.id,
                    ambulances: plan.ambulances || 1,
                    warehouse: nearestWarehouse.id,
                    supplies: ['灭火器 x10', '救生绳 x5', '呼吸面罩 x15']
                };
                e.timeline.push({
                    time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
                    title: '调度派单',
                    desc: `指挥中心派遣${nearestStation.name} ${plan.trucks || 2}辆消防车、${plan.crews || 6}名消防员前往处置`,
                    type: 'warning'
                });

                NotificationSystem.add({
                    type: 'warning',
                    icon: '🚨',
                    title: '新任务指派',
                    desc: `您已被指派至 ${e.id} ${e.title}，请立即出发`,
                    role: 'dispatcher'
                });
                NotificationSystem.add({
                    type: 'info',
                    icon: '📋',
                    title: '调度方案已生成',
                    desc: `${e.id} 已派遣${nearestStation.name}前往处置`,
                    role: 'commander'
                });

                showToast('派遣成功', `已成功生成调度方案并推送至处置员`, 'success');
                if (App.currentPage === 'dispatch' || App.currentPage === 'events' || App.currentPage === 'dashboard') {
                    App.navigateTo(App.currentPage);
                }
                App.renderHeader();
            },
            content: `
                <div class="info-grid" style="margin-bottom:24px">
                    <div class="info-item"><label>事件类型</label><div class="value">${AppData.eventTypes[e.type]?.icon} ${AppData.eventTypes[e.type]?.name}</div></div>
                    <div class="info-item"><label>发生位置</label><div class="value">${e.location}</div></div>
                    <div class="info-item"><label>严重程度</label><div class="value">${e.severity === 'high' ? '严重' : '中等'}</div></div>
                    <div class="info-item"><label>伤亡情况</label><div class="value">受伤${e.casualties?.injured || 0}人 / 被困${e.casualties?.trapped || 0}人</div></div>
                </div>

                <h4 style="margin-bottom:12px;color:var(--gray-700)">🎯 系统智能推荐（按距离排序）</h4>

                <div class="recommend-card highlight">
                    <div class="recommend-header">
                        <div class="recommend-title">🚒 推荐消防站：${nearestStation.name}</div>
                        <span class="recommend-distance">${nearestStation.distance} km</span>
                    </div>
                    <div class="recommend-details">
                        <div class="recommend-detail-item"><small>可用车辆</small><strong>${nearestStation.available}/${nearestStation.trucks} 辆</strong></div>
                        <div class="recommend-detail-item"><small>在勤人员</small><strong>${nearestStation.crews} 人</strong></div>
                        <div class="recommend-detail-item"><small>预计到达</small><strong>${Math.ceil(nearestStation.distance * 3)} 分钟</strong></div>
                    </div>
                </div>

                ${recStation[1] ? `
                <div class="recommend-card">
                    <div class="recommend-header">
                        <div class="recommend-title">🚒 备选消防站：${recStation[1].name}</div>
                        <span class="recommend-distance" style="background:var(--gray-400)">${recStation[1].distance} km</span>
                    </div>
                    <div class="recommend-details">
                        <div class="recommend-detail-item"><small>可用车辆</small><strong>${recStation[1].available}/${recStation[1].trucks} 辆</strong></div>
                        <div class="recommend-detail-item"><small>在勤人员</small><strong>${recStation[1].crews} 人</strong></div>
                        <div class="recommend-detail-item"><small>预计到达</small><strong>${Math.ceil(recStation[1].distance * 3)} 分钟</strong></div>
                    </div>
                </div>` : ''}

                <div class="recommend-card highlight">
                    <div class="recommend-header">
                        <div class="recommend-title">🏥 推荐医院：${nearestHospital.name}</div>
                        <span class="recommend-distance">${nearestHospital.distance} km</span>
                    </div>
                    <div class="recommend-details">
                        <div class="recommend-detail-item"><small>可用救护车</small><strong>${nearestHospital.available}/${nearestHospital.ambulances} 辆</strong></div>
                        <div class="recommend-detail-item"><small>空余床位</small><strong>${nearestHospital.beds} 张</strong></div>
                        <div class="recommend-detail-item"><small>预计到达</small><strong>${Math.ceil(nearestHospital.distance * 3)} 分钟</strong></div>
                    </div>
                </div>

                <h4 style="margin:20px 0 12px;color:var(--gray-700)">📋 自动生成调度方案</h4>
                <div class="card" style="background:var(--primary-light);border-color:#bbdefb">
                    <div class="card-body" style="padding:16px">
                        <div class="info-grid">
                            <div class="info-item"><label>派遣消防车</label><div class="value">${plan.trucks || 2} 辆</div></div>
                            <div class="info-item"><label>派遣救援人员</label><div class="value">${plan.crews || 6} 人</div></div>
                            <div class="info-item"><label>派遣救护车</label><div class="value">${plan.ambulances || 1} 辆</div></div>
                            ${plan.boats ? `<div class="info-item"><label>派遣救援艇</label><div class="value">${plan.boats} 艘</div></div>` : ''}
                            ${plan.hazmat ? `<div class="info-item"><label>防化小组</label><div class="value">${plan.hazmat} 组</div></div>` : ''}
                            <div class="info-item full"><label>调配物资</label><div class="value">灭火器 x10、救生绳 x5、呼吸面罩 x15（来自 ${nearestWarehouse.name}）</div></div>
                        </div>
                    </div>
                </div>
            `
        });
    },

    map(main) {
        main.innerHTML = App.renderPageHeader('资源地图', '全市应急资源分布与实时事件可视化') + `
            <div class="card">
                <div class="card-body" style="padding:16px">
                    ${CommanderPages.renderMap()}
                </div>
            </div>
            <div class="charts-grid">
                <div class="card">
                    <div class="card-header"><h3>🚒 消防站详情</h3></div>
                    <div class="card-body" style="padding:0">
                        <table class="data-table">
                            <thead><tr><th>名称</th><th>地址</th><th>车辆</th><th>人员</th><th>状态</th></tr></thead>
                            <tbody>
                                ${AppData.fireStations.map(s => `
                                    <tr>
                                        <td>${s.name}</td>
                                        <td>${s.address}</td>
                                        <td>${s.available}/${s.trucks}</td>
                                        <td>${s.crews}</td>
                                        <td><span class="tag tag-${s.available > s.trucks * 0.5 ? 'green' : 'orange'}">${s.available > s.trucks * 0.5 ? '充足' : '紧张'}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header"><h3>🏥 医院详情</h3></div>
                    <div class="card-body" style="padding:0">
                        <table class="data-table">
                            <thead><tr><th>名称</th><th>地址</th><th>救护车</th><th>床位</th><th>状态</th></tr></thead>
                            <tbody>
                                ${AppData.hospitals.map(h => `
                                    <tr>
                                        <td>${h.name}</td>
                                        <td>${h.address}</td>
                                        <td>${h.available}/${h.ambulances}</td>
                                        <td>${h.beds}</td>
                                        <td><span class="tag tag-${h.available > h.ambulances * 0.4 ? 'green' : 'orange'}">${h.available > h.ambulances * 0.4 ? '正常' : '繁忙'}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    'new-event'(main) {
        main.innerHTML = App.renderPageHeader('事件上报', '市民或监控系统上报突发事件，系统自动生成事件编号') + `
            <div class="card">
                <div class="card-header"><h3>📝 上报新事件</h3></div>
                <div class="card-body">
                    <div id="new-event-form">
                        <div class="form-row">
                            <div>
                                <label class="form-label">事件类型 <span class="required">*</span></label>
                                <select class="form-control" id="evt-type">
                                    ${Object.entries(AppData.eventTypes).map(([k, v]) => `<option value="${k}">${v.icon} ${v.name}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="form-label">严重程度 <span class="required">*</span></label>
                                <select class="form-control" id="evt-severity">
                                    <option value="low">一般</option>
                                    <option value="medium" selected>中等</option>
                                    <option value="high">严重</option>
                                    <option value="critical">极严重</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row full">
                            <div>
                                <label class="form-label">事件标题 <span class="required">*</span></label>
                                <input class="form-control" id="evt-title" placeholder="请简要描述事件">
                            </div>
                        </div>
                        <div class="form-row">
                            <div>
                                <label class="form-label">所属区域 <span class="required">*</span></label>
                                <select class="form-control" id="evt-district">
                                    ${AppData.districts.map(d => `<option value="${d}">${d}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="form-label">详细位置 <span class="required">*</span></label>
                                <input class="form-control" id="evt-location" placeholder="如：幸福小区3号楼">
                            </div>
                        </div>
                        <div class="form-row">
                            <div>
                                <label class="form-label">上报人</label>
                                <input class="form-control" id="evt-reporter" value="市民" placeholder="市民姓名或系统来源">
                            </div>
                            <div>
                                <label class="form-label">联系电话</label>
                                <input class="form-control" id="evt-phone" placeholder="联系电话">
                            </div>
                        </div>
                        <div class="form-row">
                            <div>
                                <label class="form-label">受伤人数</label>
                                <input class="form-control" type="number" id="evt-injured" value="0" min="0">
                            </div>
                            <div>
                                <label class="form-label">被困人数</label>
                                <input class="form-control" type="number" id="evt-trapped" value="0" min="0">
                            </div>
                        </div>
                        <div class="form-row full">
                            <div>
                                <label class="form-label">详细描述 <span class="required">*</span></label>
                                <textarea class="form-control" id="evt-desc" rows="4" placeholder="请详细描述事件情况..."></textarea>
                            </div>
                        </div>
                        <div style="display:flex;gap:10px;justify-content:flex-end">
                            <button class="btn btn-ghost" onclick="App.navigateTo('events')">取消</button>
                            <button class="btn btn-primary" onclick="CommanderPages.submitEvent()">🚨 提交上报</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    submitEvent() {
        const type = document.getElementById('evt-type').value;
        const severity = document.getElementById('evt-severity').value;
        const title = document.getElementById('evt-title').value.trim();
        const district = document.getElementById('evt-district').value;
        const location = document.getElementById('evt-location').value.trim();
        const desc = document.getElementById('evt-desc').value.trim();
        const reporter = document.getElementById('evt-reporter').value.trim() || '市民';
        const phone = document.getElementById('evt-phone').value.trim() || '未提供';
        const injured = parseInt(document.getElementById('evt-injured').value) || 0;
        const trapped = parseInt(document.getElementById('evt-trapped').value) || 0;

        if (!title || !location || !desc) {
            showToast('请填写完整', '标题、位置和描述不能为空', 'warning');
            return;
        }

        const id = Utils.generateEventId();
        const x = Math.floor(Math.random() * 70) + 15;
        const y = Math.floor(Math.random() * 70) + 15;

        const newEvent = {
            id,
            type,
            title,
            description: desc,
            location: district + ' ' + location,
            district,
            x, y,
            reporter,
            reporterPhone: phone,
            severity,
            status: 'pending',
            reportedAt: Utils.getCurrentTime(),
            casualties: { injured, trapped },
            progress: 0,
            photos: [],
            timeline: [{
                time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
                title: '接警上报',
                desc: `${reporter}上报：${desc.substring(0, 50)}${desc.length > 50 ? '...' : ''}`,
                type: 'info'
            }]
        };

        AppData.events.unshift(newEvent);

        NotificationSystem.add({
            type: severity === 'high' || severity === 'critical' ? 'danger' : 'warning',
            icon: AppData.eventTypes[type].icon,
            title: '新的紧急事件上报',
            desc: `${id} ${title}，请尽快处理`,
            role: 'commander'
        });
        NotificationSystem.add({
            type: 'info',
            icon: '📋',
            title: '事件上报凭证',
            desc: `您上报的事件 ${id} 已受理，请保持电话畅通`,
            role: undefined
        });

        showToast('上报成功', `事件编号：${id}，系统已自动推荐附近资源`, 'success');
        App.renderHeader();

        setTimeout(() => {
            const nearest = Utils.findNearest(x, y, AppData.fireStations)[0];
            showToast('资源推荐', `最近消防站：${nearest.name}（${nearest.distance}km）`, 'info');
        }, 800);

        App.navigateTo('events');
    }
};
