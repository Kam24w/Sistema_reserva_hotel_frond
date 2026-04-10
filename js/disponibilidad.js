/* =============================================
   disponibilidad.js
   GET /api/hotel/habitaciones
   GET /api/hotel/disponibilidad
   ============================================= */

/**
 * Carga y renderiza la disponibilidad de habitaciones.
 * Si el backend no responde, usa datos mock (modo demo).
 */
async function loadDisponibilidad() {
  const grid = document.getElementById('rooms-grid');
  grid.innerHTML = '<div class="loading"><div class="spinner"></div>Consultando API...</div>';

  try {
    const data = await apiFetch('/api/hotel/habitaciones');
    renderRooms(data);
  } catch (e) {
    // Modo demo: backend no disponible
    const rooms = mockRooms();
    renderRooms(rooms);
    document.getElementById('badge-disp').textContent = 'Modo demo';
    showToast('Modo demo', 'Conecta tu backend para datos reales');
  }
}

/**
 * Renderiza las tarjetas de habitaciones con filtro aplicado
 * @param {Array} rooms - Lista de habitaciones del API o mock
 */
function renderRooms(rooms) {
  const grid   = document.getElementById('rooms-grid');
  const filtro = document.getElementById('filter-tipo').value;

  const filtered = filtro ? rooms.filter(r => r.tipo === filtro) : rooms;

  updateStats(filtered);

  const disponibles = filtered.filter(r => r.disponible).length;
  document.getElementById('badge-disp').textContent = `${disponibles} disponibles`;

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty"><div class="empty-icon">🛏</div><div>No hay habitaciones del tipo seleccionado.</div></div>';
    return;
  }

  grid.innerHTML = filtered.map(room => buildRoomCard(room)).join('');
}

/**
 * Construye el HTML de una tarjeta de habitación
 * @param {object} room
 * @returns {string} HTML string
 */
function buildRoomCard(room) {
  const statusClass  = room.disponible ? 'free' : 'busy';
  const cardClass    = room.disponible ? '' : 'occupied';
  const clickHandler = room.disponible ? `onclick="selectRoom(${room.numero})"` : '';
  const cap          = room.capacidad;
  const capLabel     = `Hasta ${cap} huésped${cap > 1 ? 'es' : ''}`;

  return `
    <div class="room-card ${cardClass}" ${clickHandler}>
      <div class="room-status ${statusClass}"></div>
      <div class="room-number">${room.numero}</div>
      <div class="room-type">${room.tipo}</div>
      <div class="room-price">$${room.precioPorNoche}/noche</div>
      <div class="room-capacity">${capLabel}</div>
    </div>
  `;
}

/**
 * Actualiza las tarjetas de estadísticas
 * @param {Array} rooms - Lista filtrada de habitaciones
 */
function updateStats(rooms) {
  document.getElementById('stat-total').textContent = rooms.length;
  document.getElementById('stat-libre').textContent = rooms.filter(r => r.disponible).length;
  document.getElementById('stat-ocup').textContent  = rooms.filter(r => !r.disponible).length;
}

/**
 * Selecciona una habitación y navega al formulario de reserva
 * @param {number} numero - Número de habitación
 */
function selectRoom(numero) {
  goTo('reservar', document.querySelectorAll('.nav-tab')[1]);
  // Espera a que el select esté cargado antes de seleccionar
  setTimeout(() => {
    const sel = document.getElementById('r-habitacion');
    if (sel) sel.value = numero;
    calcPreview();
  }, 200);
  showToast('Habitación ' + numero, 'Seleccionada para reserva');
}
