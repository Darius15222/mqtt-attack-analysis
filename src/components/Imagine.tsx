// Un grafic PNG din document (public/img/). Graficele au fundal alb, deci stau pe un panou deschis la culoare.
// Click pe imagine = mărire pe tot ecranul; click oriunde sau Escape = închidere.
import { useEffect, useState } from 'react'

const adresaImagine = (fisier: string) => `${import.meta.env.BASE_URL}img/${fisier}`

// Ce arată fiecare grafic (legenda de sub imagine, când docx-ul nu dă una)
const LEGENDE: Record<string, string> = {
  'tcpflags_100.png': 'Ce procent din fiecare clasă are fiecare valoare tcp.flags (fiecare coloană = 100%)',
  'corr_tot.png': 'Corelația Spearman între cele 13 variabile, pe tot setul',
  'corr_scatter.png': 'Cele 3 perechi cele mai corelate, pe ranguri: tcp.len cu mqtt.len și fiecare cu tcp.time_delta',
  'corr_pearson_spearman.png': 'Corelația Pearson (valorile reale) față de Spearman (ranguri), pentru 5 variabile și is_attack',
  'reg1_scatter.png': 'Regresia 1: mqtt.len față de tcp.len și dreapta găsită (stânga valori reale, dreapta după logaritm)',
  'reg1_reziduuri.png': 'Regresia 1: erorile dreptei (reziduurile) și histograma lor față de curba normală',
  'reg2_scatter.png': 'Regresia 2: timpul dintre pachete față de cele două lungimi',
  'reg2_reziduuri.png': 'Regresia 2: erorile dreptei (reziduurile) și histograma lor',
  'reg3_pe_clase.png': 'Regresia 3: mqtt.len față de tcp.len, câte o dreaptă pentru fiecare clasă',
  'log_box.png': 'Normal față de atac: tcp.len, mqtt.len și tcp.time_delta',
  'cook.png': 'Distanța Cook: cât schimbă modelul fiecare pachet',
  'log_curba.png': 'Probabilitatea de atac în funcție de timpul dintre pachete, pentru un pachet obișnuit',
  'log_prob.png': 'Probabilitatea de atac dată de modelul final fiecărui pachet, normal față de atac',
  'arbore_adancime.png': 'Cum crește nota arborilor cu adâncimea maximă: F1 la clasificare, R² la regresie',
  'arbore_clasificare.png': 'Arborele de clasificare: întrebările de la rădăcină la frunze și clasele din fiecare frunză',
  'arbore_regresie.png': 'Arborele de regresie pentru tcp.len: întrebările și valorile din fiecare frunză',
  'ar_itemi.png': 'Cât de des apare fiecare item (variabilă=valoare), față de pragul de 5%',
  'ar_graf.png': 'Cele mai sigure 2 reguli pentru fiecare atac: valorile din stânga duc la atacul din dreapta',
  'ar_scatter.png': 'Toate regulile, după support și confidence (stânga rularea generală, dreapta regulile pe atacuri)',
}

const legendaGrafic = (fisier: string) => {
  if (LEGENDE[fisier]) return LEGENDE[fisier]
  const [, tip, nume] = fisier.match(/^(desc|test|corr)_(.+)\.png$/) ?? []
  if (tip === 'desc') return nume === 'target' ? 'Câte pachete are fiecare clasă' : `${nume}: cum sunt distribuite valorile pe tot setul`
  if (tip === 'test') return `${nume} pe fiecare clasă (stelele: atacul față de normal)`
  if (tip === 'corr') return `Corelația Spearman la ${nume}`
  return fisier.replace(/\.png$/, '').replace(/_/g, ' ')
}

// mic = în galerie, fără spațiu vertical în plus; latime/inaltime = dimensiunea PNG-ului, ca pagina să nu sară la încărcare
type ImagineProps = { src: string; legenda?: string; latime: number; inaltime: number; mic?: boolean }

export default function Imagine({ src, legenda, latime, inaltime, mic }: ImagineProps) {
  const [marita, setMarita] = useState(false)
  const text = legenda || legendaGrafic(src)

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
