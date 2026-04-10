/* =============================================================
   invoice.js — Invoice view
   Endpoints: GET /api/hotel/factura/{id}
   Depends on: config.js, api.js, mock.js, booking.js
   ============================================================= */

// ── Loader ─────────────────────────────────────────────────────

/**
 * Fetches and renders the invoice for a given reservation ID.
 * Falls back to a mock invoice generated from the local session cache.
 */
async function loadFactura() {
  const id        = document.getElementById('fact-id').value;
  const container = document.getElementById('factura-container');

  if (!id) return;

  container.innerHTML = buildLoadingHTML('Generando factura...');

  try {
    const data = await apiFetch(`${APP.ENDPOINTS.INVOICE}/${id}`);
    renderInvoice(data);
  } catch {
    // Try to build from cached session data
    const cached = reservationsCache ? reservationsCache.find(r => r.id == id) : null;

    if (cached) {
      renderInvoice(getMockInvoice(cached));
    } else {
      container.innerHTML = buildEmptyHTML('❌', `Reserva #${id} no encontrada.<br>Verifica el ID o conecta el backend.`);
    }
  }
}

// ── Rendering ──────────────────────────────────────────────────

/**
 * Renders the full invoice card, including services and digital key.
 * @param {object} invoice - Invoice object from the API or mock generator
 */
function renderInvoice(invoice) {
  const container     = document.getElementById('factura-container');
  const invoiceId     = invoice.id || document.getElementById('fact-id').value;
  const serviceRows   = buildServiceRows(invoice.serviciosAdicionales || []);
  const seasonLabel   = invoice.temporada === 'ALTA' ? 'Alta (×1.5)' : 'Baja (×1.0)';

  container.innerHTML = `
    <div class="invoice-card">

      <div class="invoice-header">
        <div>
          <div class="invoice-title">Factura</div>
          <div class="invoice-num">Reserva #${invoiceId}</div>
        </div>
        <div class="invoice-brand">Facade Resort</div>
      </div>

      <div class="invoice-guest">
        <div style="font-weight: 600;">${invoice.nombreHuesped}</div>
        <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
          Hab. ${invoice.numeroHabitacion} &nbsp;·&nbsp; ${invoice.fechaCheckin} → ${invoice.fechaCheckout}
        </div>
      </div>

      <table class="invoice-table">
        <tr>
          <td>Tarifa base / noche</td>
          <td>$${formatCurrency(invoice.tarifaBase)}</td>
        </tr>
        <tr>
          <td>Noches</td>
          <td>${invoice.noches}</td>
        </tr>
        <tr>
          <td>Temporada</td>
          <td>${seasonLabel}</td>
        </tr>
        <tr>
          <td>Subtotal habitación</td>
          <td>$${formatCurrency(invoice.subtotal)}</td>
        </tr>
        ${serviceRows}
      </table>

      <div class="invoice-total">
        <span class="invoice-total-label">Total</span>
        <span class="invoice-total-amount">$${formatCurrency(invoice.total)}</span>
      </div>

      <div class="access-key">
        <span class="access-key-icon">🔑</span>
        <div>
          <div class="access-key-label">Llave Digital</div>
          <div class="access-key-value">${invoice.llaveDigital || '—'}</div>
        </div>
      </div>

    </div>
  `;
}

// ── Table Builders ─────────────────────────────────────────────

/**
 * Builds the additional service rows for the invoice table.
 * @param {Array<object>} services
 * @returns {string} HTML string of <tr> elements
 */
function buildServiceRows(services) {
  if (!services.length) return '';

  return services.map(s => `
    <tr>
      <td>${s.tipo || s.nombre || 'Servicio adicional'}</td>
      <td>$${formatCurrency(s.precio || 0)}</td>
    </tr>
  `).join('');
}

// ── Number Formatting ──────────────────────────────────────────

/**
 * Formats a number to exactly 2 decimal places.
 * @param {number} value
 * @returns {string}
 */
function formatCurrency(value) {
  return (parseFloat(value) || 0).toFixed(2);
}
