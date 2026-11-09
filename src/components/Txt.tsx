// Afișează un text din document și transformă în linkuri:
//   - adresele web (https://...) → link extern;
//   - trimiterile la capitole („capitolul 3”, „secțiunea 4”, „cap. 9”) → link spre pagina capitolului.
// Trimiterile la subsecțiuni („10.3”) rămân text, pentru că nu au pagină proprie.
import { Link } from 'react-router-dom'
import { capitole } from '../data/capitole'

const ADRESA_WEB = String.raw`(https?:\/\/[^\s)]+)`
const CUVANT_CAPITOL = String.raw`((?:capitolul|capitolele|secțiunea|cap\.)\s+)`
const NUMAR_CAPITOL = String.raw`(\d{1,2})(?![\d.,]\d)` // „10”, dar nu „10.3” sau „10,5”
const TRIMITERI = new RegExp(`${ADRESA_WEB}|${CUVANT_CAPITOL}${NUMAR_CAPITOL}`, 'g')

function LinkExtern({ adresa }: { adresa: string }) {
  return (
    <a href={adresa} target="_blank" rel="noreferrer" className="break-all text-cyan underline decoration-cyan/30 underline-offset-2 hover:decoration-cyan">
      {adresa}
    </a>
  )
}

function LinkCapitol({ numar }: { numar: string }) {
  const capitol = capitole.find((c) => c.nr === Number(numar))
  if (!capitol) return <>{numar}</>
  return <Link to={`/capitol/${capitol.slug}`} className="text-cyan hover:underline">{numar}</Link>
}

function RandCuLinkuri({ text }: { text: string }) {
  const bucati: React.ReactNode[] = []
  let pozitie = 0

  for (const potrivire of text.matchAll(TRIMITERI)) {
    const [intreg, adresa, cuvant, numar] = potrivire
    const start = potrivire.index!
    bucati.push(text.slice(pozitie, start))
    if (adresa) bucati.push(<LinkExtern key={start} adresa={adresa} />)
    else bucati.push(cuvant, <LinkCapitol key={start} numar={numar} />)
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
