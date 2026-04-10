/* =============================================================
   config.js — Application-wide constants
   All magic numbers and strings are centralized here.
   ============================================================= */

const APP = {
  // API
  DEFAULT_API_URL:    'https://sistemareservahotelback-production.up.railway.app',

  // Business logic
  HIGH_SEASON_MONTHS: [12, 1, 7, 8],   // Dec, Jan, Jul, Aug
  HIGH_SEASON_RATE:   1.5,
  LOW_SEASON_RATE:    1.0,
  MS_PER_DAY:         86_400_000,

  // UI
  TOAST_DURATION_MS:  3000,
  ROOM_SELECT_DELAY:  200,             // ms before setting room select after nav

  // API endpoints
  ENDPOINTS: {
    ROOMS:       '/api/hotel/habitaciones',
    AVAILABLE:   '/api/hotel/disponibilidad',
    BOOK:        '/api/hotel/reservar',
    CHECKIN:     '/api/hotel/checkin',
    CHECKOUT:    '/api/hotel/checkout',
    INVOICE:     '/api/hotel/factura',
    SERVICES:    '/api/hotel/servicios/tipos',
    ADD_SERVICE: '/api/hotel/servicios',
  },
};
