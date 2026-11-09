import { useEffect, useState } from 'react'
import EChartsMod from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { BarChart, HeatmapChart, TreeChart, ScatterChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, VisualMapComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// pachetul e CommonJS: la build, exportul implicit poate veni împachetat în { default }
const ReactEChartsCore = ((EChartsMod as unknown as { default?: typeof EChartsMod }).default ?? EChartsMod)

echarts.use([BarChart, HeatmapChart, TreeChart, ScatterChart, GridComponent, TooltipComponent, VisualMapComponent, LegendComponent, CanvasRenderer])

export const ro = (v: number, d = 0) => v.toLocaleString('ro-RO', { minimumFractionDigits: d, maximumFractionDigits: d })

export const baza = {
  backgroundColor: 'transparent',
  textStyle: { fontFamily: 'Inter, sans-serif', color: '#d7dee8' },
  tooltip: { backgroundColor: '#0d131b', borderColor: '#1f2a37', textStyle: { color: '#d7dee8', fontSize: 12 }, extraCssText: 'box-shadow:0 8px 24px rgba(0,0,0,.5);border-radius:8px' },
}

export function Grafic({ option, inaltime = 360 }: { option: object; inaltime?: number }) {
  return <ReactEChartsCore echarts={echarts} option={{ ...baza, ...option }} style={{ height: inaltime, width: '100%' }} notMerge />
}

export function useJson<T>(f: string) {
  const [d, setD] = useState<T | null>(null)
  useEffect(() => { fetch(`${import.meta.env.BASE_URL}date/${f}`).then((r) => r.json()).then(setD) }, [f])
  return d
}

// panoul în care stă un grafic interactiv
export function Panou({ titlu, sub, children }: { titlu: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-cyan/25 bg-panel p-4 shadow-[0_0_40px_-20px] shadow-cyan/40">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="rounded bg-cyan/10 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-cyan">interactiv</span>
        <h4 className="font-semibold text-white">{titlu}</h4>
        {sub && <span className="text-xs text-muted">{sub}</span>}
      </div>
      {children}
    </div>
  )
}
