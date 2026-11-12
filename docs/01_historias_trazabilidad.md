# Parte 1 · Historias de usuario y matriz de trazabilidad

## HU-01 · Validar los datos del envío (R1, R2, R7)

**Como** asesor de EnvíaYa **quiero** que el sistema rechace datos de envío inválidos **para** no cotizar envíos imposibles ni aplicar cupones falsos.

| # | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1.1 | un envío de 0 kg | calculo el costo | el sistema lanza el error "peso inválido" |
| CA-1.2 | un envío de 50,01 kg | calculo el costo | el sistema lanza el error "peso inválido" |
| CA-1.3 | un envío de 50 kg | calculo el costo | el sistema lo acepta y cotiza $41.000 |
| CA-1.4 | la zona "marte" | calculo el costo | el sistema lanza error de zona inválida |
| CA-1.5 | el día 0 u 8 | calculo el costo | el sistema lanza error de día inválido |
| CA-1.6 | el cupón "GRATIS" (no existe) | calculo el costo | el sistema lanza error de cupón inválido |

## HU-02 · Calcular la tarifa con recargos (R3, R4, R5)

**Como** cliente de EnvíaYa **quiero** que el precio dependa del peso, la zona y el día **para** pagar un precio justo por mi envío.

| # | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-2.1 | un paquete de 2,99 kg urbano un lunes | calculo el costo | el costo es $6.000 (tramo 1) |
| CA-2.2 | un paquete de exactamente 3 kg urbano un lunes | calculo el costo | el costo es $9.000 (el límite 3 no pertenece al tramo 1) |
| CA-2.3 | un paquete de 12 kg urbano un lunes | calculo el costo | el costo es 9.000 + 2 × 800 = $10.600 |
| CA-2.4 | un paquete de 5 kg a zona rural | calculo el costo | se cobra +20 %: $10.800 |
| CA-2.5 | un paquete de 5 kg a zona nacional | calculo el costo | se cobra +50 %: $13.500 |
| CA-2.6 | un paquete de 5 kg urbano un sábado o domingo | calculo el costo | se suman $2.000 antes de descuentos: $11.000 |

## HU-03 · Aplicar descuentos, mínimo y redondeo (R6, R7, R8)

**Como** gerente comercial de EnvíaYa **quiero** que los descuentos de cliente y de cupón se apliquen en orden y que el precio final sea redondo **para** fidelizar clientes sin perder dinero.

| # | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-3.1 | un cliente VIP con cupón ENVIO10, 5 kg urbano lunes | calculo el costo | se aplica 15 % y luego 10 %: 6.885 → **$6.900** |
| CA-3.2 | un cliente frecuente un sábado, 5 kg urbano | calculo el costo | (9.000 + 2.000) × 0,95 = 10.450 → **$10.500** ($50 sube) |
| CA-3.3 | un VIP con ENVIO10, 1 kg urbano lunes | calculo el costo | 4.590 es menor que el mínimo → **$5.000** |
| CA-3.4 | un cálculo que da 40.992 | redondeo | el resultado es **$41.000** (múltiplo de 100 más cercano) |

## Matriz de trazabilidad

Requisito → historia → criterios → casos de prueba (caja negra TC, caja blanca CB, unitarias UT, cambio INS).

| Requisito | Historia | Criterios | Casos de caja negra | Casos de caja blanca / unitarios | Defecto encontrado |
|---|---|---|---|---|---|
| R1 Peso válido | HU-01 | CA-1.1, 1.2, 1.3 | TC01, TC02, TC03, TC04, TC05 | CB02, CB03, UT10 | DEF-07 |
| R2 Zona y día válidos | HU-01 | CA-1.4, 1.5 | TC13, TC14, TC15 | CB08 | DEF-04, DEF-05 |
| R3 Tarifa base | HU-02 | CA-2.1, 2.2, 2.3 | TC06–TC12, TC35 | CB01, CB04, CB05, UT06 | DEF-01 |
| R4 Recargo zona | HU-02 | CA-2.4, 2.5 | TC16, TC17, TC18, TC35 | CB06, CB07, UT02–UT05 | — |
| R5 Fin de semana | HU-02 | CA-2.6 | TC19, TC20, TC21, TC26–TC29 | CB09, UT07 | DEF-02 |
| R6 Descuentos | HU-03 | CA-3.1, 3.2 | TC22–TC29, TC36 | CB10, CB11, CB12, UT08 | DEF-06 (redondeo) |
| R7 Cupón inexistente | HU-01 / HU-03 | CA-1.6 | TC30 | CB13 | DEF-03 |
| R8 Mínimo y redondeo | HU-03 | CA-3.2, 3.3, 3.4 | TC10, TC12, TC22, TC23, TC25, TC28, TC29, TC31–TC34 | CB14, UT09 | DEF-06 |
| CR-01 Zona insular | HU-04 (Parte 8) | CA-4.1–4.3 | INS01–INS06 | — | — |

*(La matriz se completó en las partes 3, 4, 5 y 8.)*
