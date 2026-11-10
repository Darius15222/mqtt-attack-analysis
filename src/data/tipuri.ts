// Forma conținutului unui capitol. Fișierele src/data/capNN.ts sunt generate din docx de scripts/genereaza.py
// și conțin o listă de blocuri, în ordinea din document; fiecare tip de bloc e afișat de componenta Blocuri.tsx.

export type FelPas = 'intrare' | 'calcul' | 'iesire' | 'decizie'
export type IdGrafic = 'clase' | 'corelatii' | 'confuzie' | 'arbore' | 'reguli'

// Cele 5 părți ale unui capitol, în ordine
export type Parte = 'context' | 'ipoteza' | 'pasi' | 'demonstratie' | 'concluzie'

// src = fișier din public/img/; latime și inaltime (pixeli) rezervă locul imaginii până se încarcă
export type BlocImagine = { tip: 'imagine'; src: string; legenda?: string; latime: number; inaltime: number }

export type Bloc =
  | { tip: 'text'; text: string; eticheta?: string } // paragraf; eticheta = începutul îngroșat („Ce arată:”)
  | { tip: 'subtitlu'; text: string } // paragraf scurt, tot îngroșat
  | { tip: 'pas'; fel: FelPas; eticheta: string; text: string; puncte?: string[] } // casetele Intrare / Calcul / Ieșire / Decizie
  | { tip: 'tabel'; antet: string[]; randuri: string[][] }
  | BlocImagine
  | { tip: 'galerie'; imagini: BlocImagine[] } // grilă de imagini (tabel de imagini în docx)
  | { tip: 'cod'; text: string } // fragment scurt de cod din document
  | { tip: 'lista'; ordonata: boolean; start: number; elemente: string[] }
  | { tip: 'parte'; fel: Parte; titlu: string } // „Ce facem și de ce”, „Ipoteza” (sau „Scopul”), „Pașii”, „Demonstrația”, „Concluzia”
  | { tip: 'sectiune'; titlu: string } // subcapitol, ex. „10.3 Alegerea adâncimii”

export type Capitol = { titlu: string; blocuri: Bloc[] }
