# Parte 7 · Gestión de configuración

Repositorio: <https://github.com/calo159/parcialll>

## 7.1 Etiquetas

| Etiqueta | Commit | Contenido |
|---|---|---|
| `v1.0.0` | código heredado | `envios.js` traducido con `CONFIG` personalizado, sin modificar |
| `v1.0.1` | después de integrar `fix/DEF-01` … `fix/DEF-07` | 7 defectos corregidos |
| `v2.0.0` | después de integrar `refactor/estrategia` | refactorización, patrón Estrategia, sin `flag` |
| `v2.1.0` | después de integrar `feat/zona-insular` | nueva zona insular (CR-01) |

Todas son etiquetas anotadas (`git tag -a`).

## 7.2 Ramas

| Rama | Propósito | Integración |
|---|---|---|
| `main` | Línea principal; cada versión se etiqueta aquí | — |
| `test/suite` | Suite automatizada (caja negra y caja blanca) y evidencia contra el código heredado | `merge --no-ff` |
| `fix/DEF-01` … `fix/DEF-07` | Una rama por defecto | `merge --no-ff`, una por una, con la regresión después de cada una |
| `refactor/estrategia` | Constantes, funciones extraídas, Estrategia, eliminación de `flag` | `merge --no-ff` |
| `feat/zona-insular` | Solicitud de cambio CR-01 con pruebas primero | `merge --no-ff` |

Se usó `--no-ff` para que cada integración quede como un commit de merge visible en el grafo.

## 7.3 Versionado semántico justificado

SemVer: **MAJOR**.MINOR.PATCH. MAJOR = cambio incompatible de la interfaz pública; MINOR = funcionalidad nueva compatible;
PATCH = corrección compatible.

- **v1.0.0 → v1.0.1 (PATCH):** solo se corrigen defectos y la firma de `calc` no cambia.
  Aunque algunas llamadas ahora lanzan error (zona o día inválidos), esas entradas nunca fueron válidas según la especificación:
  corregir un comportamiento que contradice el contrato documentado es un PATCH.
- **v1.0.1 → v2.0.0 (MAJOR):** *¿quitar `flag` cambia la interfaz de la función? ¿Eso la hace major?* **Sí.** `flag` era un parámetro
  público de `calc`. Cualquier cliente que llamara `calc(..., true)` para registrar el costo en consola **pierde ese comportamiento**.
  En JavaScript la llamada no falla, pero deja de imprimir en silencio, lo que es aún más peligroso. Romper la compatibilidad de la API
  pública exige incrementar MAJOR. Por eso el commit usa `refactor!:` y el pie `BREAKING CHANGE:` (Conventional Commits).
- **v2.0.0 → v2.1.0 (MINOR):** la zona insular es funcionalidad nueva **compatible**: ninguna llamada válida en 2.0.0 cambia su resultado.

## 7.4 CHANGELOG y notas de versión

- `CHANGELOG.md` en formato *Keep a Changelog* (secciones Added / Changed / Removed / Fixed / Security, versión y fecha, enlaces de comparación).
- `RELEASE_NOTES.md` con las notas de cada versión para el usuario del módulo.

## 7.5 Historial

Los commits se hicieron a lo largo de la jornada, cada uno con un mensaje *Conventional Commits* (`feat`, `fix`, `test`, `docs`,
`refactor`, `release`). La salida de `git log --oneline --graph --all` está en `evidencias/git_log.txt` / `.png` y en el informe.
