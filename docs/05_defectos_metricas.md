# Parte 5 · Automatización, ejecución y defectos

## 5.1 Automatización

- Framework: **Jest 29.7.0** sobre Node.js (el enunciado permite JavaScript siempre que la traducción conserve la lógica y los defectos).
- Archivos de prueba:
  - `tests/cajaNegra.validaciones.test.js`: TC01–TC15 y TC35 (R1, R2, R3)
  - `tests/cajaNegra.reglas.test.js`: TC16–TC34 y TC36 (R4–R8)
  - `tests/cajaBlanca.test.js`: CB01–CB15 (un caso por camino independiente)
- Ejecución: `npm test` · cobertura: `npm run test:cov` (Jest `--coverage`, motor istanbul: sentencias, ramas, funciones y líneas).

## 5.2 Ejecución contra el código heredado (v1.0.0)

Resultado: **51 pruebas · 30 pasan · 21 fallan** (captura: `evidencias/01_heredado.png`).

| Caso que falla | Esperado | Obtenido | Defecto |
|---|---|---|---|
| TC01 | error "peso inválido" | error "peso invalido" | DEF-07 |
| TC07 | 9.000 | 6.000 | DEF-01 |
| TC35 | 10.800 | 7.200 | DEF-01 |
| TC12 | 41.000 | 40.900 | DEF-06 |
| TC13, CB08 | error | 9.000 | DEF-04 |
| TC14 | error | 9.000 | DEF-05 |
| TC15 | error | 11.000 | DEF-05 |
| TC19 | 11.000 | 9.000 | DEF-02 |
| TC27 | 8.400 | 6.800 | DEF-02 |
| TC28 | 10.500 | 8.500 | DEF-02 + DEF-06 |
| TC33 | 9.800 | 8.200 | DEF-02 |
| TC22, CB10 | 8.600 | 8.500 | DEF-06 |
| TC23, CB11 | 7.700 | 7.600 | DEF-06 |
| TC25 | 6.900 | 6.800 | DEF-06 |
| TC29 | 9.400 | 9.300 | DEF-06 |
| TC36 | 7.700 | 7.600 | DEF-06 |
| TC30, CB13 | error | 9.000 | DEF-03 |

## 5.3 Reporte de defectos

Escala de **severidad** (impacto técnico/negocio): Alta = precio incorrecto en un caso frecuente o aceptación silenciosa de datos inválidos;
Media = precio o validación incorrectos con impacto acotado; Baja = cosmético.
**Prioridad** (urgencia de corrección): Alta = corregir antes de la próxima liberación; Media = en esta versión; Baja = cuando sea posible.

### DEF-01 · El tramo 1 incluye el límite L1 = 3 kg
- **Requisito:** R3 (D = 1 impar → tramo 1 es peso < 3)
- **Pasos:** 1) `calc(3, "urbana", "normal", 1)` 2) observar el resultado
- **Esperado:** $9.000 (3 kg pertenece al tramo 2) · **Obtenido:** $6.000
- **Línea:** 16 `if (p <= CONFIG.L1)`
- **Severidad: Alta.** Se cobra $3.000 menos (33 %) en todos los paquetes de exactamente 3 kg, un peso redondo muy común.
- **Prioridad: Alta.** Pérdida directa de ingresos en cada envío afectado; la corrección es de un carácter.

### DEF-02 · El sábado no cobra el recargo de fin de semana
- **Requisito:** R5 (sábado 6 y domingo 7 → +$2.000)
- **Pasos:** `calc(5, "urbana", "normal", 6)`
- **Esperado:** $11.000 · **Obtenido:** $9.000
- **Línea:** 31 `if (d > 6)` solo considera el domingo
- **Severidad: Alta.** Todos los envíos de sábado salen sin recargo; afecta la mitad de los envíos de fin de semana.
- **Prioridad: Alta.** Pérdida de ingresos recurrente cada semana.

### DEF-03 · Un cupón inexistente se ignora en vez de lanzar error
- **Requisito:** R7 (F = 5 impar → cupón inexistente es error)
- **Pasos:** `calc(5, "urbana", "normal", 1, "GRATIS")`
- **Esperado:** error de cupón inválido · **Obtenido:** $9.000, sin error
- **Línea:** 40–44 (no hay rama `else` para un cupón desconocido)
- **Severidad: Media.** El precio no se altera, pero el cliente cree que su cupón se aplicó; se oculta un error de digitación.
- **Prioridad: Media.** Genera reclamos de clientes, pero sin pérdida económica directa.

### DEF-04 · Una zona inválida no lanza error
- **Requisito:** R2
- **Pasos:** `calc(5, "marte", "normal", 1)` (o `"Rural"` con mayúscula)
- **Esperado:** error de zona inválida · **Obtenido:** $9.000 (se cobra como urbana)
- **Línea:** 23–29 (la cadena `if/else if` no tiene `else`)
- **Severidad: Alta.** Un error de digitación en la zona hace que un envío nacional se cobre como urbano (−33 % del precio) sin aviso.
- **Prioridad: Alta.** Es silencioso y fácil de provocar.

### DEF-05 · Un día fuera de 1..7 no lanza error
- **Requisito:** R2
- **Pasos:** `calc(5, "urbana", "normal", 8)` y `calc(5, "urbana", "normal", 0)`
- **Esperado:** error de día inválido · **Obtenido:** $11.000 (el 8 se trata como fin de semana) y $9.000
- **Línea:** 11–15 (no se valida `d`)
- **Severidad: Media.** Se aceptan datos imposibles; el precio puede salir más alto o más bajo.
- **Prioridad: Media.** Normalmente el día lo genera el sistema, así que la entrada inválida es menos probable.

### DEF-06 · El redondeo trunca en lugar de ir al múltiplo de $100 más cercano
- **Requisito:** R8 (los $50 redondean hacia arriba)
- **Pasos:** `calc(5, "urbana", "frecuente", 1)` (8.550) y `calc(49.99, "urbana", "normal", 1)` (40.992)
- **Esperado:** $8.600 y $41.000 · **Obtenido:** $8.500 y $40.900
- **Línea:** 51 `return Math.trunc(t / 100) * 100` (en Python, `int(t / 100) * 100`)
- **Severidad: Media.** Hasta $99 de diferencia por envío.
- **Prioridad: Alta.** Afecta a cerca de la mitad de los envíos con descuento y es el defecto que más pruebas hace fallar (9).

### DEF-07 · El mensaje de error del peso no coincide con la especificación
- **Requisito:** R1 (error **"peso inválido"**)
- **Pasos:** `calc(0, "urbana", "normal", 1)`
- **Esperado:** mensaje "peso inválido" · **Obtenido:** "peso invalido"
- **Línea:** 14
- **Severidad: Baja.** Cosmético, pero rompe a cualquier cliente que compare el mensaje.
- **Prioridad: Baja.** Se corrige junto con las demás por su bajo costo.

### Observaciones (no son defectos con mi especificación)
- `p > 50`: el máximo del código heredado (50) **coincide** con mi PMAX = 50, así que no es defecto.
- El recargo de fin de semana se suma **antes** de los descuentos (E par) y los descuentos se aplican **en secuencia** (B impar):
  el código heredado ya hace ambas cosas, así que no son defectos para mí.
- Un cliente desconocido no recibe descuento: la especificación no lo define (se documenta como supuesto).

## 5.4 Métricas

| Métrica | Valor |
|---|---|
| Casos ejecutados | 51 |
| Casos que pasan | 30 → **58,8 %** |
| Casos que fallan | 21 → 41,2 % |
| Defectos por severidad | **Alta: 3** (DEF-01, 02, 04) · **Media: 3** (DEF-03, 05, 06) · **Baja: 1** (DEF-07) · Total: 7 |
| Densidad de defectos | 7 defectos / 54 líneas × 100 = **12,96 defectos por cada 100 líneas** |
| Cobertura de sentencias (heredado) | **100 %** (29/29) |
| Cobertura de ramas (heredado) | **100 %** (30/30) |
| Cobertura de funciones / líneas | 100 % / 100 % |
