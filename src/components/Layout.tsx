// Scheletul comun al tuturor paginilor:
//   - pe ecrane late: meniu lateral fix în stânga;
//   - pe telefon: bară sus cu butonul ☰, care deschide meniul ca sertar (drawer).
// Pagina curentă se afișează în <Outlet />.
import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { capitole } from '../data/capitole'
import { doiDigiti } from '../lib/format'

const ADRESA_GITHUB = 'https://github.com/Darius15222/mqtt-attack-analysis'

const stilLink = (activ: boolean) =>
  `group flex items-center gap-3 rounded-md px-3 py-1.5 text-sm transition ${
    activ ? 'bg-cyan/10 text-cyan' : 'text-muted hover:bg-white/[0.03] hover:text-text'
  }`

function TitluGrup({ text }: { text: string }) {
  return <div className="px-3 pt-5 pb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{text}</div>
}

function Simbol({ text, estompat }: { text: string; estompat?: boolean }) {
  return <span className={`w-5 font-mono text-xs ${estompat ? 'text-muted group-hover:text-text' : ''}`}>{text}</span>
}

// `laClick` închide sertarul pe telefon după ce s-a ales o pagină.
function Meniu({ laClick }: { laClick?: () => void }) {
  return (
    <nav className="space-y-0.5" onClick={laClick}>
      <NavLink to="/" end className={({ isActive }) => stilLink(isActive)}>
        <Simbol text="◉" />Dashboard
      </NavLink>

      <TitluGrup text="Capitole" />
      {capitole.map((capitol) => (
        <NavLink key={capitol.slug} to={`/capitol/${capitol.slug}`} className={({ isActive }) => stilLink(isActive)}>
          <Simbol text={doiDigiti(capitol.nr)} estompat />
          {capitol.scurt}
        </NavLink>
      ))}

      <TitluGrup text="Resurse" />
      <NavLink to="/cod" className={({ isActive }) => stilLink(isActive)}>
        <Simbol text="</>" />Codul complet
      </NavLink>
      <a href={ADRESA_GITHUB} target="_blank" rel="noreferrer" className={stilLink(false)}>
        <Simbol text="↗" />GitHub
      </a>
    </nav>
  )
}

function Logo() {
  return (
    <NavLink to="/" className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-md border border-cyan/40 bg-cyan/10 font-mono text-sm font-bold text-cyan shadow-[0_0_16px_-4px] shadow-cyan/60">
        M
      </span>
      <span className="leading-tight">
        <span className="block font-mono text-sm font-bold text-white">mqtt<span className="text-cyan">//</span>attack</span>
        <span className="block font-mono text-[10px] text-muted">analysis · MQTTset</span>
      </span>
    </NavLink>
  )
}

function MeniuLateral() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-panel2/80 backdrop-blur lg:flex">
      <div className="border-b border-line px-5 py-4"><Logo /></div>
      <div className="flex-1 overflow-y-auto px-2 py-4"><Meniu /></div>
      <div className="border-t border-line px-5 py-3 font-mono text-[11px] text-muted">Data Mining · 2026</div>
    </aside>
  )
}

// La deschidere focusul intră în sertar (pe primul link); Tab nu iese din sertar cât e deschis.
function SertarTelefon({ inchide }: { inchide: () => void }) {
  const sertar = useRef<HTMLDivElement>(null)
  useEffect(() => sertar.current?.querySelector('a')?.focus(), [])

  function tineFocusul(e: React.KeyboardEvent) {
    if (e.key !== 'Tab' || !sertar.current) return
    const linkuri = sertar.current.querySelectorAll('a')
    const primul = linkuri[0], ultimul = linkuri[linkuri.length - 1]
    if (e.shiftKey && document.activeElement === primul) { e.preventDefault(); ultimul.focus() }
    else if (!e.shiftKey && document.activeElement === ultimul) { e.preventDefault(); primul.focus() }
  }

  return (
    <div className="fixed inset-0 z-40 lg:hidden" onClick={inchide}>
      <div className="absolute inset-0 bg-black/70" />
      {/* click-ul în sertar nu trebuie să ajungă la fundal (care l-ar închide) */}
      <div
        ref={sertar}
        role="dialog"
        aria-modal="true"
        aria-label="Meniu"
        onKeyDown={tineFocusul}
        className="absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-line bg-panel2 px-2 py-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 px-3"><Logo /></div>
        <Meniu laClick={inchide} />
      </div>
    </div>
  )
}

export default function Layout() {
  const [sertarDeschis, setSertarDeschis] = useState(false)
  const butonMeniu = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  // La închidere, focusul revine pe butonul ☰.
  function inchideSertarul() {
    setSertarDeschis(false)
    butonMeniu.current?.focus()
  }

  // Escape închide sertarul de pe telefon.
  useEffect(() => {
    if (!sertarDeschis) return
    const laTasta = (e: KeyboardEvent) => e.key === 'Escape' && inchideSertarul()
    addEventListener('keydown', laTasta)
    return () => removeEventListener('keydown', laTasta)
  }, [sertarDeschis])

  // La schimbarea paginii, începem de sus.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen">
      <MeniuLateral />
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-bg/85 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <button ref={butonMeniu} aria-label="Meniu" aria-expanded={sertarDeschis} onClick={() => setSertarDeschis(true)} className="rounded-md border border-line px-2.5 py-1.5 font-mono text-sm text-muted">
          ☰
        </button>
      </header>
      {sertarDeschis && <SertarTelefon inchide={inchideSertarul} />}
      <main className="lg:pl-64"><Outlet /></main>
    </div>
  )
}
