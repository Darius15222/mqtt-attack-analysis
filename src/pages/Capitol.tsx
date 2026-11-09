// Pagina unui capitol: antet, tab-urile „Analiza” / „Codul”, conținutul, navigarea la capitolul anterior/următor
// și cuprinsul secțiunilor (doar pe ecrane late).
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { capitole, titluFaraNr, type Meta } from '../data/capitole'
import Blocuri from '../components/Blocuri'
import { idSectiune } from '../lib/sectiuni'
import Cod from '../components/Cod'
import { continutScript, limbajScript } from '../lib/scripturi'

type Tab = 'analiza' | 'cod'
const doiDigiti = (n: number) => String(n).padStart(2, '0')

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
  return (
    <div className="mt-6 flex gap-1 border-b border-line">
      {taburi.map((tab) => (
        <button
          key={tab.id}
          onClick={() => schimba(tab.id)}
          className={`-mb-px border-b-2 px-4 py-2 text-sm transition ${activ === tab.id ? 'border-cyan text-cyan' : 'border-transparent text-muted hover:text-text'}`}
        >
          {tab.text}
        </button>
      ))}
    </div>
  )
}

function CodulCapitolului({ capitol }: { capitol: Meta }) {
  return (
    <>
      <p className="text-sm text-muted">
        Scripturile care produc cifrele și graficele din acest capitol. Cum se rulează: pagina{' '}
        <Link to="/cod" className="text-cyan hover:underline">Codul complet</Link>.
      </p>
      {capitol.scripturi.map((fisier) => (
        <Cod key={fisier} cod={continutScript(fisier)} limbaj={limbajScript(fisier)} titlu={`cod/${fisier}`} />
      ))}
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

function CuprinsSectiuni({ sectiuni }: { sectiuni: string[] }) {
  function mergiLa(e: React.MouseEvent, sectiune: string) {
    e.preventDefault() // linkurile #... ar intra în conflict cu rutarea pe hash
    document.getElementById(idSectiune(sectiune))?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <aside className="sticky top-8 hidden h-fit w-56 shrink-0 xl:block">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">Pe pagină</div>
      {sectiuni.map((s) => (
        <a key={s} href={`#${idSectiune(s)}`} onClick={(e) => mergiLa(e, s)} className="block border-l border-line py-1 pl-3 text-xs text-muted hover:border-cyan hover:text-cyan">
          {s}
        </a>
      ))}
    </aside>
  )
}

// key={slug}: la trecerea pe alt capitol, pagina se creează din nou și pornește de la tab-ul „Analiza”
export default function Capitol() {
  const { slug } = useParams()
  const index = capitole.findIndex((c) => c.slug === slug)
  if (index < 0) return <Navigate to="/" />
  return <PaginaCapitol key={slug} index={index} />
}

function PaginaCapitol({ index }: { index: number }) {
  const [tab, setTab] = useState<Tab>('analiza')
  const capitol = capitole[index]
  const sectiuni = capitol.continut.blocuri.flatMap((b) => (b.tip === 'sectiune' ? [b.titlu] : []))
  const areCod = capitol.scripturi.length > 0

  return (
    <div className="mx-auto flex max-w-7xl gap-10 px-4 py-8 sm:px-8">
      <article className="min-w-0 max-w-4xl flex-1">
        <Antet capitol={capitol} />
        {areCod && <Taburi capitol={capitol} activ={tab} schimba={setTab} />}
        <div className="mt-4">
          {tab === 'analiza' ? <Blocuri blocuri={capitol.continut.blocuri} grafice={capitol.grafice} /> : <CodulCapitolului capitol={capitol} />}
        </div>
        <Navigare anterior={capitole[index - 1]} urmator={capitole[index + 1]} />
      </article>
      {tab === 'analiza' && sectiuni.length > 0 && <CuprinsSectiuni sectiuni={sectiuni} />}
    </div>
  )
}
