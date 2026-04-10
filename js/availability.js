/* =============================================================
   availability.js — Room availability page
   Endpoints: GET /api/hotel/habitaciones
   Depends on: config.js, api.js, mock.js
   ============================================================= */

// ── Data Loader ────────────────────────────────────────────────

/**
 * Fetches and renders room availability.
 * Falls back to mock data if the backend is unreachable.
 */
async function loadDisponibilidad() {
  const grid = document.getElementById('rooms-grid');
  grid.innerHTML = buildLoadingHTML('Consultando disponibilidad...');

  try {
    const rooms = await apiFetch(APP.ENDPOINTS.ROOMS);
    renderRooms(rooms);
  } catch {
    renderRooms(getMockRooms());
    document.getElementById('badge-disp').textContent = 'Modo demo';
    showToast('Modo demo', 'Conecta tu backend para datos reales');
  }
}

// ── Rendering ──────────────────────────────────────────────────

/**
 * Renders room cards after applying the selected type filter.
 * @param {Array<object>} rooms - Room list from API or mock
 */
function renderRooms(rooms) {
  const grid      = document.getElementById('rooms-grid');
  const typeFilter = document.getElementById('filter-tipo').value;

  // Handle both 'tipo' and 'type'
  const filtered = typeFilter
    ? rooms.filter(r => (r.type || r.tipo) === typeFilter)
    : rooms;

  updateStats(filtered);

  // Handle both 'available' and 'disponible'
  const availableCount = filtered.filter(r => (r.available !== undefined ? r.available : r.disponible)).length;
  document.getElementById('badge-disp').textContent = `${availableCount} disponibles`;

  if (filtered.length === 0) {
    grid.innerHTML = buildEmptyHTML('🛏', 'No hay habitaciones del tipo seleccionado.');
    return;
  }

  grid.innerHTML = filtered.map(buildRoomCard).join('');
}

/**
 * Builds the HTML for a single room card.
 * @param {object} room
 * @returns {string} HTML string
 */
function buildRoomCard(room) {
  const isAvailable = room.available !== undefined ? room.available : room.disponible;
  const roomNum     = room.number || room.numero;
  const roomType    = room.type   || room.tipo;
  const roomPrice   = room.pricePerNight || room.precioPorNoche || room.precio;

  const statusClass  = isAvailable ? 'free'     : 'busy';
  const cardClass    = isAvailable ? ''          : 'occupied';
  const clickHandler = isAvailable ? `onclick="selectRoom(${roomNum})"` : '';
  const guestLabel   = `Hasta ${room.capacidad || room.capacity || 2} huésped${(room.capacidad || room.capacity) > 1 ? 'es' : ''}`;

  return `
    <div class="room-card ${cardClass}" ${clickHandler}>
      <div class="room-status ${statusClass}"></div>
      <div class="room-number">${roomNum}</div>
      <div class="room-type">${roomType}</div>
      <div class="room-price">$${roomPrice}/noche</div>
      <div class="room-capacity">${guestLabel}</div>
    </div>
  `;
}


// ── Stats ──────────────────────────────────────────────────────

/**
 * Updates the three summary stat cards (total / available / occupied).
 * @param {Array<object>} rooms - Filtered room list
 */
function updateStats(rooms) {
  document.getElementById('stat-total').textContent = rooms.length;
  document.getElementById('stat-libre').textContent = rooms.filter(r =>  r.disponible).length;
  document.getElementById('stat-ocup').textContent  = rooms.filter(r => !r.disponible).length;
}

// ── Room Selection ─────────────────────────────────────────────

/**
 * Navigates to the booking form and pre-selects the chosen room.
 * @param {number} roomNumber - Selected room number
 */
function selectRoom(roomNumber) {
  const bookingTab = document.querySelectorAll('.nav-tab')[1];
  goTo('reservar', bookingTab);

  setTimeout(() => {
    const select = document.getElementById('r-habitacion');
    if (select) select.value = roomNumber;
    calculatePricePreview();
  }, APP.ROOM_SELECT_DELAY);

  showToast(`Habitación ${roomNumber}`, 'Seleccionada para reserva');
}

// ── HTML Helpers ───────────────────────────────────────────────

/**
 * @param {string} message
 * @returns {string} Loading spinner HTML
 */
function buildLoadingHTML(message) {
  return `<div class="loading"><div class="spinner"></div>${message}</div>`;
}

/**
 * @param {string} icon
 * @param {string} message
 * @returns {string} Empty state HTML
 */
function buildEmptyHTML(icon, message) {
  return `<div class="empty"><div class="empty-icon">${icon}</div><div>${message}</div></div>`;
}
