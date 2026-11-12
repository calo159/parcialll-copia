# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y el proyecto usa [Versionado Semántico](https://semver.org/lang/es/).

## [Unreleased]

## [2.0.0] - 2026-11-11

### Changed
- **BREAKING:** `calc(peso, zona, cliente, dia, cupon)` ya no recibe el argumento `flag` ni imprime el costo en consola.
  Quien necesite mostrar el costo debe hacerlo con el valor retornado.
- Patrón Estrategia para el recargo por zona: `EstrategiaZona`, `ZonaUrbana`, `ZonaConRecargo`, `ZonaRural`, `ZonaNacional`.
- Se extraen funciones (`validarPeso`, `validarDia`, `tarifaBase`, `esFinDeSemana`, `aplicarDescuentos`, `redondear`, …);
  la complejidad ciclomática de `calc` baja de 18 a 2.
- Los números mágicos se reemplazan por constantes con nombre.

### Added
- Alias `calcularCosto` de `calc`.
- 11 pruebas unitarias de las estrategias y de las funciones extraídas (UT01–UT11).

### Removed
- Argumento `flag` de `calc`.
- Objeto global mutable `CONFIG` (reemplazado por constantes inmutables).

### Security
- El peso debe ser un número: un texto como `"5"` ya no se acepta por conversión implícita.

## [1.0.1] - 2026-11-11

### Fixed
- DEF-01: el tramo 1 ya no incluye el límite L1 = 3 kg; un paquete de 3 kg cuesta $9.000 (R3).
- DEF-02: el sábado (día 6) ahora cobra el recargo de fin de semana de $2.000 (R5).
- DEF-03: un cupón inexistente ahora lanza el error "cupón inválido" en vez de ignorarse (R7).
- DEF-04: una zona distinta de urbana, rural o nacional ahora lanza el error "zona inválida" (R2).
- DEF-05: un día fuera del rango 1..7 ahora lanza el error "día inválido" (R2).
- DEF-06: el costo se redondea al múltiplo de $100 más cercano ($50 sube) en lugar de truncarse (R8).
- DEF-07: el mensaje de error del peso ahora es "peso inválido", como dice la especificación (R1).

## [1.0.0] - 2026-11-11

### Added
- Código heredado `envios.js` (traducción fiel de `envios.py`) con `CONFIG` personalizado
  para el código 0182410125: L1 = 3, L2 = 10, rural 20 %, nacional 50 %, VIP 15 %, fin de semana $2.000.

[2.0.0]: https://github.com/calo159/parcialll/compare/v1.0.1...v2.0.0
[1.0.1]: https://github.com/calo159/parcialll/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/calo159/parcialll/releases/tag/v1.0.0
