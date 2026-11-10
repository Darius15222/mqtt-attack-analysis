// Tabel întunecat. Tabelele cu 4+ coloane se pot derula orizontal pe telefon, fără ca pagina întreagă să capete
// scroll orizontal. Un rând cu o singură celulă (ex. „1. TCP (rețea)”) e titlul unui grup și ocupă toată lățimea.
import Txt from './Txt'

// Celulele care sunt doar un număr (ex. „0,9504”, „165.463”, „50,00%”, „sub 0,001 (***)”) se aliniază cu font mono.
const DOAR_NUMAR = /^[-−≈<>≤≥]?\s?[\d.,]+\s?%?(\s?\(\*+\))?$/
const esteNumar = (celula: string) => DOAR_NUMAR.test(celula.trim())

function RandGrup({ text, coloane }: { text: string; coloane: number }) {
  return (
    <tr className="border-b border-line/60">
      <td colSpan={coloane} className="bg-panel2 px-3 py-2 font-semibold text-cyan">{text}</td>
    </tr>
  )
}

function Rand({ celule }: { celule: string[] }) {
  return (
    <tr className="border-b border-line/60 last:border-0 hover:bg-white/[0.02]">
      {celule.map((celula, j) => {
        const primaColoana = j === 0 ? 'font-medium text-white' : ''
        const numeric = esteNumar(celula) ? 'whitespace-nowrap font-mono text-[13px]' : ''
        return (
          <td key={j} className={`px-3 py-2 align-top leading-relaxed ${primaColoana} ${numeric}`}>
            <Txt t={celula} />
          </td>
        )
      })}
    </tr>
  )
}

type TabelProps = { antet: string[]; randuri: string[][] }

export default function Tabel({ antet, randuri }: TabelProps) {
  return (
    <div className="my-5 overflow-x-auto rounded-lg border border-line bg-panel">
      <table className={`w-full border-collapse text-sm ${antet.length >= 4 ? 'min-w-[640px]' : ''}`}>
        <thead>
          <tr className="border-b border-line bg-panel2">
            {antet.map((titlu, i) => (
              <th key={i} className="px-3 py-2.5 text-left font-mono text-[11px] font-semibold uppercase tracking-wider text-cyan/90">
                {titlu || <span className="sr-only">Predicție</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {randuri.map((rand, i) =>
            rand.length === 1 && antet.length > 1 ? <RandGrup key={i} text={rand[0]} coloane={antet.length} /> : <Rand key={i} celule={rand} />,
          )}
        </tbody>
      </table>
    </div>
  )
}
