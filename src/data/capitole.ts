import type { Capitol, IdGrafic } from './tipuri'
import c01 from './cap01'
import c02 from './cap02'
import c03 from './cap03'
import c04 from './cap04'
import c05 from './cap05'
import c06 from './cap06'
import c07 from './cap07'
import c08 from './cap08'
import c09 from './cap09'
import c10 from './cap10'
import c11 from './cap11'
import c12 from './cap12'
import c13 from './cap13'

// Lista capitolelor, în ordinea din document. Conținutul vine din src/data/capNN.ts (generat din docx);
// aici stau doar informațiile pentru site: adresa paginii, titlul din meniu, rezumatul, scripturile și graficele interactive.
export type Meta = {
  nr: number
  slug: string // adresa paginii: #/capitol/<slug>
  scurt: string // titlul din meniu
  rezumat: string // o propoziție, sub titlu și pe cardul din dashboard
  scripturi: string[] // fișierele din cod/ care produc rezultatele capitolului (tab-ul „Codul”)
  // dintr-un script lung se pot arăta doar unele linii (de la, până la, inclusiv), cu titlul lor;
  // liniile alese formează un program care rulează singur (`rulare` = comanda); întregul e pe pagina „Codul complet”
  fragmente?: Record<string, { titlu: string; linii: [number, number][]; rulare: string }>
  // grafic interactiv pus după blocul care se potrivește cu `dupa`: numele unei imagini, titlul unei secțiuni,
  // un cap de tabel sau începutul unui paragraf
  grafice?: { id: IdGrafic; dupa: string }[]
  continut: Capitol
}

export const capitole: Meta[] = [
  {
    nr: 1,
    slug: 'dataset',
    scurt: 'Dataset',
    rezumat: 'De unde vin datele: 330.926 de pachete, jumătate normale, jumătate din cinci atacuri.',
    scripturi: ['01_cap1-7_statistici_corelatii.py'],
    fragmente: { '01_cap1-7_statistici_corelatii.py': { titlu: 'Citirea datelor și numărarea claselor', linii: [[17, 22], [37, 39]], rulare: 'python cod.py mqttdataset_reduced.csv.zip' } },
    grafice: [{ id: 'clase', dupa: 'Clasă (target)' }],
    continut: c01,
  },
  {
    nr: 2,
    slug: 'articole',
    scurt: 'Articole',
    rezumat: 'Cinci articole care au lucrat pe aceleași date, ca să ne putem compara rezultatele.',
    scripturi: [],
    continut: c02,
  },
  {
    nr: 3,
    slug: 'variabile',
    scurt: 'Variabilele',
    rezumat: 'Ce înseamnă fiecare coloană din date și ce valori are la normal și la atac.',
    scripturi: [], // descrierile vin din specificația MQTT; exemplele normal/atac le calculează 01 (pagina „Codul complet”)
    continut: c03,
  },
  {
    nr: 4,
    slug: 'formule',
    scurt: 'Formule',
    rezumat: 'Toate formulele folosite, fiecare cu un exemplu calculat pe datele noastre.',
    scripturi: [], // fiecare formulă e calculată în capitolul unde e folosită (6-11), cu codul acolo
    continut: c04,
  },
  {
    nr: 5,
    slug: 'descriptiva',
    scurt: 'Statistică descriptivă',
    rezumat: 'Cum arată fiecare variabilă: ce tip are, ce valori ia, ce valori ies din tipar.',
    scripturi: ['01_cap1-7_statistici_corelatii.py', '08_grafice_restul.py'],
    fragmente: {
      '01_cap1-7_statistici_corelatii.py': { titlu: 'Coloanele constante, mediana, asimetria, valorile extreme', linii: [[17, 22], [30, 35], [40, 41], [44, 75]], rulare: 'python cod.py mqttdataset_reduced.csv.zip' },
      '08_grafice_restul.py': { titlu: 'Graficele: procentul de pachete pentru fiecare valoare', linii: [[20, 31], [33, 34], [37, 39], [42, 86], [88, 113]], rulare: 'python cod.py mqttdataset_reduced.csv.zip folder_grafice' },
    },
    continut: c05,
  },
  {
    nr: 6,
    slug: 'pe-categorii',
    scurt: 'Statistică pe categorii',
    rezumat: 'Arată fiecare variabilă altfel la atacuri decât la traficul normal? Teste pe cele 6 clase.',
    scripturi: ['01_cap1-7_statistici_corelatii.py', '08_grafice_restul.py'],
    fragmente: {
      '01_cap1-7_statistici_corelatii.py': { titlu: 'Tabelul pe clase și testele (Kruskal-Wallis, χ², Mann-Whitney)', linii: [[17, 22], [77, 125]], rulare: 'python cod.py mqttdataset_reduced.csv.zip' },
      '08_grafice_restul.py': { titlu: 'Graficele pe clase (boxplot și procente, cu stele)', linii: [[20, 31], [33, 34], [37, 39], [42, 86], [116, 213]], rulare: 'python cod.py mqttdataset_reduced.csv.zip folder_grafice' },
    },
    continut: c06,
  },
  {
    nr: 7,
    slug: 'corelatii',
    scurt: 'Corelații',
    rezumat: 'Care variabile cresc și scad împreună, pe tot setul și separat pe fiecare clasă.',
    scripturi: ['01_cap1-7_statistici_corelatii.py', '02_cap7-9_regresii_logistica.py', '07_grafice_corelatie.py', '08_grafice_restul.py'],
    fragmente: {
      '01_cap1-7_statistici_corelatii.py': { titlu: 'Corelațiile Spearman și Pearson pe tot setul', linii: [[17, 22], [24, 29], [132, 170]], rulare: 'python cod.py mqttdataset_reduced.csv.zip' },
      '02_cap7-9_regresii_logistica.py': { titlu: 'Corelațiile pe fiecare clasă', linii: [[17, 52]], rulare: 'python cod.py mqttdataset_reduced.csv.zip' },
      '08_grafice_restul.py': { titlu: 'Graficul Pearson față de Spearman (7.4)', linii: [[20, 31], [33, 34], [37, 39], [42, 86], [214, 242]], rulare: 'python cod.py mqttdataset_reduced.csv.zip folder_grafice' },
    },
    grafice: [{ id: 'corelatii', dupa: 'Între numerice, tcp.len și mqtt.len' }],
    continut: c07,
  },
  {
    nr: 8,
    slug: 'regresie-liniara',
    scurt: 'Regresie liniară',
    rezumat: 'Din mărimea unui pachet putem afla lungimea mesajului MQTT din el? La traficul normal da, la atacuri nu.',
    scripturi: ['02_cap7-9_regresii_logistica.py', '05_cap8-9_cook_durbin_watson.py', '08_grafice_restul.py'],
    fragmente: {
      '02_cap7-9_regresii_logistica.py': { titlu: 'Regresiile liniare 1-3', linii: [[17, 26], [54, 94]], rulare: 'python cod.py mqttdataset_reduced.csv.zip' },
      '05_cap8-9_cook_durbin_watson.py': { titlu: 'Testul Durbin-Watson', linii: [[19, 26], [66, 72]], rulare: 'python cod.py mqttdataset_reduced.csv.zip' },
      '08_grafice_restul.py': { titlu: 'Graficele regresiei liniare', linii: [[20, 31], [33, 34], [37, 39], [42, 86], [243, 349]], rulare: 'python cod.py mqttdataset_reduced.csv.zip folder_grafice' },
    },
    continut: c08,
  },
  {
    nr: 9,
    slug: 'regresie-logistica',
    scurt: 'Regresie logistică',
    rezumat: 'Cât de probabil e ca un pachet să fie atac, după valorile lui.',
    scripturi: ['02_cap7-9_regresii_logistica.py', '03_cap9_probabilitati.py', '04_cap9_firth.py', '05_cap8-9_cook_durbin_watson.py', '08_grafice_restul.py'],
    fragmente: {
      '02_cap7-9_regresii_logistica.py': { titlu: 'VIF și regresia logistică', linii: [[17, 26], [34, 35], [95, 134]], rulare: 'python cod.py mqttdataset_reduced.csv.zip' },
      '03_cap9_probabilitati.py': { titlu: 'Probabilitățile prezise și tabelul 9.2', linii: [[16, 44]], rulare: 'python cod.py mqttdataset_reduced.csv.zip' },
      '05_cap8-9_cook_durbin_watson.py': { titlu: 'Distanța Cook', linii: [[19, 64]], rulare: 'python cod.py mqttdataset_reduced.csv.zip cook.npy' },
      '08_grafice_restul.py': { titlu: 'Graficele regresiei logistice', linii: [[20, 31], [33, 35], [37, 39], [42, 86], [350, 419]], rulare: 'python cod.py mqttdataset_reduced.csv.zip folder_grafice cook.npy' },
    },
    continut: c09,
  },
  {
    nr: 10,
    slug: 'arbori',
    scurt: 'Arbori de decizie',
    rezumat: 'Un arbore de decizie care spune corect „atac” sau „normal” la 95,1% din pachete.',
    scripturi: ['09_cap10_arbori_ctree.R', '10_grafice_arbori.py'],
    grafice: [{ id: 'arbore', dupa: 'Fiecare nod arată numărul lui' }, { id: 'confuzie', dupa: 'Atac real' }],
    continut: c10,
  },
  {
    nr: 11,
    slug: 'reguli',
    scurt: 'Reguli de asociere',
    rezumat: 'Combinațiile de valori care anunță fiecare atac, sigure în cel puțin 96% din cazuri.',
    scripturi: ['06_cap11_reguli_asociere.py', '08_grafice_restul.py'],
    fragmente: {
      '08_grafice_restul.py': { titlu: 'Graficul regulilor (support și confidence)', linii: [[20, 31], [33, 34], [37, 39], [42, 86], [420, 506]], rulare: 'python cod.py mqttdataset_reduced.csv.zip folder_grafice' },
    },
    grafice: [{ id: 'reguli', dupa: 'Atac' }], // după tabelul cu primele 3 reguli pe atac (11.4)
    continut: c11,
  },
  {
    nr: 12,
    slug: 'literatura',
    scurt: 'Comparație cu literatura',
    rezumat: 'Rezultatele noastre puse lângă cele din cele cinci articole.',
    scripturi: [],
    continut: c12,
  },
  {
    nr: 13,
    slug: 'concluzie',
    scurt: 'Concluzie',
    rezumat: 'Pentru fiecare atac: valorile după care îl recunoști.',
    scripturi: [], // tabelul adună rezultatele din cap. 5, 6 și 9-11; codul e la capitolele acelea
    continut: c13,
  },
]

// „10. Arbori de decizie” → „Arbori de decizie”
export const titluFaraNr = (m: Meta) => m.continut.titlu.replace(/^\d+\.\s*/, '')
