// Heatmap cu corelațiile Spearman, pe tot setul sau pe o singură clasă (cap. 7).
import { useState } from 'react'
import { CLASE } from '../../data/cifre'
import { formatNumar } from '../../lib/format'
import { AXA, TEMA } from '../../lib/tema'
import { useDateGrafic } from '../../lib/useDateGrafic'
import { Grafic, Panou } from './baza'

// O matrice de corelație: valorile sunt null acolo unde variabila e constantă (corelația nu se poate calcula).
type Matrice = { variabile: string[]; matrice: (number | null)[][] }

const TOT_SETUL = 'tot_setul'
const ROSU_ALBASTRU = ['#b2182b', '#ef8a62', '#1b2430', '#67a9cf', '#2166ac'] // -1 → 0 → +1

// Aceleași 13 variabile (numerice, ordinale, binare) și aceeași ordine ca în imaginile din docx;
// fișierul de date are și codurile variabilelor categoriale, care nu intră în corelație.
const VARIABILE = [
  'tcp.time_delta', 'tcp.len', 'mqtt.len', 'mqtt.kalive', 'mqtt.qos', 'mqtt.dupflag', 'mqtt.retain',
  'mqtt.conflag.cleansess', 'mqtt.conflag.passwd', 'mqtt.conflag.uname', 'mqtt.proto_len', 'mqtt.ver', 'mqtt.conack.val',
]
const GRI = '#3a4250' // variabilă constantă în clasa aleasă: corelația nu se poate calcula

export default function CorelatiiSpearman() {
  const toateMatricile = useDateGrafic<Record<string, Matrice>>('corelatii.json')
  const [clasaAleasa, setClasaAleasa] = useState(TOT_SETUL)
  if (!toateMatricile) return null

  const m = toateMatricile[clasaAleasa]
  const nume = VARIABILE
  const indici = VARIABILE.map((v) => m.variabile.indexOf(v))

  // ECharts vrea celulele ca [coloană, rând, valoare]; null = variabilă constantă (celulă gri, în seria a doua).
  const toate = indici.flatMap((i, rand) => indici.map((j, coloana) => [coloana, rand, m.matrice[i][j]] as const))
  const celule = toate.filter((c) => c[2] !== null)
  const constante = toate.filter((c) => c[2] === null).map(([coloana, rand]) => [coloana, rand, 0])

  const optiuni = {
    grid: { left: 150, right: 20, top: 10, bottom: 130 },
    xAxis: { type: 'category', data: nume, axisLabel: { ...AXA.etichetaMono, rotate: 50 } },
    yAxis: { type: 'category', data: nume, inverse: true, axisLabel: AXA.etichetaMono },
    visualMap: {
      min: -1,
      max: 1,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      itemWidth: 12,
      textStyle: { color: TEMA.textSters },
      seriesIndex: 0,
      inRange: { color: ROSU_ALBASTRU },
    },
    tooltip: {
      formatter: (p: { seriesIndex: number; value: [number, number, number] }) => {
        const [coloana, rand, r] = p.value
        return `${nume[rand]}<br/>${nume[coloana]}<br/><b>${p.seriesIndex === 1 ? 'constantă: nu se poate calcula' : `R = ${formatNumar(r, 2)}`}</b>`
      },
    },
    series: [
      {
        type: 'heatmap',
        data: celule,
        // cu prea multe variabile, cifrele din celule nu mai încap; rămân la hover
        label: { show: nume.length <= 14, fontSize: 9, color: '#e6edf3', formatter: (p: { value: number[] }) => formatNumar(p.value[2], 2) },
        itemStyle: { borderColor: TEMA.fundal, borderWidth: 1 },
        emphasis: { itemStyle: { borderColor: TEMA.cyan, borderWidth: 2 } },
      },
      { type: 'heatmap', data: constante, itemStyle: { color: GRI, borderColor: TEMA.fundal, borderWidth: 1 } },
    ],
  }

  return (
    <Panou titlu="Corelația Spearman" indicatie="alege clasa; gri = variabila e constantă în clasa aleasă">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {[TOT_SETUL, ...CLASE].map((clasa) => (
          <button
            key={clasa}
            onClick={() => setClasaAleasa(clasa)}
            className={`rounded-md border px-2.5 py-1 font-mono text-xs transition ${
              clasaAleasa === clasa ? 'border-cyan bg-cyan/15 text-cyan' : 'border-line text-muted hover:text-text'
            }`}
          >
            {clasa === TOT_SETUL ? 'tot setul' : clasa}
          </button>
        ))}
      </div>
      <Grafic inaltime={560} optiuni={optiuni} />
    </Panou>
  )
}
