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

// Păstrăm doar variabilele care au cel puțin o corelație calculabilă cu altă variabilă.
function variabileNeconstante(m: Matrice) {
  return m.variabile
    .map((_, i) => i)
    .filter((i) => m.matrice[i].some((valoare, j) => j !== i && valoare !== null))
}

export default function CorelatiiSpearman() {
  const toateMatricile = useDateGrafic<Record<string, Matrice>>('corelatii.json')
  const [clasaAleasa, setClasaAleasa] = useState(TOT_SETUL)
  if (!toateMatricile) return null

  const m = toateMatricile[clasaAleasa]
  const indici = variabileNeconstante(m)
  const nume = indici.map((i) => m.variabile[i])

  // ECharts vrea celulele ca [coloană, rând, valoare].
  const celule = indici
    .flatMap((i, rand) => indici.map((j, coloana) => [coloana, rand, m.matrice[i][j]]))
    .filter((celula) => celula[2] !== null)

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
      inRange: { color: ROSU_ALBASTRU },
    },
    tooltip: {
      formatter: (p: { value: [number, number, number] }) => {
        const [coloana, rand, r] = p.value
        return `${nume[rand]}<br/>${nume[coloana]}<br/><b>R = ${formatNumar(r, 2)}</b>`
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
    ],
  }

  return (
    <Panou titlu="Corelația Spearman" indicatie="alege clasa; variabilele constante în clasa aleasă nu apar">
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
