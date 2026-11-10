// Pagina principală: o descriere scurtă a temei și linkurile către capitole.
// Tot restul (cifre, grafice, concluzii) stă în capitole.
import { Link } from 'react-router-dom'
import { capitole, titluFaraNr } from '../data/capitole'
import { doiDigiti } from '../lib/format'

const DESCRIERE = [
  'MQTTset: 330.926 de pachete dintr-o casă inteligentă simulată. Jumătate sunt trafic normal, jumătate cinci tipuri de atac.',
  'Căutăm valorile din pachet care arată că e un atac și ce fel de atac.',
  'Fiecare analiză are aceeași ordine: ce facem și de ce, ipoteza, pașii, demonstrația (date, tabele, cod) și concluzia.',
]

function Hero() {
  return (
    <section className="grila relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-cyan/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
        <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-5xl">
          Ce variabile trădează fiecare <span className="text-cyan">atac</span> asupra unei rețele MQTT?
        </h1>
        <ul className="mt-5 max-w-3xl list-disc space-y-1.5 pl-5 text-base leading-relaxed text-muted marker:text-cyan sm:text-lg">
          {DESCRIERE.map((punct) => <li key={punct}>{punct}</li>)}
        </ul>
      </div>
    </section>
  )
}

function Capitole() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <h2 className="mb-4 text-xl font-semibold text-white">Capitolele</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {capitole.map((capitol) => (
          <Link key={capitol.slug} to={`/capitol/${capitol.slug}`} className="group rounded-xl border border-line bg-panel p-4 transition hover:border-cyan/50">
            <span className="font-mono text-xl font-bold text-cyan/70 group-hover:text-cyan">{doiDigiti(capitol.nr)}</span>
            <div className="mt-1 font-semibold text-white">{titluFaraNr(capitol)}</div>
            <div className="mt-1 text-sm text-muted">{capitol.rezumat}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function Dashboard() {
  return (
    <div>
      <title>MQTTset · ce variabile trădează fiecare atac</title>
      <Hero />
      <Capitole />
    </div>
  )
}
