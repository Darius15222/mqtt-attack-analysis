// Regulile de asociere pentru fiecare atac (11.4): câte pachete respectă regula (x) și cât de sigură e (confidence, y).
import { CLASE, CULORI, type Clasa } from '../../data/cifre'
import { formatNumar } from '../../lib/format'
import { AXA, TEMA } from '../../lib/tema'
import { useDateGrafic } from '../../lib/useDateGrafic'
import { Grafic, Panou } from './baza'

// O regulă din public/date/reguli.json: „stanga” → atac
type Regula = { stanga: string; atac: Clasa; pachete: number; support: number; confidence: number; lift: number }

const ATACURI = CLASE.filter((clasa) => clasa !== 'legitimate')

function tooltipRegula(r: Regula) {
  const conditii = r.stanga.split(' & ').join('<br/>')
  return `<span style="font-family:${TEMA.fontMono}">${conditii}</span><br/>`
    + `→ <b style="color:${CULORI[r.atac]}">${r.atac}</b><br/>`
    + `${formatNumar(r.pachete)} pachete · confidence ${formatNumar(r.confidence, 3)} · lift ${formatNumar(r.lift, 1)}`
}

// Punctele mai mari = lift mai mare (radical, ca flood, cu lift 540, să nu acopere tot graficul).
const marimePunct = (lift: number) => 6 + 3 * Math.sqrt(lift)

export default function ReguliDeAsociere() {
  const reguli = useDateGrafic<Regula[]>('reguli.json')
  if (!reguli) return null

  const optiuni = {
    legend: { top: 0, textStyle: { color: TEMA.text, fontFamily: TEMA.fontMono }, data: ATACURI },
    grid: { left: 60, right: 20, top: 40, bottom: 50 },
    xAxis: {
      type: 'log', // de la sute la zeci de mii de pachete
      name: 'pachete care respectă regula',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: AXA.eticheta,
      axisLabel: { ...AXA.eticheta, formatter: (v: number) => formatNumar(v) },
      splitLine: AXA.grila,
    },
    yAxis: {
      type: 'value',
      name: 'confidence',
      min: 0.5,
      max: 1,
      nameTextStyle: AXA.eticheta,
      axisLabel: { ...AXA.eticheta, formatter: (v: number) => formatNumar(v, 1) },
      splitLine: AXA.grila,
    },
    tooltip: { trigger: 'item', formatter: (p: { data: { regula: Regula } }) => tooltipRegula(p.data.regula) },
    // o serie pe atac, ca legenda să poată ascunde fiecare atac
    series: ATACURI.map((atac) => ({
      name: atac,
      type: 'scatter',
      itemStyle: { color: CULORI[atac], opacity: 0.85, borderColor: TEMA.fundal },
      data: reguli
        .filter((r) => r.atac === atac)
        .map((r) => ({ value: [r.pachete, r.confidence], regula: r, symbolSize: marimePunct(r.lift) })),
    })),
  }

  return (
    <Panou
      titlu="Regulile pentru fiecare atac (support minim 150 de pachete, confidence ≥ 0,5)"
      indicatie="click pe legendă ascunde un atac; mărimea punctului = lift"
    >
      <Grafic inaltime={440} optiuni={optiuni} />
    </Panou>
  )
}
