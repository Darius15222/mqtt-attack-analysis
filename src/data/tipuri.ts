// Forma conținutului unui capitol. Fișierele src/data/capNN.ts sunt generate din docx de scripts/genereaza.py
// și conțin o listă de blocuri, în ordinea din document; fiecare tip de bloc e afișat de componenta Blocuri.tsx.

export type FelPas = 'intrare' | 'calcul' | 'iesire' | 'decizie'
export type IdGrafic = 'clase' | 'corelatii' | 'confuzie' | 'arbore' | 'reguli'

export type Bloc =
  | { tip: 'text'; text: string; eticheta?: string } // paragraf; eticheta = începutul îngroșat („Ce arată:”)
  | { tip: 'subtitlu'; text: string } // paragraf scurt, tot îngroșat
  | { tip: 'pas'; fel: FelPas; eticheta: string; text: string } // casetele Intrare / Calcul / Ieșire / Decizie
  | { tip: 'tabel'; antet: string[]; randuri: string[][] }
  | { tip: 'imagine'; src: string; legenda?: string } // src = fișier din public/img/
  | { tip: 'galerie'; imagini: { tip: 'imagine'; src: string; legenda?: string }[] } // grilă de imagini (tabel de imagini în docx)
  | { tip: 'grafic'; id: IdGrafic } // grafic interactiv
  | { tip: 'cod'; text: string } // fragment scurt de cod din document
  | { tip: 'lista'; ordonata: boolean; start: number; elemente: string[] }
  | { tip: 'sectiune'; titlu: string } // subcapitol, ex. „10.3 Alegerea adâncimii”

export type Capitol = { titlu: string; blocuri: Bloc[] }
