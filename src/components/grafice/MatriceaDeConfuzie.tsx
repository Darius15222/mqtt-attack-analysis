// Matricea de confuzie a arborelui de clasificare pe setul de test, plus metricile calculate din ea (10.5).
// Așezarea e cea din document: predicția pe rânduri, realitatea pe coloane.
import { confuzie } from '../../data/cifre'
import { formatNumar, formatProcent } from '../../lib/format'
import { TEMA } from '../../lib/tema'
import { Grafic, Panou } from './baza'

const { tp, fp, fn, tn } = confuzie
const N = tp + fp + fn + tn

const METRICI = [
  { nume: 'Accuracy', valoare: (tp + tn) / N, formula: '(TP + TN) / N' },
  { nume: 'Sensitivity', valoare: tp / (tp + fn), formula: 'TP / (TP + FN)' },
  { nume: 'Precision', valoare: tp / (tp + fp), formula: 'TP / (TP + FP)' },
  { nume: 'F1', valoare: (2 * tp) / (2 * tp + fp + fn), formula: '2·P·S / (P + S)' },
]

// coloana 0 = atac real, 1 = normal real; rândul 0 = prezis atac, 1 = prezis normal
const CELULE = [
  { coloana: 0, rand: 0, numar: tp, cod: 'TP', sens: 'atac prezis atac', corect: true },
  { coloana: 1, rand: 0, numar: fp, cod: 'FP', sens: 'normal prezis atac (alarmă falsă)', corect: false },
  { coloana: 0, rand: 1, numar: fn, cod: 'FN', sens: 'atac prezis normal (atac ratat)', corect: false },
  { coloana: 1, rand: 1, numar: tn, cod: 'TN', sens: 'normal prezis normal', corect: true },
]

const etichetaAxa = { color: TEMA.text }
const faraLinii = { axisLine: { show: false }, axisTick: { show: false } }

const OPTIUNI = {
  grid: { left: 100, right: 10, top: 30, bottom: 10 },
  xAxis: { type: 'category', position: 'top', data: ['Atac real', 'Normal real'], axisLabel: etichetaAxa, ...faraLinii },
  yAxis: { type: 'category', inverse: true, data: ['Prezis atac', 'Prezis normal'], axisLabel: etichetaAxa, ...faraLinii },
  tooltip: {
    formatter: (p: { dataIndex: number }) => {
      const c = CELULE[p.dataIndex]
      return `<b>${c.cod} = ${formatNumar(c.numar)}</b><br/>${c.sens}<br/>${formatProcent(c.numar, N)} din test`
    },
  },
  series: [
    {
      type: 'heatmap',
      data: CELULE.map((c) => ({
        value: [c.coloana, c.rand, c.numar],
        itemStyle: {
          color: c.corect ? 'rgba(74,222,128,.22)' : 'rgba(248,113,113,.22)', // verde = corect, roșu = greșit
          borderColor: TEMA.fundal,
          borderWidth: 4,
          borderRadius: 8,
        },
      })),
      label: {
        show: true,
        color: '#fff',
        fontFamily: TEMA.fontMono,
        fontSize: 15,
        formatter: (p: { dataIndex: number }) => `${CELULE[p.dataIndex].cod}\n${formatNumar(CELULE[p.dataIndex].numar)}`,
      },
    },
  ],
}

export default function MatriceaDeConfuzie() {
  return (
    <Panou titlu="Matricea de confuzie, pe test" indicatie="rânduri = predicția, coloane = realitatea">
      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <Grafic inaltime={300} optiuni={OPTIUNI} />
        <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
          {METRICI.map((m) => (
            <div key={m.nume} className="rounded-lg border border-line bg-panel2 px-3 py-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted">{m.nume}</span>
                <span className="font-mono text-lg text-cyan">{formatNumar(m.valoare, 4)}</span>
              </div>
              <div className="font-mono text-[10px] text-muted/70">{m.formula}</div>
            </div>
          ))}
        </div>
      </div>
    </Panou>
  )
}
