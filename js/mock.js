/* =============================================
   mock.js — Datos simulados (modo demo)
   Usados cuando el backend no está disponible
   ============================================= */

/**
 * Genera las 15 habitaciones predefinidas del sistema:
 * 6 sencillas (101-106), 6 dobles (201-206), 3 suites (301-303)
 * @returns {Array} Lista de habitaciones con disponibilidad simulada
 */
function mockRooms() {
  const tipos = [
    { tipo: 'SENCILLA', precio: 80,  capacidad: 1 },
    { tipo: 'DOBLE',    precio: 130, capacidad: 2 },
    { tipo: 'SUITE',    precio: 250, capacidad: 4 },
  ];

  const numeros     = [101, 102, 103, 104, 105, 106, 201, 202, 203, 204, 205, 206, 301, 302, 303];
  const asignacion  = [  0,   0,   0,   0,   0,   0,   1,   1,   1,   1,   1,   1,   2,   2,   2];
  const disponibles = [101, 104, 201, 203, 206, 302];

  return numeros.map((num, i) => ({
    numero:         num,
    tipo:           tipos[asignacion[i]].tipo,
    precioPorNoche: tipos[asignacion[i]].precio,
    capacidad:      tipos[asignacion[i]].capacidad,
    disponible:     disponibles.includes(num),
  }));
}

/**
 * Servicios adicionales predefinidos del sistema
 * @returns {Array} Lista de servicios
 */
function mockServicios() {
  return [
    { codigo: 'SPA',       nombre: 'Spa & Wellness',       precio: 50,  icono: '🧖', desc: 'Masajes y tratamientos relajantes', unidad: 'por sesión' },
    { codigo: 'DESAYUNO',  nombre: 'Desayuno Buffet',      precio: 15,  icono: '☕', desc: 'Buffet continental incluido',       unidad: 'por día'    },
    { codigo: 'TRASLADO',  nombre: 'Traslado Aeropuerto',  precio: 30,  icono: '🚐', desc: 'Servicio puerta a puerta',          unidad: 'por trayecto' },
  ];
}

/**
 * Genera una factura simulada para una reserva del cache local
 * @param {object} reserva - Objeto de reserva
 * @returns {object} Estructura de factura simulada
 */
function mockFactura(reserva) {
  const checkin  = new Date(reserva.fechaCheckin);
  const checkout = new Date(reserva.fechaCheckout);
  const noches   = Math.max(1, Math.round((checkout - checkin) / 86400000));
  const mes      = checkin.getMonth() + 1;
  const esAlta   = [12, 1, 7, 8].includes(mes);
  const tarifa   = 100;
  const factor   = esAlta ? 1.5 : 1.0;
  const subtotal = tarifa * noches * factor;

  return {
    id:                   reserva.id,
    nombreHuesped:        reserva.nombreHuesped || 'Huésped',
    numeroHabitacion:     reserva.numeroHabitacion,
    fechaCheckin:         reserva.fechaCheckin,
    fechaCheckout:        reserva.fechaCheckout,
    noches,
    tarifaBase:           tarifa,
    temporada:            esAlta ? 'ALTA' : 'BAJA',
    subtotal,
    serviciosAdicionales: [],
    total:                subtotal,
    llaveDigital:         'demo-' + Math.random().toString(36).substring(2, 14),
  };
}

/**
 * Determina si un mes es temporada alta
 * @param {string} fechaStr - Fecha en formato YYYY-MM-DD
 * @returns {boolean}
 */
function esTemporadaAlta(fechaStr) {
  const mes = new Date(fechaStr).getMonth() + 1;
  return [12, 1, 7, 8].includes(mes);
}
