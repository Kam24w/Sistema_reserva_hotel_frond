/* =============================================
   factura.js
   GET /api/hotel/factura/{id}
   ============================================= */

/**
 * Carga y renderiza la factura de una reserva.
 * Si el backend no responde, genera una factura mock desde el cache local.
 */
async function loadFactura() {
  const id        = document.getElementById('fact-id').value;
  const container = document.getElementById('factura-container');

  if (!id) return;

  container.innerHTML = '<div class="loading"><div class="spinner"></div>Generando factura...</div>';

  try {
    const data = await apiFetch(`/api/hotel/factura/${id}`);
    renderFactura(data);
  } catch (e) {
    // Intentar generar desde cache local
    const reserva = reservasCache ? reservasCache.find(r => r.id == id) : null;

    if (reserva) {
      renderFactura(mockFactura(reserva));
    } else {
      container.innerHTML = `
        <div class="empty">
          <div class="empty-icon">❌</div>
          <div>Reserva #${id} no encontrada.<br>Verifica el ID o conecta el backend.</div>
        </div>`;
    }
  }
}

/**
 * Renderiza la factura completa con desglose y llave digital
 * @param {object} f - Objeto factura del backend o mock
 */
function renderFactura(f) {
  const container = document.getElementById('factura-container');
  const id        = f.id || document.getElementById('fact-id').value;

  // Filas de servicios adicionales
  const serviciosRows = buildServiciosRows(f.serviciosAdicionales || []);

  // Factor de temporada
  const factorLabel = f.temporada === 'ALTA' ? 'Alta (×1.5)' : 'Baja (×1.0)';

  container.innerHTML = `
    <div class="invoice-card">

      <div class="invoice-header">
        <div>
          <div class="invoice-title">Factura</div>
          <div class="invoice-num">Reserva #${id}</div>
        </div>
        <div class="invoice-brand">Hotel Facade</div>
      </div>

      <div class="invoice-guest">
        <div style="font-weight: 500;">${f.nombreHuesped}</div>
        <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">
          Hab. ${f.numeroHabitacion} &nbsp;·&nbsp; ${f.fechaCheckin} → ${f.fechaCheckout}
        </div>
      </div>

      <table class="invoice-table">
        <tr>
          <td style="color: var(--muted);">Tarifa base / noche</td>
          <td>$${toFixed2(f.tarifaBase)}</td>
        </tr>
        <tr>
          <td style="color: var(--muted);">Noches</td>
          <td>${f.noches}</td>
        </tr>
        <tr>
          <td style="color: var(--muted);">Temporada</td>
          <td>${factorLabel}</td>
        </tr>
        <tr>
          <td style="color: var(--muted);">Subtotal habitación</td>
          <td>$${toFixed2(f.subtotal)}</td>
        </tr>
        ${serviciosRows}
      </table>

      <div class="invoice-total">
        <span class="invoice-total-label">Total</span>
        <span class="invoice-total-amount">$${toFixed2(f.total)}</span>
      </div>

      <div class="access-key">
        <span class="access-key-icon">🔑</span>
        <div>
          <div class="access-key-label">Llave Digital (AccesoService)</div>
          <div class="access-key-value">${f.llaveDigital || '—'}</div>
        </div>
      </div>

    </div>
  `;
}

/**
 * Genera las filas HTML de servicios adicionales para la tabla de factura
 * @param {Array} servicios
 * @returns {string} HTML string con las filas <tr>
 */
function buildServiciosRows(servicios) {
  if (!servicios.length) return '';

  return servicios.map(s => `
    <tr>
      <td style="color: var(--muted);">${s.tipo || s.nombre || 'Servicio'}</td>
      <td>$${toFixed2(s.precio || 0)}</td>
    </tr>
  `).join('');
}

/**
 * Formatea un número a 2 decimales de forma segura
 * @param {number} n
 * @returns {string}
 */
function toFixed2(n) {
  return (parseFloat(n) || 0).toFixed(2);
}
