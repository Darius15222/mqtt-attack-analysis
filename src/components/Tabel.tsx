import Txt from './Txt'

const numeric = (s: string) => /^[-−≈<>≤≥]?\s?[\d.,]+\s?%?(\s?\(\*+\))?$/.test(s.trim())

export default function Tabel({ antet, randuri }: { antet: string[]; randuri: string[][] }) {
  const lat = antet.length >= 4 || randuri.some((r) => r.some((c) => c.length > 120))
  return (
    <div className="my-5 overflow-x-auto rounded-lg border border-line bg-panel">
      <table className={`w-full border-collapse text-sm ${lat ? 'min-w-[720px]' : ''}`}>
        <thead>
          <tr className="border-b border-line bg-panel2">
            {antet.map((h, i) => <th key={i} className="px-3 py-2.5 text-left font-mono text-[11px] font-semibold uppercase tracking-wider text-cyan/90">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {randuri.map((r, i) => (
            <tr key={i} className="border-b border-line/60 last:border-0 hover:bg-white/[0.02]">
              {r.map((c, j) => (
                <td key={j} className={`px-3 py-2 align-top leading-relaxed ${j === 0 ? 'font-medium text-white' : ''} ${numeric(c) ? 'whitespace-nowrap font-mono text-[13px]' : ''}`}>
                  <Txt t={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
