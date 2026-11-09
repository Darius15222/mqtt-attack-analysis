import { useEffect, useState } from 'react'

// scripturile din cod/, încărcate ca text la build
const fisiere = import.meta.glob('../../cod/*.{py,R}', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
export const sursa = (f: string) => fisiere[`../../cod/${f}`] ?? ''

// Shiki se încarcă doar când e nevoie (un singur highlighter pentru toată pagina)
let hl: Promise<{ codeToHtml: (c: string, o: { lang: string; theme: string }) => string }> | null = null
const highlighter = () =>
  (hl ??= (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([import('shiki/core'), import('shiki/engine/javascript')])
    return createHighlighterCore({
      themes: [import('shiki/themes/github-dark-default.mjs')],
      langs: [import('shiki/langs/python.mjs'), import('shiki/langs/r.mjs')],
      engine: createJavaScriptRegexEngine(),
    })
  })())

export default function Cod({ cod, lang, titlu }: { cod: string; lang: 'python' | 'r'; titlu?: string }) {
  const [html, setHtml] = useState('')
  const [copiat, setCopiat] = useState(false)
  useEffect(() => {
    let viu = true
    highlighter().then((h) => viu && setHtml(h.codeToHtml(cod, { lang, theme: 'github-dark-default' })))
    return () => { viu = false }
  }, [cod, lang])
  const copiaza = () => navigator.clipboard?.writeText(cod).then(() => { setCopiat(true); setTimeout(() => setCopiat(false), 1500) })
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-line bg-[#0d1117]">
      <div className="flex items-center justify-between border-b border-line bg-panel2 px-3 py-2">
        <span className="flex items-center gap-2 font-mono text-xs text-muted">
          <span className="flex gap-1"><i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" /></span>
          {titlu ?? lang}
        </span>
        <button onClick={copiaza} className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-muted hover:border-cyan/50 hover:text-cyan">{copiat ? 'copiat ✓' : 'copiază'}</button>
      </div>
      <div className="overflow-x-auto p-3 text-[12.5px] leading-relaxed [&_pre]:font-mono">
        {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <pre className="font-mono text-text/80">{cod}</pre>}
      </div>
    </div>
  )
}

export const limbaj = (f: string) => (f.endsWith('.R') ? 'r' : 'python') as 'python' | 'r'
