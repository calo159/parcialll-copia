# Parte 8 · Solicitud de cambio y análisis de impacto

**(A + F) mod 3 = (4 + 5) mod 3 = 9 mod 3 = 0** → solicitud de cambio **CR-01**:

> Nueva zona **insular** (San Andrés) con un recargo del **70 %**. Los envíos insulares **no aceptan cupón**.

## 8.1 Nuevo requisito y nueva historia

- **R4 (modificado):** recargo por zona. Rural +20 %, nacional +50 %, **insular +70 %**, urbana sin recargo.
- **R2 (modificado):** las zonas válidas ahora son urbana, rural, nacional e **insular**.
- **R9 (nuevo):** si la zona es insular y se envía cualquier cupón, se lanza el error "los envíos insulares no aceptan cupón".
  Decisión de diseño: como en mi especificación un cupón inexistente es error (F impar), un cupón no permitido también es **error**,
  no se ignora en silencio.

**HU-04 · Envíos a San Andrés.** **Como** cliente de San Andrés **quiero** cotizar envíos a la isla **para** recibir paquetes del continente.

| # | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-4.1 | un paquete de 5 kg a zona insular, cliente normal, lunes | calculo el costo | 9.000 × 1,70 = **$15.300** |
| CA-4.2 | un envío insular con el cupón ENVIO10 | calculo el costo | error "los envíos insulares no aceptan cupón" |
| CA-4.3 | un envío insular VIP de 12 kg un sábado | calculo el costo | (10.600 × 1,70 + 2.000) × 0,85 = 17.017 → **$17.000** |

## 8.2 Análisis de impacto (con la matriz de trazabilidad)

| Elemento | ¿Se afecta? | Detalle |
|---|---|---|
| **R2** zonas válidas | Sí | "insular" deja de ser inválida |
| **R4** recargo por zona | Sí | Nueva estrategia con 70 % |
| **R6 / R7** cupón | Sí | El cupón depende ahora de la zona (nueva R9) |
| R1, R3, R5, R8 | No | La tarifa base, el fin de semana, el mínimo y el redondeo se aplican igual a la zona insular |
| **HU-01** | Sí | El criterio CA-1.4 cambia: "marte" sigue siendo inválida, "insular" no |
| **HU-02** | Sí | Nueva zona en el cálculo con recargo |
| HU-03 | Sí (parcial) | Los descuentos de cliente se aplican; el cupón queda prohibido para la zona insular |
| HU-04 | Nueva | Historia de la solicitud de cambio |
| Casos TC13, CB08 | Revisar | Siguen válidos ("marte" sigue siendo error); no se usa "insular" como zona inválida en ninguna prueba previa |
| Casos TC16, TC17, TC24, TC30 | Regresión | Deben seguir pasando: las otras zonas aceptan cupón (INS06) |
| **Código** `ESTRATEGIAS_ZONA` | Sí | Se registra `["insular", new ZonaInsular()]` |
| **Código** `EstrategiaZona` | Sí | Nueva propiedad `aceptaCupon` (por defecto `true`) |
| **Código** clase nueva `ZonaInsular` | Nueva | `extends ZonaConRecargo` con 70 % y `aceptaCupon = false` |
| **Código** `calc` | Sí (1 línea) | Valida el cupón contra `estrategiaZona.aceptaCupon` |
| `tarifaBase`, `aplicarDescuentos`, `redondear` | No | Sin cambios |
| Documentación | Sí | CHANGELOG, notas de versión, UML (nueva subclase) |

**Gracias al patrón Estrategia**, el cambio no toca la lógica de cálculo de las otras zonas: se agrega una clase y una entrada en el registro.
En el código heredado habría sido necesario modificar la cadena de `if / else if` de `calc` y anidar otra condición en el bloque del cupón.

## 8.3 Tipo de mantenimiento

**Perfectivo:** agrega funcionalidad nueva pedida por el negocio, sin corregir fallas (correctivo) ni responder a un cambio de entorno (adaptativo).

## 8.4 Implementación con pruebas primero (TDD)

1. Rama `feat/zona-insular` creada desde `main` (v2.0.0).
2. **Rojo:** se escribieron `tests/insular.test.js` (INS01–INS06) **antes** del código. Resultado: **4 fallan** (INS01–INS04,
   porque "insular" todavía era una zona inválida); INS05 e INS06 pasan (cupón inexistente y regresión de la zona rural).
   Captura: `evidencias/04_insular_rojo.png`.
3. **Verde:** se implementó `ZonaInsular`, la propiedad `aceptaCupon` y la validación en `calc`. Resultado: **68 / 68 pasan**,
   con 100 % de sentencias y de ramas. Captura: `evidencias/05_insular_verde.png`.
4. Integración en `main` con `merge --no-ff`, CHANGELOG actualizado y etiqueta **v2.1.0**.

| Caso | Entradas | Cálculo a mano | Esperado |
|---|---|---|---|
| INS01 | (5, insular, normal, 1) | 9.000 × 1,70 | $15.300 |
| INS02 | (5, insular, normal, 1, ENVIO10) | cupón en zona insular | error |
| INS03 | (12, insular, vip, 6) | (9.000 + 2 × 800) × 1,70 = 18.020; + 2.000 = 20.020; × 0,85 = 17.017 | $17.000 |
| INS04 | (1, insular, frecuente, 7) | 6.000 × 1,70 = 10.200; + 2.000 = 12.200; × 0,95 = 11.590 | $11.600 |
| INS05 | (5, insular, normal, 1, XYZ) | cupón no permitido en zona insular | error |
| INS06 | (5, rural, normal, 1, ENVIO10) | 10.800 × 0,90 = 9.720 | $9.700 |

## 8.5 Versión

Se agrega funcionalidad **compatible** con versiones anteriores: todas las llamadas válidas en v2.0.0 dan el mismo resultado en v2.1.0.
Según SemVer, esto es un cambio **MINOR** → **v2.1.0**.
