import { Link } from 'react-router-dom'
import { capitole, titluFaraNr } from '../data/capitole'
import { cifre, pipeline, CULORI, type Clasa } from '../data/cifre'
import intro from '../data/intro'
import GraficInteractiv from '../components/grafice/Lazy'
import Txt from '../components/Txt'

const textIntro = (et: string) => intro.find((b) => b.tip === 'text' && b.eticheta === et) as { text: string } | undefined
const rezumat = intro.find((b) => b.tip === 'text' && !b.eticheta) as { text: string }
const concluzie = capitole.find((c) => c.slug === 'concluzie')!.continut.blocuri.find((b) => b.tip === 'tabel') as { antet: string[]; randuri: string[][] }

export default function Dashboard() {
  return (
    <div>
      {/* hero */}
      <section className="grila relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-cyan/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green/30 bg-green/5 px-3 py-1 font-mono text-[11px] text-green">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" /> MQTTset · IoT · detectarea atacurilor
          </div>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-5xl">
            Ce variabile trădează fiecare <span className="text-cyan">atac</span> asupra unei rețele MQTT?
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted sm:text-lg"><Txt t={rezumat.text} /></p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/capitol/dataset" className="rounded-md bg-cyan px-4 py-2 text-sm font-semibold text-bg hover:bg-cyan/90">Începe cu datele →</Link>
            <Link to="/capitol/concluzie" className="rounded-md border border-line px-4 py-2 text-sm text-text hover:border-cyan/50">Sari la concluzie</Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-10 sm:px-8">
        {/* cifre cheie */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {cifre.map((c) => (
            <Link key={c.eticheta} to={`/capitol/${c.cap}`} className="group rounded-xl border border-line bg-panel p-4 transition hover:-translate-y-0.5 hover:border-cyan/50 hover:shadow-[0_0_30px_-10px] hover:shadow-cyan/50">
              <div className="font-mono text-2xl font-bold text-cyan sm:text-3xl">{c.valoare}</div>
              <div className="mt-1 text-sm font-medium text-white">{c.eticheta}</div>
              <div className="mt-1 text-xs text-muted">{c.detaliu}</div>
            </Link>
          ))}
        </section>

        {/* obiectiv și ipoteze */}
        <section className="grid gap-3 md:grid-cols-2">
          {(['Obiectiv', 'Ipoteze (H0)'] as const).map((et) => (
            <div key={et} className="rounded-xl border border-line bg-panel p-5">
              <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-amber">{et}</div>
              <p className="text-sm leading-relaxed text-text/90"><Txt t={textIntro(et)?.text ?? ''} /></p>
            </div>
          ))}
        </section>

        {/* pipeline */}
        <section>
          <Titlu nr="01" t="Pașii analizei" s="fiecare pas folosește rezultatele celui dinainte" />
          <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
            {pipeline.map((p, i) => (
              <div key={p.titlu} className="flex flex-1 items-center gap-2 md:flex-col md:items-stretch">
                <Link to={`/capitol/${p.cap}`} className="flex-1 rounded-lg border border-line bg-panel px-3 py-3 transition hover:border-cyan/60">
                  <div className="font-mono text-[10px] text-cyan/70">{String(i + 1).padStart(2, '0')}</div>
                  <div className="text-sm font-semibold text-white">{p.titlu}</div>
                  <div className="text-xs text-muted">{p.text}</div>
                </Link>
                {i < pipeline.length - 1 && <span className="font-mono text-cyan/50 md:hidden">↓</span>}
              </div>
            ))}
          </div>
        </section>

        {/* date */}
        <section>
          <Titlu nr="02" t="Datele" s="jumătate trafic normal, jumătate cinci atacuri" />
          <GraficInteractiv id="clase" />
        </section>

        {/* concluzia */}
        <section>
          <Titlu nr="03" t="Ce indică fiecare atac" s="concluzia, din toate metodele" />
          <div className="grid gap-3 md:grid-cols-2">
            {concluzie.randuri.map((r) => {
              const cl = r[0].split(/[\s(]/)[0].toLowerCase() as Clasa
              return (
                <div key={r[0]} className="rounded-xl border border-line bg-panel p-4" style={{ borderTop: `3px solid ${CULORI[cl] ?? '#22d3ee'}` }}>
                  <div className="font-mono text-sm font-bold" style={{ color: CULORI[cl] ?? '#22d3ee' }}>{r[0]}</div>
                  <div className="mt-2 text-sm text-white"><Txt t={r[1]} /></div>
                  <div className="mt-2 text-xs leading-relaxed text-muted"><Txt t={r[2]} /></div>
                </div>
              )
            })}
          </div>
        </section>

        {/* capitolele */}
        <section>
          <Titlu nr="04" t="Toate capitolele" s="pașii, calculele, deciziile și codul fiecărei analize" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {capitole.map((c) => (
              <Link key={c.slug} to={`/capitol/${c.slug}`} className="group rounded-xl border border-line bg-panel p-4 transition hover:border-cyan/50">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xl font-bold text-cyan/40 group-hover:text-cyan">{String(c.nr).padStart(2, '0')}</span>
                  {c.scripturi.length > 0 && <span className="font-mono text-[10px] text-muted">{c.scripturi.length} script{c.scripturi.length > 1 ? 'uri' : ''}</span>}
                </div>
                <div className="mt-1 font-semibold text-white">{titluFaraNr(c)}</div>
                <div className="mt-1 text-sm text-muted">{c.rezumat}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function Titlu({ nr, t, s }: { nr: string; t: string; s: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-baseline gap-x-3">
      <span className="font-mono text-xs text-cyan">{nr} //</span>
      <h2 className="text-xl font-semibold text-white">{t}</h2>
      <span className="text-sm text-muted">{s}</span>
    </div>
  )
}
