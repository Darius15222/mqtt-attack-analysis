# Codul analizei MQTTset

Scripturi Python care reproduc cifrele și graficele din `MQTTset_tema.docx`.
Codul original al temei nu s-a păstrat; acestea au fost scrise la audit (noiembrie 2026) și dau aceleași rezultate ca documentul.

## Rulare

```bash
python3 -m venv venv && venv/bin/pip install pandas scipy statsmodels mlxtend matplotlib
venv/bin/python 01_cap1-7_statistici_corelatii.py ../mqttdataset_reduced.csv.zip
```

pandas citește direct fișierul `.zip`, nu trebuie dezarhivat.

| Script | Ce reproduce | Argumente |
|---|---|---|
| `01_cap1-7_statistici_corelatii.py` | clase, constante, statistici descriptive, tabelul pe clase, χ² tcp.flags, Kruskal-Wallis, Mann-Whitney, Spearman/Pearson, exemplele din cap. 4 | CSV |
| `02_cap7-9_regresii_logistica.py` | matrice pe clase, regresiile 1-3, VIF, regresia logistică (separarea, pașii 10-30, modelul final) | CSV |
| `03_cap9_probabilitati.py` | probabilitățile din 9.6, tabelul 9.2, msgtype pe clase | CSV |
| `04_cap9_firth.py` | regresia Firth (9.5): coeficienți, erori standard, Chisq | CSV |
| `05_cap8-9_cook_durbin_watson.py` | distanța Cook (9.3), Durbin-Watson (cap. 8), verificarea câmpurilor „0” | CSV, fișier `.npy` de ieșire pentru Cook |
| `06_cap11_reguli_asociere.py` | tranzacțiile, Apriori, cele 308 reguli, regulile pe atacuri | CSV |
| `07_grafice_corelatie.py` | graficele din 7.1-7.3 | CSV, folder de ieșire |
| `08_grafice_restul.py` | graficele din cap. 5, 6, 7.4, 8, 9, 11 | CSV, folder de ieșire, `.npy` de la 05 |
| `09_cap10_arbori_ctree.R` | cap. 10 cu `partykit::ctree` (R): tabelul rădăcinii, maxdepth, frunzele, metricile, verificările; scrie CSV-urile pentru grafice | zip, folder de ieșire |
| `10_grafice_arbori.py` | graficele din cap. 10 (adâncimea, cei doi arbori) | folderul cu CSV-uri de la 09, folder de ieșire |

## Arborii (cap. 10)

```bash
Rscript 09_cap10_arbori_ctree.R ../mqttdataset_reduced.csv.zip arbori   # cifrele + CSV-uri (are nevoie de r-base r-cran-partykit)
venv/bin/python 10_grafice_arbori.py arbori arbori                      # cele 3 grafice din cap. 10
```

Arborii din document sunt făcuți cu `partykit::ctree` (quadratic, Bonferroni, α = 0,05, minsplit 20, minbucket 300, maxdepth 5 / 4), cu împărțirea 70/30 făcută în script (pe fiecare clasă, `set.seed(42)`).
Coloanele hex (`tcp.flags`, `mqtt.conack.flags`, `mqtt.conflags`, `mqtt.hdrflags`) se citesc ca text: altfel R le transformă în numere, iar „0” și „0x00000000” devin aceeași valoare.
