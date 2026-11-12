# Parte 2 · Plan de pruebas

## 1. Alcance

- **Objeto de prueba:** la función `calc(peso, zona, cliente, dia, cupon)` del módulo `envios.js` de EnvíaYa
  (versión heredada 1.0.0 y las versiones corregidas 1.0.1, 2.0.0 y 2.1.0).
- **Incluye:** las reglas R1–R8 de la especificación personalizada (código 0182410125), los valores límite de peso
  (0, 3, 10, 50), la combinación cliente × cupón × fin de semana, el mínimo de $5.000 y el redondeo, y la solicitud
  de cambio CR-01 (zona insular).
- **No incluye:** interfaz gráfica, base de datos, facturación, rendimiento y seguridad, que no forman parte del
  componente entregado.

## 2. Niveles de prueba aplicados a este caso

| Nivel | Qué se prueba aquí | Cómo |
|---|---|---|
| **Unidad** | Cada función por separado: `tarifaBase`, `redondear`, `esFinDeSemana`, `aplicarDescuentos` y cada clase `Zona*` del patrón Estrategia. | Jest, `tests/estrategias.test.js` (UT01–UT10). |
| **Integración** | La colaboración entre las funciones extraídas y las estrategias de zona dentro de `calc` (el orden zona → fin de semana → cliente → cupón → mínimo → redondeo). | Casos de caja blanca CB01–CB15 y casos integrales TC33, TC34, que recorren todo el flujo. |
| **Sistema** | El componente completo frente a la especificación R1–R8, como caja negra, a través de su interfaz pública `calc`. | Matriz de 36 casos TC01–TC36 (`tests/cajaNegra.*.test.js`). |
| **Aceptación** | Los criterios Dado/Cuando/Entonces de HU-01, HU-02 y HU-03 (y HU-04 de la Parte 8), validados con el negocio. | Cada criterio está trazado a un caso automatizado (matriz de trazabilidad); se revisan con el "cliente" (docente) en la sustentación. |

## 3. Estrategia

- **Caja negra:** particiones de equivalencia, análisis de valores límite y tabla de decisión.
  Los resultados esperados se **calculan a mano** a partir de la especificación, nunca ejecutando el código heredado.
- **Caja blanca:** grafo de flujo, complejidad ciclomática y un caso por camino independiente;
  medición de cobertura de sentencias y de ramas con Jest (`--coverage`, motor istanbul).
- **Regresión:** las mismas pruebas se ejecutan después de cada corrección (una rama `fix/DEF-xx` por defecto),
  después de la refactorización y después de la solicitud de cambio.
- **TDD para cambios:** en la Parte 8 y en la sustentación, primero se escribe la prueba que falla (rojo), luego el código (verde).

## 4. Ambiente

| Elemento | Detalle |
|---|---|
| Sistema operativo | Windows 11 Pro |
| Lenguaje | JavaScript, Node.js v26 (traducción fiel de `envios.py`, defectos incluidos) |
| Framework | Jest 29.7.0 (pruebas y cobertura) |
| Control de versiones | Git 2.54 + GitHub (`calo159/parcialll`) |
| Datos | Valores fijos definidos en la matriz de casos; no se requiere base de datos |

## 5. Roles

| Rol | Responsable | Responsabilidad |
|---|---|---|
| Líder de calidad | Carlos David Sierra | Plan, diseño de casos, métricas e informe |
| Probador | Carlos David Sierra | Automatización y ejecución de pruebas, reporte de defectos |
| Desarrollador de mantenimiento | Carlos David Sierra | Corrección, refactorización y solicitud de cambio |
| Cliente / aceptación | Docente (EnvíaYa) | Valida criterios de aceptación y la sustentación |

## 6. Riesgos y mitigación

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| Resultados esperados mal calculados a mano | Media | Alto | Cálculo paso a paso de casos clave; doble verificación de los límites |
| Errores de punto flotante (p. ej. 10449,999…) que cambian el redondeo | Alta | Medio | Normalizar a 6 decimales antes de redondear; casos límite con $50 exactos (TC28, UT09) |
| Ambigüedad de la especificación (cliente desconocido, día no entero) | Media | Medio | Supuestos documentados en la especificación |
| La refactorización introduce regresiones | Media | Alto | Ejecutar la suite completa después de cada commit; cobertura ≥ 95 % de ramas |
| Mala traducción de Python a JavaScript | Baja | Alto | Traducción línea a línea; mismos operadores (`<=`, `>`, truncamiento) |
| Falta de tiempo en la jornada | Media | Alto | Commits pequeños e incrementales; priorizar defectos de severidad alta |

## 7. Criterios de entrada

- La especificación R1–R8 está escrita con los valores del código 0182410125.
- `CONFIG` tiene los valores personales y el código heredado tiene la etiqueta `v1.0.0`.
- El ambiente (Node + Jest) está instalado y `npm test` se ejecuta.
- La matriz de casos tiene los resultados esperados calculados a mano.

## 8. Criterios de salida

- El 100 % de los casos diseñados están automatizados y ejecutados.
- Todos los defectos de severidad alta y media están corregidos y verificados (0 abiertos).
- La regresión final está **100 % en verde**.
- Cobertura de sentencias = 100 % y de ramas ≥ 95 % sobre `envios.js`.
- El CHANGELOG y las etiquetas de versión están publicados.
