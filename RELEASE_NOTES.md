# Notas de versión · EnvíaYa `envios.js`

## v2.1.0 — Zona insular (11-nov-2026)

**Novedades**
- Ahora se pueden cotizar envíos a **San Andrés**: `calc(peso, "insular", cliente, dia)`.
  La zona insular tiene un recargo del **70 %** sobre la tarifa base.
- Los envíos insulares **no aceptan cupón**. Si se envía uno, se lanza el error *"los envíos insulares no aceptan cupón"*.

**Compatibilidad:** total con v2.0.0. Actualización recomendada.

---

## v2.0.0 — Código mantenible (11-nov-2026)

**⚠️ Cambio incompatible**
- `calc` **ya no recibe el argumento `flag`** y no imprime nada en consola.
  *Migración:* reemplace `calc(p, z, c, d, cup, true)` por `const costo = calc(p, z, c, d, cup); console.log("costo:", costo);`

**Mejoras internas**
- Patrón Estrategia para las zonas; constantes con nombre; funciones pequeñas (complejidad ciclomática de `calc`: 18 → 2).
- 62 pruebas automatizadas con 100 % de cobertura de sentencias y de ramas.

---

## v1.0.1 — Correcciones (11-nov-2026)

Corrige 7 defectos del cálculo heredado:

| Defecto | Antes | Ahora |
|---|---|---|
| DEF-01 | 3 kg costaba $6.000 | 3 kg cuesta $9.000 (tramo 2) |
| DEF-02 | el sábado no tenía recargo | sábado y domingo: +$2.000 |
| DEF-03 | un cupón falso se ignoraba | error "cupón inválido" |
| DEF-04 | una zona desconocida se cobraba como urbana | error "zona inválida" |
| DEF-05 | se aceptaban días 0, 8, … | error "día inválido" |
| DEF-06 | el costo se truncaba ($8.550 → $8.500) | se redondea al múltiplo de $100 más cercano ($8.550 → $8.600) |
| DEF-07 | mensaje "peso invalido" | mensaje "peso inválido" |

**Compatibilidad:** misma firma de función. Las cotizaciones de 3 kg, de sábado y con redondeo cambian porque antes eran incorrectas.
