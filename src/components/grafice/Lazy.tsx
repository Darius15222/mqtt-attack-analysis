import { lazy, Suspense } from 'react'
import type { IdGrafic } from '../../data/tipuri'

// ECharts (~700 kB) se încarcă doar pe paginile cu grafice interactive
const G = lazy(() => import('./Grafice'))

export default function GraficInteractiv({ id }: { id: IdGrafic }) {
  return (
    <Suspense fallback={<div className="my-6 h-72 animate-pulse rounded-xl border border-line bg-panel" />}>
      <G id={id} />
    </Suspense>
  )
}
