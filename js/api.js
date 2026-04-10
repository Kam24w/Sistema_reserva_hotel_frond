/* =============================================
   api.js — Configuración y llamadas al backend
   ============================================= */

let API_BASE = localStorage.getItem('hotel_api_url') || 'http://localhost:8080';

/**
 * Guarda la URL base del API y muestra confirmación
 */
function saveUrl() {
  API_BASE = document.getElementById('api-url-input').value.trim().replace(/\/$/, '');
  localStorage.setItem('hotel_api_url', API_BASE);
  showToast('URL guardada', API_BASE);
}

/**
 * Wrapper genérico para fetch al backend Spring Boot
 * @param {string} path  - Ruta relativa, ej: '/api/hotel/habitaciones'
 * @param {object} opts  - Opciones fetch (method, body, etc.)
 * @returns {Promise<any>} JSON de respuesta
 */
async function apiFetch(path, opts = {}) {
  const response = await fetch(API_BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }

  return response.json();
}

/**
 * Muestra un toast de notificación temporal
 * @param {string} title   - Título del toast
 * @param {string} msg     - Mensaje del toast
 * @param {number} dur     - Duración en ms (default 3000)
 */
function showToast(title, msg, dur = 3000) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), dur);
}
