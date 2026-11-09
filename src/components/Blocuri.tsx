import type { Bloc, IdGrafic } from '../data/tipuri'
import Pas from './Pas'
import Tabel from './Tabel'
import Imagine from './Imagine'
import Txt from './Txt'
import GraficInteractiv from './grafice/Lazy'

export const idSectiune = (t: string) => 's-' + t.split(' ')[0].replace(/\./g, '-')

function potriveste(b: Bloc, dupa: string) {
  if (b.tip === 'imagine') return b.src === dupa
  if (b.tip === 'sectiune') return b.titlu === dupa
  if (b.tip === 'tabel') return b.antet.includes(dupa)
  return false
}

function Unul({ b }: { b: Bloc }) {
  switch (b.tip) {
    case 'sectiune':
      return <h2 id={idSectiune(b.titlu)} className="mt-12 mb-4 scroll-mt-20 border-b border-line pb-2 text-xl font-semibold text-white"><span className="mr-2 font-mono text-cyan">{b.titlu.split(' ')[0]}</span>{b.titlu.split(' ').slice(1).join(' ')}</h2>
    case 'subtitlu':
      return <h3 className="mt-6 mb-2 font-semibold text-white">{b.text}</h3>
    case 'pas':
      return <Pas fel={b.fel} eticheta={b.eticheta} text={b.text} />
    case 'text':
      return (
        <p className="my-3 leading-relaxed text-text/90">
          {b.eticheta && <span className="mr-1 font-semibold text-white">{b.eticheta}:</span>}
          <Txt t={b.text} />
        </p>
      )
    case 'lista': {
      const L = b.ordonata ? 'ol' : 'ul'
      return (
        <L start={b.start} className={`my-3 space-y-1.5 pl-6 leading-relaxed text-text/90 ${b.ordonata ? 'list-decimal marker:font-mono marker:text-cyan' : 'list-disc marker:text-cyan'}`}>
          {b.elemente.map((e, i) => <li key={i} className="pl-1"><Txt t={e} /></li>)}
        </L>
      )
    }
    case 'tabel':
      return <Tabel antet={b.antet} randuri={b.randuri} />
    case 'imagine':
      return <Imagine src={b.src} legenda={b.legenda} />
    case 'galerie':
      return (
        <div className="my-5 grid gap-4 sm:grid-cols-2">
          {b.imagini.map((im) => <Imagine key={im.src} src={im.src} legenda={im.legenda} mic />)}
        </div>
      )
    case 'cod':
      return <pre className="my-4 overflow-x-auto rounded-lg border border-line bg-[#0d1117] p-3 font-mono text-[12.5px] leading-relaxed text-green/90">{b.text}</pre>
    case 'grafic':
      return <GraficInteractiv id={b.id} />
  }
}

export default function Blocuri({ blocuri, grafice = [] }: { blocuri: Bloc[]; grafice?: { id: IdGrafic; dupa: string }[] }) {
  return (
    <>
      {blocuri.map((b, i) => (
        <div key={i}>
          <Unul b={b} />
          {grafice.filter((g) => potriveste(b, g.dupa)).map((g) => <GraficInteractiv key={g.id} id={g.id} />)}
        </div>
      ))}
    </>
  )
}
