// envios.js — cálculo del costo de envío de EnvíaYa (v2.1.0)
// Especificación personalizada: código 0182410125 (A=4 B=1 C=0 D=1 E=2 F=5)
"use strict";

// ---- Peso y tarifa base (R1, R3) ----
const PESO_MAXIMO_KG = 50;
const LIMITE_TRAMO_1_KG = 3; // D impar: el tramo 1 NO incluye el límite (peso < 3)
const LIMITE_TRAMO_2_KG = 10; // el tramo 2 sí incluye el límite (peso <= 10)
const TARIFA_TRAMO_1 = 6000;
const TARIFA_TRAMO_2 = 9000;
const VALOR_KG_ADICIONAL = 800;

// ---- Recargos (R4, R5) ----
const RECARGO_RURAL = 0.2;
const RECARGO_NACIONAL = 0.5;
const RECARGO_INSULAR = 0.7; // CR-01: San Andrés
const RECARGO_FIN_DE_SEMANA = 2000; // E par: se suma antes de los descuentos
const DIA_MINIMO = 1;
const DIA_MAXIMO = 7;
const SABADO = 6;

// ---- Descuentos (R6, R7) ----
const DESCUENTOS_CLIENTE = Object.freeze({ normal: 0, frecuente: 0.05, vip: 0.15 });
const CUPONES = Object.freeze({ ENVIO10: 0.1 });

// ---- Costo mínimo y redondeo (R8) ----
const COSTO_MINIMO = 5000;
const MULTIPLO_REDONDEO = 100;
const DECIMALES_TOLERANCIA = 6;

// ===== Patrón Estrategia: recargo por zona (R4) =====
class EstrategiaZona {
  aplicarRecargo(_tarifa) {
    throw new Error("EstrategiaZona es abstracta: implemente aplicarRecargo");
  }

  get aceptaCupon() {
    return true;
  }
}

class ZonaUrbana extends EstrategiaZona {
  aplicarRecargo(tarifa) {
    return tarifa;
  }
}

class ZonaConRecargo extends EstrategiaZona {
  constructor(porcentaje) {
    super();
    this.porcentaje = porcentaje;
  }

  aplicarRecargo(tarifa) {
    return tarifa + tarifa * this.porcentaje;
  }
}

class ZonaRural extends ZonaConRecargo {
  constructor() {
    super(RECARGO_RURAL);
  }
}

class ZonaNacional extends ZonaConRecargo {
  constructor() {
    super(RECARGO_NACIONAL);
  }
}

// CR-01: zona insular con recargo del 70 %; no acepta cupones
class ZonaInsular extends ZonaConRecargo {
  constructor() {
    super(RECARGO_INSULAR);
  }

  get aceptaCupon() {
    return false;
  }
}

const ESTRATEGIAS_ZONA = new Map([
  ["urbana", new ZonaUrbana()],
  ["rural", new ZonaRural()],
  ["nacional", new ZonaNacional()],
  ["insular", new ZonaInsular()],
]);

// ===== Funciones extraídas =====
function validarPeso(peso) {
  if (typeof peso !== "number" || !(peso > 0 && peso <= PESO_MAXIMO_KG)) {
    throw new Error("peso inválido");
  }
}

function validarDia(dia) {
  if (!Number.isInteger(dia) || dia < DIA_MINIMO || dia > DIA_MAXIMO) {
    throw new Error("día inválido");
  }
}

function obtenerEstrategiaZona(zona) {
  const estrategia = ESTRATEGIAS_ZONA.get(zona);
  if (!estrategia) throw new Error("zona inválida");
  return estrategia;
}

function tarifaBase(peso) {
  if (peso < LIMITE_TRAMO_1_KG) return TARIFA_TRAMO_1;
  if (peso <= LIMITE_TRAMO_2_KG) return TARIFA_TRAMO_2;
  return TARIFA_TRAMO_2 + (peso - LIMITE_TRAMO_2_KG) * VALOR_KG_ADICIONAL;
}

function esFinDeSemana(dia) {
  return dia >= SABADO;
}

function porcentajeCliente(cliente) {
  return Object.hasOwn(DESCUENTOS_CLIENTE, cliente) ? DESCUENTOS_CLIENTE[cliente] : 0;
}

function porcentajeCupon(cupon) {
  if (cupon === null || cupon === undefined) return 0;
  if (!Object.hasOwn(CUPONES, cupon)) throw new Error("cupón inválido");
  return CUPONES[cupon];
}

// B impar: se aplican ambos descuentos, primero el del cliente y luego el cupón
function aplicarDescuentos(costo, cliente, cupon) {
  const conDescuentoCliente = costo - costo * porcentajeCliente(cliente);
  return conDescuentoCliente - conDescuentoCliente * porcentajeCupon(cupon);
}

function redondear(costo) {
  const exacto = Number(costo.toFixed(DECIMALES_TOLERANCIA));
  return Math.floor(exacto / MULTIPLO_REDONDEO + 0.5) * MULTIPLO_REDONDEO;
}

/**
 * Calcula el costo de un envío.
 * @param {number} peso   kg, 0 < peso <= 50
 * @param {string} zona   "urbana" | "rural" | "nacional" | "insular"
 * @param {string} cliente "normal" | "frecuente" | "vip"
 * @param {number} dia    1..7 (6 = sábado, 7 = domingo)
 * @param {string|null} [cupon] "ENVIO10" u omitido
 * @returns {number} costo en pesos, múltiplo de 100
 */
function calc(peso, zona, cliente, dia, cupon = null) {
  validarPeso(peso);
  validarDia(dia);
  const estrategiaZona = obtenerEstrategiaZona(zona);
  if (cupon !== null && cupon !== undefined && !estrategiaZona.aceptaCupon) {
    throw new Error("los envíos insulares no aceptan cupón");
  }
  let costo = estrategiaZona.aplicarRecargo(tarifaBase(peso));
  if (esFinDeSemana(dia)) costo += RECARGO_FIN_DE_SEMANA;
  costo = aplicarDescuentos(costo, cliente, cupon);
  return redondear(Math.max(costo, COSTO_MINIMO));
}

module.exports = {
  calc,
  calcularCosto: calc,
  tarifaBase,
  esFinDeSemana,
  aplicarDescuentos,
  redondear,
  EstrategiaZona,
  ZonaUrbana,
  ZonaConRecargo,
  ZonaRural,
  ZonaNacional,
  ZonaInsular,
  ESTRATEGIAS_ZONA,
};
