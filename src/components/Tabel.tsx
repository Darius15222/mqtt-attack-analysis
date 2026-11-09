// Tabel întunecat. Tabelele late (4+ coloane sau celule cu mult text) se pot derula orizontal pe telefon,
// fără ca pagina întreagă să capete scroll orizontal.
import Txt from './Txt'

// Celulele care sunt doar un număr (ex. „0,9504”, „165.463”, „50,00%”, „sub 0,001 (***)”) se aliniază cu font mono.
const DOAR_NUMAR = /^[-−≈<>≤≥]?\s?[\d.,]+\s?%?(\s?\(\*+\))?$/
const esteNumar = (celula: string) => DOAR_NUMAR.test(celula.trim())

type TabelProps = { antet: string[]; randuri: string[][] }

export default function Tabel({ antet, randuri }: TabelProps) {
  const esteLat = antet.length >= 4 || randuri.some((rand) => rand.some((celula) => celula.length > 120))

  return (
    <div className="my-5 overflow-x-auto rounded-lg border border-line bg-panel">
      <table className={`w-full border-collapse text-sm ${esteLat ? 'min-w-[720px]' : ''}`}>
        <thead>
          <tr className="border-b border-line bg-panel2">
            {antet.map((titlu, i) => (
              <th key={i} className="px-3 py-2.5 text-left font-mono text-[11px] font-semibold uppercase tracking-wider text-cyan/90">
                {titlu}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {randuri.map((rand, i) => (
            <tr key={i} className="border-b border-line/60 last:border-0 hover:bg-white/[0.02]">
              {rand.map((celula, j) => {
                const primaColoana = j === 0 ? 'font-medium text-white' : ''
                const numeric = esteNumar(celula) ? 'whitespace-nowrap font-mono text-[13px]' : ''
                return (
                  <td key={j} className={`px-3 py-2 align-top leading-relaxed ${primaColoana} ${numeric}`}>
                    <Txt t={celula} />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
