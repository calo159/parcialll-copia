// Casos de caja blanca: un caso por cada camino independiente del grafo de flujo de calc
// V(G) = 15 -> 15 caminos (CB01..CB15). Resultados esperados según la especificación.
const { calc } = require("../envios");

describe("Caminos independientes de calc", () => {
  test("CB01 camino base: 5 kg urbana normal lunes -> 9000", () => {
    expect(calc(5, "urbana", "normal", 1)).toBe(9000);
  });
  test("CB02 peso <= 0 verdadero -> error", () => {
    expect(() => calc(0, "urbana", "normal", 1)).toThrow();
  });
  test("CB03 peso > 50 verdadero -> error", () => {
    expect(() => calc(51, "urbana", "normal", 1)).toThrow();
  });
  test("CB04 tramo 1: 2 kg -> 6000", () => {
    expect(calc(2, "urbana", "normal", 1)).toBe(6000);
  });
  test("CB05 tramo 3: 12 kg -> 9000 + 2*800 = 10600", () => {
    expect(calc(12, "urbana", "normal", 1)).toBe(10600);
  });
  test("CB06 zona rural -> 10800", () => {
    expect(calc(5, "rural", "normal", 1)).toBe(10800);
  });
  test("CB07 zona nacional -> 13500", () => {
    expect(calc(5, "nacional", "normal", 1)).toBe(13500);
  });
  test("CB08 ninguna zona coincide ('marte') -> error", () => {
    expect(() => calc(5, "marte", "normal", 1)).toThrow();
  });
  test("CB09 fin de semana (domingo) -> 11000", () => {
    expect(calc(5, "urbana", "normal", 7)).toBe(11000);
  });
  test("CB10 cliente frecuente -> 8550 -> 8600", () => {
    expect(calc(5, "urbana", "frecuente", 1)).toBe(8600);
  });
  test("CB11 cliente vip -> 7650 -> 7700", () => {
    expect(calc(5, "urbana", "vip", 1)).toBe(7700);
  });
  test("CB12 cupón ENVIO10 -> 8100", () => {
    expect(calc(5, "urbana", "normal", 1, "ENVIO10")).toBe(8100);
  });
  test("CB13 cupón distinto de ENVIO10 ('XYZ') -> error", () => {
    expect(() => calc(5, "urbana", "normal", 1, "XYZ")).toThrow();
  });
  test("CB14 costo < 5000: 1 kg vip ENVIO10 -> 5000", () => {
    expect(calc(1, "urbana", "vip", 1, "ENVIO10")).toBe(5000);
  });
  // v2.0.0 (cambio incompatible): se eliminó el argumento flag. Un 6.º argumento
  // ya no tiene efecto: no se imprime nada y el resultado es el mismo.
  test("CB15 (v2) flag eliminado: un 6.º argumento no imprime nada -> 9000", () => {
    const espia = jest.spyOn(console, "log").mockImplementation(() => {});
    expect(calc(5, "urbana", "normal", 1, null, true)).toBe(9000);
    expect(espia).not.toHaveBeenCalled();
    espia.mockRestore();
  });
});
