export type FelPas = 'intrare' | 'calcul' | 'iesire' | 'decizie'
export type IdGrafic = 'clase' | 'corelatii' | 'confuzie' | 'arbore' | 'reguli'

export type Bloc =
  | { tip: 'text'; text: string; eticheta?: string }
  | { tip: 'subtitlu'; text: string }
  | { tip: 'pas'; fel: FelPas; eticheta: string; text: string }
  | { tip: 'tabel'; antet: string[]; randuri: string[][] }
  | { tip: 'imagine'; src: string; legenda?: string }
  | { tip: 'galerie'; imagini: { tip: 'imagine'; src: string; legenda?: string }[] }
  | { tip: 'grafic'; id: IdGrafic }
  | { tip: 'cod'; text: string }
  | { tip: 'lista'; ordonata: boolean; start: number; elemente: string[] }
  | { tip: 'sectiune'; titlu: string }

export type Capitol = { titlu: string; blocuri: Bloc[] }
