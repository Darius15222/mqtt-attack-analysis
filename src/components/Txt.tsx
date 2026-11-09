import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { capitole } from '../data/capitole'

// text simplu, cu linkuri: URL-uri externe și trimiteri „capitolul N” / „secțiunea N” / „cap. N” spre pagina capitolului
const RE = /(https?:\/\/[^\s)]+)|((?:capitolul|capitolele|secțiunea|cap\.)\s+)(\d{1,2})(?![\d.,]\d)/g

export default function Txt({ t }: { t: string }) {
  const out: React.ReactNode[] = []
  let last = 0
  for (const m of t.matchAll(RE)) {
    out.push(t.slice(last, m.index))
    if (m[1]) out.push(<a key={m.index} href={m[1]} target="_blank" rel="noreferrer" className="text-cyan underline decoration-cyan/30 underline-offset-2 break-all hover:decoration-cyan">{m[1]}</a>)
    else {
      const c = capitole.find((x) => x.nr === Number(m[3]))
      out.push(m[2], c ? <Link key={m.index} to={`/capitol/${c.slug}`} className="text-cyan hover:underline">{m[3]}</Link> : m[3])
    }
    last = m.index! + m[0].length
  }
  out.push(t.slice(last))
  return <>{t.split('\n').length > 1 && out.length === 1 ? t.split('\n').map((l, i) => <Fragment key={i}>{i > 0 && <br />}{l}</Fragment>) : out}</>
}
