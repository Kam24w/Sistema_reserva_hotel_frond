/* =============================================================
   mock.js — Simulated data for offline / demo mode
   Used when the backend is unavailable.
   Depends on: config.js
   ============================================================= */

// ── Room Type Definitions ──────────────────────────────────────

const ROOM_TYPES = [
  { type: 'SENCILLA', pricePerNight: 80,  capacity: 1 },
  { type: 'DOBLE',    pricePerNight: 130, capacity: 2 },
  { type: 'SUITE',    pricePerNight: 250, capacity: 4 },
];

/**
 * Maps each room number to its type index in ROOM_TYPES.
 * Layout: 101-106 → SENCILLA, 201-206 → DOBLE, 301-303 → SUITE
 */
const ROOM_NUMBERS     = [101, 102, 103, 104, 105, 106, 201, 202, 203, 204, 205, 206, 301, 302, 303];
const ROOM_TYPE_INDEX  = [  0,   0,   0,   0,   0,   0,   1,   1,   1,   1,   1,   1,   2,   2,   2];
const AVAILABLE_ROOMS  = [101, 104, 201, 203, 206, 302];

// ── Mock Data Generators ───────────────────────────────────────

/**
 * Generates the full list of hotel rooms with simulated availability.
 * @returns {Array<object>} Room list
 */
function getMockRooms() {
  return ROOM_NUMBERS.map((number, index) => {
    const roomType = ROOM_TYPES[ROOM_TYPE_INDEX[index]];
    return {
      numero:         number,
      tipo:           roomType.type,
      precioPorNoche: roomType.pricePerNight,
      capacidad:      roomType.capacity,
      disponible:     AVAILABLE_ROOMS.includes(number),
    };
  });
}

/**
 * Returns the predefined list of additional services.
 * @returns {Array<object>} Service list
 */
function getMockServices() {
  return [
    { codigo: 'SPA',      nombre: 'Spa & Wellness',      precio: 50,  icono: '🧖', desc: 'Masajes y tratamientos relajantes', unidad: 'por sesión'  },
    { codigo: 'DESAYUNO', nombre: 'Desayuno Buffet',     precio: 15,  icono: '☕', desc: 'Buffet continental incluido',        unidad: 'por día'     },
    { codigo: 'TRASLADO', nombre: 'Traslado Aeropuerto', precio: 30,  icono: '🚐', desc: 'Servicio puerta a puerta',           unidad: 'por trayecto'},
  ];
}

/**
 * Generates a simulated invoice from a cached reservation.
 * @param {object} reservation - Reservation object from local cache
 * @returns {object} Simulated invoice
 */
function getMockInvoice(reservation) {
  const checkIn   = new Date(reservation.fechaCheckin);
  const checkOut  = new Date(reservation.fechaCheckout);
  const nights    = Math.max(1, Math.round((checkOut - checkIn) / APP.MS_PER_DAY));
  const isHigh    = isHighSeason(reservation.fechaCheckin);
  const baseRate  = 100;
  const factor    = isHigh ? APP.HIGH_SEASON_RATE : APP.LOW_SEASON_RATE;
  const subtotal  = baseRate * nights * factor;

  return {
    id:                   reservation.id,
    nombreHuesped:        reservation.nombreHuesped || 'Huésped',
    numeroHabitacion:     reservation.numeroHabitacion,
    fechaCheckin:         reservation.fechaCheckin,
    fechaCheckout:        reservation.fechaCheckout,
    noches:               nights,
    tarifaBase:           baseRate,
    temporada:            isHigh ? 'ALTA' : 'BAJA',
    subtotal,
    serviciosAdicionales: [],
    total:                subtotal,
    llaveDigital:         'demo-' + Math.random().toString(36).substring(2, 14),
  };
}

// ── Season Helpers ─────────────────────────────────────────────

/**
 * Determines if a date falls in the high season.
 * High season: December, January, July, August.
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @returns {boolean}
 */
function isHighSeason(dateStr) {
  const month = new Date(dateStr).getMonth() + 1;
  return APP.HIGH_SEASON_MONTHS.includes(month);
}
