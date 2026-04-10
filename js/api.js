/* =============================================================
   api.js — HTTP client and toast notification utility
   Depends on: config.js
   ============================================================= */

// ── State ─────────────────────────────────────────────────────
const apiBaseUrl = APP.DEFAULT_API_URL;

// ── HTTP Helper ────────────────────────────────────────────────

/**
 * Generic fetch wrapper for the Spring Boot backend.
 * @param {string} path  - Relative path, e.g. '/api/hotel/habitaciones'
 * @param {object} opts  - Fetch options (method, body, etc.)
 * @returns {Promise<any>} Parsed JSON response
 * @throws {Error} If the response is not OK
 */
async function apiFetch(path, opts = {}) {
  const response = await fetch(apiBaseUrl + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}

// ── Toast Notifications ────────────────────────────────────────

/**
 * Shows a temporary toast notification.
 * @param {string} title    - Toast title
 * @param {string} message  - Toast body text
 * @param {number} duration - Visibility duration in ms
 */
function showToast(title, message, duration = APP.TOAST_DURATION_MS) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-msg').textContent   = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}
