// Colorarea codului (syntax highlighting) cu Shiki, aceeași tehnologie ca în VS Code.
// Se încarcă abia când e afișat primul bloc de cod și se creează o singură dată pentru tot site-ul.
import type { Limbaj } from './scripturi'

export const TEMA_COD = 'github-dark-default'

type Evidentiator = { codeToHtml: (cod: string, optiuni: { lang: string; theme: string }) => string }

let evidentiator: Promise<Evidentiator> | null = null

async function creeazaEvidentiator(): Promise<Evidentiator> {
  const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
    import('shiki/core'),
    import('shiki/engine/javascript'),
  ])
  // Doar tema și cele două limbaje folosite, nu tot pachetul Shiki.
  return createHighlighterCore({
    themes: [import('shiki/themes/github-dark-default.mjs')],
    langs: [import('shiki/langs/python.mjs'), import('shiki/langs/r.mjs')],
    engine: createJavaScriptRegexEngine(),
  })
}

export async function codColorat(cod: string, limbaj: Limbaj) {
  evidentiator ??= creeazaEvidentiator()
  return (await evidentiator).codeToHtml(cod, { lang: limbaj, theme: TEMA_COD })
}
