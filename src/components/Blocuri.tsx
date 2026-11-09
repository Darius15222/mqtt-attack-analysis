// Transformă conținutul unui capitol (lista de blocuri din src/data/capNN.ts) în elemente pe pagină.
// Fiecare tip de bloc are componenta lui; graficele interactive se inserează după blocul indicat în capitole.ts.
import type { Bloc, IdGrafic } from '../data/tipuri'
import type { Meta } from '../data/capitole'
import Pas from './Pas'
import Tabel from './Tabel'
import Imagine from './Imagine'
import Txt from './Txt'
import GraficInteractiv from './grafice/GraficInteractiv'
import { idSectiune } from '../lib/sectiuni'

// Graficul se pune după blocul care se potrivește cu `dupa`: numele unei imagini, titlul unei secțiuni sau un cap de tabel.
function esteAncora(bloc: Bloc, dupa: string) {
  if (bloc.tip === 'imagine') return bloc.src === dupa
  if (bloc.tip === 'sectiune') return bloc.titlu === dupa
  if (bloc.tip === 'tabel') return bloc.antet.includes(dupa)
  return false
}

function TitluSectiune({ titlu }: { titlu: string }) {
  const [numar, ...restul] = titlu.split(' ')
  return (
    <h2 id={idSectiune(titlu)} className="mt-12 mb-4 scroll-mt-20 border-b border-line pb-2 text-xl font-semibold text-white">
      <span className="mr-2 font-mono text-cyan">{numar}</span>
      {restul.join(' ')}
    </h2>
  )
}

function Lista({ ordonata, start, elemente }: { ordonata: boolean; start: number; elemente: string[] }) {
  const Eticheta = ordonata ? 'ol' : 'ul'
  const marcaj = ordonata ? 'list-decimal marker:font-mono marker:text-cyan' : 'list-disc marker:text-cyan'
  return (
    <Eticheta start={start} className={`my-3 space-y-1.5 pl-6 leading-relaxed text-text/90 ${marcaj}`}>
      {elemente.map((element, i) => <li key={i} className="pl-1"><Txt t={element} /></li>)}
    </Eticheta>
  )
}

function UnBloc({ bloc }: { bloc: Bloc }) {
  switch (bloc.tip) {
    case 'sectiune':
      return <TitluSectiune titlu={bloc.titlu} />
    case 'subtitlu':
      return <h3 className="mt-6 mb-2 font-semibold text-white">{bloc.text}</h3>
    case 'pas':
      return <Pas fel={bloc.fel} eticheta={bloc.eticheta} text={bloc.text} />
    case 'text':
      return (
        <p className="my-3 leading-relaxed text-text/90">
          {bloc.eticheta && <span className="mr-1 font-semibold text-white">{bloc.eticheta}:</span>}
          <Txt t={bloc.text} />
        </p>
      )
    case 'lista':
      return <Lista ordonata={bloc.ordonata} start={bloc.start} elemente={bloc.elemente} />
    case 'tabel':
      return <Tabel antet={bloc.antet} randuri={bloc.randuri} />
    case 'imagine':
      return <Imagine src={bloc.src} legenda={bloc.legenda} />
    case 'galerie':
      return (
        <div className="my-5 grid gap-4 sm:grid-cols-2">
          {bloc.imagini.map((imagine) => <Imagine key={imagine.src} src={imagine.src} legenda={imagine.legenda} mic />)}
        </div>
      )
    case 'cod': // fragmentele scurte de cod din document (cele lungi sunt în tab-ul „Codul”)
      return <pre className="my-4 overflow-x-auto rounded-lg border border-line bg-[#0d1117] p-3 font-mono text-[12.5px] leading-relaxed text-green/90">{bloc.text}</pre>
    case 'grafic':
      return <GraficInteractiv id={bloc.id} />
  }
}

type BlocuriProps = { blocuri: Bloc[]; grafice?: Meta['grafice'] }

export default function Blocuri({ blocuri, grafice = [] }: BlocuriProps) {
  return (
    <>
      {blocuri.map((bloc, i) => (
        <div key={i}>
          <UnBloc bloc={bloc} />
          {grafice
            .filter((grafic) => esteAncora(bloc, grafic.dupa))
            .map((grafic: { id: IdGrafic }) => <GraficInteractiv key={grafic.id} id={grafic.id} />)}
        </div>
      ))}
    </>
  )
}
