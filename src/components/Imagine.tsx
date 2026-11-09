import { useEffect, useState } from 'react'

const url = (src: string) => `${import.meta.env.BASE_URL}img/${src}`
const nume = (src: string) => src.replace(/\.png$/, '').replace(/_/g, ' ')

// PNG pe panou deschis (graficele au fundal alb); click = mărire
export default function Imagine({ src, legenda, mic }: { src: string; legenda?: string; mic?: boolean }) {
  const [mare, setMare] = useState(false)
  useEffect(() => {
    if (!mare) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setMare(false)
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [mare])
  return (
    <figure className={mic ? '' : 'my-5'}>
      <button onClick={() => setMare(true)} className="group block w-full cursor-zoom-in overflow-hidden rounded-lg border border-line bg-white p-2 transition hover:border-cyan/60 hover:shadow-[0_0_24px_-6px] hover:shadow-cyan/40">
        <img src={url(src)} alt={legenda || nume(src)} loading="lazy" className="mx-auto h-auto max-w-full" />
      </button>
      <figcaption className="mt-1.5 font-mono text-[11px] text-muted">{legenda || nume(src)}</figcaption>
      {mare && (
        <div onClick={() => setMare(false)} className="fixed inset-0 z-50 grid cursor-zoom-out place-items-center bg-black/85 p-4 backdrop-blur-sm">
          <img src={url(src)} alt={legenda || nume(src)} className="max-h-[92vh] max-w-full rounded-lg bg-white p-2" />
        </div>
      )}
    </figure>
  )
}
