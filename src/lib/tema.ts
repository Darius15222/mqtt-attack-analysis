// Culorile temei, pentru locurile unde nu se pot folosi clasele Tailwind (graficele ECharts desenează pe canvas).
// Trebuie să rămână la fel ca variabilele din src/index.css (@theme).
export const TEMA = {
  fundal: '#0a0e14',
  panou: '#0d131b',
  linie: '#1f2a37',
  text: '#d7dee8',
  textSters: '#8b98a9',
  cyan: '#22d3ee',
  verde: '#4ade80',
  rosu: '#f87171',
  fontText: 'Inter, sans-serif',
  fontMono: 'JetBrains Mono',
}

// Stiluri refolosite pe axele graficelor.
export const AXA = {
  eticheta: { color: TEMA.textSters },
  etichetaMono: { color: TEMA.textSters, fontFamily: TEMA.fontMono, fontSize: 10 },
  grila: { lineStyle: { color: TEMA.linie } },
}
