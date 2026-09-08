// Admin JS - Parheheon HKBP Cibubur (SHINE TOMBUR Vol 2) Strict System

const CATEGORY_NAMES = {
  'tiket': 'Tiket Masuk Wristband',
  'bundling': 'Paket Bundling (Tiket + Kipas)',
  'kipas': 'Official Kipas TOMBUR Vol 2'
};

const DAY_NAMES = {
  'day1': 'Sabtu, 12 Sep 2026 (Day One)',
  'day2': 'Minggu, 13 Sep 2026 (Day Two)',
  'both': 'Sabtu & Minggu (Terusan 2 Hari)'
};

let currentVerifyingOrderId = null;

function getOrders() {
  return JSON.parse(localStorage.getItem('parheheon_orders') || '[]');
}

function saveOrders(orders) {
  localStorage.setItem('parheheon_orders', JSON.stringify(orders));
}

function getStock() {
  return JSON.parse(localStorage.getItem('parheheon_stock') || '{}');
}

function saveStock(stock) {
  localStorage.setItem('parheheon_stock', JSON.stringify(stock));
}

document.addEventListener('DOMContentLoaded', () => {
  setupAuth();
  setupFilters();
});

function setupAuth() {
  const loginForm = document.getElementById('adminLoginForm');
  const loginModal = document.getElementById('loginModal');
  const adminContent = document.getElementById('adminMainContent');
  const btnLogout = document.getElementById('btnLogout');

  if (sessionStorage.getItem('admin_logged_in') === 'true') {
    loginModal.classList.remove('active');
    adminContent.style.display = 'block';
    btnLogout.style.display = 'inline-flex';
    loadDashboardData();
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('adminUser').value.trim();
    const p = document.getElementById('adminPass').value.trim();

    if (u === 'admin' && p === 'admin123') {
      sessionStorage.setItem('admin_logged_in', 'true');
      loginModal.classList.remove('active');
      adminContent.style.display = 'block';
      btnLogout.style.display = 'inline-flex';
      loadDashboardData();
    } else {
      alert('Username atau Password salah! (Default: admin / admin123)');
    }
  });

  btnLogout.addEventListener('click', () => {
    sessionStorage.removeItem('admin_logged_in');
    location.reload();
  });

  document.getElementById('btnRefreshData').addEventListener('click', loadDashboardData);

  document.getElementById('btnResetDatabase').addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin mengosongkan seluruh database transaksi? (Sistem akan kembali bersih dengan data 0).')) {
      localStorage.setItem('parheheon_orders', JSON.stringify([]));
      const resetStock = {
        'tiket_day1': 200,
        'tiket_day2': 100,
        'kipas': 200
      };
      saveStock(resetStock);
      loadDashboardData();
      alert('Database transaksi berhasil dikosongkan. Sistem siap mencatat transaksi baru (Tanpa Data Dummy).');
    }
  });
}

function loadDashboardData() {
  const orders = getOrders();
  const stock = getStock();
  
  let totalIncome = 0; // ONLY lunas status
  let totalOrdersValue = 0; // all created orders
  let qrisIncome = 0;
  let cashIncome = 0;
  let totalTicketsSold = 0;
  let totalProductsSold = 0;
  let pendingCount = 0;
  let pickedUpCount = 0;
  let notPickedUpCount = 0;

  orders.forEach(o => {
    totalOrdersValue += o.total;

    if (o.status === 'lunas') {
      totalIncome += o.total;
      totalProductsSold += o.qty;
      if (o.category === 'tiket' || o.category === 'bundling') {
        totalTicketsSold += (o.day === 'both' ? o.qty * 2 : o.qty);
      }

      if (o.payMethod === 'qris') qrisIncome += o.total;
      if (o.payMethod === 'cash') cashIncome += o.total;
    }

    if (o.status === 'menunggu_verifikasi' || o.status === 'menunggu_pembayaran') {
      pendingCount++;
    }

    if (o.pickupStatus === 'tiket_diambil') {
      pickedUpCount += o.qty;
    } else {
      notPickedUpCount += o.qty;
    }
  });

  document.getElementById('statTotalIncome').textContent = `Rp ${totalIncome.toLocaleString('id-ID')}`;
  document.getElementById('statTotalOrdersValue').textContent = `Rp ${totalOrdersValue.toLocaleString('id-ID')}`;
  document.getElementById('statQrisIncome').textContent = `Rp ${qrisIncome.toLocaleString('id-ID')}`;
  document.getElementById('statCashIncome').textContent = `Rp ${cashIncome.toLocaleString('id-ID')}`;
  document.getElementById('statTotalTickets').textContent = `${totalTicketsSold} Tiket`;
  document.getElementById('statTotalProducts').textContent = `${totalProductsSold} Item`;
  document.getElementById('statPendingCount').textContent = `${pendingCount} Transaksi`;
  document.getElementById('statPickedUpCount').textContent = `${pickedUpCount} Item`;
  document.getElementById('statNotPickedUpCount').textContent = `${notPickedUpCount} Item`;

  // Real-time sisa kuota tiket
  const day1QuotaElem = document.getElementById('statDay1Quota');
  const day2QuotaElem = document.getElementById('statDay2Quota');
  if (day1QuotaElem) day1QuotaElem.textContent = `${stock['tiket_day1'] ?? 200}`;
  if (day2QuotaElem) day2QuotaElem.textContent = `${stock['tiket_day2'] ?? 100}`;

  renderTransactionsTable();
  renderProductStockReport();
  renderDailyReports();
}

function setupFilters() {
  document.getElementById('adminSearchName').addEventListener('input', renderTransactionsTable);
  document.getElementById('filterDay').addEventListener('change', renderTransactionsTable);
  document.getElementById('filterMethod').addEventListener('change', renderTransactionsTable);
  document.getElementById('filterStatus').addEventListener('change', renderTransactionsTable);
  document.getElementById('filterPickup').addEventListener('change', renderTransactionsTable);
}

function renderTransactionsTable() {
  const tbody = document.getElementById('transactionTableBody');
  const orders = getOrders();
  const searchName = document.getElementById('adminSearchName').value.trim().toLowerCase();
  const filterDay = document.getElementById('filterDay').value;
  const filterMethod = document.getElementById('filterMethod').value;
  const filterStatus = document.getElementById('filterStatus').value;
  const filterPickup = document.getElementById('filterPickup').value;

  tbody.innerHTML = '';

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 2.5rem;"><i class="fa-solid fa-folder-open" style="font-size: 1.8rem; color: var(--accent-gold); display: block; margin-bottom: 8px;"></i>Belum ada data transaksi di database.</td></tr>`;
    return;
  }

  const filtered = orders.filter(o => {
    const matchName = searchName === '' || o.name.toLowerCase().includes(searchName) || o.id.toLowerCase().includes(searchName);
    const matchDay = (filterDay === 'all' || o.day === filterDay);
    const matchMethod = (filterMethod === 'all' || o.payMethod === filterMethod);
    const matchStatus = (filterStatus === 'all' || o.status === filterStatus);
    const matchPickup = (filterPickup === 'all' || o.pickupStatus === filterPickup);
    return matchName && matchDay && matchMethod && matchStatus && matchPickup;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 2rem;">Belum ada data transaksi yang sesuai dengan filter pencarian.</td></tr>`;
    return;
  }

  filtered.forEach(o => {
    const tr = document.createElement('tr');
    
    let statusBadge = '';
    if (o.status === 'lunas') {
      statusBadge = '<span class="badge badge-verified"><i class="fa-solid fa-circle-check"></i> LUNAS</span>';
    } else if (o.status === 'menunggu_verifikasi') {
      statusBadge = '<span class="badge badge-pending"><i class="fa-solid fa-hourglass-start"></i> VERIFIKASI QRIS</span>';
    } else if (o.status === 'menunggu_pembayaran') {
      statusBadge = '<span class="badge badge-pending"><i class="fa-solid fa-money-bill"></i> PEMBAYARAN CASH</span>';
    } else {
      statusBadge = '<span class="badge badge-rejected"><i class="fa-solid fa-ban"></i> DITOLAK</span>';
    }

    let pickupBadge = o.pickupStatus === 'tiket_diambil'
      ? '<span class="badge badge-pickedup"><i class="fa-solid fa-box-open"></i> TIKET DIAMBIL</span>'
      : '<span class="badge badge-notpickedup"><i class="fa-solid fa-clock"></i> BELUM DIAMBIL</span>';

    let payMethodLabel = o.payMethod === 'qris' 
      ? '<span style="color: var(--accent-gold); font-weight:700;"><i class="fa-solid fa-qrcode"></i> QRIS</span>'
      : '<span style="color: var(--accent-green); font-weight:700;"><i class="fa-solid fa-money-bill"></i> CASH</span>';

    tr.innerHTML = `
      <td><strong style="color: var(--accent-gold);">${o.id}</strong></td>
      <td><strong style="color: #fff; font-size: 0.95rem;">${o.name}</strong></td>
      <td><span style="font-size: 0.85rem; color: var(--text-muted);">${DAY_NAMES[o.day] || o.day}</span></td>
      <td>${o.church}</td>
      <td>${CATEGORY_NAMES[o.category]}<br><strong style="color: var(--accent-gold);">${o.qty} Item</strong></td>
      <td>${payMethodLabel}<br><strong style="color: #fff;">Rp ${o.total.toLocaleString('id-ID')}</strong></td>
      <td>${statusBadge}</td>
      <td>${pickupBadge}</td>
      <td>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          ${o.status !== 'lunas' ? `<button class="btn btn-success" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="openVerifyModal('${o.id}')"><i class="fa-solid fa-check"></i> Verifikasi</button>` : ''}
          <button class="btn ${o.pickupStatus === 'tiket_diambil' ? 'btn-secondary' : 'btn-primary'}" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="togglePickupStatus('${o.id}')">
            ${o.pickupStatus === 'tiket_diambil' ? '<i class="fa-solid fa-rotate-left"></i> Batal Ambil' : '<i class="fa-solid fa-box-open"></i> Tandai Diambil'}
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function togglePickupStatus(orderId) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx !== -1) {
    const current = orders[idx].pickupStatus;
    orders[idx].pickupStatus = current === 'tiket_diambil' ? 'belum_diambil' : 'tiket_diambil';
    saveOrders(orders);
    loadDashboardData();
  }
}

// Product Stock & Sales Report Table
function renderProductStockReport() {
  const tbody = document.getElementById('productStockReportBody');
  const orders = getOrders();
  const stock = getStock();

  tbody.innerHTML = '';

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">Belum ada data penjualan produk di database.</td></tr>`;
    return;
  }

  const items = [
    { key: 'tiket', name: 'Tiket Masuk Wristband (Rp 10.000)' },
    { key: 'bundling', name: 'Paket Bundling Tiket + Kipas (Rp 15.000)' },
    { key: 'kipas', name: 'Official Kipas TOMBUR Vol 2 (Rp 10.000)' }
  ];

  items.forEach(item => {
    let day1Qty = 0;
    let day2Qty = 0;
    let totalQty = 0;
    let revenue = 0;

    orders.forEach(o => {
      if (o.category === item.key && o.status === 'lunas') {
        totalQty += o.qty;
        revenue += o.total;

        if (o.day === 'day1' || o.day === 'both') day1Qty += o.qty;
        if (o.day === 'day2' || o.day === 'both') day2Qty += o.qty;
      }
    });

    let sisaStockText = '';
    if (item.key === 'tiket') {
      sisaStockText = `Day 1: ${stock['tiket_day1'] ?? 200} | Day 2: ${stock['tiket_day2'] ?? 100}`;
    } else if (item.key === 'bundling') {
      sisaStockText = `Day 1: ${stock['tiket_day1'] ?? 200} | Day 2: ${stock['tiket_day2'] ?? 100}`;
    } else {
      sisaStockText = `Kipas: ${stock['kipas'] ?? 200}`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong style="color: #fff;">${item.name}</strong></td>
      <td>${day1Qty} Item</td>
      <td>${day2Qty} Item</td>
      <td><strong style="color: var(--accent-gold);">${totalQty} Item</strong></td>
      <td><span class="badge badge-pickedup">Stok Sisa: ${sisaStockText}</span></td>
      <td><strong style="color: var(--accent-green);">Rp ${revenue.toLocaleString('id-ID')}</strong></td>
    `;
    tbody.appendChild(tr);
  });
}

// Daily Financial Reports Engine (Day One: 12 Sep, Day Two: 13 Sep, Laporan Keseluruhan)
function renderDailyReports() {
  const tbody = document.getElementById('dailyReportsBody');
  const orders = getOrders();

  tbody.innerHTML = '';

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">Belum ada data laporan keuangan di database.</td></tr>`;
    return;
  }

  const reportData = {
    'day1': { title: 'Day One — Sabtu, 12 September 2026', tickets: 0, orders: 0, qris: 0, cash: 0, totalIncome: 0, pendingCount: 0 },
    'day2': { title: 'Day Two — Minggu, 13 September 2026', tickets: 0, orders: 0, qris: 0, cash: 0, totalIncome: 0, pendingCount: 0 },
    'both': { title: 'Terusan 2 Hari (Sabtu & Minggu)', tickets: 0, orders: 0, qris: 0, cash: 0, totalIncome: 0, pendingCount: 0 }
  };

  let combinedTickets = 0;
  let combinedOrders = 0;
  let combinedQris = 0;
  let combinedCash = 0;
  let combinedIncome = 0;
  let combinedPending = 0;

  orders.forEach(o => {
    const dayKey = o.day || 'day1';

    if (reportData[dayKey]) {
      reportData[dayKey].orders++;
      if (o.status === 'lunas') {
        reportData[dayKey].tickets += (o.day === 'both' ? o.qty * 2 : o.qty);
        reportData[dayKey].totalIncome += o.total;

        if (o.payMethod === 'qris') reportData[dayKey].qris += o.total;
        if (o.payMethod === 'cash') reportData[dayKey].cash += o.total;
      } else {
        reportData[dayKey].pendingCount++;
      }
    }

    combinedOrders++;
    if (o.status === 'lunas') {
      combinedTickets += (o.day === 'both' ? o.qty * 2 : o.qty);
      combinedIncome += o.total;
      if (o.payMethod === 'qris') combinedQris += o.total;
      if (o.payMethod === 'cash') combinedCash += o.total;
    } else {
      combinedPending++;
    }
  });

  // Render Day One, Day Two, Both
  ['day1', 'day2', 'both'].forEach(key => {
    const r = reportData[key];
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong style="color: #fff;">${r.title}</strong></td>
      <td>${r.tickets} Tiket</td>
      <td>${r.orders} Order</td>
      <td>Rp ${r.qris.toLocaleString('id-ID')}</td>
      <td>Rp ${r.cash.toLocaleString('id-ID')}</td>
      <td><strong style="color: var(--accent-gold); font-size: 1.05rem;">Rp ${r.totalIncome.toLocaleString('id-ID')}</strong></td>
      <td><span class="badge badge-pending">${r.pendingCount} Transaksi</span></td>
    `;
    tbody.appendChild(tr);
  });

  // Combined Total Row (Day One + Day Two)
  const totalTr = document.createElement('tr');
  totalTr.style.cssText = 'background: rgba(255, 215, 0, 0.15); border-top: 2px solid var(--accent-gold); font-weight: 800;';
  totalTr.innerHTML = `
    <td><strong style="color: var(--accent-gold); font-size: 1.05rem;">LAPORAN KESELURUHAN (DAY ONE + DAY TWO)</strong></td>
    <td><strong style="color: var(--accent-gold);">${combinedTickets} Tiket</strong></td>
    <td>${combinedOrders} Order</td>
    <td>Rp ${combinedQris.toLocaleString('id-ID')}</td>
    <td>Rp ${combinedCash.toLocaleString('id-ID')}</td>
    <td><strong style="color: var(--accent-gold); font-size: 1.15rem;">Rp ${combinedIncome.toLocaleString('id-ID')}</strong></td>
    <td><span class="badge badge-pending">${combinedPending} Transaksi</span></td>
  `;
  tbody.appendChild(totalTr);
}

// Download / Export Excel (CSV Format with UTF-8 BOM)
function exportReportToCsv(filterType) {
  const orders = getOrders();
  
  const filtered = orders.filter(o => {
    if (filterType === 'day1') return o.day === 'day1';
    if (filterType === 'day2') return o.day === 'day2';
    return true; // 'all'
  });

  if (filtered.length === 0) {
    alert(`Belum ada data transaksi di database untuk laporan: ${filterType}.`);
    return;
  }

  // UTF-8 BOM for Microsoft Excel compatibility
  let csvContent = "\uFEFF";

  csvContent += "=======================================================\n";
  csvContent += `LAPORAN KEUANGAN PARHEHEON HKBP CIBUBUR (SHINE 2026)\n`;
  csvContent += `Kategori Laporan: ${filterType.toUpperCase()}\n`;
  csvContent += `Waktu Export: ${new Date().toLocaleString('id-ID')}\n`;
  csvContent += "=======================================================\n\n";

  let totalQrisLunas = 0;
  let totalCashLunas = 0;
  let totalUangMasuk = 0;
  let totalPending = 0;
  let totalDitolak = 0;

  csvContent += "Nomor Transaksi,Nama Pembeli,Asal Gereja / Kontingen,Hari Event,Jenis Produk,Jumlah (Qty),Harga Satuan,Total Transaksi,Metode Pembayaran,Status Pembayaran,Status Pengambilan,Waktu Transaksi\n";

  filtered.forEach(o => {
    if (o.status === 'lunas') {
      totalUangMasuk += o.total;
      if (o.payMethod === 'qris') totalQrisLunas += o.total;
      if (o.payMethod === 'cash') totalCashLunas += o.total;
    } else if (o.status === 'ditolak') {
      totalDitolak += o.total;
    } else {
      totalPending += o.total;
    }

    const row = [
      `"${o.id}"`,
      `"${o.name}"`,
      `"${o.church}"`,
      `"${DAY_NAMES[o.day] || o.day}"`,
      `"${o.productName}"`,
      o.qty,
      o.unitPrice,
      o.total,
      `"${o.payMethod.toUpperCase()}"`,
      `"${o.status.toUpperCase()}"`,
      `"${o.pickupStatus.toUpperCase()}"`,
      `"${o.date}"`
    ];
    csvContent += row.join(",") + "\n";
  });

  // Financial summary footer in CSV
  csvContent += "\n";
  csvContent += "-------------------------------------------------------\n";
  csvContent += "RINGKASAN REKAPITULASI KEUANGAN LUNAS\n";
  csvContent += "-------------------------------------------------------\n";
  csvContent += `TOTAL QRIS (LUNAS),,,,,,,Rp ${totalQrisLunas.toLocaleString('id-ID')}\n`;
  csvContent += `TOTAL CASH (LUNAS),,,,,,,Rp ${totalCashLunas.toLocaleString('id-ID')}\n`;
  csvContent += `TOTAL UANG MASUK (LUNAS ONLY),,,,,,,Rp ${totalUangMasuk.toLocaleString('id-ID')}\n`;
  csvContent += `TOTAL TRANSAKSI PENDING,,,,,,,Rp ${totalPending.toLocaleString('id-ID')}\n`;
  csvContent += `TOTAL TRANSAKSI DITOLAK,,,,,,,Rp ${totalDitolak.toLocaleString('id-ID')}\n`;
  csvContent += "-------------------------------------------------------\n";

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Laporan_Keuangan_SHINE_${filterType}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Verification Modal
function openVerifyModal(orderId) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  currentVerifyingOrderId = orderId;
  const container = document.getElementById('verifyDetailsContent');
  
  let proofHtml = order.proofImage 
    ? `<div style="text-align: center; margin-top: 10px;"><label style="font-size: 0.8rem; color: var(--text-muted);">Foto Bukti Transfer QRIS:</label><br><img src="${order.proofImage}" alt="Bukti Transfer" style="max-width: 100%; max-height: 260px; border-radius: 8px; border: 1px solid var(--border-color); margin-top:4px;"></div>`
    : `<div style="text-align: center; font-size: 0.88rem; color: var(--accent-gold); margin-top: 10px; background: rgba(255,215,0,0.1); padding: 8px; border-radius: 6px;">Metode Pembayaran: <strong>${order.payMethod.toUpperCase()}</strong> (Konfirmasi Tunai di Meja Panitia).</div>`;

  container.innerHTML = `
    <div class="summary-box">
      <div class="summary-row"><span>Nomor Transaksi:</span> <strong>${order.id}</strong></div>
      <div class="summary-row"><span>Nama Pemesan:</span> <strong style="color: var(--accent-gold); font-size: 1.05rem;">${order.name}</strong></div>
      <div class="summary-row"><span>Hari Event:</span> <strong>${DAY_NAMES[order.day] || order.day}</strong></div>
      <div class="summary-row"><span>Asal Gereja / Kontingen:</span> <strong>${order.church}</strong></div>
      <div class="summary-row"><span>Produk & Qty:</span> <strong>${order.productName} (${order.qty} Item)</strong></div>
      <div class="summary-total"><span>Total Bayar:</span> <strong>Rp ${order.total.toLocaleString('id-ID')}</strong></div>
    </div>
    ${proofHtml}
  `;

  document.getElementById('btnApprovePayment').onclick = () => {
    updateOrderStatus(currentVerifyingOrderId, 'lunas');
    closeModal('adminVerifyModal');
  };

  document.getElementById('btnRejectPayment').onclick = () => {
    updateOrderStatus(currentVerifyingOrderId, 'ditolak');
    closeModal('adminVerifyModal');
  };

  openModal('adminVerifyModal');
}

function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx !== -1) {
    orders[idx].status = status;
    saveOrders(orders);
    loadDashboardData();
    alert(`Status transaksi ${orderId} (${orders[idx].name}) berhasil diubah menjadi: ${status.toUpperCase()}`);
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}
