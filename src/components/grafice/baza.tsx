// Piesele comune ale graficelor interactive: înregistrarea ECharts, componenta <Grafic> și panoul în care stă fiecare grafic.
import EChartsCjs from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { BarChart, HeatmapChart, ScatterChart, TreeChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { TEMA } from '../../lib/tema'

// Înregistrăm doar tipurile de grafic folosite, ca pachetul descărcat să fie mai mic.
echarts.use([BarChart, HeatmapChart, ScatterChart, TreeChart, GridComponent, LegendComponent, TooltipComponent, VisualMapComponent, CanvasRenderer])

// echarts-for-react este un pachet CommonJS: după build, componenta poate veni împachetată în { default }.
const ReactECharts = (EChartsCjs as unknown as { default?: typeof EChartsCjs }).default ?? EChartsCjs

// Setări aplicate tuturor graficelor (fundal transparent, fonturi, tooltip întunecat).
const SETARI_COMUNE = {
  backgroundColor: 'transparent',
  textStyle: { fontFamily: TEMA.fontText, color: TEMA.text },
  tooltip: {
    backgroundColor: TEMA.panou,
    borderColor: TEMA.linie,
    textStyle: { color: TEMA.text, fontSize: 12 },
    extraCssText: 'box-shadow: 0 8px 24px rgba(0,0,0,.5); border-radius: 8px',
  },
}

type GraficProps = { optiuni: object; inaltime?: number }

export function Grafic({ optiuni, inaltime = 360 }: GraficProps) {
  return (
    <ReactECharts
      echarts={echarts}
      option={{ ...SETARI_COMUNE, ...optiuni }}
      style={{ height: inaltime, width: '100%' }}
      notMerge
    />
  )
}

type PanouProps = { titlu: string; indicatie?: string; children: React.ReactNode }

// Chenarul cu eticheta „interactiv”, titlul și o indicație despre cum se folosește graficul.
export function Panou({ titlu, indicatie, children }: PanouProps) {
  return (
    <div className="my-6 rounded-xl border border-cyan/25 bg-panel p-4 shadow-[0_0_40px_-20px] shadow-cyan/40">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="rounded bg-cyan/10 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-cyan">
          interactiv
        </span>
        <h4 className="font-semibold text-white">{titlu}</h4>
        {indicatie && <span className="text-xs text-muted">{indicatie}</span>}
      </div>
      {children}
    </div>
  )
}
