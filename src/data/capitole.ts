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
import c14 from './cap14'

// Lista capitolelor, în ordinea din document. Conținutul vine din src/data/capNN.ts (generat din docx);
// aici stau doar informațiile pentru site: adresa paginii, titlul din meniu, rezumatul, scripturile și graficele interactive.
export type Meta = {
  nr: number
  slug: string // adresa paginii: #/capitol/<slug>
  scurt: string // titlul din meniu
  rezumat: string // o propoziție, sub titlu și pe cardul din dashboard
  scripturi: string[] // fișierele din cod/ care produc rezultatele capitolului (tab-ul „Codul”)
  // grafic interactiv pus după blocul care se potrivește cu `dupa`: numele unei imagini, titlul unei secțiuni sau un cap de tabel
  grafice?: { id: IdGrafic; dupa: string }[]
  continut: Capitol
}

export const capitole: Meta[] = [
  {
    nr: 1,
    slug: 'dataset',
    scurt: 'Dataset',
    rezumat: 'MQTTset redus: 330.926 de pachete dintr-o casă inteligentă simulată, jumătate normale, jumătate cinci atacuri.',
    scripturi: ['01_cap1-7_statistici_corelatii.py'],
    grafice: [{ id: 'clase', dupa: 'Clasă (target)' }],
    continut: c01,
  },
  {
    nr: 2,
    slug: 'articole',
    scurt: 'Articole',
    rezumat: 'Cinci articole care folosesc același dataset, ca rezultatele să se poată compara.',
    scripturi: [],
    continut: c02,
  },
  {
    nr: 3,
    slug: 'variabile',
    scurt: 'Variabilele',
    rezumat: 'Ce înseamnă fiecare dintre cele 34 de coloane și ce valori are la normal și la atac.',
    scripturi: ['01_cap1-7_statistici_corelatii.py'],
    continut: c03,
  },
  {
    nr: 4,
    slug: 'formule',
    scurt: 'Formule',
    rezumat: 'Toate formulele folosite, fiecare cu un exemplu calculat pe datele noastre.',
    scripturi: ['01_cap1-7_statistici_corelatii.py'],
    continut: c04,
  },
  {
    nr: 5,
    slug: 'descriptiva',
    scurt: 'Statistică descriptivă',
    rezumat: 'Tipul fiecărei variabile, normalitatea, valorile extreme și distribuția fiecăreia.',
    scripturi: ['01_cap1-7_statistici_corelatii.py', '08_grafice_restul.py'],
    continut: c05,
  },
  {
    nr: 6,
    slug: 'pe-categorii',
    scurt: 'Statistică pe categorii',
    rezumat: 'Cum diferă fiecare variabilă între cele 6 clase: χ², Kruskal-Wallis, Mann-Whitney.',
    scripturi: ['01_cap1-7_statistici_corelatii.py', '08_grafice_restul.py'],
    continut: c06,
  },
  {
    nr: 7,
    slug: 'corelatii',
    scurt: 'Corelații',
    rezumat: 'Ce variabile se mișcă împreună, pe tot setul și separat pe fiecare clasă.',
    scripturi: ['01_cap1-7_statistici_corelatii.py', '07_grafice_corelatie.py', '08_grafice_restul.py'],
    grafice: [{ id: 'corelatii', dupa: 'corr_tot.png' }],
    continut: c07,
  },
  {
    nr: 8,
    slug: 'regresie-liniara',
    scurt: 'Regresie liniară',
    rezumat: 'Se poate prezice o lungime din alta? Trei regresii, cu toate condițiile verificate.',
    scripturi: ['02_cap7-9_regresii_logistica.py', '05_cap8-9_cook_durbin_watson.py', '08_grafice_restul.py'],
    continut: c08,
  },
  {
    nr: 9,
    slug: 'regresie-logistica',
    scurt: 'Regresie logistică',
    rezumat: 'Probabilitatea ca un pachet să fie atac; separarea perfectă și regresia Firth.',
    scripturi: ['02_cap7-9_regresii_logistica.py', '03_cap9_probabilitati.py', '04_cap9_firth.py', '05_cap8-9_cook_durbin_watson.py', '08_grafice_restul.py'],
    continut: c09,
  },
  {
    nr: 10,
    slug: 'arbori',
    scurt: 'Arbori de decizie',
    rezumat: 'Arbori ctree: 95,2% pachete de test recunoscute corect, cu 15 reguli simple.',
    scripturi: ['09_cap10_arbori_ctree.R', '10_grafice_arbori.py'],
    grafice: [{ id: 'arbore', dupa: 'arbore_clasificare.png' }, { id: 'confuzie', dupa: 'Atac real' }],
    continut: c10,
  },
  {
    nr: 11,
    slug: 'reguli',
    scurt: 'Reguli de asociere',
    rezumat: 'Apriori: combinațiile de valori care anunță fiecare atac, cu confidence de cel puțin 0,96.',
    scripturi: ['06_cap11_reguli_asociere.py', '08_grafice_restul.py'],
    grafice: [{ id: 'reguli', dupa: '11.4 Regulile pentru fiecare atac' }],
    continut: c11,
  },
  {
    nr: 12,
    slug: 'literatura',
    scurt: 'Comparație cu literatura',
    rezumat: 'Rezultatele noastre față de cele cinci articole: date, variabile, metode, accuracy.',
    scripturi: [],
    continut: c12,
  },
  {
    nr: 13,
    slug: 'concluzie',
    scurt: 'Concluzie',
    rezumat: 'Pentru fiecare atac, variabilele care îl deosebesc de traficul normal.',
    scripturi: ['01_cap1-7_statistici_corelatii.py'],
    continut: c13,
  },
  {
    nr: 14,
    slug: 'bibliografie',
    scurt: 'Bibliografie',
    rezumat: 'Setul de date, articolele, metodele și programele folosite.',
    scripturi: [],
    continut: c14,
  },
]

// „10. Arbori de decizie” → „Arbori de decizie”
export const titluFaraNr = (m: Meta) => m.continut.titlu.replace(/^\d+\.\s*/, '')
