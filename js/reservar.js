/* =============================================
   reservar.js
   POST /api/hotel/reservar
   GET  /api/hotel/disponibilidad  (para el select)
   ============================================= */

// Cache de reservas creadas en la sesión
let reservasCache = [];

/**
 * Carga las habitaciones disponibles en el select del formulario.
 * Si el backend no responde, usa datos mock.
 */
async function loadHabitacionesSelect() {
  const select = document.getElementById('r-habitacion');
  select.innerHTML = '<option value="">Cargando...</option>';

  try {
    const data = await apiFetch('/api/hotel/disponibilidad');
    poblarSelectHabitaciones(data.filter(r => r.disponible));
  } catch (e) {
    poblarSelectHabitaciones(mockRooms().filter(r => r.disponible));
  }

  // Actualizar URL en el config bar
  document.getElementById('api-url-input').value = API_BASE;

  // Listeners para recalcular precio al cambiar campos
  document.getElementById('r-checkin').addEventListener('change', calcPreview);
  document.getElementById('r-checkout').addEventListener('change', calcPreview);
  document.getElementById('r-habitacion').addEventListener('change', calcPreview);
}

/**
 * Popula el select de habitaciones disponibles
 * @param {Array} rooms - Habitaciones disponibles
 */
function poblarSelectHabitaciones(rooms) {
  const select = document.getElementById('r-habitacion');
  select.innerHTML =
    '<option value="">Seleccionar habitación...</option>' +
    rooms
      .map(r => `<option value="${r.numero}">#${r.numero} — ${r.tipo} ($${r.precioPorNoche}/noche)</option>`)
      .join('');
}

/**
 * Calcula y muestra el precio estimado antes de confirmar.
 * Aplica la lógica de TarifaService: temporada alta ×1.5, baja ×1.0
 */
function calcPreview() {
  const checkin   = document.getElementById('r-checkin').value;
  const checkout  = document.getElementById('r-checkout').value;
  const habSelect = document.getElementById('r-habitacion');
  const preview   = document.getElementById('price-preview');

  if (!checkin || !checkout || !habSelect.value) {
    preview.classList.remove('visible');
    return;
  }

  const noches = Math.round((new Date(checkout) - new Date(checkin)) / 86400000);
  if (noches <= 0) {
    preview.classList.remove('visible');
    return;
  }

  // Extraer precio de la opción seleccionada
  const textoOpcion = habSelect.selectedOptions[0]?.text || '';
  const match  = textoOpcion.match(/\$(\d+)/);
  const tarifa = match ? parseInt(match[1]) : 100;

  // Lógica TarifaService: dic, ene, jul, ago = temporada alta
  const alta   = esTemporadaAlta(checkin);
  const factor = alta ? 1.5 : 1.0;
  const total  = (tarifa * noches * factor).toFixed(2);

  document.getElementById('pp-tarifa').textContent    = '$' + tarifa;
  document.getElementById('pp-noches').textContent    = noches;
  document.getElementById('pp-temporada').textContent = alta ? 'Alta (×1.5)' : 'Baja (×1.0)';
  document.getElementById('pp-total').textContent     = '$' + total;

  preview.classList.add('visible');
}

/**
 * Crea una reserva llamando al HotelFacade → POST /api/hotel/reservar
 * Si el backend no responde, crea una reserva simulada.
 */
async function crearReserva() {
  const body = {
    nombreHuesped:    document.getElementById('r-nombre').value.trim(),
    numeroHabitacion: parseInt(document.getElementById('r-habitacion').value),
    fechaCheckin:     document.getElementById('r-checkin').value,
    fechaCheckout:    document.getElementById('r-checkout').value,
  };

  // Validación básica
  if (!body.nombreHuesped || !body.numeroHabitacion || !body.fechaCheckin || !body.fechaCheckout) {
    showToast('Campos incompletos', 'Completa todos los campos antes de confirmar');
    return;
  }

  try {
    const data = await apiFetch('/api/hotel/reservar', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    reservasCache.push(data);
    showToast('¡Reserva creada!', `ID: ${data.id} — ${body.nombreHuesped}`);
    limpiarFormulario();
  } catch (e) {
    // Modo demo
    const mockReserva = {
      id:               Math.floor(Math.random() * 900) + 100,
      estado:           'PENDIENTE',
      ...body,
    };
    reservasCache.push(mockReserva);
    showToast('Reserva simulada', `ID: ${mockReserva.id} (modo demo)`);
    limpiarFormulario();
  }
}

/**
 * Limpia el formulario tras crear una reserva
 */
function limpiarFormulario() {
  document.getElementById('r-nombre').value = '';
  document.getElementById('r-habitacion').value = '';
  document.getElementById('price-preview').classList.remove('visible');
}
