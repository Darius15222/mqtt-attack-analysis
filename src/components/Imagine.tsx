// Un grafic PNG din document (public/img/). Graficele au fundal alb, deci stau pe un panou deschis la culoare.
// Click pe imagine = mărire pe tot ecranul; click oriunde sau Escape = închidere.
import { useEffect, useState } from 'react'

const adresaImagine = (fisier: string) => `${import.meta.env.BASE_URL}img/${fisier}`

// „reg1_reziduuri.png” → „reg1 reziduuri” (folosit ca legendă când imaginea nu are una)
const numeLizibil = (fisier: string) => fisier.replace(/\.png$/, '').replace(/_/g, ' ')

// mic = în galerie, fără spațiu vertical în plus; latime/inaltime = dimensiunea PNG-ului, ca pagina să nu sară la încărcare
type ImagineProps = { src: string; legenda?: string; latime: number; inaltime: number; mic?: boolean }

export default function Imagine({ src, legenda, latime, inaltime, mic }: ImagineProps) {
  const [marita, setMarita] = useState(false)
  const text = legenda || numeLizibil(src)

  useEffect(() => {
    if (!marita) return
    const laTasta = (e: KeyboardEvent) => e.key === 'Escape' && setMarita(false)
    addEventListener('keydown', laTasta)
    return () => removeEventListener('keydown', laTasta)
  }, [marita])

  return (
    <figure className={mic ? '' : 'my-5'}>
      <button
        onClick={() => setMarita(true)}
        className="group block w-full cursor-zoom-in overflow-hidden rounded-lg border border-line bg-white p-2 transition hover:border-cyan/60 hover:shadow-[0_0_24px_-6px] hover:shadow-cyan/40"
      >
        <img src={adresaImagine(src)} alt={text} width={latime} height={inaltime} loading="lazy" className="mx-auto h-auto max-w-full" />
      </button>
      <figcaption className="mt-1.5 font-mono text-[11px] text-muted">{text}</figcaption>
      {marita && (
        <div onClick={() => setMarita(false)} className="fixed inset-0 z-50 grid cursor-zoom-out place-items-center bg-black/85 p-4 backdrop-blur-sm">
          <img src={adresaImagine(src)} alt={text} className="max-h-[92vh] max-w-full rounded-lg bg-white p-2" />
        </div>
      )}
    </figure>
  )
}
