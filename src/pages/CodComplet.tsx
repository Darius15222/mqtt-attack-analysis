import Cod, { limbaj, sursa } from '../components/Cod'

const scripturi = [
  ['01_cap1-7_statistici_corelatii.py', 'Clase, constante, statistici descriptive și valori extreme (IQR), tabelul pe clase, χ² pentru tcp.flags, Kruskal-Wallis, Mann-Whitney, Spearman / Pearson, exemplele din cap. 4.'],
  ['02_cap7-9_regresii_logistica.py', 'Matricile pe clase, regresiile 1-3, VIF, regresia logistică (separarea, pașii algoritmului, modelul final).'],
  ['03_cap9_probabilitati.py', 'Probabilitățile din 9.6, tabelul 9.2, tipurile de mesaje pe clase.'],
  ['04_cap9_firth.py', 'Regresia Firth (9.5): coeficienți, erori standard, Chisq.'],
  ['05_cap8-9_cook_durbin_watson.py', 'Distanța Cook și reziduurile deviance (9.3), Durbin-Watson (cap. 8).'],
  ['06_cap11_reguli_asociere.py', 'Tranzacțiile, Apriori, cele 308 reguli, regulile pentru fiecare atac.'],
  ['07_grafice_corelatie.py', 'Graficele din 7.1-7.3.'],
  ['08_grafice_restul.py', 'Graficele din cap. 5, 6, 7.4, 8, 9, 11.'],
  ['09_cap10_arbori_ctree.R', 'Cap. 10 cu partykit::ctree (R): tabelul rădăcinii, alegerea adâncimii, frunzele, metricile, verificările.'],
  ['10_grafice_arbori.py', 'Graficele din cap. 10 (adâncimea, cei doi arbori).'],
] as const

const rulare = `# datele: mqttdataset_reduced.csv.zip (Kaggle, MQTTset, versiunea redusă)
python3 -m venv venv && venv/bin/pip install pandas scipy statsmodels mlxtend matplotlib
venv/bin/python 01_cap1-7_statistici_corelatii.py mqttdataset_reduced.csv.zip

# arborii (R, pachetul partykit)
Rscript 09_cap10_arbori_ctree.R mqttdataset_reduced.csv.zip arbori
venv/bin/python 10_grafice_arbori.py arbori arbori`

export default function CodComplet() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <div className="mb-2 font-mono text-xs text-muted">resurse / cod</div>
      <h1 className="text-3xl font-bold text-white">Codul complet</h1>
      <p className="mt-2 max-w-3xl text-muted">
        Zece scripturi (Python și R) care reproduc toate cifrele și graficele. Fișierul de date nu este în repo; se descarcă de pe{' '}
        <a className="text-cyan hover:underline" href="https://www.kaggle.com/datasets/cnrieiit/mqttset" target="_blank" rel="noreferrer">Kaggle (MQTTset)</a>.
        pandas citește direct fișierul .zip.
      </p>
      <a href={`${import.meta.env.BASE_URL}MQTTset_cod.pdf`} target="_blank" rel="noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-md border border-cyan/40 bg-cyan/10 px-3 py-1.5 font-mono text-sm text-cyan hover:bg-cyan/20">
        ↓ Codul în PDF (16 pagini)
      </a>
      <h2 className="mt-8 mb-2 font-semibold text-white">Rulare</h2>
      <pre className="overflow-x-auto rounded-lg border border-line bg-[#0d1117] p-4 font-mono text-[12.5px] leading-relaxed text-green/90">{rulare}</pre>
      <div className="mt-8 grid gap-2 sm:grid-cols-2">
        {scripturi.map(([f, d]) => (
          <a key={f} href={`#${f}`} className="rounded-lg border border-line bg-panel p-3 hover:border-cyan/50">
            <div className="font-mono text-xs text-cyan">{f}</div><div className="mt-1 text-sm text-muted">{d}</div>
          </a>
        ))}
      </div>
      {scripturi.map(([f, d]) => (
        <section key={f} id={f} className="mt-10 scroll-mt-20">
          <h2 className="font-mono text-white">{f}</h2>
          <p className="text-sm text-muted">{d}</p>
          <Cod cod={sursa(f)} lang={limbaj(f)} titlu={`cod/${f}`} />
        </section>
      ))}
    </div>
  )
}
