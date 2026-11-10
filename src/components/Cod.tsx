// Bloc de cod cu bară de titlu (ca o fereastră de editor), colorare și buton de copiere.
// Pornește închis: un click pe bara de titlu îl deschide sau îl închide (<details>, nativ în browser).
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

  async function copiaza(e: React.MouseEvent) {
    e.preventDefault() // butonul stă în bara de titlu: fără asta, click-ul ar închide/deschide codul
    await navigator.clipboard?.writeText(cod)
    setCopiat(true)
    setTimeout(() => setCopiat(false), 1500)
  }

  return (
    <details className="group my-4 overflow-hidden rounded-lg border border-line bg-[#0d1117]">
      <summary className="flex cursor-pointer list-none items-center justify-between bg-panel2 px-3 py-2 hover:bg-white/[0.04] group-open:border-b group-open:border-line [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2 font-mono text-xs text-muted">
          <span className="w-3 text-cyan transition group-open:rotate-90">▸</span>
          <span className="flex gap-1">
            <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          {titlu ?? limbaj}
          <span className="text-muted/60">· {cod.split('\n').length} linii</span>
        </span>
        <button onClick={copiaza} className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-muted hover:border-cyan/50 hover:text-cyan">
          {copiat ? 'copiat ✓' : 'copiază'}
        </button>
      </summary>
      <div className="overflow-x-auto p-3 text-[12.5px] leading-relaxed [&_pre]:font-mono">
        {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <pre className="font-mono text-text/80">{cod}</pre>}
      </div>
    </details>
  )
}
