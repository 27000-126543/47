const SupplierPages = {
    inventory(main) {
        const lowStock = AppData.inventory.filter(i => i.stock < i.minStock);
        const totalValue = AppData.inventory.reduce((s, i) => s + i.stock * 50, 0);

        main.innerHTML = App.renderPageHeader('库存管理', '实时监控各类应急物资的库存情况',
            `<button class="btn btn-primary" onclick="SupplierPages.showAddItem()">➕ 新增物资</button>`) + `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">📦</div>
                    <div class="stat-info">
                        <h4>物资总数</h4>
                        <div class="stat-value">${AppData.inventory.length}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon red">⚠️</div>
                    <div class="stat-info">
                        <h4>库存预警</h4>
                        <div class="stat-value">${lowStock.length}</div>
                        <div class="stat-change ${lowStock.length > 0 ? 'down' : ''}">${lowStock.length > 0 ? '需及时补货' : '库存健康'}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">💰</div>
                    <div class="stat-info">
                        <h4>库存总值</h4>
                        <div class="stat-value">¥${(totalValue / 10000).toFixed(1)}万</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">🏭</div>
                    <div class="stat-info">
                        <h4>仓库数量</h4>
                        <div class="stat-value">${AppData.warehouses.length}</div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>📦 物资库存列表</h3>
                    <div style="display:flex;gap:10px">
                        <select class="form-control" style="width:160px" id="inv-category">
                            <option value="">全部分类</option>
                            <option value="消防装备">消防装备</option>
                            <option value="救援装备">救援装备</option>
                            <option value="医疗物资">医疗物资</option>
                            <option value="防护装备">防护装备</option>
                            <option value="通用装备">通用装备</option>
                            <option value="生活物资">生活物资</option>
                        </select>
                        <select class="form-control" style="width:160px" id="inv-status">
                            <option value="">全部状态</option>
                            <option value="low">库存不足</option>
                            <option value="normal">库存正常</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="inventory-grid" id="inventory-grid">
                        ${SupplierPages.renderInventoryItems(AppData.inventory)}
                    </div>
                </div>
            </div>
        `;

        document.getElementById('inv-category')?.addEventListener('change', SupplierPages.filterInventory);
        document.getElementById('inv-status')?.addEventListener('change', SupplierPages.filterInventory);
    },

    renderInventoryItems(items) {
        return items.map(i => {
            const ratio = i.stock / i.minStock;
            const stockClass = ratio < 1 ? 'danger' : ratio < 1.5 ? 'warning' : 'success';
            return `
                <div class="inventory-item ${i.stock < i.minStock ? 'low-stock' : ''}">
                    <div class="inventory-header">
                        <div>
                            <div class="inventory-name">${i.icon} ${i.name}</div>
                            <div class="inventory-category">${i.category}</div>
                        </div>
                        ${i.stock < i.minStock ? '<span class="tag tag-red">库存不足</span>' : '<span class="tag tag-green">库存正常</span>'}
                    </div>
                    <div class="inventory-stock">${i.stock} <small>/ ${i.minStock} ${i.unit}(安全线)</small></div>
                    <div class="progress-bar" style="margin-bottom:10px">
                        <div class="progress-fill ${stockClass}" style="width:${Math.min(100, i.stock / i.minStock * 50)}%"></div>
                    </div>
                    <div class="stock-threshold">上次补货：${i.lastRestock || '-'}</div>
                    <div style="display:flex;gap:8px">
                        <button class="btn btn-sm btn-primary" style="flex:1" onclick="SupplierPages.showRestock('${i.id}')">补货</button>
                        <button class="btn btn-sm btn-ghost" onclick="SupplierPages.showItemDetail('${i.id}')">详情</button>
                    </div>
                </div>
            `;
        }).join('');
    },

    filterInventory() {
        const cat = document.getElementById('inv-category').value;
        const status = document.getElementById('inv-status').value;
        const filtered = AppData.inventory.filter(i => {
            if (cat && i.category !== cat) return false;
            if (status === 'low' && i.stock >= i.minStock) return false;
            if (status === 'normal' && i.stock < i.minStock) return false;
            return true;
        });
        document.getElementById('inventory-grid').innerHTML = SupplierPages.renderInventoryItems(filtered);
    },

    showRestock(id) {
        const item = AppData.inventory.find(i => i.id === id);
        if (!item) return;
        const needQty = Math.max(item.minStock * 2 - item.stock, item.minStock);

        showModal({
            title: `🔄 补货申请 - ${item.name}`,
            confirmText: '提交申请',
            onConfirm: () => {
                const qty = parseInt(document.getElementById('restock-qty').value) || needQty;
                showToast('申请已提交', `${item.name} 补货 ${qty}${item.unit} 申请已提交`, 'success');

                NotificationSystem.add({
                    type: 'warning',
                    icon: '📦',
                    title: '新的补货申请',
                    desc: `${item.name} 需要补货 ${qty}${item.unit}，请审批`,
                    role: 'manager'
                });
            },
            content: `
                <div class="info-grid" style="margin-bottom:20px">
                    <div class="info-item"><label>物资名称</label><div class="value">${item.icon} ${item.name}</div></div>
                    <div class="info-item"><label>分类</label><div class="value">${item.category}</div></div>
                    <div class="info-item"><label>当前库存</label><div class="value" style="color:${item.stock < item.minStock ? 'var(--danger)' : 'var(--dark)'}">${item.stock} ${item.unit}</div></div>
                    <div class="info-item"><label>安全库存</label><div class="value">${item.minStock} ${item.unit}</div></div>
                </div>
                <div class="form-row">
                    <div>
                        <label class="form-label">补货数量 <span class="required">*</span></label>
                        <input class="form-control" type="number" id="restock-qty" value="${needQty}" min="1">
                        <small style="color:var(--gray-500)">建议补货至安全库存2倍：${needQty} ${item.unit}</small>
                    </div>
                    <div>
                        <label class="form-label">供应商</label>
                        <select class="form-control">
                            <option>安消防装备有限公司</option>
                            <option>防护科技有限公司</option>
                            <option>应急物资供应中心</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">备注说明</label>
                    <textarea class="form-control" rows="3" placeholder="补货原因及其他说明..."></textarea>
                </div>
            `
        });
    },

    showItemDetail(id) {
        const item = AppData.inventory.find(i => i.id === id);
        if (!item) return;

        showModal({
            title: `📦 ${item.name} - 库存详情`,
            showFooter: false,
            content: `
                <div class="info-grid">
                    <div class="info-item"><label>物资编号</label><div class="value">${item.id}</div></div>
                    <div class="info-item"><label>物资名称</label><div class="value">${item.icon} ${item.name}</div></div>
                    <div class="info-item"><label>物资分类</label><div class="value">${item.category}</div></div>
                    <div class="info-item"><label>计量单位</label><div class="value">${item.unit}</div></div>
                    <div class="info-item"><label>当前库存</label><div class="value" style="color:${item.stock < item.minStock ? 'var(--danger)' : 'var(--dark)'};font-size:20px">${item.stock} ${item.unit}</div></div>
                    <div class="info-item"><label>安全库存</label><div class="value">${item.minStock} ${item.unit}</div></div>
                    <div class="info-item"><label>库存状态</label><div class="value"><span class="tag tag-${item.stock < item.minStock ? 'red' : 'green'}">${item.stock < item.minStock ? '库存不足' : '库存正常'}</span></div></div>
                    <div class="info-item"><label>上次补货</label><div class="value">${item.lastRestock || '-'}</div></div>
                    <div class="info-item full"><label>存放仓库</label><div class="value">中心物资仓库、东城物资仓库、高新区物资仓库</div></div>
                </div>
                <div style="margin-top:20px">
                    <h4 style="margin-bottom:12px">📊 近期出入库记录</h4>
                    <table class="data-table">
                        <thead><tr><th>日期</th><th>类型</th><th>数量</th><th>关联事件</th><th>操作人</th></tr></thead>
                        <tbody>
                            <tr><td>2026-06-01</td><td><span class="tag tag-green">入库</span></td><td>+200 ${item.unit}</td><td>月度补货</td><td>李管理员</td></tr>
                            <tr><td>2026-06-03</td><td><span class="tag tag-orange">出库</span></td><td>-50 ${item.unit}</td><td>EVT-20260603-008</td><td>张调度</td></tr>
                            <tr><td>2026-06-05</td><td><span class="tag tag-orange">出库</span></td><td>-30 ${item.unit}</td><td>EVT-20260605-015</td><td>王调度</td></tr>
                        </tbody>
                    </table>
                </div>
            `
        });
    },

    showAddItem() {
        showModal({
            title: '➕ 新增物资',
            confirmText: '保存',
            onConfirm: () => {
                showToast('保存成功', '新物资已添加到库存列表', 'success');
            },
            content: `
                <div class="form-row">
                    <div>
                        <label class="form-label">物资名称 <span class="required">*</span></label>
                        <input class="form-control" placeholder="如：消防头盔">
                    </div>
                    <div>
                        <label class="form-label">物资分类 <span class="required">*</span></label>
                        <select class="form-control">
                            <option>消防装备</option>
                            <option>救援装备</option>
                            <option>医疗物资</option>
                            <option>防护装备</option>
                            <option>通用装备</option>
                            <option>生活物资</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div>
                        <label class="form-label">当前库存 <span class="required">*</span></label>
                        <input class="form-control" type="number" value="0" min="0">
                    </div>
                    <div>
                        <label class="form-label">安全库存 <span class="required">*</span></label>
                        <input class="form-control" type="number" value="100" min="1">
                    </div>
                    <div>
                        <label class="form-label">计量单位 <span class="required">*</span></label>
                        <select class="form-control">
                            <option>个</option><option>件</option><option>套</option>
                            <option>箱</option><option>米</option><option>瓶</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">备注</label>
                    <textarea class="form-control" rows="3"></textarea>
                </div>
            `
        });
    },

    replenish(main) {
        const lowStock = AppData.inventory.filter(i => i.stock < i.minStock);

        main.innerHTML = App.renderPageHeader('补货申请', '库存低于安全线时自动触发补货提醒，可批量生成采购订单',
            `<button class="btn btn-primary" onclick="SupplierPages.autoGenerateOrders()">📋 一键生成补货单</button>`) + `

            <div class="card" style="border-left:4px solid var(--warning)">
                <div class="card-header"><h3>⚠️ 库存预警（自动触发补货建议）</h3></div>
                <div class="card-body" style="padding:0">
                    ${lowStock.length === 0 ? `
                        <div class="empty-state" style="padding:48px">
                            <div class="empty-state-icon">🎉</div>
                            <div>所有物资库存充足，暂无补货需求</div>
                        </div>
                    ` : `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>物资名称</th>
                                <th>分类</th>
                                <th>当前库存</th>
                                <th>安全库存</th>
                                <th>缺口</th>
                                <th>建议补货量</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${lowStock.map(i => {
                                const gap = i.minStock - i.stock;
                                const suggest = Math.max(i.minStock * 2 - i.stock, i.minStock);
                                return `
                                    <tr>
                                        <td>${i.icon} ${i.name}</td>
                                        <td>${i.category}</td>
                                        <td style="color:var(--danger);font-weight:600">${i.stock} ${i.unit}</td>
                                        <td>${i.minStock} ${i.unit}</td>
                                        <td style="color:var(--danger)">${gap} ${i.unit}</td>
                                        <td><strong>${suggest}</strong> ${i.unit}</td>
                                        <td>
                                            <button class="btn btn-sm btn-warning" onclick="SupplierPages.showRestock('${i.id}')">申请补货</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>`}
                </div>
            </div>

            <div class="card">
                <div class="card-header"><h3>📋 补货申请记录</h3></div>
                <div class="card-body" style="padding:0">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>申请编号</th>
                                <th>申请时间</th>
                                <th>物资</th>
                                <th>数量</th>
                                <th>申请人</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="font-family:monospace">RR-20260606-001</td>
                                <td>2026-06-06 08:30</td>
                                <td>🧯 消防灭火器</td>
                                <td>100 个</td>
                                <td>王管理员</td>
                                <td><span class="tag tag-blue">审批中</span></td>
                                <td><button class="btn btn-sm btn-ghost">查看</button></td>
                            </tr>
                            <tr>
                                <td style="font-family:monospace">RR-20260605-003</td>
                                <td>2026-06-05 14:20</td>
                                <td>😷 呼吸面罩</td>
                                <td>200 个</td>
                                <td>李管理员</td>
                                <td><span class="tag tag-green">已通过</span></td>
                                <td><button class="btn btn-sm btn-ghost">查看</button></td>
                            </tr>
                            <tr>
                                <td style="font-family:monospace">RR-20260604-002</td>
                                <td>2026-06-04 10:15</td>
                                <td>💧 应急饮用水</td>
                                <td>500 箱</td>
                                <td>张管理员</td>
                                <td><span class="tag tag-green">已完成</span></td>
                                <td><button class="btn btn-sm btn-ghost">查看</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    autoGenerateOrders() {
        const lowStock = AppData.inventory.filter(i => i.stock < i.minStock);
        if (lowStock.length === 0) {
            showToast('无需补货', '当前所有物资库存充足', 'info');
            return;
        }

        showModal({
            title: '📋 自动生成补货单',
            confirmText: `确认生成 ${lowStock.length} 个补货申请`,
            onConfirm: () => {
                lowStock.forEach(i => {
                    NotificationSystem.add({
                        type: 'warning',
                        icon: '📦',
                        title: '自动补货申请',
                        desc: `${i.name} 库存不足，已自动生成补货申请`,
                        role: 'manager'
                    });
                });
                showToast('生成成功', `已自动生成 ${lowStock.length} 个补货申请`, 'success');
                App.navigateTo('purchase');
            },
            content: `
                <p style="margin-bottom:16px;color:var(--gray-600)">系统检测到以下 ${lowStock.length} 项物资库存不足，将自动生成补货申请：</p>
                <table class="data-table">
                    <thead><tr><th>物资名称</th><th>当前库存</th><th>安全库存</th><th>建议补货</th></tr></thead>
                    <tbody>
                        ${lowStock.map(i => `
                            <tr>
                                <td>${i.icon} ${i.name}</td>
                                <td style="color:var(--danger)">${i.stock} ${i.unit}</td>
                                <td>${i.minStock} ${i.unit}</td>
                                <td><strong>${Math.max(i.minStock * 2 - i.stock, i.minStock)}</strong> ${i.unit}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `
        });
    },

    purchase(main) {
        const totalAmount = AppData.purchaseOrders.reduce((s, o) => s + o.total, 0);
        const pending = AppData.purchaseOrders.filter(o => o.status === 'pending').length;

        main.innerHTML = App.renderPageHeader('采购订单', '管理所有物资采购订单及供应商',
            `<button class="btn btn-primary" onclick="SupplierPages.showCreateOrder()">➕ 新建采购单</button>`) + `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">📑</div>
                    <div class="stat-info">
                        <h4>采购订单总数</h4>
                        <div class="stat-value">${AppData.purchaseOrders.length}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">⏳</div>
                    <div class="stat-info">
                        <h4>待审批</h4>
                        <div class="stat-value">${pending}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">💰</div>
                    <div class="stat-info">
                        <h4>采购总金额</h4>
                        <div class="stat-value">¥${(totalAmount / 10000).toFixed(1)}万</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">🚚</div>
                    <div class="stat-info">
                        <h4>运输中</h4>
                        <div class="stat-value">${AppData.purchaseOrders.filter(o => o.status === 'shipping').length}</div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header"><h3>📑 采购订单列表</h3></div>
                <div class="card-body" style="padding:0">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>订单编号</th>
                                <th>创建时间</th>
                                <th>供应商</th>
                                <th>物资明细</th>
                                <th>总金额</th>
                                <th>预计到货</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${AppData.purchaseOrders.map(o => `
                                <tr>
                                    <td style="font-family:monospace;font-size:12px">${o.id}</td>
                                    <td>${o.createdAt}</td>
                                    <td>${o.supplier}</td>
                                    <td>${o.items.map(i => `${i.name} x${i.qty}`).join('，')}</td>
                                    <td>¥${o.total.toLocaleString()}</td>
                                    <td>${o.expectedDate}</td>
                                    <td><span class="tag tag-${o.status === 'approved' ? 'green' : o.status === 'pending' ? 'yellow' : o.status === 'shipping' ? 'blue' : 'gray'}">
                                        ${o.status === 'approved' ? '已审批' : o.status === 'pending' ? '待审批' : o.status === 'shipping' ? '运输中' : '已完成'}
                                    </span></td>
                                    <td>
                                        <button class="btn btn-sm btn-primary" onclick="SupplierPages.showOrderDetail('${o.id}')">详情</button>
                                        ${o.status === 'shipping' ? `<button class="btn btn-sm btn-success" onclick="SupplierPages.confirmReceive('${o.id}')">确认收货</button>` : ''}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    showOrderDetail(id) {
        const order = AppData.purchaseOrders.find(o => o.id === id);
        if (!order) return;

        showModal({
            title: `📑 采购订单详情 - ${order.id}`,
            showFooter: false,
            content: `
                <div class="info-grid">
                    <div class="info-item"><label>订单编号</label><div class="value" style="font-family:monospace">${order.id}</div></div>
                    <div class="info-item"><label>创建时间</label><div class="value">${order.createdAt}</div></div>
                    <div class="info-item"><label>供应商</label><div class="value">${order.supplier}</div></div>
                    <div class="info-item"><label>状态</label><div class="value"><span class="tag tag-${order.status === 'approved' ? 'green' : order.status === 'pending' ? 'yellow' : 'blue'}">${order.status === 'approved' ? '已审批' : order.status === 'pending' ? '待审批' : '运输中'}</span></div></div>
                    <div class="info-item"><label>总金额</label><div class="value" style="font-size:20px;color:var(--primary)">¥${order.total.toLocaleString()}</div></div>
                    <div class="info-item"><label>预计到货</label><div class="value">${order.expectedDate}</div></div>
                </div>
                <div style="margin-top:20px">
                    <h4 style="margin-bottom:12px">📦 采购明细</h4>
                    <table class="data-table">
                        <thead><tr><th>物资名称</th><th>数量</th><th>单价</th><th>小计</th></tr></thead>
                        <tbody>
                            ${order.items.map(i => `
                                <tr>
                                    <td>${i.name}</td>
                                    <td>${i.qty}</td>
                                    <td>¥${i.price.toLocaleString()}</td>
                                    <td>¥${(i.qty * i.price).toLocaleString()}</td>
                                </tr>
                            `).join('')}
                            <tr>
                                <td colspan="3" style="text-align:right;font-weight:600">合计：</td>
                                <td style="font-weight:600;color:var(--primary)">¥${order.total.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `
        });
    },

    confirmReceive(id) {
        showModal({
            title: '✅ 确认收货',
            confirmText: '确认收货',
            onConfirm: () => {
                const order = AppData.purchaseOrders.find(o => o.id === id);
                if (order) order.status = 'completed';
                showToast('收货成功', '物资已入库，库存已更新', 'success');

                NotificationSystem.add({
                    type: 'success',
                    icon: '📦',
                    title: '采购订单已完成',
                    desc: `${id} 物资已成功验收入库`,
                    role: 'manager'
                });

                App.navigateTo('purchase');
            },
            content: `<p>确认已收到采购订单 <strong>${id}</strong> 的全部物资？确认后库存将自动更新。</p>`
        });
    },

    showCreateOrder() {
        showModal({
            title: '➕ 新建采购订单',
            confirmText: '提交订单',
            onConfirm: () => {
                showToast('创建成功', '采购订单已创建，等待审批', 'success');
            },
            content: `
                <div class="form-row">
                    <div>
                        <label class="form-label">供应商 <span class="required">*</span></label>
                        <select class="form-control">
                            <option>安消防装备有限公司</option>
                            <option>防护科技有限公司</option>
                            <option>清泉饮品有限公司</option>
                            <option>应急物资供应中心</option>
                        </select>
                    </div>
                    <div>
                        <label class="form-label">预计到货日期</label>
                        <input class="form-control" type="date">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">采购物资</label>
                    <table class="data-table">
                        <thead><tr><th>物资名称</th><th>数量</th><th>单价</th><th>操作</th></tr></thead>
                        <tbody>
                            <tr>
                                <td>
                                    <select class="form-control" style="min-width:160px">
                                        ${AppData.inventory.map(i => `<option>${i.icon} ${i.name}</option>`).join('')}
                                    </select>
                                </td>
                                <td><input class="form-control" type="number" value="100" style="width:100px"></td>
                                <td><input class="form-control" type="number" value="50" style="width:100px"></td>
                                <td><button class="btn btn-sm btn-ghost">删除</button></td>
                            </tr>
                        </tbody>
                    </table>
                    <button class="btn btn-sm btn-ghost" style="margin-top:8px">+ 添加物资</button>
                </div>
                <div class="form-group">
                    <label class="form-label">备注</label>
                    <textarea class="form-control" rows="3"></textarea>
                </div>
            `
        });
    }
};
