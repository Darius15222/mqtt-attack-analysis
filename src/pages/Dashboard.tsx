// Pagina principală: întrebarea și rezumatul, cifrele cheie, obiectivul și ipotezele, pașii analizei,
// distribuția claselor, concluzia pentru fiecare atac și cardurile spre capitole.
import { Link } from 'react-router-dom'
import { capitole, titluFaraNr } from '../data/capitole'
import { cifre, pipeline, CULORI, type Clasa } from '../data/cifre'
import intro from '../data/intro'
import GraficInteractiv from '../components/grafice/GraficInteractiv'
import Txt from '../components/Txt'
import { TEMA } from '../lib/tema'

// --- textele luate din document (src/data/intro.ts și tabelul din cap. 13) ---

function paragrafIntro(eticheta?: string) {
  const bloc = intro.find((b) => b.tip === 'text' && b.eticheta === eticheta)
  return bloc && bloc.tip === 'text' ? bloc.text : ''
}

const tabelConcluzie = capitole.find((c) => c.slug === 'concluzie')!.continut.blocuri.find((b) => b.tip === 'tabel')
const randuriConcluzie = tabelConcluzie?.tip === 'tabel' ? tabelConcluzie.randuri : []

const doiDigiti = (n: number) => String(n).padStart(2, '0')

// --- secțiunile paginii ---

function Hero() {
  return (
    <section className="grila relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-cyan/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green/30 bg-green/5 px-3 py-1 font-mono text-[11px] text-green">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" /> MQTTset · IoT · detectarea atacurilor
        </div>
        <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-5xl">
          Ce variabile trădează fiecare <span className="text-cyan">atac</span> asupra unei rețele MQTT?
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted sm:text-lg"><Txt t={paragrafIntro()} /></p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/capitol/dataset" className="rounded-md bg-cyan px-4 py-2 text-sm font-semibold text-bg hover:bg-cyan/90">Începe cu datele →</Link>
          <Link to="/capitol/concluzie" className="rounded-md border border-line px-4 py-2 text-sm text-text hover:border-cyan/50">Sari la concluzie</Link>
        </div>
      </div>
    </section>
  )
}

function TitluSectiune({ numar, titlu, explicatie }: { numar: string; titlu: string; explicatie: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-baseline gap-x-3">
      <span className="font-mono text-xs text-cyan">{numar} //</span>
      <h2 className="text-xl font-semibold text-white">{titlu}</h2>
      <span className="text-sm text-muted">{explicatie}</span>
    </div>
  )
}

function CifreCheie() {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cifre.map((cifra) => (
        <Link
          key={cifra.eticheta}
          to={`/capitol/${cifra.cap}`}
          className="group rounded-xl border border-line bg-panel p-4 transition hover:-translate-y-0.5 hover:border-cyan/50 hover:shadow-[0_0_30px_-10px] hover:shadow-cyan/50"
        >
          <div className="font-mono text-2xl font-bold text-cyan sm:text-3xl">{cifra.valoare}</div>
          <div className="mt-1 text-sm font-medium text-white">{cifra.eticheta}</div>
          <div className="mt-1 text-xs text-muted">{cifra.detaliu}</div>
        </Link>
      ))}
    </section>
  )
}

function ObiectivSiIpoteze() {
  return (
    <section className="grid gap-3 md:grid-cols-2">
      {['Obiectiv', 'Ipoteze (H0)'].map((eticheta) => (
        <div key={eticheta} className="rounded-xl border border-line bg-panel p-5">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-amber">{eticheta}</div>
          <p className="text-sm leading-relaxed text-text/90"><Txt t={paragrafIntro(eticheta)} /></p>
        </div>
      ))}
    </section>
  )
}

// Pașii pe orizontală pe desktop, unul sub altul (cu săgeți) pe telefon.
function PasiiAnalizei() {
  return (
    <section>
      <TitluSectiune numar="01" titlu="Pașii analizei" explicatie="fiecare pas folosește rezultatele celui dinainte" />
      <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
        {pipeline.map((pas, i) => (
          <div key={pas.titlu} className="flex flex-1 items-center gap-2 md:flex-col md:items-stretch">
            <Link to={`/capitol/${pas.cap}`} className="flex-1 rounded-lg border border-line bg-panel px-3 py-3 transition hover:border-cyan/60">
              <div className="font-mono text-[10px] text-cyan/70">{doiDigiti(i + 1)}</div>
              <div className="text-sm font-semibold text-white">{pas.titlu}</div>
              <div className="text-xs text-muted">{pas.text}</div>
            </Link>
            {i < pipeline.length - 1 && <span className="font-mono text-cyan/50 md:hidden">↓</span>}
          </div>
        ))}
      </div>
    </section>
  )
}

// Câte un card pe atac, colorat cu culoarea clasei (prima coloană din tabelul de concluzie e numele atacului).
function ConcluziePeAtacuri() {
  return (
    <section>
      <TitluSectiune numar="03" titlu="Ce indică fiecare atac" explicatie="concluzia, din toate metodele" />
      <div className="grid gap-3 md:grid-cols-2">
        {randuriConcluzie.map(([atac, variabile, interpretare]) => {
          const culoare = CULORI[atac.split(/[\s(]/)[0].toLowerCase() as Clasa] ?? TEMA.cyan
          return (
            <div key={atac} className="rounded-xl border border-line bg-panel p-4" style={{ borderTop: `3px solid ${culoare}` }}>
              <div className="font-mono text-sm font-bold" style={{ color: culoare }}>{atac}</div>
              <div className="mt-2 text-sm text-white"><Txt t={variabile} /></div>
              <div className="mt-2 text-xs leading-relaxed text-muted"><Txt t={interpretare} /></div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function CarduriCapitole() {
  return (
    <section>
      <TitluSectiune numar="04" titlu="Toate capitolele" explicatie="pașii, calculele, deciziile și codul fiecărei analize" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {capitole.map((capitol) => {
          const nrScripturi = capitol.scripturi.length
          return (
            <Link key={capitol.slug} to={`/capitol/${capitol.slug}`} className="group rounded-xl border border-line bg-panel p-4 transition hover:border-cyan/50">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xl font-bold text-cyan/40 group-hover:text-cyan">{doiDigiti(capitol.nr)}</span>
                {nrScripturi > 0 && <span className="font-mono text-[10px] text-muted">{nrScripturi} {nrScripturi > 1 ? 'scripturi' : 'script'}</span>}
              </div>
              <div className="mt-1 font-semibold text-white">{titluFaraNr(capitol)}</div>
              <div className="mt-1 text-sm text-muted">{capitol.rezumat}</div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default function Dashboard() {
  return (
    <div>
      <Hero />
      <div className="mx-auto max-w-6xl space-y-14 px-4 py-10 sm:px-8">
        <CifreCheie />
        <ObiectivSiIpoteze />
        <PasiiAnalizei />
        <section>
          <TitluSectiune numar="02" titlu="Datele" explicatie="jumătate trafic normal, jumătate cinci atacuri" />
          <GraficInteractiv id="clase" />
        </section>
        <ConcluziePeAtacuri />
        <CarduriCapitole />
      </div>
    </div>
  )
}
