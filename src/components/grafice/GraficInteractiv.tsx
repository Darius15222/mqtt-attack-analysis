// Punctul de intrare pentru graficele interactive.
// ECharts are ~600 kB, așa că se descarcă doar când o pagină are nevoie de un grafic (lazy loading).
import { lazy, Suspense } from 'react'
import type { IdGrafic } from '../../data/tipuri'

const Grafice = lazy(() => import('./Grafice'))

// Cât timp se descarcă, arată un dreptunghi gri pulsând în locul graficului.
const Incarcare = () => <div className="my-6 h-72 animate-pulse rounded-xl border border-line bg-panel" />

export default function GraficInteractiv({ id }: { id: IdGrafic }) {
  return (
    <Suspense fallback={<Incarcare />}>
      <Grafice id={id} />
    </Suspense>
  )
}
