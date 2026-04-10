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

  // API endpoints — match the backend controllers exactly
  ENDPOINTS: {
    // Static paths
    ROOMS:       '/api/reservations/rooms',
    AVAILABLE:   '/api/reservations/availability',
    BOOK:        '/api/reservations',
    SERVICES:    '/api/reservations/services/types',

    // Dynamic paths — functions that receive the reservation ID
    CHECKIN:     (id) => `/api/reservations/${id}/check-in`,
    CHECKOUT:    (id) => `/api/reservations/${id}/check-out`,
    INVOICE:     (id) => `/api/reservations/${id}/invoice`,
    ADD_SERVICE: (id) => `/api/reservations/${id}/services`,
  },
};
