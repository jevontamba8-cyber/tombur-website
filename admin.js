// Admin JS - Parheheon HKBP Cibubur (SHINE TOMBUR Vol 2) Strict System

const CATEGORY_NAMES = {
  'tiket': 'Tiket Masuk Wristband'
};

const DAY_NAMES = {
  'day1': 'Sabtu, 12 Sep 2026 (Day One)',
  'day2': 'Minggu, 13 Sep 2026 (Day Two)'
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

let currentCaptcha = '';

function generateCaptcha() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  currentCaptcha = code;
  const display = document.getElementById('captchaDisplay');
  if (display) {
    display.textContent = code;
  }
}

const INITIAL_ORDERS_SEED = [
  { id: 'TRX-CASH-D1-001', name: 'Pembeli Cash Tomang Barat', church: 'HKBP Tomang Barat', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 1, total: 10000, payMethod: 'cash', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T10:00:00.000Z' },
  { id: 'TRX-CASH-D1-002', name: 'Pembeli Cash Rawamangun', church: 'HKBP Rawamangun', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 2, total: 20000, payMethod: 'cash', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T10:05:00.000Z' },
  { id: 'TRX-CASH-D1-003', name: 'Pembeli Cash Harjamukti', church: 'HKBP Harjamukti', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 5, total: 50000, payMethod: 'cash', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T10:10:00.000Z' },
  { id: 'TRX-CASH-D1-004', name: 'Pembeli Cash Cibinong', church: 'HKBP Cibinong', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 2, total: 20000, payMethod: 'cash', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T10:15:00.000Z' },
  { id: 'TRX-CASH-D1-005', name: 'Pembeli Cash Jatisampurna', church: 'HKBP Jatisampurna', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 5, total: 50000, payMethod: 'cash', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T10:20:00.000Z' },
  { id: 'TRX-CASH-D1-006', name: 'Pembeli Cash Kernolong', church: 'HKBP Kernolong', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 1, total: 10000, payMethod: 'cash', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T10:25:00.000Z' },
  { id: 'TRX-CASH-D1-007', name: 'Pembeli Cash Cibubur', church: 'HKBP Cibubur', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 4, total: 40000, payMethod: 'cash', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T10:30:00.000Z' },
  { id: 'TRX-CASH-D1-008', name: 'Pembeli Cash Jatimurni', church: 'HKBP Jatimurni', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 1, total: 10000, payMethod: 'cash', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T10:35:00.000Z' },
  { id: 'TRX-CASH-D1-009', name: 'Pembeli Cash Tebet', church: 'HKBP Tebet', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 1, total: 10000, payMethod: 'cash', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T10:40:00.000Z' },
  { id: 'TRX-CASH-D1-010', name: 'Pembeli Cash GPIB Agape', church: 'GPIB AGAPE', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 2, total: 20000, payMethod: 'cash', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T10:45:00.000Z' },
  { id: 'TRX-TF-D1-001', name: 'Pembeli TF Kernolong', church: 'HKBP Kernolong', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 15, total: 150000, payMethod: 'qris', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T11:00:00.000Z' },
  { id: 'TRX-TF-D1-002', name: 'Pembeli TF Cibinong', church: 'HKBP Cibinong', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 3, total: 30000, payMethod: 'qris', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T11:05:00.000Z' },
  { id: 'TRX-TF-D1-003', name: 'Pembeli TF Jatimurni', church: 'HKBP Jatimurni', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 4, total: 40000, payMethod: 'qris', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T11:10:00.000Z' },
  { id: 'TRX-TF-D1-004', name: 'Pembeli TF Jatiwaringin', church: 'HKBP JATIWARINGIN', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 6, total: 60000, payMethod: 'qris', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T11:15:00.000Z' },
  { id: 'TRX-TF-D1-005', name: 'Pembeli TF Rawamangun', church: 'HKBP Rawamangun', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 10, total: 100000, payMethod: 'qris', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T11:20:00.000Z' },
  { id: 'TRX-TF-D1-006', name: 'Pembeli TF Pulo Mas', church: 'HKBP PULOMAS', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 16, total: 160000, payMethod: 'qris', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T11:25:00.000Z' },
  { id: 'TRX-TF-D1-007', name: 'Pembeli TF GKP Yeruel', church: 'GKP YERUEL', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 5, total: 50000, payMethod: 'qris', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T11:30:00.000Z' },
  { id: 'TRX-TF-D1-008', name: 'Pembeli TF Kebon Jeruk', church: 'HKBP Kebon Jeruk', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 6, total: 60000, payMethod: 'qris', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T11:35:00.000Z' },
  { id: 'TRX-TF-D1-009', name: 'Pembeli TF Tomang Barat', church: 'HKBP Tomang Barat', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 2, total: 20000, payMethod: 'qris', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T11:40:00.000Z' },
  { id: 'TRX-TF-D1-010', name: 'Pembeli TF Cibubur', church: 'HKBP Cibubur', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 3, total: 30000, payMethod: 'qris', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T11:45:00.000Z' },
  { id: 'TRX-TF-D1-011', name: 'Pembeli TF Jatisampurna', church: 'HKBP Jatisampurna', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 3, total: 30000, payMethod: 'qris', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T11:50:00.000Z' },
  { id: 'TRX-TF-D1-012', name: 'Pembeli TF Cipcil', church: 'Cipcil', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 1, total: 10000, payMethod: 'qris', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T11:55:00.000Z' },
  { id: 'TRX-TF-D1-013', name: 'Pembeli TF GPIB Agape', church: 'GPIB AGAPE', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 2, total: 20000, payMethod: 'qris', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T12:00:00.000Z' },
  { id: 'TRX-WEB-D1-001', name: 'Pembeli Web Cibubur', church: 'HKBP Cibubur', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 1, total: 10000, payMethod: 'qris', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T12:05:00.000Z' },
  { id: 'TRX-WEB-D1-002', name: 'Pembeli Web Anonim', church: 'Umum / Anonim', day: 'day1', category: 'tiket', productName: 'Tiket Masuk Wristband', unitPrice: 10000, qty: 1, total: 10000, payMethod: 'qris', status: 'lunas', pickupStatus: 'belum_diambil', createdAt: '2026-09-12T12:10:00.000Z' }
];

function initStorage() {
  if (!localStorage.getItem('parheheon_orders')) {
    localStorage.setItem('parheheon_orders', JSON.stringify(INITIAL_ORDERS_SEED));
  }
  if (!localStorage.getItem('parheheon_stock')) {
    const initialStock = {
      'tiket_day1': 98,
      'tiket_day2': 100
    };
    localStorage.setItem('parheheon_stock', JSON.stringify(initialStock));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  setupAuth();
  setupFilters();
});

function setupAuth() {
  const loginForm = document.getElementById('adminLoginForm');
  const loginModal = document.getElementById('loginModal');
  const adminContent = document.getElementById('adminMainContent');
  const btnLogout = document.getElementById('btnLogout');
  const btnRefreshCaptcha = document.getElementById('btnRefreshCaptcha');
  const errorAlert = document.getElementById('loginErrorAlert');
  const errorMsg = document.getElementById('loginErrorMsg');

  generateCaptcha();
  if (btnRefreshCaptcha) {
    btnRefreshCaptcha.addEventListener('click', generateCaptcha);
  }

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
    const inputCaptcha = document.getElementById('adminCaptchaInput')?.value.trim().toUpperCase();

    // 1. CAPTCHA Validation
    if (inputCaptcha !== currentCaptcha) {
      if (errorAlert && errorMsg) {
        errorMsg.textContent = 'Kode CAPTCHA tidak sesuai! Silakan coba lagi.';
        errorAlert.style.display = 'block';
      } else {
        alert('Kode CAPTCHA tidak sesuai! Silakan coba lagi.');
      }
      generateCaptcha();
      const captchaInput = document.getElementById('adminCaptchaInput');
      if (captchaInput) captchaInput.value = '';
      return;
    }

    // 2. Authentication Check
    if (u === 'admin' && p === 'admin123') {
      if (errorAlert) errorAlert.style.display = 'none';
      sessionStorage.setItem('admin_logged_in', 'true');
      loginModal.classList.remove('active');
      adminContent.style.display = 'block';
      btnLogout.style.display = 'inline-flex';
      loadDashboardData();
    } else {
      if (errorAlert && errorMsg) {
        errorMsg.textContent = 'Username atau Password yang Anda masukkan salah!';
        errorAlert.style.display = 'block';
      } else {
        alert('Username atau Password yang Anda masukkan salah!');
      }
      generateCaptcha();
      const captchaInput = document.getElementById('adminCaptchaInput');
      const passInput = document.getElementById('adminPass');
      if (captchaInput) captchaInput.value = '';
      if (passInput) passInput.value = '';
    }
  });

  btnLogout.addEventListener('click', () => {
    sessionStorage.removeItem('admin_logged_in');
    location.reload();
  });

  // 1. Sync Data Button Handler
  document.getElementById('btnRefreshData')?.addEventListener('click', () => {
    loadDashboardData();
    showAdminToast('Data transaksi & sisa kuota berhasil disinkronkan!', 'fa-rotate');
  });

  // 2. Reset Database Button Handler
  document.getElementById('btnResetDatabase')?.addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin mengosongkan seluruh database transaksi? (Sistem akan kembali bersih dengan data 0).')) {
      localStorage.setItem('parheheon_orders', JSON.stringify([]));
      const resetStock = {
        'tiket_day1': 200,
        'tiket_day2': 100
      };
      saveStock(resetStock);
      previousOrderCount = 0;
      loadDashboardData();
      showAdminToast('Database transaksi berhasil dikosongkan! Kuota di-reset.', 'fa-trash-can');
    }
  });

  // Start real-time new order notification monitoring
  initRealtimeOrderMonitor();
}

// Real-Time Audio Chime Notification Synthesizer (Web Audio API)
function playNotificationChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Pleasant two-tone chime (E5 -> G5)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, ctx.currentTime);
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.log('Chime sound skipped:', e);
  }
}

// Floating Toast Notification Engine for Admin
function showAdminToast(message, iconClass = 'fa-bell') {
  let container = document.getElementById('adminToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'adminToastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.style.cssText = 'background: linear-gradient(135deg, #3b0303, #660606); border: 2px solid var(--accent-gold); box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(255,215,0,0.5); font-size: 0.9rem; color: #fff; padding: 1rem 1.25rem;';
  toast.innerHTML = `<i class="fa-solid ${iconClass}" style="color: var(--accent-gold); font-size: 1.4rem;"></i> <div><strong style="color: var(--accent-gold); font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; display:block;">NOTIFIKASI PANITIA REAL-TIME</strong> <span>${message}</span></div>`;
  container.appendChild(toast);

  setTimeout(() => {
    if (toast && toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 6000);
}

// Real-Time New Order Detection Engine
let previousOrderCount = null;

function initRealtimeOrderMonitor() {
  const initialOrders = getOrders();
  previousOrderCount = initialOrders.length;

  // 1. Cross-Tab Storage Event Listener
  window.addEventListener('storage', (e) => {
    if (e.key === 'parheheon_orders') {
      checkNewOrders();
    }
  });

  // 2. Heartbeat Polling fallback (every 3 seconds)
  setInterval(() => {
    checkNewOrders();
  }, 3000);
}

function checkNewOrders() {
  const currentOrders = getOrders();
  if (previousOrderCount === null) {
    previousOrderCount = currentOrders.length;
    return;
  }

  if (currentOrders.length > previousOrderCount) {
    const newestOrder = currentOrders[0];
    previousOrderCount = currentOrders.length;
    
    // Refresh dashboard UI math & tables
    loadDashboardData();
    
    // Play sound & pop notification toast
    playNotificationChime();
    if (newestOrder) {
      showAdminToast(`🔔 PESANAN BARU MASUK! [${newestOrder.id}] ${newestOrder.name} (${newestOrder.productName} - Rp ${newestOrder.total.toLocaleString('id-ID')})`, 'fa-bell');
    }
  } else if (currentOrders.length !== previousOrderCount) {
    previousOrderCount = currentOrders.length;
    loadDashboardData();
  }
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
      if (o.category === 'tiket') {
        totalTicketsSold += o.qty;
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
  document.getElementById('filterSort')?.addEventListener('change', renderTransactionsTable);
}

function renderTransactionsTable() {
  const tbody = document.getElementById('transactionTableBody');
  const orders = getOrders();
  const searchName = document.getElementById('adminSearchName').value.trim().toLowerCase();
  const filterDay = document.getElementById('filterDay').value;
  const filterMethod = document.getElementById('filterMethod').value;
  const filterStatus = document.getElementById('filterStatus').value;
  const filterPickup = document.getElementById('filterPickup').value;
  const filterSort = document.getElementById('filterSort')?.value || 'newest';

  tbody.innerHTML = '';

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 2.5rem;"><i class="fa-solid fa-folder-open" style="font-size: 1.8rem; color: var(--accent-gold); display: block; margin-bottom: 8px;"></i>Belum ada data transaksi di database.</td></tr>`;
    return;
  }

  let filtered = orders.filter(o => {
    const matchName = searchName === '' || o.name.toLowerCase().includes(searchName) || o.id.toLowerCase().includes(searchName);
    const matchDay = (filterDay === 'all' || o.day === filterDay);
    const matchMethod = (filterMethod === 'all' || o.payMethod === filterMethod);
    const matchStatus = (filterStatus === 'all' || o.status === filterStatus);
    const matchPickup = (filterPickup === 'all' || o.pickupStatus === filterPickup);
    return matchName && matchDay && matchMethod && matchStatus && matchPickup;
  });

  // Sorting Logic
  if (filterSort === 'oldest') {
    filtered = [...filtered].reverse();
  } else if (filterSort === 'highest') {
    filtered.sort((a, b) => b.total - a.total);
  } else if (filterSort === 'lowest') {
    filtered.sort((a, b) => a.total - b.total);
  }

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
    { key: 'tiket', name: 'Tiket Masuk Wristband (Rp 10.000)' }
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

        if (o.day === 'day1') day1Qty += o.qty;
        if (o.day === 'day2') day2Qty += o.qty;
      }
    });

    let sisaStockText = `Day 1: ${stock['tiket_day1'] ?? 200} | Day 2: ${stock['tiket_day2'] ?? 100}`;

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
    'day2': { title: 'Day Two — Minggu, 13 September 2026', tickets: 0, orders: 0, qris: 0, cash: 0, totalIncome: 0, pendingCount: 0 }
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
        reportData[dayKey].tickets += o.qty;
        reportData[dayKey].totalIncome += o.total;

        if (o.payMethod === 'qris') reportData[dayKey].qris += o.total;
        if (o.payMethod === 'cash') reportData[dayKey].cash += o.total;
      } else {
        reportData[dayKey].pendingCount++;
      }
    }

    combinedOrders++;
    if (o.status === 'lunas') {
      combinedTickets += o.qty;
      combinedIncome += o.total;
      if (o.payMethod === 'qris') combinedQris += o.total;
      if (o.payMethod === 'cash') combinedCash += o.total;
    } else {
      combinedPending++;
    }
  });

  // Render Day One, Day Two
  ['day1', 'day2'].forEach(key => {
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

// Official Print PDF Financial Report Engine with Signature Block
function printOfficialPdfReport() {
  const orders = getOrders();
  if (orders.length === 0) {
    alert('Belum ada data transaksi di database untuk dicetak.');
    return;
  }

  let totalIncome = 0;
  let qrisIncome = 0;
  let cashIncome = 0;
  let totalTickets = 0;

  orders.forEach(o => {
    if (o.status === 'lunas') {
      totalIncome += o.total;
      if (o.category === 'tiket') {
        totalTickets += o.qty;
      }
      if (o.payMethod === 'qris') qrisIncome += o.total;
      if (o.payMethod === 'cash') cashIncome += o.total;
    }
  });

  const printWin = window.open('', '_blank', 'width=900,height=750');
  
  let rowsHtml = '';
  let no = 1;
  orders.forEach(o => {
    if (o.status === 'lunas') {
      rowsHtml += `
        <tr>
          <td style="border: 1px solid #333; padding: 6px; text-align: center;">${no++}</td>
          <td style="border: 1px solid #333; padding: 6px; font-weight: bold;">${o.id}</td>
          <td style="border: 1px solid #333; padding: 6px;">${o.name}</td>
          <td style="border: 1px solid #333; padding: 6px;">${o.church}</td>
          <td style="border: 1px solid #333; padding: 6px;">${DAY_NAMES[o.day] || o.day}</td>
          <td style="border: 1px solid #333; padding: 6px;">${o.productName}</td>
          <td style="border: 1px solid #333; padding: 6px; text-align: center;">${o.qty}</td>
          <td style="border: 1px solid #333; padding: 6px; text-align: right; font-weight: bold;">Rp ${o.total.toLocaleString('id-ID')}</td>
          <td style="border: 1px solid #333; padding: 6px; text-align: center;">${o.payMethod.toUpperCase()}</td>
          <td style="border: 1px solid #333; padding: 6px; text-align: center;">${o.pickupStatus === 'tiket_diambil' ? 'Sudah Diambil' : 'Belum Diambil'}</td>
        </tr>
      `;
    }
  });

  printWin.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Laporan Keuangan Resmi — SHINE TOMBUR Vol 2</title>
      <style>
        body { font-family: 'Times New Roman', serif; margin: 30px; color: #000; background: #fff; }
        .header-title { text-align: center; font-weight: bold; font-size: 16pt; margin-bottom: 4px; text-transform: uppercase; }
        .header-sub { text-align: center; font-size: 12pt; margin-bottom: 20px; font-style: italic; border-bottom: 2px double #000; padding-bottom: 10px; }
        .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10pt; }
        .summary-table td { padding: 6px; border: 1px solid #000; }
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 9pt; }
        .data-table th { border: 1px solid #000; padding: 6px; background: #f0f0f0; }
        .signature-block { width: 100%; margin-top: 40px; font-size: 11pt; }
        .signature-block td { text-align: center; vertical-align: top; width: 50%; height: 90px; }
      </style>
    </head>
    <body>
      <div class="header-title">PARHEHEON NAPOSO BULUNG HKBP CIBUBUR</div>
      <div class="header-title" style="font-size: 14pt;">SHINE — TOMBUR Vol 2</div>
      <div class="header-sub">PASAHATON SPORTS FESTIVAL 2026 — LAPORAN REKAPITULASI KEUANGAN RESMI (LUNAS)</div>

      <p style="font-size: 10pt; margin-bottom: 10px;"><strong>Waktu Cetak Laporan:</strong> ${new Date().toLocaleString('id-ID')}</p>

      <table class="summary-table">
        <tr>
          <td><strong>Total Uang Masuk (Lunas):</strong></td>
          <td style="font-size: 11pt; font-weight: bold;">Rp ${totalIncome.toLocaleString('id-ID')}</td>
          <td><strong>Total Tiket Terjual:</strong></td>
          <td style="font-size: 11pt; font-weight: bold;">${totalTickets} Tiket</td>
        </tr>
        <tr>
          <td><strong>Uang Masuk QRIS:</strong></td>
          <td>Rp ${qrisIncome.toLocaleString('id-ID')}</td>
          <td><strong>Uang Masuk CASH:</strong></td>
          <td>Rp ${cashIncome.toLocaleString('id-ID')}</td>
        </tr>
      </table>

      <table class="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>No. TRX</th>
            <th>Nama Pembeli</th>
            <th>Gereja / Kontingen</th>
            <th>Hari Event</th>
            <th>Produk</th>
            <th>Qty</th>
            <th>Total (Rp)</th>
            <th>Metode</th>
            <th>Pengambilan</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || '<tr><td colspan="10" style="text-align:center; padding:15px;">Belum ada data transaksi lunas.</td></tr>'}
        </tbody>
      </table>

      <table class="signature-block">
        <tr>
          <td>
            Cibubur, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
            Mengetahui & Menyetujui,<br>
            <strong>Ketua Panitia Parheheon</strong>
            <br><br><br><br>
            ( _______________________ )
          </td>
          <td>
            Cibubur, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
            Disusun Oleh,<br>
            <strong>Seksi Dana & Bendahara</strong>
            <br><br><br><br>
            ( _______________________ )
          </td>
        </tr>
      </table>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `);
  printWin.document.close();
}
