# Parte 3 · Matriz de casos de prueba de caja negra (36 casos)

Técnicas: **PE** = partición de equivalencia · **VL** = valor límite · **TD** = tabla de decisión · **INT** = caso integral.
Entradas: (peso, zona, cliente, día, cupón). Los resultados esperados se calcularon a mano desde la especificación.

| ID | Req. | Entradas | Cálculo a mano | Esperado | Técnica |
|---|---|---|---|---|---|
| TC01 | R1 | (0, urbana, normal, 1) | 0 no cumple 0 < peso | error "peso inválido" | VL |
| TC02 | R1 | (-1, urbana, normal, 1) | negativo | error | PE (I1) |
| TC03 | R1 | (50.01, urbana, normal, 1) | 50,01 > PMAX | error | VL |
| TC04 | R1, R3 | (50, urbana, normal, 1) | 9.000 + 40 × 800 = 41.000 | $41.000 | VL |
| TC05 | R1, R3 | (0.01, urbana, normal, 1) | tramo 1 | $6.000 | VL |
| TC06 | R3 | (2.99, urbana, normal, 1) | 2,99 < 3 → tramo 1 | $6.000 | VL |
| TC07 | R3 | (3, urbana, normal, 1) | 3 no es < 3 → tramo 2 | $9.000 | VL |
| TC08 | R3 | (3.01, urbana, normal, 1) | tramo 2 | $9.000 | VL |
| TC09 | R3 | (10, urbana, normal, 1) | 10 ≤ 10 → tramo 2 | $9.000 | VL |
| TC10 | R3, R8 | (10.01, urbana, normal, 1) | 9.000 + 0,01 × 800 = 9.008 → 9.000 | $9.000 | VL |
| TC11 | R3 | (10.5, urbana, normal, 1) | 9.000 + 0,5 × 800 = 9.400 | $9.400 | PE (V3) |
| TC12 | R3, R8 | (49.99, urbana, normal, 1) | 9.000 + 39,99 × 800 = 40.992 → 41.000 | $41.000 | VL |
| TC13 | R2 | (5, marte, normal, 1) | zona no válida | error | PE (I4) |
| TC14 | R2 | (5, urbana, normal, 0) | día < 1 | error | VL |
| TC15 | R2 | (5, urbana, normal, 8) | día > 7 | error | VL |
| TC16 | R4 | (5, rural, normal, 1) | 9.000 × 1,20 | $10.800 | PE (V5) |
| TC17 | R4 | (5, nacional, normal, 1) | 9.000 × 1,50 | $13.500 | PE (V6) |
| TC18 | R4 | (1, nacional, normal, 1) | 6.000 × 1,50 | $9.000 | PE |
| TC19 | R5 | (5, urbana, normal, 6) | 9.000 + 2.000 | $11.000 | VL |
| TC20 | R5 | (5, urbana, normal, 7) | 9.000 + 2.000 | $11.000 | VL |
| TC21 | R5 | (5, urbana, normal, 5) | sin recargo | $9.000 | VL |
| TC22 | R6, R8 | (5, urbana, frecuente, 1) | 9.000 × 0,95 = 8.550 → 8.600 | $8.600 | TD (D5) |
| TC23 | R6, R8 | (5, urbana, vip, 1) | 9.000 × 0,85 = 7.650 → 7.700 | $7.700 | TD (D9) |
| TC24 | R6 | (5, urbana, normal, 1, ENVIO10) | 9.000 × 0,90 | $8.100 | TD (D3) |
| TC25 | R6, R8 | (5, urbana, vip, 1, ENVIO10) | 9.000 × 0,85 × 0,90 = 6.885 → 6.900 | $6.900 | TD (D11) |
| TC26 | R5, R6 | (5, urbana, frecuente, 7, ENVIO10) | 11.000 × 0,95 × 0,90 = 9.405 → 9.400 | $9.400 | TD (D8) |
| TC27 | R5, R6 | (5, urbana, vip, 6, ENVIO10) | 11.000 × 0,85 × 0,90 = 8.415 → 8.400 | $8.400 | TD (D12) |
| TC28 | R5, R8 | (5, urbana, frecuente, 6) | 11.000 × 0,95 = 10.450 → 10.500 | $10.500 | TD (D6) |
| TC29 | R5, R8 | (5, urbana, vip, 7) | 11.000 × 0,85 = 9.350 → 9.400 | $9.400 | TD (D10) |
| TC30 | R7 | (5, urbana, normal, 1, GRATIS) | cupón no existe, F impar | error | PE (I7) |
| TC31 | R8 | (1, urbana, vip, 1, ENVIO10) | 6.000 × 0,85 × 0,90 = 4.590 < 5.000 | $5.000 | VL |
| TC32 | R8 | (2, urbana, frecuente, 1, ENVIO10) | 6.000 × 0,95 × 0,90 = 5.130 → 5.100 | $5.100 | VL |
| TC33 | R3–R8 | (4, rural, vip, 6, ENVIO10) | ver cálculo 1 | $9.800 | INT |
| TC34 | R3–R8 | (12.5, nacional, frecuente, 7, ENVIO10) | ver cálculo 2 | $15.800 | INT |
| TC35 | R3, R4 | (3, rural, normal, 1) | 9.000 × 1,20 | $10.800 | VL |
| TC36 | R6, R8 | (5, urbana, frecuente, 1, ENVIO10) | 9.000 × 0,95 × 0,90 = 7.695 → 7.700 | $7.700 | TD (D7) |

## Cálculos paso a paso (mínimo 5)

**Cálculo 1 · TC33** — (4 kg, rural, vip, sábado, ENVIO10)
1. Tramo: D = 1 impar, el tramo 1 es peso < 3. 4 no es menor que 3 y 4 ≤ 10 → tramo 2 → **$9.000**
2. Zona rural +20 % → 9.000 × 1,20 = **$10.800**
3. Sábado y E = 2 par: el recargo va antes de los descuentos → 10.800 + 2.000 = **$12.800**
4. B = 1 impar: ambos descuentos. VIP 15 % → 12.800 × 0,85 = $10.880. Cupón 10 % → 10.880 × 0,90 = **$9.792**
5. Es mayor que $5.000. Se redondea a $100 → **resultado esperado: $9.800**

**Cálculo 2 · TC34** — (12,5 kg, nacional, frecuente, domingo, ENVIO10)
1. 12,5 > 10 → tramo 3: 9.000 + (12,5 − 10) × 800 = 9.000 + 2.000 = **$11.000**
2. Zona nacional +50 % → 11.000 × 1,50 = **$16.500**
3. Domingo, E par → 16.500 + 2.000 = **$18.500**
4. Frecuente 5 % → 18.500 × 0,95 = $17.575. Cupón 10 % → 17.575 × 0,90 = **$15.817,50**
5. > $5.000. El múltiplo de $100 más cercano a 15.817,50 es 15.800 (faltan 17,50 para bajar y 82,50 para subir) → **$15.800**

**Cálculo 3 · TC28** — (5 kg, urbana, frecuente, sábado, sin cupón)
1. 3 ≤ 5 ≤ 10 → tramo 2 → **$9.000**
2. Urbana, sin recargo → **$9.000**
3. Sábado, E par → 9.000 + 2.000 = **$11.000**
4. Frecuente 5 % → 11.000 × 0,95 = **$10.450**; sin cupón
5. > $5.000. 10.450 está justo en la mitad: los $50 redondean hacia arriba → **$10.500**

**Cálculo 4 · TC25** — (5 kg, urbana, vip, lunes, ENVIO10)
1. Tramo 2 → **$9.000**
2. Urbana → **$9.000**
3. Lunes, sin recargo → **$9.000**
4. B impar: VIP 15 % → 9.000 × 0,85 = $7.650; cupón 10 % → 7.650 × 0,90 = **$6.885**
5. > $5.000. 6.885 → el múltiplo de 100 más cercano es **$6.900**

**Cálculo 5 · TC31** — (1 kg, urbana, vip, lunes, ENVIO10)
1. 1 < 3 → tramo 1 → **$6.000**
2. Urbana → **$6.000**; lunes, sin recargo
3. VIP 15 % → 6.000 × 0,85 = $5.100; cupón 10 % → 5.100 × 0,90 = **$4.590**
4. 4.590 < 5.000 → se sube al mínimo **$5.000**
5. Redondeo: 5.000 ya es múltiplo de 100 → **$5.000**

**Cálculo 6 · TC12** — (49,99 kg, urbana, normal, lunes)
1. 49,99 > 10 → 9.000 + 39,99 × 800 = 9.000 + 31.992 = **$40.992**
2. Urbana, lunes, normal, sin cupón → **$40.992**
3. Redondeo al múltiplo de 100 más cercano: 40.992 está a 8 de 41.000 → **$41.000**
