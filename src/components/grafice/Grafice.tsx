import { useState } from 'react'
import { CLASE, CULORI, confuzie, type Clasa } from '../../data/cifre'
import type { IdGrafic } from '../../data/tipuri'
import { Grafic, Panou, ro, useJson } from './echarts'

// 1) distribuția claselor
function Clase() {
  const d = useJson<{ clasa: Clasa; pachete: number }[]>('clase.json')
  if (!d) return null
  const tot = d.reduce((s, x) => s + x.pachete, 0)
  const r = [...d].reverse()
  return (
    <Panou titlu="Pachete pe clase" sub="treci cu mouse-ul peste bare">
      <Grafic inaltime={300} option={{
        grid: { left: 90, right: 110, top: 10, bottom: 30 },
        xAxis: { type: 'value', axisLabel: { color: '#8b98a9', formatter: (v: number) => ro(v) }, splitLine: { lineStyle: { color: '#1f2a37' } } },
        yAxis: { type: 'category', data: r.map((x) => x.clasa), axisLabel: { color: '#d7dee8', fontFamily: 'JetBrains Mono' }, axisLine: { lineStyle: { color: '#1f2a37' } } },
        tooltip: { trigger: 'item', formatter: (p: { name: string; value: number }) => `<b>${p.name}</b><br/>${ro(p.value)} pachete (${ro((100 * p.value) / tot, 2)}%)` },
        series: [{ type: 'bar', barWidth: '60%', data: r.map((x) => ({ value: x.pachete, itemStyle: { color: CULORI[x.clasa], borderRadius: [0, 4, 4, 0] } })),
          label: { show: true, position: 'right', color: '#d7dee8', fontFamily: 'JetBrains Mono', fontSize: 11, formatter: (p: { value: number }) => `${ro(p.value)}  ${ro((100 * p.value) / tot, 2)}%` } }],
      }} />
    </Panou>
  )
}

// 2) corelațiile Spearman, pe tot setul și pe clase
type Mat = { variabile: string[]; matrice: (number | null)[][] }
function Corelatii() {
  const d = useJson<Record<string, Mat>>('corelatii.json')
  const [cl, setCl] = useState('tot_setul')
  if (!d) return null
  const m = d[cl]
  const pastrate = m.variabile.map((_, i) => i).filter((i) => m.matrice[i].some((v, j) => j !== i && v !== null))
  const v = pastrate.map((i) => m.variabile[i])
  const date = pastrate.flatMap((i, a) => pastrate.map((j, b) => [b, a, m.matrice[i][j]])).filter((x) => x[2] !== null)
  return (
    <Panou titlu="Corelația Spearman" sub="alege clasa; variabilele constante în clasa aleasă nu apar">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {['tot_setul', ...CLASE].map((c) => (
          <button key={c} onClick={() => setCl(c)}
            className={`rounded-md border px-2.5 py-1 font-mono text-xs transition ${cl === c ? 'border-cyan bg-cyan/15 text-cyan' : 'border-line text-muted hover:text-text'}`}>
            {c === 'tot_setul' ? 'tot setul' : c}
          </button>
        ))}
      </div>
      <Grafic inaltime={560} option={{
        grid: { left: 150, right: 20, top: 10, bottom: 130 },
        xAxis: { type: 'category', data: v, axisLabel: { rotate: 50, color: '#8b98a9', fontSize: 10, fontFamily: 'JetBrains Mono' }, splitArea: { show: false } },
        yAxis: { type: 'category', data: v, inverse: true, axisLabel: { color: '#8b98a9', fontSize: 10, fontFamily: 'JetBrains Mono' } },
        visualMap: { min: -1, max: 1, calculable: true, orient: 'horizontal', left: 'center', bottom: 0, itemWidth: 12, textStyle: { color: '#8b98a9' },
          inRange: { color: ['#b2182b', '#ef8a62', '#1b2430', '#67a9cf', '#2166ac'] } },
        tooltip: { formatter: (p: { value: [number, number, number] }) => `${v[p.value[1]]}<br/>${v[p.value[0]]}<br/><b>R = ${ro(p.value[2], 2)}</b>` },
        series: [{ type: 'heatmap', data: date, label: { show: v.length <= 14, fontSize: 9, color: '#e6edf3', formatter: (p: { value: number[] }) => ro(p.value[2], 2) },
          itemStyle: { borderColor: '#0a0e14', borderWidth: 1 }, emphasis: { itemStyle: { borderColor: '#22d3ee', borderWidth: 2 } } }],
      }} />
    </Panou>
  )
}

// 3) matricea de confuzie (predicția pe rânduri, realitatea pe coloane)
function Confuzie() {
  const { tp, fp, fn, tn } = confuzie
  const n = tp + fp + fn + tn
  const metrici = [
    ['Accuracy', (tp + tn) / n, '(TP + TN) / N'],
    ['Sensitivity', tp / (tp + fn), 'TP / (TP + FN)'],
    ['Precision', tp / (tp + fp), 'TP / (TP + FP)'],
    ['F1', (2 * tp) / (2 * tp + fp + fn), '2·P·S / (P + S)'],
  ] as const
  const celule = [
    [0, 0, tp, 'TP', 'atac prezis atac'], [1, 0, fp, 'FP', 'normal prezis atac (alarmă falsă)'],
    [0, 1, fn, 'FN', 'atac prezis normal (atac ratat)'], [1, 1, tn, 'TN', 'normal prezis normal'],
  ] as const
  return (
    <Panou titlu="Matricea de confuzie, pe test" sub="rânduri = predicția, coloane = realitatea">
      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <Grafic inaltime={300} option={{
          grid: { left: 100, right: 10, top: 30, bottom: 10 },
          xAxis: { type: 'category', position: 'top', data: ['Atac real', 'Normal real'], axisLabel: { color: '#d7dee8' }, axisLine: { show: false }, axisTick: { show: false } },
          yAxis: { type: 'category', inverse: true, data: ['Prezis atac', 'Prezis normal'], axisLabel: { color: '#d7dee8' }, axisLine: { show: false }, axisTick: { show: false } },
          tooltip: { formatter: (p: { dataIndex: number }) => { const c = celule[p.dataIndex]; return `<b>${c[3]} = ${ro(c[2])}</b><br/>${c[4]}<br/>${ro((100 * c[2]) / n, 1)}% din test` } },
          series: [{ type: 'heatmap', data: celule.map((c) => ({ value: [c[0], c[1], c[2]], itemStyle: { color: c[3] === 'TP' || c[3] === 'TN' ? 'rgba(74,222,128,.22)' : 'rgba(248,113,113,.22)', borderColor: '#0a0e14', borderWidth: 4, borderRadius: 8 } })),
            label: { show: true, color: '#fff', fontFamily: 'JetBrains Mono', fontSize: 15, formatter: (p: { dataIndex: number }) => `${celule[p.dataIndex][3]}\n${ro(celule[p.dataIndex][2])}` } }],
        }} />
        <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
          {metrici.map(([k, v, f]) => (
            <div key={k} className="rounded-lg border border-line bg-panel2 px-3 py-2">
              <div className="flex items-baseline justify-between"><span className="text-xs text-muted">{k}</span><span className="font-mono text-lg text-cyan">{ro(v, 4)}</span></div>
              <div className="font-mono text-[10px] text-muted/70">{f}</div>
            </div>
          ))}
        </div>
      </div>
    </Panou>
  )
}

// 4) arborele de clasificare
type Nod = { id: number; ramura: string; n: number; atac: number; clase: Record<Clasa, number>; var?: string; p?: number; children?: Nod[] }
function Arbore() {
  const d = useJson<Nod>('arbore.json')
  if (!d) return null
  const scurt = (s: string) => s.replace(/0x0+([0-9a-f]{2})/g, '0x$1').replace('<=', '≤')
  // pe grafic, listele lungi de valori se scurtează (lista întreagă apare la hover)
  const eticheta = (s: string) => { const v = scurt(s).split(', '); return v.length > 3 ? `${v.slice(0, 2).join(', ')} … (${v.length} valori)` : v.join(', ') }
  const conv = (x: Nod): object => ({
    name: x.children ? x.var : x.atac >= 0.5 ? `atac ${ro(100 * x.atac, 1)}%` : `normal ${ro(100 * (1 - x.atac), 1)}%`,
    nod: x,
    value: x.n,
    label: { formatter: () => `${x.ramura ? `{r|${eticheta(x.ramura)}}\n` : ''}{n|#${x.id}} ${x.children ? `{v|${x.var}}` : x.atac >= 0.5 ? `{a|atac ${ro(100 * x.atac, 1)}%}` : `{o|normal ${ro(100 * (1 - x.atac), 1)}%}`}` },
    itemStyle: { color: x.children ? '#22d3ee' : x.atac >= 0.5 ? '#f87171' : '#4ade80', borderColor: '#0a0e14' },
    children: x.children?.map(conv),
  })
  return (
    <Panou titlu="Arborele de clasificare (ctree, maxdepth = 5)" sub="click pe un nod îl pliază; hover = detalii; trage și zoom cu rotița">
      <Grafic inaltime={900} option={{
        tooltip: { trigger: 'item', formatter: (p: { data: { nod: Nod } }) => {
          const x = p.data.nod
          const cl = CLASE.filter((c) => x.clase[c] > 0).map((c) => `<span style="color:${CULORI[c]}">●</span> ${c}: ${ro(x.clase[c])}`).join('<br/>')
          return `<b>Nodul ${x.id}</b>${x.ramura ? ` &nbsp;<span style="color:#8b98a9">${scurt(x.ramura)}</span>` : ''}<br/>${ro(x.n)} pachete de construcție, ${ro(100 * x.atac, 1)}% atac<br/>${x.var ? `împarte după <b>${x.var}</b> (p ${x.p! < 0.001 ? '< 0,001' : '= ' + ro(x.p!, 3)})<br/>` : ''}${cl}`
        } },
        series: [{ type: 'tree', data: [conv(d)], orient: 'LR', left: 60, right: 190, top: 20, bottom: 20, roam: true, symbolSize: 10, initialTreeDepth: -1,
          expandAndCollapse: true, animationDuration: 400,
          lineStyle: { color: '#2b3a4c', width: 1.2, curveness: 0.5 },
          label: { position: 'top', distance: 6, fontSize: 11, color: '#d7dee8', rich: {
            r: { color: '#8b98a9', fontSize: 10, fontFamily: 'JetBrains Mono', lineHeight: 14 }, n: { color: '#5b6b7f', fontFamily: 'JetBrains Mono', fontSize: 10 },
            v: { color: '#22d3ee', fontFamily: 'JetBrains Mono', fontWeight: 'bold' }, a: { color: '#f87171', fontWeight: 'bold' }, o: { color: '#4ade80', fontWeight: 'bold' } } },
          leaves: { label: { position: 'right', verticalAlign: 'middle', align: 'left' } } }],
      }} />
    </Panou>
  )
}

// 5) regulile de asociere pentru fiecare atac
type Regula = { stanga: string; atac: Clasa; pachete: number; support: number; confidence: number; lift: number }
function Reguli() {
  const d = useJson<Regula[]>('reguli.json')
  if (!d) return null
  const atacuri = CLASE.filter((c) => c !== 'legitimate')
  return (
    <Panou titlu="Regulile pentru fiecare atac (support minim 150 de pachete, confidence ≥ 0,5)" sub="click pe legendă ascunde un atac; mărimea punctului = lift">
      <Grafic inaltime={440} option={{
        legend: { top: 0, textStyle: { color: '#d7dee8', fontFamily: 'JetBrains Mono' }, data: atacuri },
        grid: { left: 60, right: 20, top: 40, bottom: 50 },
        xAxis: { type: 'log', name: 'pachete care respectă regula', nameLocation: 'middle', nameGap: 30, nameTextStyle: { color: '#8b98a9' }, axisLabel: { color: '#8b98a9', formatter: (v: number) => ro(v) }, splitLine: { lineStyle: { color: '#1f2a37' } } },
        yAxis: { type: 'value', name: 'confidence', min: 0.5, max: 1, nameTextStyle: { color: '#8b98a9' }, axisLabel: { color: '#8b98a9', formatter: (v: number) => ro(v, 1) }, splitLine: { lineStyle: { color: '#1f2a37' } } },
        tooltip: { trigger: 'item', formatter: (p: { data: { r: Regula } }) => { const r = p.data.r
          return `<span style="font-family:JetBrains Mono">${r.stanga.split(' & ').join('<br/>')}</span><br/>→ <b style="color:${CULORI[r.atac]}">${r.atac}</b><br/>${ro(r.pachete)} pachete · confidence ${ro(r.confidence, 3)} · lift ${ro(r.lift, 1)}` } },
        series: atacuri.map((a) => ({ name: a, type: 'scatter', itemStyle: { color: CULORI[a], opacity: 0.85, borderColor: '#0a0e14' },
          data: d.filter((r) => r.atac === a).map((r) => ({ value: [r.pachete, r.confidence], r, symbolSize: 6 + 3 * Math.sqrt(r.lift) })) })),
      }} />
    </Panou>
  )
}

const GRAFICE: Record<IdGrafic, () => React.ReactNode> = { clase: Clase, corelatii: Corelatii, confuzie: Confuzie, arbore: Arbore, reguli: Reguli }
export default function GraficInteractiv({ id }: { id: IdGrafic }) {
  const G = GRAFICE[id]
  return <G />
}
