// envios.js — código heredado con correcciones (v1.0.1) (traducción fiel de envios.py)
const CONFIG = {
  L1: 3, // <- pon tus valores
  L2: 10,
  RECARGO_RURAL: 0.2, // como fracción, ej. 0.15
  RECARGO_NACIONAL: 0.5,
  DESC_VIP: 0.15,
  RECARGO_FINDE: 2000, // en pesos
};

function calc(p, z, c, d, cup = null, flag = false) {
  let t;
  if (p <= 0 || p > 50) {
    throw new Error("peso invalido");
  }
  if (!Number.isInteger(d) || d < 1 || d > 7) {
    throw new Error("día inválido"); // DEF-05
  }
  if (p < CONFIG.L1) { // DEF-01: el tramo 1 no incluye el límite (D impar)
    t = 6000;
  } else if (p <= CONFIG.L2) {
    t = 9000;
  } else {
    t = 9000 + (p - CONFIG.L2) * 800;
  }
  if (z == "urbana") {
    t = t;
  } else if (z == "rural") {
    t = t + t * CONFIG.RECARGO_RURAL;
  } else if (z == "nacional") {
    t = t + t * CONFIG.RECARGO_NACIONAL;
  } else {
    throw new Error("zona inválida"); // DEF-04
  }
  // fin de semana
  if (d >= 6) { // DEF-02: sábado (6) y domingo (7)
    t = t + CONFIG.RECARGO_FINDE;
  }
  if (c == "frecuente") {
    t = t - t * 0.05;
  }
  if (c == "vip") {
    t = t - t * CONFIG.DESC_VIP;
  }
  if (cup != null) {
    if (cup == "ENVIO10") {
      t = t - t * 0.1;
    } else {
      throw new Error("cupón inválido"); // DEF-03: F impar, cupón inexistente es error
    }
  }
  if (t < 5000) {
    t = 5000;
  }
  if (flag) {
    console.log("costo:", t);
  }
  // DEF-06: redondeo al múltiplo de 100 más cercano ($50 sube)
  return Math.floor(Number(t.toFixed(6)) / 100 + 0.5) * 100;
}

module.exports = { calc, CONFIG };
