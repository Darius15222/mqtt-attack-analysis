// Transformă conținutul unui capitol (lista de blocuri din src/data/capNN.ts) în elemente pe pagină.
// Blocurile se grupează pe cele 5 părți ale capitolului (Ce facem și de ce, Ipoteza, Pașii, Demonstrația, Concluzia).
// Fiecare tip de bloc are componenta lui; graficele interactive se inserează după blocul indicat în capitole.ts.
import type { Bloc } from '../data/tipuri'
import type { Meta } from '../data/capitole'
import Pas from './Pas'
import Tabel from './Tabel'
import Imagine from './Imagine'
import Txt from './Txt'
import GraficInteractiv from './grafice/GraficInteractiv'
import { idSectiune } from '../lib/sectiuni'

// Graficul se pune după blocul care se potrivește cu `dupa`: numele unei imagini, titlul unei secțiuni,
// un cap de tabel sau începutul unui paragraf.
function esteAncora(bloc: Bloc, dupa: string) {
  if (bloc.tip === 'imagine') return bloc.src === dupa
  if (bloc.tip === 'sectiune') return bloc.titlu === dupa
  if (bloc.tip === 'tabel') return bloc.antet.includes(dupa)
  if (bloc.tip === 'text') return bloc.text.startsWith(dupa)
  return false
}

function TitluSectiune({ titlu }: { titlu: string }) {
  const [numar, ...restul] = titlu.split(' ')
  return (
    <h3 id={idSectiune(titlu)} className="mt-10 mb-4 scroll-mt-20 border-b border-line pb-2 text-xl font-semibold text-white">
      <span className="mr-2 font-mono text-cyan">{numar}</span>
      {restul.join(' ')}
    </h3>
  )
}

// Listele numerotate sunt referințele (articolele din cap. 2);
// fiecare primește id-ul „ref-N”, la care duc trimiterile „[N]” din text.
function Lista({ ordonata, start, elemente }: { ordonata: boolean; start: number; elemente: string[] }) {
  const Eticheta = ordonata ? 'ol' : 'ul'
  const marcaj = ordonata ? 'list-decimal marker:font-mono marker:text-cyan' : 'list-disc marker:text-cyan'
  return (
    <Eticheta start={start} className={`my-3 space-y-1.5 pl-6 leading-relaxed text-text/90 ${marcaj}`}>
      {elemente.map((element, i) => (
        <li key={i} id={ordonata ? `ref-${start + i}` : undefined} className="scroll-mt-20 pl-1"><Txt t={element} /></li>
      ))}
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
      return <Pas {...bloc} />
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
      return <Imagine {...bloc} />
    case 'galerie':
      return (
        <div className="my-5 grid gap-4 sm:grid-cols-2">
          {bloc.imagini.map((imagine) => <Imagine key={imagine.src} {...imagine} mic />)}
        </div>
      )
    case 'cod': // fragmentele scurte de cod din document (cele lungi sunt în tab-ul „Codul”)
      return <pre className="my-4 overflow-x-auto rounded-lg border border-line bg-[#0d1117] p-3 font-mono text-[12.5px] leading-relaxed text-green/90">{bloc.text}</pre>
    case 'parte': // titlurile părților le pune Blocuri, mai jos
      return null
  }
}

// O parte a capitolului: titlul ei („Ce facem și de ce”, …) și blocurile de sub el.
type Grup = { parte?: Extract<Bloc, { tip: 'parte' }>; numar: number; blocuri: Bloc[] }

// Fiecare bloc „parte” începe un grup nou; blocurile dinaintea primei părți (dacă există) formează un grup fără titlu.
function grupeazaPeParti(blocuri: Bloc[]): Grup[] {
  const grupuri: Grup[] = [{ numar: 0, blocuri: [] }]
  for (const bloc of blocuri) {
    if (bloc.tip === 'parte') grupuri.push({ parte: bloc, numar: grupuri.length, blocuri: [] })
    else grupuri[grupuri.length - 1].blocuri.push(bloc)
  }
  return grupuri.filter((grup) => grup.parte || grup.blocuri.length > 0)
}

// numar lipsește la capitolele cu o singură parte (2, 4), unde numerotarea n-ar spune nimic.
function TitluParte({ numar, titlu }: { numar?: number; titlu: string }) {
  return (
    <h2 id={idSectiune(titlu)} className="mt-12 mb-4 flex scroll-mt-20 items-center gap-3 text-2xl font-bold text-white">
      {numar && (
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan/50 font-mono text-sm text-cyan">{numar}</span>
      )}
      {titlu}
    </h2>
  )
}

type BlocuriProps = { blocuri: Bloc[]; grafice?: Meta['grafice'] }

export default function Blocuri({ blocuri, grafice = [] }: BlocuriProps) {
  if (import.meta.env.DEV) {
    for (const grafic of grafice) {
      if (!blocuri.some((bloc) => esteAncora(bloc, grafic.dupa))) console.warn(`Graficul „${grafic.id}” nu găsește blocul „${grafic.dupa}”`)
    }
  }

  const lista = (blocuriGrup: Bloc[]) =>
    blocuriGrup.map((bloc, i) => (
      <div key={i}>
        <UnBloc bloc={bloc} />
        {grafice
          .filter((grafic) => esteAncora(bloc, grafic.dupa))
          .map((grafic) => <GraficInteractiv key={grafic.id} id={grafic.id} />)}
      </div>
    ))

  const grupuri = grupeazaPeParti(blocuri)
  const oSinguraParte = grupuri.filter((grup) => grup.parte).length === 1
  return (
    <>
      {grupuri.map((grup, i) => {
        if (!grup.parte) return <div key={i}>{lista(grup.blocuri)}</div>
        const eConcluzie = grup.parte.fel === 'concluzie'
        return (
          <section key={i}>
            <TitluParte numar={oSinguraParte ? undefined : grup.numar} titlu={grup.parte.titlu} />
            {/* concluzia stă într-un panou verde, ca să se vadă de departe ce am aflat */}
            <div className={eConcluzie ? 'rounded-xl border border-green/40 bg-green/5 px-5 py-2' : ''}>{lista(grup.blocuri)}</div>
          </section>
        )
      })}
    </>
  )
}
