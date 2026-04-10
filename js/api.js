/* =============================================================
   api.js — HTTP client and toast notification utility
   Depends on: config.js
   ============================================================= */

// ── State ─────────────────────────────────────────────────────
let apiBaseUrl = localStorage.getItem(APP.STORAGE_KEY_API) || APP.DEFAULT_API_URL;

// ── API URL config ─────────────────────────────────────────────

/**
 * Saves the API base URL from the input field and persists it in localStorage.
 */
function saveApiUrl() {
  apiBaseUrl = document.getElementById('api-url-input').value.trim().replace(/\/$/, '');
  localStorage.setItem(APP.STORAGE_KEY_API, apiBaseUrl);
  showToast('URL guardada', apiBaseUrl);
}

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
