# Parte 1 · Requisitos — Especificación personalizada

**Estudiante:** Carlos David Sierra · **Código:** 0182410125

## Mis parámetros

Últimos 6 dígitos del código: **4 1 0 1 2 5**

| A | B | C | D | E | F | PMAX | L1 | L2 | RR | RN | V | S | CAMBIO |
|---|---|---|---|---|---|------|----|----|----|----|---|---|--------|
| 4 | 1 | 0 | 1 | 2 | 5 | 50 kg | 3 kg | 10 kg | 20 % | 50 % | 15 % | $2.000 | 0 |

Cálculo de cada parámetro:

| Parámetro | Fórmula | Cálculo | Valor |
|---|---|---|---|
| PMAX | 30 + 5·A | 30 + 5·4 | **50 kg** |
| L1 | 2 + (B mod 3) | 2 + (1 mod 3) = 2 + 1 | **3 kg** |
| L2 | 10 + C | 10 + 0 | **10 kg** |
| RR | 10 + 5·(E mod 4) | 10 + 5·(2 mod 4) = 10 + 10 | **20 %** |
| RN | 40 + 5·(F mod 3) | 40 + 5·(5 mod 3) = 40 + 10 | **50 %** |
| V | 10 + 5·(A mod 3) | 10 + 5·(4 mod 3) = 10 + 5 | **15 %** |
| S | 2000 + 500·(C mod 4) | 2000 + 500·0 | **$2.000** |
| CAMBIO | (A + F) mod 3 | (4 + 5) mod 3 = 9 mod 3 | **0** |

Reglas por paridad:

| Dígito | Valor | Paridad | Regla que me toca |
|---|---|---|---|
| D | 1 | impar | Tramo 1 **no incluye** el límite: peso **< 3** |
| E | 2 | par | El recargo de fin de semana se suma **antes** de los descuentos |
| B | 1 | impar | Cliente y cupón: se aplican **ambos**, primero el del cliente y luego el cupón |
| F | 5 | impar | Un cupón que no existe es **error** |

Solicitud de cambio (Parte 8): **0 → zona insular (San Andrés), recargo del 70 %, sin cupón.**

## CONFIG del código heredado

```js
const CONFIG = {
  L1: 3,
  L2: 10,
  RECARGO_RURAL: 0.2,
  RECARGO_NACIONAL: 0.5,
  DESC_VIP: 0.15,
  RECARGO_FINDE: 2000,
};
```

## Especificación R1–R8 (con mis valores)

Entradas: `peso` en kg (con decimales); `zona` ∈ {urbana, rural, nacional}; `cliente` ∈ {normal, frecuente, vip};
`dia` de 1 a 7 (6 = sábado, 7 = domingo); `cupon` opcional.

| ID | Regla |
|---|---|
| **R1** | El peso debe cumplir **0 < peso ≤ 50**. Si no, se lanza el error **"peso inválido"**. |
| **R2** | Si la zona no es urbana, rural o nacional, o el día no está entre 1 y 7, se lanza un error. |
| **R3** | Tarifa base. **Tramo 1: peso < 3 kg → $6.000.** Tramo 2: 3 ≤ peso ≤ 10 → $9.000. Más de 10 kg: $9.000 + $800 por cada kg sobre 10, de forma proporcional. |
| **R4** | Recargo por zona: rural **+20 %**, nacional **+50 %**, urbana sin recargo. |
| **R5** | Sábado (6) y domingo (7): **+$2.000**, sumados **antes** de los descuentos. |
| **R6** | Descuento de cliente: frecuente 5 %, VIP **15 %**. Cupón `ENVIO10`: 10 %. Si hay ambos se aplican **los dos**: primero el del cliente y luego el cupón sobre el resultado. |
| **R7** | Un cupón que no existe **lanza un error**. |
| **R8** | El costo nunca es menor que $5.000. El resultado se redondea al múltiplo de $100 más cercano; los $50 redondean hacia arriba. |

**Orden de cálculo:** validar (R1, R2, R7) → tarifa base (R3) → recargo de zona (R4) → recargo de fin de semana (R5)
→ descuento de cliente → cupón (R6) → mínimo de $5.000 → redondeo (R8).

**Supuesto documentado:** la especificación no dice qué hacer con un tipo de cliente desconocido; se conserva el
comportamiento del código heredado (se trata como cliente normal, sin descuento).

### Ejemplo calculado a mano con mis parámetros

Entradas: peso = 4 kg · zona = rural · cliente = vip · día = 6 (sábado) · cupón = ENVIO10

1. Tramo: D = 1 impar → tramo 1 es peso < 3. 4 no es < 3 y 4 ≤ 10 → tramo 2 → **$9.000**
2. Zona rural +20 % → 9.000 × 1,20 = **$10.800**
3. Sábado y E = 2 par → recargo antes de descuentos → 10.800 + 2.000 = **$12.800**
4. B = 1 impar → ambos: VIP 15 % → 12.800 × 0,85 = $10.880; luego cupón 10 % → 10.880 × 0,90 = **$9.792**
5. Mayor que $5.000. Redondeo al múltiplo de $100 más cercano → **resultado esperado: $9.800**
