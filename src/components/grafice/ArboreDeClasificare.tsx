// Arborele de clasificare ctree (10.4), desenat de la stânga la dreapta, cu noduri care se pot plia.
import { CLASE, CULORI, type Clasa } from '../../data/cifre'
import { formatNumar } from '../../lib/format'
import { TEMA } from '../../lib/tema'
import { useDateGrafic } from '../../lib/useDateGrafic'
import { Grafic, Panou } from './baza'

// Un nod din public/date/arbore.json (scris de scripts/date_grafice.py din CSV-ul lui cod/09_cap10_arbori_ctree.R).
type Nod = {
  id: number
  ramura: string // condiția de pe ramura care duce la nod, de ex. "<= 0" sau "0x00000018"
  n: number // pachete în nod
  atac: number // proporția de atacuri în nod (0-1)
  clase: Record<Clasa, number>
  var?: string // variabila după care se împarte (doar la nodurile interne)
  p?: number // p ajustat (Bonferroni)
  children?: Nod[]
}

// "0x00000018" → "0x18", "<=" → "≤"
function condensat(conditie: string) {
  return conditie.replace(/0x0+([0-9a-f]{2})/g, '0x$1').replace('<=', '≤')
}

// Pe desen, listele lungi de valori se scurtează; lista întreagă apare la hover.
function etichetaRamura(conditie: string) {
  const valori = condensat(conditie).split(', ')
  return valori.length > 3 ? `${valori.slice(0, 2).join(', ')} … (${valori.length} valori)` : valori.join(', ')
}

const esteAtac = (nod: Nod) => nod.atac >= 0.5

function predictie(nod: Nod) {
  return esteAtac(nod) ? `atac ${formatNumar(100 * nod.atac, 1)}%` : `normal ${formatNumar(100 * (1 - nod.atac), 1)}%`
}

// Textul de lângă nod. {r|…}, {n|…} etc. sunt stilurile definite în `rich` mai jos.
function textNod(nod: Nod) {
  const ramura = nod.ramura ? `{r|${etichetaRamura(nod.ramura)}}\n` : ''
  const continut = nod.children ? `{v|${nod.var}}` : esteAtac(nod) ? `{a|${predictie(nod)}}` : `{o|${predictie(nod)}}`
  return `${ramura}{n|#${nod.id}} ${continut}`
}

function tooltipNod(nod: Nod) {
  const clase = CLASE.filter((c) => nod.clase[c] > 0)
    .map((c) => `<span style="color:${CULORI[c]}">●</span> ${c}: ${formatNumar(nod.clase[c])}`)
    .join('<br/>')
  const ramura = nod.ramura ? ` &nbsp;<span style="color:${TEMA.textSters}">${condensat(nod.ramura)}</span>` : ''
  // frunzele nu au p (nu se mai împart)
  const pValoare = nod.var ? (nod.p! < 0.001 ? '< 0,001' : '= ' + formatNumar(nod.p!, 3)) : ''
  const impartire = nod.var ? `împarte după <b>${nod.var}</b> (p ${pValoare})<br/>` : ''
  return `<b>Nodul ${nod.id}</b>${ramura}<br/>${formatNumar(nod.n)} pachete, ${formatNumar(100 * nod.atac, 1)}% atac<br/>${impartire}${clase}`
}

// Transformă un nod în formatul cerut de seria `tree` din ECharts.
function nodECharts(nod: Nod): object {
  const culoare = nod.children ? TEMA.cyan : esteAtac(nod) ? TEMA.rosu : TEMA.verde
  return {
    name: nod.children ? nod.var : predictie(nod),
    nod,
    value: nod.n,
    label: { formatter: () => textNod(nod) },
    itemStyle: { color: culoare, borderColor: TEMA.fundal },
    children: nod.children?.map(nodECharts),
  }
}

const STILURI_TEXT = {
  r: { color: TEMA.textSters, fontSize: 10, fontFamily: TEMA.fontMono, lineHeight: 14 }, // condiția ramurii
  n: { color: '#5b6b7f', fontSize: 10, fontFamily: TEMA.fontMono }, // numărul nodului
  v: { color: TEMA.cyan, fontFamily: TEMA.fontMono, fontWeight: 'bold' }, // variabila nodului intern
  a: { color: TEMA.rosu, fontWeight: 'bold' }, // frunză care prezice atac
  o: { color: TEMA.verde, fontWeight: 'bold' }, // frunză care prezice normal
}

export default function ArboreDeClasificare() {
  const radacina = useDateGrafic<Nod>('arbore.json')
  if (!radacina) return null

  const optiuni = {
    tooltip: { trigger: 'item', formatter: (p: { data: { nod: Nod } }) => tooltipNod(p.data.nod) },
    series: [
      {
        type: 'tree',
        data: [nodECharts(radacina)],
        orient: 'LR',
        left: 60,
        right: 190,
        top: 20,
        bottom: 20,
        roam: true, // tragere și zoom
        symbolSize: 10,
        initialTreeDepth: -1, // tot arborele deschis la început
        expandAndCollapse: true,
        animationDuration: 400,
        lineStyle: { color: '#2b3a4c', width: 1.2, curveness: 0.5 },
        label: { position: 'top', distance: 6, fontSize: 11, color: TEMA.text, rich: STILURI_TEXT },
        leaves: { label: { position: 'right', verticalAlign: 'middle', align: 'left' } },
      },
    ],
  }

  return (
    <Panou titlu="Arborele de clasificare (ctree, maxdepth = 5)" indicatie="click pe un nod îl pliază; hover = detalii; trage și zoom cu rotița">
      <Grafic inaltime={900} optiuni={optiuni} />
    </Panou>
  )
}
