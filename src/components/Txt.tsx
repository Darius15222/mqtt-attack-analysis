// Afișează un text din document și transformă în linkuri:
//   - adresele web (https://...) → link extern;
//   - trimiterile la capitole, și în liste („capitolul 3”, „capitolele 7, 10 și 13”, „cap. 9”, „secțiunea 10.2”);
//   - subsecțiunile scrise singure („8.1”, „din 10.4”), doar dacă secțiunea există;
//   - referințele bibliografice („[14]”, „[6, 7]”), doar dacă toate numerele există în liste: „[0, 13]” e un interval.
// Trimiterile la o secțiune sau la o referință deschid capitolul și derulează la ea (vezi Capitol.tsx).
import { Link } from 'react-router-dom'
import { capitole } from '../data/capitole'
import { idSectiune } from '../lib/sectiuni'

// id-urile tuturor secțiunilor („s-10-4”), ca să nu linkăm numere care doar seamănă cu o secțiune („0.0”)
const SECTIUNI = new Set(capitole.flatMap((c) => c.continut.blocuri.flatMap((b) => (b.tip === 'sectiune' ? [idSectiune(b.titlu)] : []))))

// referința N → slug-ul capitolului în care e lista ei (articolele în cap. 2)
const REFERINTA_IN = new Map(
  capitole.flatMap((c) =>
    c.continut.blocuri.flatMap((b) => (b.tip === 'lista' && b.ordonata ? b.elemente.map((_, i) => [String(b.start + i), c.slug] as const) : [])),
  ),
)

// Un număr de capitol („10”) sau de secțiune („10.2”), dar nu începutul unui număr mai lung („10,5”, „1.584”, „3.1.1”).
const NUMAR = String.raw`\d{1,2}(?:\.\d)?(?!\d|[.,]\d)`
const SEPARATOR = String.raw`(?:,\s*|\s+și\s+|\s*-\s*)`

const ADRESA_WEB = String.raw`(https?:\/\/[^\s)]+)`
const CU_CUVANT = String.raw`((?:capitolul|capitolele|secțiunea|secțiunile|cap\.)\s+)(${NUMAR}(?:${SEPARATOR}${NUMAR})*)`
const SECTIUNE_SINGURA = String.raw`(?<![\d.,])(\d{1,2}\.\d)(?!\d|[.,]\d)`
const REFERINTE = String.raw`\[(\d{1,2}(?:,\s*\d{1,2})*)\]`
const TRIMITERI = new RegExp(`${ADRESA_WEB}|${CU_CUVANT}|${SECTIUNE_SINGURA}|${REFERINTE}`, 'g')

const stilLink = 'text-cyan underline decoration-cyan/30 underline-offset-2 hover:decoration-cyan'

function LinkExtern({ adresa }: { adresa: string }) {
  return (
    <a href={adresa} target="_blank" rel="noreferrer" className="break-all text-cyan underline decoration-cyan/30 underline-offset-2 hover:decoration-cyan">
      {adresa}
    </a>
  )
}

// „10” → capitolul 10; „10.4” → capitolul 10, derulat la secțiunea 10.4 (dacă există).
function LinkNumar({ numar }: { numar: string }) {
  const [nrCapitol] = numar.split('.')
  const capitol = capitole.find((c) => c.nr === Number(nrCapitol))
  const sectiune = numar.includes('.') ? idSectiune(numar) : undefined
  if (!capitol || (sectiune && !SECTIUNI.has(sectiune))) return <>{numar}</>
  return <Link to={`/capitol/${capitol.slug}`} state={{ tinta: sectiune }} className={stilLink}>{numar}</Link>
}

function LinkReferinta({ numar }: { numar: string }) {
  return <Link to={`/capitol/${REFERINTA_IN.get(numar)}`} state={{ tinta: `ref-${numar}` }} className={stilLink}>{numar}</Link>
}

// „7, 10 și 13” sau „8-11” → linkuri separate, cu separatorii păstrați între ele.
function ListaDeLinkuri({ text, Componenta }: { text: string; Componenta: typeof LinkNumar }) {
  return <>{text.split(/(,\s*|\s+și\s+|\s*-\s*)/).map((bucata, i) => (i % 2 ? bucata : <Componenta key={i} numar={bucata} />))}</>
}

function RandCuLinkuri({ text }: { text: string }) {
  const bucati: React.ReactNode[] = []
  let pozitie = 0

  for (const potrivire of text.matchAll(TRIMITERI)) {
    const [intreg, adresa, cuvant, numere, sectiune, referinte] = potrivire
    if (referinte && !referinte.split(/,\s*/).every((n) => REFERINTA_IN.has(n))) continue
    const start = potrivire.index!
    bucati.push(text.slice(pozitie, start))
    if (adresa) bucati.push(<LinkExtern key={start} adresa={adresa} />)
    else if (cuvant) bucati.push(cuvant, <ListaDeLinkuri key={start} text={numere} Componenta={LinkNumar} />)
    else if (sectiune) bucati.push(<LinkNumar key={start} numar={sectiune} />)
    else bucati.push('[', <ListaDeLinkuri key={start} text={referinte} Componenta={LinkReferinta} />, ']')
    pozitie = start + intreg.length
  }
  bucati.push(text.slice(pozitie))

  return <>{bucati}</>
}

// Celulele de tabel cu mai multe paragrafe vin cu „\n” între ele; le păstrăm pe rânduri separate.
export default function Txt({ t }: { t: string }) {
  return (
    <>
      {t.split('\n').map((rand, i) => (
        <span key={i}>
          {i > 0 && <br />}
          <RandCuLinkuri text={rand} />
        </span>
      ))}
    </>
  )
}
