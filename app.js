// App JS - Parheheon HKBP Cibubur (SHINE TOMBUR Vol 2) Strict System

const CHURCH_LIST = [
  "GKP YERUEL",
  "HKBP JATIWARINGIN",
  "HKBP PULOMAS",
  "HKBP JATISAMPURNA",
  "HKBP CIBUBUR",
  "GPIB AGAPE",
  "HKBP Harjamukti",
  "HKBP Cibinong",
  "HKBP Rawamangun",
  "HKBP Kebon Jeruk",
  "HKBP Tomang Barat",
  "HKBP Kernolong",
  "HKBP Jatimurni"
];

const PRODUCT_CATALOG = {
  'tiket': {
    name: 'Tiket Masuk Wristband',
    price: 10000,
    image: 'gambar/66a8c20a-c6ef-4de7-b4f9-33a68f1a26df.jpg',
    desc: 'Gelang fisik resmi tiket masuk venue event Wira Yudha Sport Center.'
  }
};

const DAY_NAMES = {
  'day1': 'Sabtu, 12 September 2026 (Day One)',
  'day2': 'Minggu, 13 September 2026 (Day Two)'
};

let lastCreatedOrder = null;

// Initial Stock setup (Day 1: 200 tickets, Day 2: 100 tickets)
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
  const existingOrders = JSON.parse(localStorage.getItem('parheheon_orders') || '[]');
  const isDay1Loaded = localStorage.getItem('parheheon_day1_loaded_v1');

  if (!isDay1Loaded || existingOrders.length === 0) {
    localStorage.setItem('parheheon_orders', JSON.stringify(INITIAL_ORDERS_SEED));
    const initialStock = {
      'tiket_day1': 98,
      'tiket_day2': 100
    };
    localStorage.setItem('parheheon_stock', JSON.stringify(initialStock));
    localStorage.setItem('parheheon_day1_loaded_v1', 'true');
  }
}

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
  initStorage();
  renderProductCards();
  setupPricingCategorySelector();
  setupPaymentMethodSelector();
  setupFormListeners();
  setupSearchListeners();
  updateLiveStockDisplay();
});

// Render Product Catalog Options in Booking Form
function renderProductCards() {
  const container = document.getElementById('productCatalogContainer');
  if (!container) return;

  const stock = getStock();
  const dayKey = document.getElementById('eventDaySelect')?.value || 'day2';

  let stockTiketVal = dayKey === 'day1' ? (stock['tiket_day1'] ?? 200) : (stock['tiket_day2'] ?? 100);

  container.innerHTML = `
    <div class="pricing-card-option selected" data-type="tiket" data-price="10000" style="max-width: 320px; margin: 0 auto;">
      <img src="${PRODUCT_CATALOG['tiket'].image}" alt="Tiket Wristband" class="product-card-img">
      <div class="price-title" style="font-size:0.95rem; font-weight:800; color:#fff;">${PRODUCT_CATALOG['tiket'].name}</div>
      <div class="price-val" style="color:var(--accent-gold); font-weight:900; font-size:1.25rem; margin:4px 0;">Rp 10.000</div>
      <span class="stock-badge" id="stockBadgeTiket">Kuota Tiket: ${stockTiketVal}</span>
    </div>
  `;

  setupPricingCategorySelector();
}

function setupPricingCategorySelector() {
  const options = document.querySelectorAll('.pricing-card-option');
  const inputCategory = document.getElementById('selectedCategory');
  const inputPrice = document.getElementById('selectedUnitPrice');

  options.forEach(opt => {
    opt.onclick = () => {
      options.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const category = opt.getAttribute('data-type');
      const price = opt.getAttribute('data-price');
      if (inputCategory) inputCategory.value = category;
      if (inputPrice) inputPrice.value = price;
      calculateTotalSummary();
    };
  });
}

function selectProductFromCatalog(categoryKey) {
  const options = document.querySelectorAll('.pricing-card-option');
  const inputCategory = document.getElementById('selectedCategory');
  const inputPrice = document.getElementById('selectedUnitPrice');

  options.forEach(opt => {
    if (opt.getAttribute('data-type') === categoryKey) {
      opt.classList.add('selected');
      const price = opt.getAttribute('data-price');
      if (inputCategory) inputCategory.value = categoryKey;
      if (inputPrice) inputPrice.value = price;
    } else {
      opt.classList.remove('selected');
    }
  });
  calculateTotalSummary();
}

function setupPaymentMethodSelector() {
  const qrisLabel = document.getElementById('payMethodQrisLabel');
  const cashLabel = document.getElementById('payMethodCashLabel');
  const radios = document.querySelectorAll('input[name="payMethod"]');

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (qrisLabel) qrisLabel.classList.remove('selected');
      if (cashLabel) cashLabel.classList.remove('selected');

      if (radio.value === 'qris' && qrisLabel) {
        qrisLabel.classList.add('selected');
      } else if (radio.value === 'cash' && cashLabel) {
        cashLabel.classList.add('selected');
      }
    });
  });
}

function calculateTotalSummary() {
  const dayKey = document.getElementById('eventDaySelect')?.value || 'day2';
  const categoryKey = document.getElementById('selectedCategory')?.value || 'tiket';
  const unitPrice = parseInt(document.getElementById('selectedUnitPrice')?.value) || 10000;
  const qty = parseInt(document.getElementById('ticketQty')?.value) || 1;

  const summaryDayText = document.getElementById('summaryDayText');
  const summaryCategoryText = document.getElementById('summaryCategoryText');
  const summaryQty = document.getElementById('summaryQty');
  const totalPriceText = document.getElementById('totalPriceText');

  if (summaryDayText) summaryDayText.textContent = DAY_NAMES[dayKey] || dayKey;
  if (summaryCategoryText) summaryCategoryText.textContent = `${PRODUCT_CATALOG[categoryKey]?.name || 'Tiket Masuk Wristband'} (Rp ${unitPrice.toLocaleString('id-ID')})`;
  if (summaryQty) summaryQty.textContent = `${qty} Item`;
  
  const grandTotal = unitPrice * qty;
  if (totalPriceText) totalPriceText.textContent = `Rp ${grandTotal.toLocaleString('id-ID')}`;
}

function setupFormListeners() {
  const form = document.getElementById('orderForm');
  if (!form) return;

  const eventDaySelect = document.getElementById('eventDaySelect');
  const ticketQty = document.getElementById('ticketQty');
  const btnMinus = document.getElementById('btnMinus');
  const btnPlus = document.getElementById('btnPlus');

  if (eventDaySelect) {
    eventDaySelect.addEventListener('change', () => {
      renderProductCards();
      updateLiveStockDisplay();
      calculateTotalSummary();
    });
  }

  if (btnMinus && ticketQty) {
    btnMinus.onclick = () => {
      let q = parseInt(ticketQty.value) || 1;
      if (q > 1) {
        ticketQty.value = q - 1;
        calculateTotalSummary();
      }
    };
  }

  if (btnPlus && ticketQty) {
    btnPlus.onclick = () => {
      let q = parseInt(ticketQty.value) || 1;
      const stock = getStock();
      const dayKey = document.getElementById('eventDaySelect')?.value || 'day2';

      let maxAvailable = dayKey === 'day1' ? (stock['tiket_day1'] ?? 200) : (stock['tiket_day2'] ?? 100);

      if (q < maxAvailable) {
        ticketQty.value = q + 1;
        calculateTotalSummary();
      } else {
        showToast(`Stok kuota tiket tersisa ${maxAvailable} tiket!`, 'fa-triangle-exclamation');
      }
    };
  }

  form.onsubmit = (e) => {
    e.preventDefault();

    const name = document.getElementById('custName')?.value.trim();
    const church = document.getElementById('churchSelect')?.value;
    const day = document.getElementById('eventDaySelect')?.value || 'day2';
    const category = 'tiket';
    const unitPrice = parseInt(document.getElementById('selectedUnitPrice')?.value) || 10000;
    const qty = parseInt(document.getElementById('ticketQty')?.value) || 1;
    const payMethod = document.querySelector('input[name="payMethod"]:checked')?.value || 'qris';

    if (!name) {
      alert('Silakan masukkan Nama Pemesan.');
      document.getElementById('custName')?.focus();
      return;
    }

    if (!church) {
      alert('Silakan pilih Asal Gereja / Kontingen Anda.');
      document.getElementById('churchSelect')?.focus();
      return;
    }

    // Check stock availability
    const stock = getStock();
    if (day === 'day1' && ((stock['tiket_day1'] ?? 200) < qty)) {
      alert(`Kuota Tiket Day One tersisa ${stock['tiket_day1']} tiket. Pemesanan Anda (${qty}) melebihi kuota!`);
      return;
    }
    if (day === 'day2' && ((stock['tiket_day2'] ?? 100) < qty)) {
      alert(`Kuota Tiket Day Two tersisa ${stock['tiket_day2']} tiket. Pemesanan Anda (${qty}) melebihi kuota!`);
      return;
    }

    // Deduct stock
    if (day === 'day1') {
      stock['tiket_day1'] = Math.max(0, (stock['tiket_day1'] ?? 200) - qty);
    } else if (day === 'day2') {
      stock['tiket_day2'] = Math.max(0, (stock['tiket_day2'] ?? 100) - qty);
    }

    saveStock(stock);
    updateLiveStockDisplay();

    // Generate TRX ID
    const trxId = 'TRX-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      id: trxId,
      name: name,
      church: church,
      day: day,
      category: category,
      productName: PRODUCT_CATALOG[category]?.name || 'Tiket Masuk Wristband',
      unitPrice: unitPrice,
      qty: qty,
      total: unitPrice * qty,
      payMethod: payMethod,
      status: payMethod === 'qris' ? 'menunggu_verifikasi' : 'menunggu_pembayaran',
      pickupStatus: 'belum_diambil',
      proofImage: null,
      createdAt: new Date().toISOString()
    };

    const orders = getOrders();
    orders.unshift(newOrder);
    saveOrders(orders);
    lastCreatedOrder = newOrder;

    showToast(`Pemesanan ${trxId} Berhasil!`, 'fa-circle-check');

    // Reset Form
    if (document.getElementById('custName')) document.getElementById('custName').value = '';

    if (payMethod === 'qris') {
      showQrisModal(newOrder);
    } else {
      showCashModal(newOrder);
    }
  };
}

function updateLiveStockDisplay() {
  const stock = getStock();
  const dayKey = document.getElementById('eventDaySelect')?.value || 'day2';

  let sTiket = dayKey === 'day1' ? (stock['tiket_day1'] ?? 200) : (stock['tiket_day2'] ?? 100);

  const badgeT = document.getElementById('stockBadgeTiket');
  if (badgeT) badgeT.textContent = `Kuota Tiket: ${sTiket}`;

  checkLowStockAlert();
}

// Low Stock Alert Banner Engine
function checkLowStockAlert() {
  const stock = getStock();
  const alertContainer = document.getElementById('lowStockAlertBanner');
  if (!alertContainer) return;

  const d1 = stock['tiket_day1'] ?? 200;
  const d2 = stock['tiket_day2'] ?? 100;

  if (d1 < 30 || d2 < 20) {
    alertContainer.style.display = 'block';
    alertContainer.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(220, 38, 38, 0.95), rgba(139, 0, 0, 0.95)); border: 2px solid var(--accent-gold); padding: 1rem 1.25rem; border-radius: 12px; color: #fff; display: flex; align-items: center; gap: 12px; box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.8rem; color: var(--accent-gold); flex-shrink: 0;"></i>
        <div>
          <strong style="color: var(--accent-gold); font-size: 1rem; text-transform: uppercase; letter-spacing: 1px;">🚨 PERINGATAN: KUOTA TIKET MENIPIS!</strong>
          <p style="font-size: 0.88rem; margin-top: 2px; color: #FFE4E6;">
            ${d1 < 30 ? `Sisa Tiket Day One: <strong style="color: var(--accent-gold);">${d1} Tiket</strong>. ` : ''}
            ${d2 < 20 ? `Sisa Tiket Day Two: <strong style="color: var(--accent-gold);">${d2} Tiket</strong>. ` : ''}
            Segera amankan dan selesaikan pemesanan Anda sebelum kuota habis!
          </p>
        </div>
      </div>
    `;
  } else {
    alertContainer.style.display = 'none';
  }
}

// Dynamic QRIS Modal & Auto-Compressed Payment Proof Upload
function compressImageFile(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      const MAX_DIM = 800;

      if (width > height) {
        if (width > MAX_DIM) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        }
      } else {
        if (height > MAX_DIM) {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Compress to high clarity JPEG (~40KB Data URI)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
      callback(compressedDataUrl);
    };
    img.onerror = () => callback(e.target.result);
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function copyQrisAmount() {
  if (lastCreatedOrder) {
    const amtStr = lastCreatedOrder.total.toString();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(amtStr).then(() => {
        showToast(`Nominal Rp ${lastCreatedOrder.total.toLocaleString('id-ID')} berhasil disalin!`, 'fa-copy');
      }).catch(() => {
        showToast(`Nominal: Rp ${lastCreatedOrder.total.toLocaleString('id-ID')}`);
      });
    } else {
      showToast(`Nominal: Rp ${lastCreatedOrder.total.toLocaleString('id-ID')}`);
    }
  }
}

function copyText(str) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(str).then(() => {
      showToast(`Teks "${str}" berhasil disalin!`, 'fa-copy');
    }).catch(() => {
      showToast(`Nomor: ${str}`);
    });
  } else {
    showToast(`Nomor: ${str}`);
  }
}

function showQrisModal(order) {
  document.getElementById('qrisOrderId').textContent = order.id;
  document.getElementById('qrisDynamicAmount').textContent = `Rp ${order.total.toLocaleString('id-ID')}`;

  // Render Full Size Official Authentic QRIS Barcode Image
  const canvasWrap = document.getElementById('qrisInteractiveCanvas');
  if (canvasWrap) {
    canvasWrap.innerHTML = `
      <img src="gambar/qris_official.jpg" alt="Gambar QRIS Asli Parheheon HKBP Cibubur" style="width: 320px; max-width: 100%; height: auto; border-radius: 12px; border: 2.5px solid var(--accent-gold); box-shadow: 0 10px 30px rgba(0,0,0,0.6); display: block; margin: 0 auto;">
    `;
  }

  const btnSubmitProof = document.getElementById('btnSubmitQrisProof');
  btnSubmitProof.onclick = () => {
    const fileInput = document.getElementById('paymentProofInput');
    if (fileInput.files && fileInput.files[0]) {
      btnSubmitProof.disabled = true;
      btnSubmitProof.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengompres & Memproses...';
      
      compressImageFile(fileInput.files[0], (compressedDataUri) => {
        order.proofImage = compressedDataUri;
        order.status = 'menunggu_verifikasi';
        updateOrderInStorage(order);
        
        btnSubmitProof.disabled = false;
        btnSubmitProof.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Bukti & Selesaikan Pemesanan';
        
        closeModal('qrisPaymentModal');
        showPickupNoticeModal(order);
      });
    } else {
      order.status = 'menunggu_verifikasi';
      updateOrderInStorage(order);
      closeModal('qrisPaymentModal');
      showPickupNoticeModal(order);
    }
  };

  openModal('qrisPaymentModal');
}

// Cash Modal
function showCashModal(order) {
  document.getElementById('cashOrderId').textContent = order.id;
  document.getElementById('cashCustName').textContent = order.name;
  document.getElementById('cashCustNameText').textContent = order.name;
  document.getElementById('cashEventDay').textContent = DAY_NAMES[order.day] || order.day;
  document.getElementById('cashChurch').textContent = order.church;
  document.getElementById('cashTotalPay').textContent = `Rp ${order.total.toLocaleString('id-ID')}`;

  openModal('cashPaymentModal');
}

function showPickupNoticeModalFromCash() {
  if (lastCreatedOrder) {
    showPickupNoticeModal(lastCreatedOrder);
  }
}

// Physical Ticket Pickup Notification Modal
function showPickupNoticeModal(order) {
  document.getElementById('pickupOrderId').textContent = order.id;
  document.getElementById('pickupCustName').textContent = order.name;
  document.getElementById('pickupDay').textContent = DAY_NAMES[order.day] || order.day;

  const statusBadge = document.getElementById('pickupStatusBadge');
  if (order.status === 'lunas') {
    statusBadge.className = 'badge badge-verified';
    statusBadge.textContent = 'LUNAS';
  } else if (order.status === 'menunggu_verifikasi') {
    statusBadge.className = 'badge badge-pending';
    statusBadge.textContent = 'MENUNGGU VERIFIKASI QRIS';
  } else {
    statusBadge.className = 'badge badge-pending';
    statusBadge.textContent = 'MENUNGGU PEMBAYARAN CASH';
  }

  openModal('ticketPickupModal');
}

function updateOrderInStorage(updatedOrder) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === updatedOrder.id);
  if (idx !== -1) {
    orders[idx] = updatedOrder;
    saveOrders(orders);
  }
}

// Search Booking Status by Name or Trx ID
function setupSearchListeners() {
  const btnSearch = document.getElementById('btnSearchTicket');
  const inputSearch = document.getElementById('searchTicketInput');
  const resultArea = document.getElementById('searchResultArea');

  if (!btnSearch) return;

  btnSearch.addEventListener('click', () => {
    const query = inputSearch.value.trim().toLowerCase();
    if (!query) {
      alert('Silakan masukkan Nama Pemesan atau Nomor Transaksi.');
      return;
    }

    const orders = getOrders();

    if (orders.length === 0) {
      resultArea.innerHTML = `
        <div style="background: rgba(255, 255, 255, 0.05); border: 1px dashed var(--border-color); padding: 1.5rem; border-radius: 12px; color: var(--text-muted); text-align: center;">
          <i class="fa-solid fa-folder-open" style="font-size: 2rem; color: var(--accent-gold); margin-bottom: 8px;"></i><br>
          <strong>Belum ada data transaksi</strong> di dalam sistem.
        </div>
      `;
      return;
    }

    const matches = orders.filter(o => 
      o.name.toLowerCase().includes(query) || 
      o.id.toLowerCase().includes(query)
    );

    if (matches.length > 0) {
      resultArea.innerHTML = '';
      matches.forEach(match => {
        const item = document.createElement('div');
        item.style.cssText = 'background: rgba(45, 6, 6, 0.95); border: 1px solid var(--accent-gold); padding: 1.25rem; border-radius: 12px; text-align: left; margin-bottom: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);';
        
        let statusBadge = '';
        if (match.status === 'lunas') {
          statusBadge = '<span class="badge badge-verified">LUNAS</span>';
        } else if (match.status === 'menunggu_verifikasi') {
          statusBadge = '<span class="badge badge-pending">MENUNGGU VERIFIKASI</span>';
        } else if (match.status === 'menunggu_pembayaran') {
          statusBadge = '<span class="badge badge-pending">MENUNGGU PEMBAYARAN CASH</span>';
        } else {
          statusBadge = '<span class="badge badge-rejected">DITOLAK</span>';
        }

        let pickupBadge = match.pickupStatus === 'tiket_diambil'
          ? '<span class="badge badge-pickedup"><i class="fa-solid fa-circle-check"></i> TIKET SUDAH DIAMBIL</span>'
          : '<span class="badge badge-notpickedup"><i class="fa-solid fa-clock"></i> TIKET BELUM DIAMBIL</span>';

        item.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
            <strong style="color: var(--accent-gold); font-size: 1.1rem;">${match.id} — ${match.name}</strong>
            <div>${statusBadge} ${pickupBadge}</div>
          </div>
          <p style="font-size: 0.9rem; color: #fff;">Hari: <strong>${DAY_NAMES[match.day] || match.day}</strong></p>
          <p style="font-size: 0.9rem; color: #fff;">Gereja / Kontingen: <strong>${match.church}</strong></p>
          <p style="font-size: 0.9rem; color: var(--text-muted);">${match.productName} | ${match.qty} Item | Total: <strong style="color: var(--accent-gold);">Rp ${match.total.toLocaleString('id-ID')}</strong></p>
          <div style="margin-top: 10px; padding: 10px; background: rgba(255,215,0,0.12); border-radius: 8px; font-size: 0.85rem; color: #fff;">
            <i class="fa-solid fa-bullhorn" style="color: var(--accent-gold);"></i> Tiket fisik (wristband) dapat diambil langsung di Meja Panitia dengan sebutkan Nama: <strong>${match.name}</strong> atau Nomor Transaksi: <strong>${match.id}</strong>.
          </div>
        `;
        resultArea.appendChild(item);
      });
    } else {
      resultArea.innerHTML = `
        <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid var(--accent-red); padding: 1.25rem; border-radius: 12px; color: var(--accent-red-bright);">
          Data pemesanan atas nama / ID "${query}" tidak ditemukan.
        </div>
      `;
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Floating Toast Notification Engine
function showToast(message, iconClass = 'fa-circle-check') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = `<i class="fa-solid ${iconClass}" style="color: var(--accent-gold); font-size: 1.1rem;"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    if (toast && toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 4000);
}

// Interactive FAQ Accordion Toggle
function toggleFaq(headerElem) {
  const faqItem = headerElem.parentElement;
  const isActive = faqItem.classList.contains('active');
  
  document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
  
  if (!isActive) {
    faqItem.classList.add('active');
  }
}
