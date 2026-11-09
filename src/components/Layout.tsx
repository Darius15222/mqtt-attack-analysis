import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { capitole } from '../data/capitole'

function Meniu({ inchide }: { inchide?: () => void }) {
  const item = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center gap-3 rounded-md px-3 py-1.5 text-sm transition ${isActive ? 'bg-cyan/10 text-cyan' : 'text-muted hover:bg-white/[0.03] hover:text-text'}`
  return (
    <nav className="space-y-0.5" onClick={inchide}>
      <NavLink to="/" end className={item}><span className="w-5 font-mono text-xs">◉</span>Dashboard</NavLink>
      <div className="px-3 pt-5 pb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">Capitole</div>
      {capitole.map((c) => (
        <NavLink key={c.slug} to={`/capitol/${c.slug}`} className={item}>
          <span className="w-5 font-mono text-xs opacity-60 group-hover:opacity-100">{String(c.nr).padStart(2, '0')}</span>{c.scurt}
        </NavLink>
      ))}
      <div className="px-3 pt-5 pb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">Resurse</div>
      <NavLink to="/cod" className={item}><span className="w-5 font-mono text-xs">{'</>'}</span>Codul complet</NavLink>
      <a href="https://github.com/Darius15222/mqtt-attack-analysis" target="_blank" rel="noreferrer" className={item({ isActive: false })}><span className="w-5 font-mono text-xs">↗</span>GitHub</a>
    </nav>
  )
}

const Logo = () => (
  <NavLink to="/" className="flex items-center gap-2.5">
    <span className="grid h-8 w-8 place-items-center rounded-md border border-cyan/40 bg-cyan/10 font-mono text-sm font-bold text-cyan shadow-[0_0_16px_-4px] shadow-cyan/60">M</span>
    <span className="leading-tight"><span className="block font-mono text-sm font-bold text-white">mqtt<span className="text-cyan">//</span>attack</span><span className="block font-mono text-[10px] text-muted">analysis · MQTTset</span></span>
  </NavLink>
)

export default function Layout() {
  const [deschis, setDeschis] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-panel2/80 backdrop-blur lg:flex">
        <div className="border-b border-line px-5 py-4"><Logo /></div>
        <div className="flex-1 overflow-y-auto px-2 py-4"><Meniu /></div>
        <div className="border-t border-line px-5 py-3 font-mono text-[10px] text-muted/60">Data Mining · 2026</div>
      </aside>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-bg/85 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <button aria-label="Meniu" onClick={() => setDeschis(true)} className="rounded-md border border-line px-2.5 py-1.5 font-mono text-sm text-muted">☰</button>
      </header>
      {deschis && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setDeschis(false)}>
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-line bg-panel2 px-2 py-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 px-3"><Logo /></div>
            <Meniu inchide={() => setDeschis(false)} />
          </div>
        </div>
      )}
      <main className="lg:pl-64"><Outlet /></main>
    </div>
  )
}
