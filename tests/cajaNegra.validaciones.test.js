// Casos de caja negra: validaciones (R1, R2) y valores límite de peso (R3)
// Parámetros del estudiante 0182410125: PMAX=50, L1=3 (exclusivo, D impar), L2=10
const { calc } = require("../envios");

describe("R1 - Validación del peso", () => {
  test("TC01 [R1][VL] peso = 0 lanza 'peso inválido'", () => {
    expect(() => calc(0, "urbana", "normal", 1)).toThrow("peso inválido");
  });
  test("TC02 [R1][PE] peso negativo (-1) lanza error", () => {
    expect(() => calc(-1, "urbana", "normal", 1)).toThrow();
  });
  test("TC03 [R1][VL] peso = 50.01 (PMAX + 0.01) lanza error", () => {
    expect(() => calc(50.01, "urbana", "normal", 1)).toThrow();
  });
  test("TC04 [R1][VL] peso = 50 (PMAX) es válido -> 41000", () => {
    expect(calc(50, "urbana", "normal", 1)).toBe(41000);
  });
  test("TC05 [R1][VL] peso = 0.01 es válido -> 6000", () => {
    expect(calc(0.01, "urbana", "normal", 1)).toBe(6000);
  });
});

describe("R3 - Valores límite de los tramos", () => {
  test("TC06 [R3][VL] peso = 2.99 (L1 - 0.01) -> tramo 1 = 6000", () => {
    expect(calc(2.99, "urbana", "normal", 1)).toBe(6000);
  });
  test("TC07 [R3][VL] peso = 3 (L1, excluido) -> tramo 2 = 9000", () => {
    expect(calc(3, "urbana", "normal", 1)).toBe(9000);
  });
  test("TC08 [R3][VL] peso = 3.01 (L1 + 0.01) -> 9000", () => {
    expect(calc(3.01, "urbana", "normal", 1)).toBe(9000);
  });
  test("TC09 [R3][VL] peso = 10 (L2, incluido) -> 9000", () => {
    expect(calc(10, "urbana", "normal", 1)).toBe(9000);
  });
  test("TC10 [R3][VL] peso = 10.01 (L2 + 0.01) -> 9008 redondeado = 9000", () => {
    expect(calc(10.01, "urbana", "normal", 1)).toBe(9000);
  });
  test("TC11 [R3][PE] peso = 10.5 -> 9000 + 0.5*800 = 9400", () => {
    expect(calc(10.5, "urbana", "normal", 1)).toBe(9400);
  });
  test("TC12 [R3][VL] peso = 49.99 (PMAX - 0.01) -> 40992 redondeado = 41000", () => {
    expect(calc(49.99, "urbana", "normal", 1)).toBe(41000);
  });
  test("TC35 [R3][VL] peso = 3 rural -> 9000 * 1.20 = 10800", () => {
    expect(calc(3, "rural", "normal", 1)).toBe(10800);
  });
});

describe("R2 - Validación de zona y día", () => {
  test("TC13 [R2][PE] zona inexistente 'marte' lanza error", () => {
    expect(() => calc(5, "marte", "normal", 1)).toThrow();
  });
  test("TC14 [R2][VL] día = 0 lanza error", () => {
    expect(() => calc(5, "urbana", "normal", 0)).toThrow();
  });
  test("TC15 [R2][VL] día = 8 lanza error", () => {
    expect(() => calc(5, "urbana", "normal", 8)).toThrow();
  });
});
