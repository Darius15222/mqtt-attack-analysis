import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/mqtt-attack-analysis/',
  plugins: [react(), tailwindcss()],
  // textul capitolelor și React în fișiere separate de codul aplicației: niciunul peste 500 kB,
  // iar la o schimbare de text browserul re-descarcă doar conținutul
  build: {
    // Grafice.js (ECharts, ~630 kB) are deja doar componentele folosite și se descarcă numai pe paginile cu grafice
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'continut', test: /src[\\/]data[\\/]cap\d+/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|scheduler)/ },
          ],
        },
      },
    },
  },
})
