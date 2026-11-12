# Parte 6 · Comparación antes / después

Medido con ESLint (regla `complexity`, que cuenta la complejidad ciclomática de cada función) y con Jest `--coverage`.

| Métrica | Antes (v1.0.0 heredado) | Corregido (v1.0.1) | Después (v2.0.0 refactorizado) |
|---|---|---|---|
| V(G) de `calc` | **15** | 18 | **2** |
| V(G) máxima de una función | 15 | 18 | **4** (`validarPeso`, `validarDia`, `porcentajeCupon`) |
| Número de funciones o métodos | 1 | 1 | 16 |
| V(G) total del módulo (suma) | 15 | 18 | 30 |
| Líneas físicas | 54 | 62 | 154 |
| Líneas de código (sin comentarios ni líneas en blanco) | 50 | 57 | 114 |
| Números mágicos (literales de negocio en el código) | 13 | 17 | 0 |
| Pruebas | 51 (30 pasan) | 51 (51 pasan) | 62 (62 pasan) |
| Cobertura de sentencias | 100 % (29/29) | 100 % (33/33) | 100 % (58/58) |
| Cobertura de ramas | 100 % (30/30) | 100 % (35/35) | 100 % (28/28) |
| Cobertura de funciones | 100 % (1/1) | 100 % (1/1) | 100 % (16/16) |

**Lectura:**
- Corregir sin refactorizar **aumentó** la complejidad de `calc` de 15 a 18 (cada corrección agrega una decisión).
  La refactorización la bajó a **2**, y ninguna función supera 4: cada una se entiende y se prueba por separado.
- El número de líneas creció (54 → 154) por las constantes con nombre, las clases de la Estrategia y la documentación JSDoc.
  Es un intercambio deliberado: más líneas, pero cada una simple y con nombre propio.
- La complejidad total del módulo (30) es mayor que la de una sola función, pero está **repartida** en 16 unidades de V(G) 1–4.
  Lo que importa para el mantenimiento es la complejidad de cada unidad que hay que entender a la vez.
- La cobertura se mantuvo en el 100 % de sentencias y ramas después de refactorizar, gracias a las pruebas unitarias UT01–UT11.
