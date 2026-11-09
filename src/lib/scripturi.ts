// Scripturile din cod/, citite ca text în momentul build-ului (Vite import.meta.glob cu ?raw).
const fisiere = import.meta.glob('../../cod/*.{py,R}', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

export function continutScript(numeFisier: string) {
  return fisiere[`../../cod/${numeFisier}`] ?? ''
}

export type Limbaj = 'python' | 'r'

export function limbajScript(numeFisier: string): Limbaj {
  return numeFisier.endsWith('.R') ? 'r' : 'python'
}
