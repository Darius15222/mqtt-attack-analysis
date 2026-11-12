// Pagina unui capitol: antet, tab-urile „Analiza” / „Codul”, conținutul, navigarea la capitolul anterior/următor
// și cuprinsul secțiunilor (doar pe ecrane late).
import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { capitole, titluFaraNr, type Meta } from '../data/capitole'
import Blocuri from '../components/Blocuri'
import { idSectiune } from '../lib/sectiuni'
import Cod from '../components/Cod'
import { continutScript, limbajScript, TITLU_SCRIPT } from '../lib/scripturi'
import { doiDigiti } from '../lib/format'

type Tab = 'analiza' | 'cod'

function Antet({ capitol }: { capitol: Meta }) {
  return (
    <>
      <div className="mb-2 font-mono text-xs text-muted">
        <Link to="/" className="hover:text-cyan">dashboard</Link> / capitolul {capitol.nr}
      </div>
      <div className="flex items-start gap-4">
        <span className="font-mono text-5xl font-bold leading-none text-cyan/25">{doiDigiti(capitol.nr)}</span>
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{titluFaraNr(capitol)}</h1>
          <p className="mt-2 text-muted">{capitol.rezumat}</p>
        </div>
      </div>
    </>
  )
}

function Taburi({ capitol, activ, schimba }: { capitol: Meta; activ: Tab; schimba: (t: Tab) => void }) {
  const taburi: { id: Tab; text: string }[] = [
    { id: 'analiza', text: 'Analiza' },
    { id: 'cod', text: `Codul (${capitol.scripturi.length})` },
  ]
  // Săgețile stânga/dreapta trec la celălalt tab (sunt doar două), iar focusul îl urmează.
  function laTasta(e: React.KeyboardEvent) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    const urmator = activ === 'analiza' ? 'cod' : 'analiza'
    schimba(urmator)
    document.getElementById(`tab-${urmator}`)?.focus()
  }
  return (
    <div role="tablist" className="mt-6 flex gap-1 border-b border-line" onKeyDown={laTasta}>
      {taburi.map((tab) => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          role="tab"
          aria-selected={activ === tab.id}
          aria-controls="panou-capitol"
          tabIndex={activ === tab.id ? 0 : -1}
          onClick={() => schimba(tab.id)}
          className={`-mb-px border-b-2 px-4 py-2 text-sm transition ${activ === tab.id ? 'border-cyan text-cyan' : 'border-transparent text-muted hover:text-text'}`}
        >
          {tab.text}
        </button>
      ))}
    </div>
  )
}

// Liniile alese dintr-un script (numerotate de la 1), puse cap la cap: împreună formează un program complet.
function fragment(cod: string, intervale: [number, number][], rulare: string) {
  const linii = cod.split('\n')
  const bucati = intervale.map(([de, pana]) => linii.slice(de - 1, pana).join('\n').replace(/^\n+/, '').trimEnd())
  return [`# Rulare: ${rulare}`, ...bucati].join('\n\n') + '\n'
}

// Blocurile din docx, fără galeria pe care pe site o acoperă un grafic interactiv (vezi `faraGalerie` în capitole.ts)
function blocuriPeSite({ continut, faraGalerie }: Meta) {
  if (!faraGalerie) return continut.blocuri
  return continut.blocuri.filter((b) => !(b.tip === 'galerie' && b.imagini[0]?.src === faraGalerie.prima))
}

function CodulCapitolului({ capitol }: { capitol: Meta }) {
  return (
    <>
      <p className="text-sm text-muted">
        Scripturile care produc cifrele și graficele din acest capitol. Cum se rulează: pagina{' '}
        <Link to="/cod" className="text-cyan hover:underline">Codul complet</Link>.
      </p>
      {capitol.scripturi.map((fisier) => {
        const parte = capitol.fragmente?.[fisier]
        const cod = parte ? fragment(continutScript(fisier), parte.linii, parte.rulare) : continutScript(fisier)
        return <Cod key={fisier} cod={cod} limbaj={limbajScript(fisier)} titlu={parte?.titlu ?? TITLU_SCRIPT[fisier]} />
      })}
    </>
  )
}

function Navigare({ anterior, urmator }: { anterior?: Meta; urmator?: Meta }) {
  const card = 'rounded-lg border border-line p-3 hover:border-cyan/50'
  return (
    <nav className="mt-14 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
      {anterior ? (
        <Link to={`/capitol/${anterior.slug}`} className={card}>
          <div className="font-mono text-[11px] text-muted">← {doiDigiti(anterior.nr)}</div>
          <div className="text-white">{anterior.scurt}</div>
        </Link>
      ) : <span />}
      {urmator && (
        <Link to={`/capitol/${urmator.slug}`} className={`${card} text-right`}>
          <div className="font-mono text-[11px] text-muted">{doiDigiti(urmator.nr)} →</div>
          <div className="text-white">{urmator.scurt}</div>
        </Link>
      )}
    </nav>
  )
}

type Titlu = { text: string; parte: boolean } // parte = una din cele 5 părți; altfel o secțiune N.M

function CuprinsSectiuni({ slug, sectiuni }: { slug: string; sectiuni: Titlu[] }) {
  function mergiLa(e: React.MouseEvent, sectiune: string) {
    e.preventDefault() // linkurile #... ar intra în conflict cu rutarea pe hash
    document.getElementById(idSectiune(sectiune))?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <aside className="sticky top-8 hidden h-fit w-56 shrink-0 xl:block">
      <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Pe pagină</div>
      {sectiuni.map((s) => (
        <a
          key={s.text}
          href={`#/capitol/${slug}`} // un link copiat sau deschis în tab nou duce la capitol
          onClick={(e) => mergiLa(e, s.text)}
          className={`block border-l border-line py-1 text-xs hover:border-cyan hover:text-cyan ${s.parte ? 'pl-3 font-semibold text-text' : 'pl-6 text-muted'}`}
        >
          {s.text}
        </a>
      ))}
    </aside>
  )
}

// key={slug + key}: la orice navigare (și pe același capitol, din meniu) pagina pornește de la tab-ul „Analiza”
export default function Capitol() {
  const { slug } = useParams()
  const { key } = useLocation()
  const index = capitole.findIndex((c) => c.slug === slug)
  if (index < 0) return <Navigate to="/" />
  return <PaginaCapitol key={slug + key} index={index} />
}

function PaginaCapitol({ index }: { index: number }) {
  const [tab, setTab] = useState<Tab>('analiza')
  const capitol = capitole[index]
  const { state, key } = useLocation()

  // Un link spre o secțiune sau o referință („10.4”, „[14]”) trimite id-ul ei în state; derulăm la ea.
  // setTimeout: Layout derulează întâi pagina sus, la schimbarea capitolului.
  useEffect(() => {
    const tinta = (state as { tinta?: string } | null)?.tinta
    if (!tinta) return // linkurile cu țintă sunt doar în tab-ul „Analiza”, deci nu trebuie schimbat tab-ul
    const temporizator = setTimeout(() => document.getElementById(tinta)?.scrollIntoView(), 50)
    return () => clearTimeout(temporizator)
  }, [state, key])
  const sectiuni: Titlu[] = capitol.continut.blocuri.flatMap((b) =>
    b.tip === 'parte' || b.tip === 'sectiune' ? [{ text: b.titlu, parte: b.tip === 'parte' }] : [],
  )
  const areCod = capitol.scripturi.length > 0

  return (
    <div className="mx-auto flex max-w-7xl gap-10 px-4 py-8 sm:px-8">
      <article className="min-w-0 max-w-4xl flex-1">
        <Antet capitol={capitol} />
        {areCod && <Taburi capitol={capitol} activ={tab} schimba={setTab} />}
        <div className="mt-4" id="panou-capitol" role="tabpanel" aria-labelledby={`tab-${tab}`}>
          {tab === 'analiza' ? <Blocuri blocuri={blocuriPeSite(capitol)} grafice={capitol.grafice} /> : <CodulCapitolului capitol={capitol} />}
        </div>
        <Navigare anterior={capitole[index - 1]} urmator={capitole[index + 1]} />
      </article>
      <title>{`${capitol.scurt} · MQTTset`}</title>
      {tab === 'analiza' && sectiuni.length > 0 && <CuprinsSectiuni slug={capitol.slug} sectiuni={sectiuni} />}
    </div>
  )
}
