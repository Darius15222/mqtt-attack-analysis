// Numere în format românesc: 330.926 și 0,9504.
export function formatNumar(valoare: number, zecimale = 0) {
  return valoare.toLocaleString('ro-RO', { minimumFractionDigits: zecimale, maximumFractionDigits: zecimale })
}

export function formatProcent(parte: number, total: number, zecimale = 1) {
  return formatNumar((100 * parte) / total, zecimale) + '%'
}

// 7 → „07”: numărul capitolului, pe două cifre
export const doiDigiti = (n: number) => String(n).padStart(2, '0')
