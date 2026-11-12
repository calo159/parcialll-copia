// Solicitud de cambio 0 ((A+F) mod 3 = (4+5) mod 3 = 0):
// Nueva zona insular (San Andrés) con recargo del 70 %. Los envíos insulares no aceptan cupón.
// Pruebas escritas ANTES de la implementación (TDD).
const { calc } = require("../envios");

describe("CR-01 Zona insular (San Andrés)", () => {
  test("INS01 5 kg insular normal lunes -> 9000 * 1.70 = 15300", () => {
    expect(calc(5, "insular", "normal", 1)).toBe(15300);
  });
  test("INS02 insular con cupón ENVIO10 lanza error", () => {
    expect(() => calc(5, "insular", "normal", 1, "ENVIO10")).toThrow("no aceptan cupón");
  });
  test("INS03 12 kg insular vip sábado -> (10600*1.70 + 2000)*0.85 = 17017 -> 17000", () => {
    expect(calc(12, "insular", "vip", 6)).toBe(17000);
  });
  test("INS04 1 kg insular frecuente domingo -> (6000*1.70 + 2000)*0.95 = 11590 -> 11600", () => {
    expect(calc(1, "insular", "frecuente", 7)).toBe(11600);
  });
  test("INS05 insular con cupón inexistente también lanza error", () => {
    expect(() => calc(5, "insular", "normal", 1, "XYZ")).toThrow();
  });
  test("INS06 regresión: la zona rural sigue aceptando cupón -> 10800*0.90 = 9720 -> 9700", () => {
    expect(calc(5, "rural", "normal", 1, "ENVIO10")).toBe(9700);
  });
});
