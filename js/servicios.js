/* =============================================
   servicios.js
   GET  /api/hotel/servicios/tipos
   POST /api/hotel/servicios/{id}
   ============================================= */

// Servicio seleccionado actualmente
let selectedService = null;

/**
 * Carga y renderiza los tipos de servicios adicionales.
 * Si el backend no responde, usa los servicios predefinidos del mock.
 */
async function loadServicios() {
  const grid = document.getElementById('services-grid');
  grid.innerHTML = '<div class="loading"><div class="spinner"></div>Cargando servicios...</div>';

  try {
    const data = await apiFetch('/api/hotel/servicios/tipos');
    renderServicios(data);
  } catch (e) {
    renderServicios(mockServicios());
  }
}

/**
 * Renderiza las tarjetas de servicios
 * @param {Array} servicios - Lista de servicios disponibles
 */
function renderServicios(servicios) {
  const grid = document.getElementById('services-grid');

  // Iconos por defecto si el backend no los incluye
  const iconos = { SPA: '🧖', DESAYUNO: '☕', TRASLADO: '🚐' };

  grid.innerHTML = servicios.map(s => {
    const icono = s.icono || iconos[s.codigo] || '✨';
    const precio = s.precio !== undefined
      ? `$${s.precio} ${s.unidad || ''}`
      : s.precioFormateado || '—';

    return `
      <div class="service-card" onclick="selectService('${s.codigo}', '${s.nombre}', this)">
        <div class="service-icon">${icono}</div>
        <div class="service-name">${s.nombre}</div>
        <div class="service-price">${precio}</div>
        <div class="service-desc">${s.desc || s.descripcion || ''}</div>
      </div>
    `;
  }).join('');
}

/**
 * Selecciona un servicio al hacer clic en su tarjeta
 * @param {string} codigo  - Código del servicio (SPA, DESAYUNO, TRASLADO)
 * @param {string} nombre  - Nombre legible del servicio
 * @param {Element} el     - Elemento DOM de la tarjeta clicada
 */
function selectService(codigo, nombre, el) {
  selectedService = codigo;
  document.getElementById('svc-selected').value = nombre;

  // Resaltar tarjeta seleccionada
  document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

/**
 * Agrega el servicio seleccionado a una reserva — POST /api/hotel/servicios/{id}
 * Llama al método agregarServicio del HotelFacade.
 */
async function agregarServicio() {
  const reservaId = document.getElementById('svc-reserva-id').value;

  if (!reservaId) {
    showToast('Falta el ID', 'Ingresa el número de tu reserva');
    return;
  }
  if (!selectedService) {
    showToast('Sin servicio', 'Selecciona un servicio de la lista');
    return;
  }

  const body = { tipoServicio: selectedService };

  try {
    await apiFetch(`/api/hotel/servicios/${reservaId}`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    showToast('Servicio agregado', `${selectedService} → Reserva #${reservaId}`);
  } catch (e) {
    showToast('Servicio registrado', `${selectedService} (modo demo)`);
  }

  // Limpiar selección
  selectedService = null;
  document.getElementById('svc-selected').value = '';
  document.getElementById('svc-reserva-id').value = '';
  document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
}
