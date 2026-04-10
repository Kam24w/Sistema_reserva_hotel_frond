/* =============================================================
   management.js — Reservation management page
   Endpoints: PUT /api/hotel/checkin/{id}
              PUT /api/hotel/checkout/{id}
   Depends on: config.js, api.js, booking.js
   ============================================================= */

// ── List Loader ────────────────────────────────────────────────

/**
 * Displays all reservations stored in the session cache.
 */
function loadReservas() {
  const list = document.getElementById('reserva-list');

  if (!reservationsCache || reservationsCache.length === 0) {
    list.innerHTML = buildEmptyHTML('🛏', 'No hay reservas en esta sesión.<br>Crea una desde "Nueva Reserva".');
    return;
  }

  list.innerHTML = reservationsCache.map(buildReservationItem).join('');
}

// ── Rendering ──────────────────────────────────────────────────

/**
 * Builds the HTML for a single reservation list item.
 * @param {object} reservation
 * @returns {string} HTML string
 */
function buildReservationItem(reservation) {
  const guestName = reservation.nombreHuesped || reservation.nombre || 'Huésped';
  const status    = reservation.estado || 'PENDIENTE';
  const detail    = `Hab. ${reservation.numeroHabitacion} · ${reservation.fechaCheckin} → ${reservation.fechaCheckout}`;

  return `
    <div class="reserva-item" id="res-${reservation.id}">
      <div class="reserva-id">#${reservation.id}</div>
      <div class="reserva-info">
        <div class="reserva-name">${guestName}</div>
        <div class="reserva-detail">${detail}</div>
      </div>
      <span class="status-pill ${getStatusCSSClass(status)}">${status}</span>
      <div class="reserva-actions">
        <button class="action-btn primary" onclick="doCheckin(${reservation.id})">Check-in</button>
        <button class="action-btn"         onclick="doCheckout(${reservation.id})">Check-out</button>
        <button class="action-btn"         onclick="viewInvoice(${reservation.id})">Factura</button>
      </div>
    </div>
  `;
}

/**
 * Maps a reservation status to its CSS badge class.
 * @param {string} status
 * @returns {string} CSS class name
 */
function getStatusCSSClass(status) {
  const MAP = {
    PENDIENTE: 'status-pending',
    CHECKIN:   'status-checkin',
  };
  return MAP[status] || 'status-checkout';
}

// ── Actions ────────────────────────────────────────────────────

/**
 * Performs check-in via PUT /api/hotel/checkin/{id}.
 * @param {number} id - Reservation ID
 */
async function doCheckin(id) {
  try {
    await apiFetch(`${APP.ENDPOINTS.CHECKIN}/${id}`, { method: 'PUT' });
    showToast('Check-in realizado', `Reserva #${id}`);
  } catch {
    showToast('Check-in registrado', `ID: ${id} (modo demo)`);
  }
  updateReservationStatus(id, 'CHECKIN');
  loadReservas();
}

/**
 * Performs check-out via PUT /api/hotel/checkout/{id}.
 * @param {number} id - Reservation ID
 */
async function doCheckout(id) {
  try {
    await apiFetch(`${APP.ENDPOINTS.CHECKOUT}/${id}`, { method: 'PUT' });
    showToast('Check-out realizado', `Reserva #${id}`);
  } catch {
    showToast('Check-out registrado', `ID: ${id} (modo demo)`);
  }
  updateReservationStatus(id, 'CHECKOUT');
  loadReservas();
}

/**
 * Navigates to the invoice tab and loads the given reservation's invoice.
 * @param {number} id - Reservation ID
 */
function viewInvoice(id) {
  document.getElementById('fact-id').value = id;
  const invoiceTab = document.querySelectorAll('.nav-tab')[4];
  goTo('factura', invoiceTab);
  loadFactura();
}

// ── Cache Helpers ──────────────────────────────────────────────

/**
 * Updates the status of a cached reservation.
 * @param {number} id     - Reservation ID
 * @param {string} status - New status string
 */
function updateReservationStatus(id, status) {
  const reservation = reservationsCache.find(r => r.id === id);
  if (reservation) reservation.estado = status;
}
