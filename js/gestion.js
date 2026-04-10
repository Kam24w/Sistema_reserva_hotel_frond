/* =============================================
   gestion.js
   PUT /api/hotel/checkin/{id}
   PUT /api/hotel/checkout/{id}
   GET /api/hotel/reserva/{id}
   ============================================= */

/**
 * Carga y renderiza la lista de reservas activas.
 * Usa el cache local de la sesión (reservasCache definido en reservar.js).
 */
function loadReservas() {
  const list = document.getElementById('reserva-list');

  if (!reservasCache || reservasCache.length === 0) {
    list.innerHTML = `
      <div class="empty">
        <div class="empty-icon">🛏</div>
        <div>No hay reservas en esta sesión.<br>Crea una desde "Nueva Reserva".</div>
      </div>`;
    return;
  }

  list.innerHTML = reservasCache.map(r => buildReservaItem(r)).join('');
}

/**
 * Construye el HTML de un ítem de reserva
 * @param {object} r - Objeto de reserva
 * @returns {string} HTML string
 */
function buildReservaItem(r) {
  const nombre  = r.nombreHuesped || r.nombre || 'Huésped';
  const estado  = r.estado || 'PENDIENTE';
  const detalle = `Hab. ${r.numeroHabitacion} · ${r.fechaCheckin} → ${r.fechaCheckout}`;

  return `
    <div class="reserva-item" id="res-${r.id}">
      <div class="reserva-id">#${r.id}</div>
      <div class="reserva-info">
        <div class="reserva-name">${nombre}</div>
        <div class="reserva-detail">${detalle}</div>
      </div>
      <span class="status-pill ${getStatusClass(estado)}">${estado}</span>
      <div class="reserva-actions">
        <button class="action-btn primary" onclick="doCheckin(${r.id})">Check-in</button>
        <button class="action-btn"         onclick="doCheckout(${r.id})">Check-out</button>
        <button class="action-btn"         onclick="verFactura(${r.id})">Factura</button>
      </div>
    </div>
  `;
}

/**
 * Retorna la clase CSS para el badge de estado
 * @param {string} estado
 * @returns {string}
 */
function getStatusClass(estado) {
  if (!estado || estado === 'PENDIENTE') return 'status-pending';
  if (estado === 'CHECKIN')              return 'status-checkin';
  return 'status-checkout';
}

/**
 * Realiza el check-in de una reserva — PUT /api/hotel/checkin/{id}
 * @param {number} id - ID de la reserva
 */
async function doCheckin(id) {
  try {
    await apiFetch(`/api/hotel/checkin/${id}`, { method: 'PUT' });
    showToast('Check-in realizado', `Reserva #${id}`);
  } catch (e) {
    showToast('Check-in registrado', `ID: ${id} (modo demo)`);
  }
  actualizarEstadoCache(id, 'CHECKIN');
  loadReservas();
}

/**
 * Realiza el check-out de una reserva — PUT /api/hotel/checkout/{id}
 * @param {number} id - ID de la reserva
 */
async function doCheckout(id) {
  try {
    await apiFetch(`/api/hotel/checkout/${id}`, { method: 'PUT' });
    showToast('Check-out realizado', `Reserva #${id}`);
  } catch (e) {
    showToast('Check-out registrado', `ID: ${id} (modo demo)`);
  }
  actualizarEstadoCache(id, 'CHECKOUT');
  loadReservas();
}

/**
 * Navega a la factura de una reserva específica
 * @param {number} id - ID de la reserva
 */
function verFactura(id) {
  document.getElementById('fact-id').value = id;
  const tabFactura = document.querySelectorAll('.nav-tab')[4];
  goTo('factura', tabFactura);
  loadFactura();
}

/**
 * Actualiza el estado de una reserva en el cache local
 * @param {number} id     - ID de la reserva
 * @param {string} estado - Nuevo estado
 */
function actualizarEstadoCache(id, estado) {
  const reserva = reservasCache.find(r => r.id === id);
  if (reserva) reserva.estado = estado;
}
