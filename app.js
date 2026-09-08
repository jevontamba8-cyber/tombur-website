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
  },
  'bundling': {
    name: 'Paket Bundling (Tiket + Kipas)',
    price: 15000,
    image: 'gambar/ad308ac7-acaa-4d1e-a23d-d71b30dc583d.jpg',
    desc: 'Isi paket: 1 Tiket Masuk Wristband + 1 Kipas Official TOMBUR Vol 2.'
  },
  'kipas': {
    name: 'Official Kipas TOMBUR Vol 2',
    price: 10000,
    image: 'gambar/ad308ac7-acaa-4d1e-a23d-d71b30dc583d.jpg',
    desc: 'Merchandise Kipas Eksklusif Parheheon SHINE.'
  }
};

const DAY_NAMES = {
  'day1': 'Sabtu, 12 September 2026 (Day One)',
  'day2': 'Minggu, 13 September 2026 (Day Two)',
  'both': 'Sabtu & Minggu (Terusan 2 Hari)'
};

let lastCreatedOrder = null;

// Initial Stock setup (Day 1: 200 tickets, Day 2: 100 tickets, Kipas: 200)
function initStorage() {
  if (!localStorage.getItem('parheheon_orders')) {
    localStorage.setItem('parheheon_orders', JSON.stringify([]));
  }
  if (!localStorage.getItem('parheheon_stock')) {
    const initialStock = {
      'tiket_day1': 200,
      'tiket_day2': 100,
      'kipas': 200
    };
    localStorage.setItem('parheheon_stock', JSON.stringify(initialStock));
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
  const dayKey = document.getElementById('eventDaySelect')?.value || 'day1';

  let stockTiketVal = dayKey === 'day1' ? (stock['tiket_day1'] ?? 200) : (dayKey === 'day2' ? (stock['tiket_day2'] ?? 100) : Math.min(stock['tiket_day1'] ?? 200, stock['tiket_day2'] ?? 100));

  container.innerHTML = `
    <div class="pricing-card-option selected" data-type="tiket" data-price="10000">
      <img src="${PRODUCT_CATALOG['tiket'].image}" alt="Tiket Wristband" class="product-card-img">
      <div class="price-title" style="font-size:0.85rem; font-weight:800; color:#fff;">${PRODUCT_CATALOG['tiket'].name}</div>
      <div class="price-val" style="color:var(--accent-gold); font-weight:900; font-size:1.1rem; margin:4px 0;">Rp 10.000</div>
      <span class="stock-badge" id="stockBadgeTiket">Kuota Tiket: ${stockTiketVal}</span>
    </div>

    <div class="pricing-card-option" data-type="bundling" data-price="15000">
      <div style="display:flex; gap:2px; height:90px; border-radius:8px; overflow:hidden; border:1px solid rgba(255,215,0,0.3); margin-bottom:8px;">
        <img src="gambar/66a8c20a-c6ef-4de7-b4f9-33a68f1a26df.jpg" alt="Tiket" style="width:50%; height:100%; object-fit:cover;">
        <img src="gambar/ad308ac7-acaa-4d1e-a23d-d71b30dc583d.jpg" alt="Kipas" style="width:50%; height:100%; object-fit:cover;">
      </div>
      <div class="price-title" style="font-size:0.85rem; font-weight:800; color:#fff;">${PRODUCT_CATALOG['bundling'].name}</div>
      <div class="price-val" style="color:var(--accent-gold); font-weight:900; font-size:1.1rem; margin:4px 0;">Rp 15.000</div>
      <span class="stock-badge" style="background: rgba(255,215,0,0.2); color: var(--accent-gold);" id="stockBadgeBundling">Kuota Tiket: ${stockTiketVal}</span>
    </div>

    <div class="pricing-card-option" data-type="kipas" data-price="10000">
      <img src="${PRODUCT_CATALOG['kipas'].image}" alt="Kipas Official" class="product-card-img">
      <div class="price-title" style="font-size:0.85rem; font-weight:800; color:#fff;">${PRODUCT_CATALOG['kipas'].name}</div>
      <div class="price-val" style="color:var(--accent-gold); font-weight:900; font-size:1.1rem; margin:4px 0;">Rp 10.000</div>
      <span class="stock-badge" style="background: rgba(16, 185, 129, 0.2); color: #34D399;">Merchandise Official</span>
    </div>
  `;

  setupPricingCategorySelector();
}

function updateLiveStockDisplay() {
  const stock = getStock();
  const dayKey = document.getElementById('eventDaySelect')?.value || 'day1';

  let sTiket = dayKey === 'day1' ? (stock['tiket_day1'] ?? 200) : (dayKey === 'day2' ? (stock['tiket_day2'] ?? 100) : Math.min(stock['tiket_day1'] ?? 200, stock['tiket_day2'] ?? 100));

  const badgeT = document.getElementById('stockBadgeTiket');
  const badgeB = document.getElementById('stockBadgeBundling');

  if (badgeT) badgeT.textContent = `Kuota Tiket: ${sTiket}`;
  if (badgeB) badgeB.textContent = `Kuota Tiket: ${sTiket}`;

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

function showQrisModal(order) {
  document.getElementById('qrisOrderId').textContent = order.id;
  document.getElementById('qrisDynamicAmount').textContent = `Rp ${order.total.toLocaleString('id-ID')}`;

  // Interactive Dynamic Canvas QR Code Generator
  const canvasWrap = document.getElementById('qrisInteractiveCanvas');
  if (canvasWrap) {
    canvasWrap.innerHTML = '';
    const qrPayloadStr = `00020101021226680016ID.CO.QRIS.WWW0118936009140000000000520458125303360540${order.total}5802ID5923SEKSI DANA PARHEHEON 20266007CIBUBUR6304`;
    
    if (window.QRCode) {
      new QRCode(canvasWrap, {
        text: qrPayloadStr,
        width: 170,
        height: 170,
        colorDark: "#120202",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    } else {
      canvasWrap.innerHTML = `<img src="gambar/qris_official.jpg" alt="QRIS Resmi" style="max-width:170px; height:auto; border-radius:6px;">`;
    }
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
