// Bloc de cod cu bară de titlu (ca o fereastră de editor), colorare și buton de copiere.
// Până se încarcă colorarea, codul apare ca text simplu.
import { useEffect, useState } from 'react'
import { codColorat } from '../lib/evidentiereCod'
import type { Limbaj } from '../lib/scripturi'

type CodProps = { cod: string; limbaj: Limbaj; titlu?: string }

export default function Cod({ cod, limbaj, titlu }: CodProps) {
  const [html, setHtml] = useState('')
  const [copiat, setCopiat] = useState(false)

  useEffect(() => {
    let componentaAfisata = true // nu actualizăm starea dacă utilizatorul a plecat de pe pagină între timp
    codColorat(cod, limbaj).then((rezultat) => componentaAfisata && setHtml(rezultat))
    return () => { componentaAfisata = false }
  }, [cod, limbaj])

  async function copiaza() {
    await navigator.clipboard?.writeText(cod)
    setCopiat(true)
    setTimeout(() => setCopiat(false), 1500)
  }

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-line bg-[#0d1117]">
      <div className="flex items-center justify-between border-b border-line bg-panel2 px-3 py-2">
        <span className="flex items-center gap-2 font-mono text-xs text-muted">
          <span className="flex gap-1">
            <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          {titlu ?? limbaj}
        </span>
        <button onClick={copiaza} className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-muted hover:border-cyan/50 hover:text-cyan">
          {copiat ? 'copiat ✓' : 'copiază'}
        </button>
      </div>
      <div className="overflow-x-auto p-3 text-[12.5px] leading-relaxed [&_pre]:font-mono">
        {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <pre className="font-mono text-text/80">{cod}</pre>}
      </div>
    </div>
  )
}
