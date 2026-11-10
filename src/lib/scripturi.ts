// Scripturile din cod/, citite ca text în momentul build-ului (Vite import.meta.glob cu ?raw).
const fisiere = import.meta.glob('../../cod/*.{py,R}', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

export function continutScript(numeFisier: string) {
  return fisiere[`../../cod/${numeFisier}`] ?? ''
}

export type Limbaj = 'python' | 'r'

export function limbajScript(numeFisier: string): Limbaj {
  return numeFisier.endsWith('.R') ? 'r' : 'python'
}

// Titlul arătat deasupra codului: ce face scriptul, nu numele fișierului.
export const TITLU_SCRIPT: Record<string, string> = {
  '01_cap1-7_statistici_corelatii.py': 'Statistici, teste pe clase și corelații',
  '02_cap7-9_regresii_logistica.py': 'Regresiile liniare și regresia logistică',
  '03_cap9_probabilitati.py': 'Probabilitățile de atac din regresia logistică',
  '04_cap9_firth.py': 'Regresia Firth',
  '05_cap8-9_cook_durbin_watson.py': 'Distanța Cook și testul Durbin-Watson',
  '06_cap11_reguli_asociere.py': 'Regulile de asociere (Apriori)',
  '07_grafice_corelatie.py': 'Graficele cu corelații',
  '08_grafice_restul.py': 'Graficele din capitolele 5-11',
  '09_cap10_arbori_ctree.R': 'Arborii de decizie (R, ctree)',
  '10_grafice_arbori.py': 'Desenele arborilor',
}
