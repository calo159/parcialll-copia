// Casos de caja negra: recargos (R4, R5), descuentos (R6, R7) y mínimo/redondeo (R8)
// RR=20 %, RN=50 %, V=15 %, S=$2.000 (E par: antes de descuentos),
// B impar: se aplican ambos descuentos (cliente y luego cupón), F impar: cupón inexistente = error
const { calc } = require("../envios");

describe("R4 - Recargo por zona", () => {
  test("TC16 [R4][PE] rural, 5 kg -> 9000 * 1.20 = 10800", () => {
    expect(calc(5, "rural", "normal", 1)).toBe(10800);
  });
  test("TC17 [R4][PE] nacional, 5 kg -> 9000 * 1.50 = 13500", () => {
    expect(calc(5, "nacional", "normal", 1)).toBe(13500);
  });
  test("TC18 [R4][PE] nacional, 1 kg -> 6000 * 1.50 = 9000", () => {
    expect(calc(1, "nacional", "normal", 1)).toBe(9000);
  });
});

describe("R5 - Recargo de fin de semana", () => {
  test("TC19 [R5][VL] sábado (6) -> 9000 + 2000 = 11000", () => {
    expect(calc(5, "urbana", "normal", 6)).toBe(11000);
  });
  test("TC20 [R5][VL] domingo (7) -> 11000", () => {
    expect(calc(5, "urbana", "normal", 7)).toBe(11000);
  });
  test("TC21 [R5][VL] viernes (5) -> sin recargo = 9000", () => {
    expect(calc(5, "urbana", "normal", 5)).toBe(9000);
  });
});

describe("R6 - Tabla de decisión cliente x cupón x fin de semana", () => {
  test("TC22 [R6][TD] frecuente, entre semana -> 8550 redondeado = 8600", () => {
    expect(calc(5, "urbana", "frecuente", 1)).toBe(8600);
  });
  test("TC23 [R6][TD] vip, entre semana -> 7650 redondeado = 7700", () => {
    expect(calc(5, "urbana", "vip", 1)).toBe(7700);
  });
  test("TC24 [R6][TD] normal + ENVIO10 -> 8100", () => {
    expect(calc(5, "urbana", "normal", 1, "ENVIO10")).toBe(8100);
  });
  test("TC25 [R6][TD] vip + ENVIO10 -> 9000*0.85*0.90 = 6885 -> 6900", () => {
    expect(calc(5, "urbana", "vip", 1, "ENVIO10")).toBe(6900);
  });
  test("TC36 [R6][TD] frecuente + ENVIO10 -> 9000*0.95*0.90 = 7695 -> 7700", () => {
    expect(calc(5, "urbana", "frecuente", 1, "ENVIO10")).toBe(7700);
  });
  test("TC26 [R6][TD] frecuente + ENVIO10 + domingo -> 11000*0.95*0.90 = 9405 -> 9400", () => {
    expect(calc(5, "urbana", "frecuente", 7, "ENVIO10")).toBe(9400);
  });
  test("TC27 [R6][TD] vip + ENVIO10 + sábado -> 11000*0.85*0.90 = 8415 -> 8400", () => {
    expect(calc(5, "urbana", "vip", 6, "ENVIO10")).toBe(8400);
  });
  test("TC28 [R6][TD] frecuente + sábado -> 11000*0.95 = 10450 -> 10500", () => {
    expect(calc(5, "urbana", "frecuente", 6)).toBe(10500);
  });
  test("TC29 [R6][TD] vip + domingo -> 11000*0.85 = 9350 -> 9400", () => {
    expect(calc(5, "urbana", "vip", 7)).toBe(9400);
  });
});

describe("R7 - Cupón inexistente", () => {
  test("TC30 [R7][PE] cupón 'GRATIS' lanza error (F impar)", () => {
    expect(() => calc(5, "urbana", "normal", 1, "GRATIS")).toThrow();
  });
});

describe("R8 - Costo mínimo y redondeo", () => {
  test("TC31 [R8][VL] 1 kg vip + ENVIO10 -> 4590 sube al mínimo 5000", () => {
    expect(calc(1, "urbana", "vip", 1, "ENVIO10")).toBe(5000);
  });
  test("TC32 [R8][VL] 2 kg frecuente + ENVIO10 -> 5130 -> 5100", () => {
    expect(calc(2, "urbana", "frecuente", 1, "ENVIO10")).toBe(5100);
  });
});

describe("Casos integrales (todas las reglas)", () => {
  test("TC33 [R3-R8] 4 kg rural vip sábado ENVIO10 -> 9792 -> 9800", () => {
    expect(calc(4, "rural", "vip", 6, "ENVIO10")).toBe(9800);
  });
  test("TC34 [R3-R8] 12.5 kg nacional frecuente domingo ENVIO10 -> 15817.5 -> 15800", () => {
    expect(calc(12.5, "nacional", "frecuente", 7, "ENVIO10")).toBe(15800);
  });
});
