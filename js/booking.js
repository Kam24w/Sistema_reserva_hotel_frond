/* =============================================================
   booking.js — New reservation form
   Endpoints: GET  /api/hotel/disponibilidad
              POST /api/hotel/reservar
   Depends on: config.js, api.js, mock.js
   ============================================================= */

// ── State ──────────────────────────────────────────────────────

/** Session cache shared with management.js */
let reservationsCache = [];

// ── Form Loader ────────────────────────────────────────────────

/**
 * Populates the room select with available rooms.
 * Attaches change listeners for live price preview.
 */
async function loadHabitacionesSelect() {
  const select = document.getElementById('r-habitacion');
  select.innerHTML = '<option value="">Cargando...</option>';

  try {
    const rooms = await apiFetch(APP.ENDPOINTS.AVAILABLE);
    populateRoomSelect(rooms.filter(r => r.disponible));
  } catch {
    populateRoomSelect(getMockRooms().filter(r => r.disponible));
  }

  // Attach listeners once (guard with dataset flag to avoid duplicates)
  ['r-checkin', 'r-checkout', 'r-habitacion'].forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.dataset.listenerAttached) {
      el.addEventListener('change', calculatePricePreview);
      el.dataset.listenerAttached = 'true';
    }
  });
}

// ── Room Select ────────────────────────────────────────────────

/**
 * Fills the room select element with the provided available rooms.
 * @param {Array<object>} rooms - Available rooms
 */
function populateRoomSelect(rooms) {
  const select = document.getElementById('r-habitacion');
  select.innerHTML =
    '<option value="">Seleccionar habitación...</option>' +
    rooms
      .map(r => {
        const num   = r.number || r.numero;
        const type  = r.type   || r.tipo;
        const price = r.pricePerNight || r.precioPorNoche || r.precio;
        return `<option value="${num}">#${num} — ${type} ($${price}/noche)</option>`;
      })
      .join('');
}

// ── Price Preview ──────────────────────────────────────────────

/**
 * Calculates and displays the estimated price before confirming.
 * Applies the season rate: high season ×1.5, low season ×1.0.
 */
function calculatePricePreview() {
  const checkIn   = document.getElementById('r-checkin').value;
  const checkOut  = document.getElementById('r-checkout').value;
  const roomSelect = document.getElementById('r-habitacion');
  const preview   = document.getElementById('price-preview');

  if (!checkIn || !checkOut || !roomSelect.value) {
    preview.classList.remove('visible');
    return;
  }

  const nights = Math.round((new Date(checkOut) - new Date(checkIn)) / APP.MS_PER_DAY);
  if (nights <= 0) {
    preview.classList.remove('visible');
    return;
  }

  // Extract base rate from the selected option text
  const optionText = roomSelect.selectedOptions[0]?.text || '';
  const rateMatch  = optionText.match(/\$(\d+)/);
  const baseRate   = rateMatch ? parseInt(rateMatch[1]) : 100;

  const isHigh  = isHighSeason(checkIn);
  const factor  = isHigh ? APP.HIGH_SEASON_RATE : APP.LOW_SEASON_RATE;
  const total   = (baseRate * nights * factor).toFixed(2);

  document.getElementById('pp-tarifa').textContent    = `$${baseRate}`;
  document.getElementById('pp-noches').textContent    = nights;
  document.getElementById('pp-temporada').textContent = isHigh ? 'Alta (×1.5)' : 'Baja (×1.0)';
  document.getElementById('pp-total').textContent     = `$${total}`;

  preview.classList.add('visible');
}

// ── Create Reservation ─────────────────────────────────────────

/**
 * Submits a new reservation via POST /api/reservations.
 * Saves the result to the local session cache.
 */
async function crearReserva() {
  // Using English keys as standard for the new backend
  const payload = {
    guestName:      document.getElementById('r-nombre').value.trim(),
    roomNumber:     parseInt(document.getElementById('r-habitacion').value),
    checkinDate:    document.getElementById('r-checkin').value,
    checkoutDate:   document.getElementById('r-checkout').value,
  };

  // Fallback for older backends (sending both if needed can be messy, so let's use English primarily per instructions)
  if (!payload.guestName || !payload.roomNumber || !payload.checkinDate || !payload.checkoutDate) {
    showToast('Campos incompletos', 'Completa todos los campos antes de confirmar');
    return;
  }

  try {
    const data = await apiFetch(APP.ENDPOINTS.BOOK, {
      method: 'POST',
      body:   JSON.stringify(payload),
    });
    reservationsCache.push(data);
    showToast('¡Reserva creada!', `ID: ${data.id} — ${payload.guestName}`);
  } catch {
    // Demo fallback payload keys mapping
    const mockReservation = {
      id:     Math.floor(Math.random() * 900) + 100,
      status: 'PENDIENTE',
      ...payload,
    };
    reservationsCache.push(mockReservation);
    showToast('Reserva simulada', `ID: ${mockReservation.id} (modo demo)`);
  }


  resetBookingForm();
}

// ── Form Helpers ───────────────────────────────────────────────

/**
 * Clears the booking form after a successful reservation.
 */
function resetBookingForm() {
  document.getElementById('r-nombre').value = '';
  document.getElementById('r-habitacion').value = '';
  document.getElementById('price-preview').classList.remove('visible');
}
