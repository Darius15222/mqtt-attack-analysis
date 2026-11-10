// Clasele, culorile lor și cifrele din docx folosite de graficele interactive.
export const CLASE = ['legitimate', 'dos', 'bruteforce', 'malformed', 'slowite', 'flood'] as const
export type Clasa = (typeof CLASE)[number]

// aceleași culori ca în graficele din document, ușor luminate pentru fundal închis
export const CULORI: Record<Clasa, string> = {
  legitimate: '#4f9cf0',
  dos: '#f2804a',
  bruteforce: '#2ec79a',
  malformed: '#f5b52e',
  slowite: '#ec8fb8',
  flood: '#5fd35f',
}

// 10.5: predicția pe rânduri, realitatea pe coloane
export const confuzie = { tp: 150659, fp: 1269, fn: 14804, tn: 164194 }
