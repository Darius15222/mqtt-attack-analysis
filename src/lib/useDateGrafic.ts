import { useEffect, useState } from 'react'

// Încarcă un fișier JSON din public/date/ (scris de scripts/date_grafice.py).
// Întoarce null până când fișierul s-a încărcat.
export function useDateGrafic<T>(numeFisier: string): T | null {
  const [date, setDate] = useState<T | null>(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}date/${numeFisier}`)
      .then((raspuns) => raspuns.json())
      .then(setDate)
  }, [numeFisier])

  return date
}
