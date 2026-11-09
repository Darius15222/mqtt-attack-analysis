// Bare orizontale: câte pachete are fiecare clasă (cap. 1).
import { CULORI, type Clasa } from '../../data/cifre'
import { formatNumar, formatProcent } from '../../lib/format'
import { AXA, TEMA } from '../../lib/tema'
import { useDateGrafic } from '../../lib/useDateGrafic'
import { Grafic, Panou } from './baza'

type RandClasa = { clasa: Clasa; pachete: number }

export default function DistributiaClaselor() {
  const clase = useDateGrafic<RandClasa[]>('clase.json')
  if (!clase) return null

  const total = clase.reduce((suma, rand) => suma + rand.pachete, 0)
  // ECharts desenează categoriile de jos în sus; inversăm ca legitimate să fie sus.
  const deSusInJos = [...clase].reverse()

  const optiuni = {
    grid: { left: 90, right: 110, top: 10, bottom: 30 },
    xAxis: {
      type: 'value',
      axisLabel: { ...AXA.eticheta, formatter: (v: number) => formatNumar(v) },
      splitLine: AXA.grila,
    },
    yAxis: {
      type: 'category',
      data: deSusInJos.map((rand) => rand.clasa),
      axisLabel: { color: TEMA.text, fontFamily: TEMA.fontMono },
      axisLine: { lineStyle: { color: TEMA.linie } },
    },
    tooltip: {
      trigger: 'item',
      formatter: (p: { name: string; value: number }) =>
        `<b>${p.name}</b><br/>${formatNumar(p.value)} pachete (${formatProcent(p.value, total, 2)})`,
    },
    series: [
      {
        type: 'bar',
        barWidth: '60%',
        data: deSusInJos.map((rand) => ({
          value: rand.pachete,
          itemStyle: { color: CULORI[rand.clasa], borderRadius: [0, 4, 4, 0] },
        })),
        label: {
          show: true,
          position: 'right',
          color: TEMA.text,
          fontFamily: TEMA.fontMono,
          fontSize: 11,
          formatter: (p: { value: number }) => `${formatNumar(p.value)}  ${formatProcent(p.value, total, 2)}`,
        },
      },
    ],
  }

  return (
    <Panou titlu="Pachete pe clase" indicatie="treci cu mouse-ul peste bare">
      <Grafic inaltime={300} optiuni={optiuni} />
    </Panou>
  )
}
