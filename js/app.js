/* =============================================
   app.js — Inicialización y navegación
   Punto de entrada principal de la aplicación
   ============================================= */

/**
 * Navega a una página de la aplicación
 * @param {string}  pageId  - ID de la página destino (sin prefijo 'page-')
 * @param {Element} tabEl   - Elemento <button> del tab activo
 */
function goTo(pageId, tabEl) {
  // Ocultar todas las páginas
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Desactivar todos los tabs
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  // Activar página y tab seleccionados
  document.getElementById('page-' + pageId).classList.add('active');
  if (tabEl) tabEl.classList.add('active');

  // Acciones específicas de cada página al navegar
  switch (pageId) {
    case 'disponibilidad':
      loadDisponibilidad();
      break;
    case 'reservar':
      loadHabitacionesSelect();
      break;
    case 'gestion':
      loadReservas();
      break;
    case 'servicios':
      loadServicios();
      break;
    case 'factura':
      // Sin acción automática — el usuario ingresa el ID
      break;
  }
}

/**
 * Inicializa la aplicación al cargar el DOM
 */
document.addEventListener('DOMContentLoaded', () => {
  // Fechas por defecto: hoy y hoy + 3 días
  const hoy       = new Date().toISOString().split('T')[0];
  const en3dias   = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  // Filtros de disponibilidad
  const filtCheckin  = document.getElementById('filter-checkin');
  const filtCheckout = document.getElementById('filter-checkout');
  if (filtCheckin)  filtCheckin.value  = hoy;
  if (filtCheckout) filtCheckout.value = en3dias;

  // Formulario de reserva
  const rCheckin  = document.getElementById('r-checkin');
  const rCheckout = document.getElementById('r-checkout');
  if (rCheckin)  rCheckin.value  = hoy;
  if (rCheckout) rCheckout.value = en3dias;

  // Cargar página inicial
  loadDisponibilidad();

  console.log('%c Hotel Facade Frontend ', 'background:#1C1C1C;color:#C9A84C;font-size:14px;padding:4px 8px;border-radius:4px;');
  console.log('API Base URL:', API_BASE);
  console.log('Cambia la URL en "Nueva Reserva" → campo API URL');
});
