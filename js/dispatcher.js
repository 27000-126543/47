const DispatcherPages = {
    'my-tasks'(main) {
        const myTasks = AppData.events.filter(e => e.status === 'dispatched' || e.status === 'processing');

        main.innerHTML = App.renderPageHeader('我的任务', '当前分配给您的处置任务列表') + `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon orange">📋</div>
                    <div class="stat-info">
                        <h4>待处置任务</h4>
                        <div class="stat-value">${myTasks.filter(e => e.status === 'dispatched').length}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue">🚨</div>
                    <div class="stat-info">
                        <h4>处置中任务</h4>
                        <div class="stat-value">${myTasks.filter(e => e.status === 'processing').length}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">✅</div>
                    <div class="stat-info">
                        <h4>今日已完成</h4>
                        <div class="stat-value">3</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">⏱️</div>
                    <div class="stat-info">
                        <h4>平均响应时间</h4>
                        <div class="stat-value">7.2<span style="font-size:14px">分钟</span></div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header"><h3>📋 任务列表</h3></div>
                <div class="card-body" style="padding:0">
                    ${myTasks.length === 0 ? `
                        <div class="empty-state" style="padding:48px">
                            <div class="empty-state-icon">📭</div>
                            <div>暂无分配给您的任务</div>
                        </div>
                    ` : `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>事件编号</th>
                                <th>类型</th>
                                <th>位置</th>
                                <th>严重度</th>
                                <th>派单时间</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${myTasks.map(e => `
                                <tr>
                                    <td style="font-family:monospace;font-size:12px">${e.id}</td>
                                    <td><span class="tag tag-${e.type === 'fire' ? 'red' : e.type === 'flood' ? 'blue' : 'orange'}">${AppData.eventTypes[e.type]?.icon} ${AppData.eventTypes[e.type]?.name}</span></td>
                                    <td>${e.location}</td>
                                    <td><span class="tag tag-${e.severity === 'high' ? 'red' : e.severity === 'medium' ? 'yellow' : 'green'}">${e.severity === 'high' ? '严重' : e.severity === 'medium' ? '中等' : '一般'}</span></td>
                                    <td>${e.dispatchedAt || '-'}</td>
                                    <td><span class="status-indicator ${e.status}">${AppData.eventStatus[e.status]?.name}</span></td>
                                    <td>
                                        ${e.status === 'dispatched' ? `<button class="btn btn-sm btn-warning" onclick="DispatcherPages.checkIn('${e.id}')">📍 签到</button>` : ''}
                                        <button class="btn btn-sm btn-primary" onclick="DispatcherPages.viewTask('${e.id}')">详情</button>
                                        <button class="btn btn-sm btn-success" onclick="DispatcherPages.reportProgress('${e.id}')">📸 上报</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>`}
                </div>
            </div>
        `;
    },

    viewTask(id) {
        CommanderPages.viewEvent(id);
    },

    'check-in'(main) {
        main.innerHTML = App.renderPageHeader('签到打卡', '到达现场后扫码签到确认') + `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:40px">
                    <div style="margin-bottom:24px">
                        <div style="width:200px;height:200px;margin:0 auto;background:var(--gray-50);border:2px dashed var(--gray-300);border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:20px">
                            <div style="text-align:center">
                                <div style="font-size:64px">📱</div>
                                <div style="font-size:14px;color:var(--gray-500);margin-top:12px">扫描现场二维码</div>
                            </div>
                        </div>
                        <h3 style="margin-bottom:8px">现场扫码签到</h3>
                        <p style="color:var(--gray-500);font-size:14px;margin-bottom:24px">请使用手机扫描现场张贴的事件二维码进行签到确认</p>
                        <div style="display:flex;gap:12px;justify-content:center">
                            <button class="btn btn-primary" onclick="DispatcherPages.simulateCheckIn()">📷 模拟扫码签到</button>
                            <button class="btn btn-ghost" onclick="DispatcherPages.manualCheckIn()">✍️ 手动选择事件</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header"><h3>📋 今日签到记录</h3></div>
                <div class="card-body" style="padding:0">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>事件编号</th>
                                <th>事件类型</th>
                                <th>签到位置</th>
                                <th>签到时间</th>
                                <th>签到状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="font-family:monospace;font-size:12px">EVT-20260606-001</td>
                                <td>🔥 火灾</td>
                                <td>东城区幸福小区3号楼</td>
                                <td>2026-06-06 09:25:10</td>
                                <td><span class="tag tag-green">已签到</span></td>
                            </tr>
                            <tr>
                                <td style="font-family:monospace;font-size:12px">EVT-20260606-002</td>
                                <td>🚑 医疗急救</td>
                                <td>中心区人民公园南门</td>
                                <td>-</td>
                                <td><span class="tag tag-gray">待签到</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    simulateCheckIn() {
        const pendingTasks = AppData.events.filter(e => e.status === 'dispatched');
        if (pendingTasks.length === 0) {
            showToast('暂无任务', '没有待签到的处置任务', 'warning');
            return;
        }
        const task = pendingTasks[0];
        DispatcherPages.doCheckIn(task);
    },

    manualCheckIn() {
        const pendingTasks = AppData.events.filter(e => e.status === 'dispatched');
        if (pendingTasks.length === 0) {
            showToast('暂无任务', '没有待签到的处置任务', 'warning');
            return;
        }

        showModal({
            title: '✍️ 手动签到',
            confirmText: '确认签到',
            onConfirm: () => {
                const select = document.getElementById('checkin-event');
                const id = select.value;
                const event = AppData.events.find(e => e.id === id);
                if (event) DispatcherPages.doCheckIn(event);
            },
            content: `
                <div class="form-group">
                    <label class="form-label">选择事件</label>
                    <select class="form-control" id="checkin-event">
                        ${pendingTasks.map(e => `<option value="${e.id}">${e.id} - ${e.title}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">签到备注</label>
                    <textarea class="form-control" rows="3" id="checkin-remark" placeholder="可填写现场初步情况..."></textarea>
                </div>
            `
        });
    },

    doCheckIn(event) {
        event.status = 'processing';
        event.arrivedAt = Utils.getCurrentTime();
        event.progress = Math.max(event.progress, 20);
        event.timeline.push({
            time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
            title: '到达现场签到',
            desc: '处置人员已到达现场并完成签到，开始处置工作',
            type: 'success'
        });

        NotificationSystem.add({
            type: 'success',
            icon: '📍',
            title: '处置人员已到场',
            desc: `${event.id} 处置人员已到达现场签到`,
            role: 'commander'
        });

        showToast('签到成功', `已完成 ${event.id} 的现场签到`, 'success');
        App.navigateTo('my-tasks');
        App.renderHeader();
    },

    'report'(main) {
        DispatcherPages['my-tasks'](main);
    },

    reportProgress(id) {
        const event = AppData.events.find(e => e.id === id);
        if (!event) return;

        showModal({
            title: `📸 进度上报 - ${event.id}`,
            width: '640px',
            confirmText: '提交上报',
            onConfirm: () => {
                const progress = parseInt(document.getElementById('progress-input').value) || 0;
                const status = document.getElementById('status-select').value;
                const report = document.getElementById('report-text').value.trim();

                event.progress = progress;
                if (progress >= 100 || status === 'resolved') {
                    event.status = 'resolved';
                    event.resolvedAt = Utils.getCurrentTime();
                }

                event.timeline.push({
                    time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
                    title: '现场进度上报',
                    desc: report || `进度更新：${progress}%`,
                    type: progress >= 80 ? 'success' : 'info'
                });

                if (event.status === 'resolved') {
                    event.timeline.push({
                        time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
                        title: '事件处置完成',
                        desc: '现场处置工作已完成，事件已解决',
                        type: 'success'
                    });

                    NotificationSystem.add({
                        type: 'success',
                        icon: '✅',
                        title: '事件已处置完成',
                        desc: `${event.id} ${event.title} 已成功处置`,
                        role: 'commander'
                    });
                    NotificationSystem.add({
                        type: 'success',
                        icon: '📄',
                        title: '处置凭证可下载',
                        desc: `${event.id} 的处置报告已生成，请下载归档`,
                        role: 'manager'
                    });
                } else {
                    NotificationSystem.add({
                        type: 'info',
                        icon: '📋',
                        title: '现场进度更新',
                        desc: `${event.id} 进度更新：${progress}%`,
                        role: 'commander'
                    });
                }

                showToast('上报成功', '进度已同步至指挥中心', 'success');
                if (App.currentPage === 'my-tasks') App.navigateTo('my-tasks');
                App.renderHeader();
            },
            content: `
                <div class="info-grid" style="margin-bottom:20px">
                    <div class="info-item"><label>事件编号</label><div class="value" style="font-family:monospace">${event.id}</div></div>
                    <div class="info-item"><label>事件类型</label><div class="value">${AppData.eventTypes[event.type]?.icon} ${AppData.eventTypes[event.type]?.name}</div></div>
                    <div class="info-item full"><label>事件位置</label><div class="value">${event.location}</div></div>
                </div>

                <div class="form-row">
                    <div>
                        <label class="form-label">处置进度 <span class="required">*</span></label>
                        <input type="range" id="progress-input" class="form-control" min="0" max="100" value="${event.progress}" style="padding:10px 0" oninput="document.getElementById('progress-text').textContent=this.value+'%'">
                        <div style="text-align:center;font-size:18px;font-weight:600;color:var(--primary)" id="progress-text">${event.progress}%</div>
                    </div>
                    <div>
                        <label class="form-label">当前状态</label>
                        <select class="form-control" id="status-select">
                            <option value="processing" ${event.status === 'processing' ? 'selected' : ''}>处置进行中</option>
                            <option value="resolved">处置完成</option>
                        </select>
                    </div>
                </div>

                <div style="margin-bottom:20px">
                    <label class="form-label">进度说明 <span class="required">*</span></label>
                    <textarea class="form-control" id="report-text" rows="4" placeholder="请描述当前处置进展、遇到的问题、需要的支援等..."></textarea>
                </div>

                <div>
                    <label class="form-label">📸 上传现场照片</label>
                    <div class="photos-grid">
                        ${(event.photos || []).map(p => `<div class="photo-thumb"><img src="${p}" alt=""></div>`).join('')}
                        <div class="photo-upload" onclick="DispatcherPages.addPhoto()">
                            <span class="plus">+</span>
                            <span>添加照片</span>
                        </div>
                    </div>
                    <p style="font-size:12px;color:var(--gray-500);margin-top:8px">上传的照片将实时同步至指挥中心</p>
                </div>
            `
        });
    },

    addPhoto() {
        const photos = [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
            'https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=300',
            'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300',
            'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=300'
        ];
        const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
        const existingGrid = document.querySelector('.photos-grid');
        if (existingGrid) {
            const uploadBtn = existingGrid.querySelector('.photo-upload');
            const newDiv = document.createElement('div');
            newDiv.className = 'photo-thumb';
            newDiv.innerHTML = `<img src="${randomPhoto}" alt="">`;
            existingGrid.insertBefore(newDiv, uploadBtn);
            showToast('照片已添加', '可继续添加更多现场照片', 'success');
        }
    }
};
