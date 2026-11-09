// Cifrele cheie din docx (capitolele indicate), afișate pe dashboard și în graficele interactive.
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

export const cifre = [
  { valoare: '330.926', eticheta: 'pachete analizate', detaliu: '6 clase: normal + 5 atacuri', cap: 'dataset' },
  { valoare: '95,2%', eticheta: 'accuracy arbore', detaliu: 'F1 = 0,950 pe 99.278 pachete de test', cap: 'arbori' },
  { valoare: '0,843', eticheta: 'R² regresie', detaliu: 'mqtt.len din tcp.len, după logaritm', cap: 'regresie-liniara' },
  { valoare: '≥ 0,96', eticheta: 'confidence reguli', detaliu: 'cel puțin o regulă pentru fiecare atac', cap: 'reguli' },
]

// 10.5: predicția pe rânduri, realitatea pe coloane
export const confuzie = { tp: 45319, fp: 409, fn: 4320, tn: 49230 }

// pașii analizei, în ordinea din document
export const pipeline = [
  { titlu: 'Date', text: 'MQTTset redus', cap: 'dataset' },
  { titlu: 'Descriere', text: 'tipuri, normalitate, extreme', cap: 'descriptiva' },
  { titlu: 'Teste pe clase', text: 'χ², Kruskal-Wallis', cap: 'pe-categorii' },
  { titlu: 'Corelații', text: 'Spearman, Pearson', cap: 'corelatii' },
  { titlu: 'Regresii', text: 'liniară, logistică', cap: 'regresie-liniara' },
  { titlu: 'Arbori', text: 'ctree, 70/30', cap: 'arbori' },
  { titlu: 'Reguli', text: 'Apriori', cap: 'reguli' },
  { titlu: 'Concluzie', text: 'ce indică fiecare atac', cap: 'concluzie' },
]
