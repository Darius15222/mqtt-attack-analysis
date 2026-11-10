// Punctul de intrare pentru graficele interactive.
// ECharts are ~600 kB, așa că se descarcă doar când o pagină are nevoie de un grafic (lazy loading).
import { lazy, Suspense } from 'react'
import type { IdGrafic } from '../../data/tipuri'

const Grafice = lazy(() => import('./Grafice'))

// Înălțimea fiecărui grafic plus titlul panoului: locul se rezervă de la început, ca pagina să nu sară
// când se încarcă ECharts și datele (altfel cuprinsul „Pe pagină” ar derula la locul greșit).
const INALTIME: Record<IdGrafic, number> = { clase: 390, corelatii: 720, confuzie: 540, arbore: 1060, reguli: 600 }

// Cât timp se descarcă, arată un dreptunghi gri pulsând în locul graficului.
const Incarcare = () => <div className="my-6 h-72 animate-pulse rounded-xl border border-line bg-panel" />

export default function GraficInteractiv({ id }: { id: IdGrafic }) {
  return (
    <div style={{ minHeight: INALTIME[id] }}>
      <Suspense fallback={<Incarcare />}>
        <Grafice id={id} />
      </Suspense>
    </div>
  )
}
