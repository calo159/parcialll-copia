# Parte 3 · Diseño de casos de caja negra

## 3.1 Particiones de equivalencia

| Entrada | Clases válidas | Clases inválidas |
|---|---|---|
| **peso** | V1: 0 < peso < 3 (tramo 1) · V2: 3 ≤ peso ≤ 10 (tramo 2) · V3: 10 < peso ≤ 50 (tramo 3) | I1: peso ≤ 0 · I2: peso > 50 · I3: no numérico ("5") |
| **zona** | V4: urbana · V5: rural · V6: nacional | I4: cualquier otro texto ("marte", "Rural", "") |
| **cliente** | V7: normal · V8: frecuente · V9: vip | (no especificado: se trata como normal, ver supuesto) |
| **dia** | V10: 1–5 (entre semana) · V11: 6–7 (fin de semana) | I5: dia < 1 · I6: dia > 7 |
| **cupon** | V12: sin cupón (null) · V13: "ENVIO10" | I7: cupón inexistente ("GRATIS", "XYZ") → error (F impar) |

Casos que cubren cada clase: V1 TC06 · V2 TC07, TC09 · V3 TC11 · V4 TC21 · V5 TC16 · V6 TC17 · V7 TC24 ·
V8 TC22 · V9 TC23 · V10 TC21 · V11 TC19, TC20 · V12 TC22 · V13 TC24 · I1 TC01, TC02 · I2 TC03 · I3 UT10 ·
I4 TC13 · I5 TC14 · I6 TC15 · I7 TC30.

## 3.2 Valores límite de peso

L1 = 3 kg **no está incluido** en el tramo 1 (D = 1 impar → peso < 3). L2 = 10 kg **sí** está incluido en el tramo 2. PMAX = 50 kg.

| Límite | Valor probado | Clase | Esperado | Caso |
|---|---|---|---|---|
| 0 | 0 | inválido | error "peso inválido" | TC01 |
| 0 | 0,01 | tramo 1 | $6.000 | TC05 |
| L1 = 3 | 2,99 | tramo 1 | $6.000 | TC06 |
| L1 = 3 | **3** | **tramo 2** (límite excluido del tramo 1) | **$9.000** | TC07, TC35 |
| L1 = 3 | 3,01 | tramo 2 | $9.000 | TC08 |
| L2 = 10 | 10 | tramo 2 | $9.000 | TC09 |
| L2 = 10 | 10,01 | tramo 3 | 9.008 → $9.000 | TC10 |
| PMAX = 50 | 49,99 | tramo 3 | 40.992 → $41.000 | TC12 |
| PMAX = 50 | 50 | tramo 3 | $41.000 | TC04 |
| PMAX = 50 | 50,01 | inválido | error | TC03 |

Valores límite de día: 0 (error, TC14), 5 (sin recargo, TC21), 6 (recargo, TC19), 7 (recargo, TC20), 8 (error, TC15).

## 3.3 Tabla de decisión: cliente × cupón × fin de semana

Reglas: **E = 2 par** → el recargo de $2.000 se suma **antes** de los descuentos.
**B = 1 impar** → se aplican **ambos** descuentos: primero el del cliente y luego el cupón sobre el resultado.
Base de todas las columnas: 5 kg, urbana → $9.000.

| Condiciones / Acciones | D1 | D2 | D3 | D4 | D5 | D6 | D7 | D8 | D9 | D10 | D11 | D12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Cliente | normal | normal | normal | normal | frec. | frec. | frec. | frec. | vip | vip | vip | vip |
| Cupón ENVIO10 | No | No | Sí | Sí | No | No | Sí | Sí | No | No | Sí | Sí |
| Fin de semana | No | Sí | No | Sí | No | Sí | No | Sí | No | Sí | No | Sí |
| Sumar $2.000 antes | – | X | – | X | – | X | – | X | – | X | – | X |
| Descuento cliente | – | – | – | – | 5 % | 5 % | 5 % | 5 % | 15 % | 15 % | 15 % | 15 % |
| Luego cupón 10 % | – | – | X | X | – | – | X | X | – | – | X | X |
| Cálculo | 9.000 | 11.000 | 8.100 | 9.900 | 8.550 | 10.450 | 7.695 | 9.405 | 7.650 | 9.350 | 6.885 | 8.415 |
| **Resultado** | **9.000** | **11.000** | **8.100** | **9.900** | **8.600** | **10.500** | **7.700** | **9.400** | **7.700** | **9.400** | **6.900** | **8.400** |
| Caso | CB01 | TC19 | TC24 | (D4) | TC22 | TC28 | TC36 | TC26 | TC23 | TC29 | TC25 | TC27 |

Con 3 condiciones binarias (cliente con 3 valores) hay 3 × 2 × 2 = 12 reglas; todas están cubiertas por al menos un
caso automatizado, excepto D4, que se verifica de forma implícita con TC24 + TC19 (la regla D4 es la composición de ambas).
