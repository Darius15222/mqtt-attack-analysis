import type { FelPas } from '../data/tipuri'
import Txt from './Txt'

const STIL: Record<FelPas, { culoare: string; simbol: string }> = {
  intrare: { culoare: 'var(--color-blue)', simbol: '→' },
  calcul: { culoare: 'var(--color-violet)', simbol: 'ƒ' },
  iesire: { culoare: 'var(--color-green)', simbol: '←' },
  decizie: { culoare: 'var(--color-amber)', simbol: '◆' },
}

// caseta Intrare / Calcul / Ieșire / Decizie
export default function Pas({ fel, eticheta, text }: { fel: FelPas; eticheta: string; text: string }) {
  const s = STIL[fel]
  return (
    <div className="relative my-3 rounded-lg border border-line bg-panel2 py-3 pl-12 pr-4" style={{ borderLeft: `3px solid ${s.culoare}` }}>
      <span className="absolute left-3 top-3 grid h-6 w-6 place-items-center rounded font-mono text-xs font-bold"
        style={{ color: s.culoare, background: `color-mix(in srgb, ${s.culoare} 14%, transparent)` }}>{s.simbol}</span>
      <div className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-widest" style={{ color: s.culoare }}>{eticheta}</div>
      <div className="leading-relaxed text-text"><Txt t={text} /></div>
    </div>
  )
}
