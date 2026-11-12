// Pruebas unitarias de las funciones extraídas y del patrón Estrategia (v2.0.0)
const {
  tarifaBase,
  esFinDeSemana,
  aplicarDescuentos,
  redondear,
  EstrategiaZona,
  ZonaUrbana,
  ZonaRural,
  ZonaNacional,
  ESTRATEGIAS_ZONA,
} = require("../envios");

describe("Estrategias de zona", () => {
  test("UT01 la estrategia abstracta no se puede usar directamente", () => {
    expect(() => new EstrategiaZona().aplicarRecargo(9000)).toThrow();
  });
  test("UT02 ZonaUrbana no cobra recargo", () => {
    expect(new ZonaUrbana().aplicarRecargo(9000)).toBe(9000);
  });
  test("UT03 ZonaRural cobra 20 %", () => {
    expect(new ZonaRural().aplicarRecargo(9000)).toBeCloseTo(10800, 6);
  });
  test("UT04 ZonaNacional cobra 50 %", () => {
    expect(new ZonaNacional().aplicarRecargo(9000)).toBeCloseTo(13500, 6);
  });
  test("UT05 el registro contiene las zonas válidas", () => {
    expect([...ESTRATEGIAS_ZONA.keys()]).toEqual(expect.arrayContaining(["urbana", "rural", "nacional"]));
  });
});

describe("Funciones extraídas", () => {
  test("UT06 tarifaBase en los límites 2.99 / 3 / 10 / 12", () => {
    expect([tarifaBase(2.99), tarifaBase(3), tarifaBase(10), tarifaBase(12)]).toEqual([6000, 9000, 9000, 10600]);
  });
  test("UT07 esFinDeSemana solo para 6 y 7", () => {
    expect([5, 6, 7].map(esFinDeSemana)).toEqual([false, true, true]);
  });
  test("UT08 aplicarDescuentos combina cliente y luego cupón", () => {
    expect(aplicarDescuentos(10000, "vip", "ENVIO10")).toBeCloseTo(7650, 6);
  });
  test("UT09 redondear: $50 sube, $49.99 baja", () => {
    expect([redondear(10450), redondear(10449.99), redondear(10449.999999999998)]).toEqual([10500, 10400, 10500]);
  });
  test("UT10 un peso que no es número (\"5\") lanza 'peso inválido'", () => {
    const { calc } = require("../envios");
    expect(() => calc("5", "urbana", "normal", 1)).toThrow("peso inválido");
  });
  test("UT11 supuesto: un cliente no especificado se trata como normal (sin descuento) -> 9000", () => {
    const { calc } = require("../envios");
    expect(calc(5, "urbana", "desconocido", 1)).toBe(9000);
  });
});
