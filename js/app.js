/* =============================================================
   app.js — Application entry point and router
   Depends on: config.js, api.js, and all page modules
   ============================================================= */

// ── Router ─────────────────────────────────────────────────────

/**
 * Navigates to an application page and activates its nav tab.
 * @param {string}  pageId - Page ID (without 'page-' prefix)
 * @param {Element} tabEl  - The <button> nav tab element to activate
 */
function goTo(pageId, tabEl) {
  document.querySelectorAll('.page').forEach(p  => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  document.getElementById(`page-${pageId}`).classList.add('active');
  if (tabEl) tabEl.classList.add('active');

  // Trigger page-specific load actions
  const PAGE_ACTIONS = {
    disponibilidad: loadDisponibilidad,
    reservar:       loadHabitacionesSelect,
    gestion:        loadReservas,
    servicios:      loadServicios,
    factura:        () => {},  // No auto-load — user must enter an ID
  };

  PAGE_ACTIONS[pageId]?.();
}

// ── Initialization ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Default dates: today and 3 days from now
  const today        = new Date().toISOString().split('T')[0];
  const inThreeDays  = new Date(Date.now() + 3 * APP.MS_PER_DAY).toISOString().split('T')[0];

  const fields = [
    { id: 'filter-checkin',  value: today       },
    { id: 'filter-checkout', value: inThreeDays },
    { id: 'r-checkin',       value: today       },
    { id: 'r-checkout',      value: inThreeDays },
  ];

  fields.forEach(({ id, value }) => {
    const el = document.getElementById(id);
    if (el) el.value = value;
  });

  loadDisponibilidad();

  console.log('%c Facade Resort — Frontend ', 'background:#0d1117;color:#d4a953;font-size:14px;padding:4px 8px;border-radius:4px;');
  console.log('API Base URL:', apiBaseUrl);
});
