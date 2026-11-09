import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { capitole, titluFaraNr } from '../data/capitole'
import Blocuri, { idSectiune } from '../components/Blocuri'
import Cod, { limbaj, sursa } from '../components/Cod'

export default function Capitol() {
  const { slug } = useParams()
  const i = capitole.findIndex((c) => c.slug === slug)
  const [tab, setTab] = useState<'analiza' | 'cod'>('analiza')
  if (i < 0) return <Navigate to="/" />
  const c = capitole[i], prev = capitole[i - 1], next = capitole[i + 1]
  const sectiuni = c.continut.blocuri.flatMap((b) => (b.tip === 'sectiune' ? [b.titlu] : []))
  return (
    <div className="mx-auto flex max-w-7xl gap-10 px-4 py-8 sm:px-8" key={slug}>
      <article className="min-w-0 max-w-4xl flex-1">
        <div className="mb-2 font-mono text-xs text-muted"><Link to="/" className="hover:text-cyan">dashboard</Link> / capitolul {c.nr}</div>
        <div className="flex items-start gap-4">
          <span className="font-mono text-5xl font-bold leading-none text-cyan/25">{String(c.nr).padStart(2, '0')}</span>
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{titluFaraNr(c)}</h1>
            <p className="mt-2 text-muted">{c.rezumat}</p>
          </div>
        </div>
        {c.scripturi.length > 0 && (
          <div className="mt-6 flex gap-1 border-b border-line">
            {(['analiza', 'cod'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`-mb-px border-b-2 px-4 py-2 text-sm transition ${tab === t ? 'border-cyan text-cyan' : 'border-transparent text-muted hover:text-text'}`}>
                {t === 'analiza' ? 'Analiza' : `Codul (${c.scripturi.length})`}
              </button>
            ))}
          </div>
        )}
        <div className="mt-4">
          {tab === 'analiza' ? <Blocuri blocuri={c.continut.blocuri} grafice={c.grafice} /> : (
            <>
              <p className="text-sm text-muted">Scripturile care produc cifrele și graficele din acest capitol. Cum se rulează: pagina <Link to="/cod" className="text-cyan hover:underline">Codul complet</Link>.</p>
              {c.scripturi.map((f) => <Cod key={f} cod={sursa(f)} lang={limbaj(f)} titlu={`cod/${f}`} />)}
            </>
          )}
        </div>
        <nav className="mt-14 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
          {prev ? <Link to={`/capitol/${prev.slug}`} className="rounded-lg border border-line p-3 hover:border-cyan/50"><div className="font-mono text-[11px] text-muted">← {String(prev.nr).padStart(2, '0')}</div><div className="text-white">{prev.scurt}</div></Link> : <span />}
          {next && <Link to={`/capitol/${next.slug}`} className="rounded-lg border border-line p-3 text-right hover:border-cyan/50"><div className="font-mono text-[11px] text-muted">{String(next.nr).padStart(2, '0')} →</div><div className="text-white">{next.scurt}</div></Link>}
        </nav>
      </article>
      {tab === 'analiza' && sectiuni.length > 0 && (
        <aside className="sticky top-8 hidden h-fit w-56 shrink-0 xl:block">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">Pe pagină</div>
          {sectiuni.map((s) => (
            <a key={s} href={`#${idSectiune(s)}`} onClick={(e) => { e.preventDefault(); document.getElementById(idSectiune(s))?.scrollIntoView({ behavior: 'smooth' }) }}
              className="block border-l border-line py-1 pl-3 text-xs text-muted hover:border-cyan hover:text-cyan">{s}</a>
          ))}
        </aside>
      )}
    </div>
  )
}
