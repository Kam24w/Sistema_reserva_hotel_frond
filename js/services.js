/* =============================================================
   services.js — Additional services page
   Endpoints: GET  /api/hotel/servicios/tipos
              POST /api/hotel/servicios/{id}
   Depends on: config.js, api.js, mock.js
   ============================================================= */

// ── State ──────────────────────────────────────────────────────

/** Code of the currently selected service card */
let selectedServiceCode = null;

// ── Default icon mapping (used if backend omits icon field) ────
const SERVICE_ICONS = { SPA: '🧖', DESAYUNO: '☕', TRASLADO: '🚐' };

// ── Loader ─────────────────────────────────────────────────────

/**
 * Loads and renders available service types.
 * Falls back to mock data if the backend is unreachable.
 */
async function loadServicios() {
  const grid = document.getElementById('services-grid');
  grid.innerHTML = buildLoadingHTML('Cargando servicios...');

  try {
    const services = await apiFetch(APP.ENDPOINTS.SERVICES);
    renderServices(services);
  } catch {
    renderServices(getMockServices());
  }
}

// ── Rendering ──────────────────────────────────────────────────

/**
 * Renders service cards in the grid.
 * @param {Array<object>} services - Service list from API or mock
 */
function renderServices(services) {
  const grid = document.getElementById('services-grid');

  grid.innerHTML = services.map(service => {
    const icon  = service.icono || SERVICE_ICONS[service.codigo] || '✨';
    const price = service.precio !== undefined
      ? `$${service.precio} ${service.unidad || ''}`
      : service.precioFormateado || '—';

    return `
      <div class="service-card" onclick="selectService('${service.codigo}', '${service.nombre}', this)">
        <div class="service-icon">${icon}</div>
        <div class="service-name">${service.nombre}</div>
        <div class="service-price">${price}</div>
        <div class="service-desc">${service.desc || service.descripcion || ''}</div>
      </div>
    `;
  }).join('');
}

// ── Service Selection ──────────────────────────────────────────

/**
 * Marks a service card as selected and stores its code.
 * @param {string}  code    - Service code (SPA, DESAYUNO, TRASLADO)
 * @param {string}  name    - Human-readable service name
 * @param {Element} cardEl  - Clicked card DOM element
 */
function selectService(code, name, cardEl) {
  selectedServiceCode = code;
  document.getElementById('svc-selected').value = name;

  document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
  cardEl.classList.add('selected');
}

// ── Add Service ────────────────────────────────────────────────

/**
 * Adds the selected service to a reservation via POST /api/hotel/servicios/{id}.
 */
async function agregarServicio() {
  const reservationId = document.getElementById('svc-reserva-id').value;

  if (!reservationId) {
    showToast('Falta el ID', 'Ingresa el número de tu reserva');
    return;
  }
  if (!selectedServiceCode) {
    showToast('Sin servicio', 'Selecciona un servicio de la lista');
    return;
  }

  const payload = { tipoServicio: selectedServiceCode };

  try {
    await apiFetch(`${APP.ENDPOINTS.ADD_SERVICE}/${reservationId}`, {
      method: 'POST',
      body:   JSON.stringify(payload),
    });
    showToast('Servicio agregado', `${selectedServiceCode} → Reserva #${reservationId}`);
  } catch {
    showToast('Servicio registrado', `${selectedServiceCode} (modo demo)`);
  }

  resetServiceForm();
}

// ── Form Reset ─────────────────────────────────────────────────

/**
 * Clears the service form and removes card selection.
 */
function resetServiceForm() {
  selectedServiceCode = null;
  document.getElementById('svc-selected').value    = '';
  document.getElementById('svc-reserva-id').value = '';
  document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
}
