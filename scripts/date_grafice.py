"""
Pregătește datele pentru graficele interactive ale site-ului (fișiere JSON în public/date/).

Intrare (4 argumente, în ordine):
  1. CSV-ul cu datele MQTTset (mqttdataset_reduced.csv)
  2. folderul cu matricile Spearman: rezultate/corelatii/matrice_<clasă>.csv
  3. noduri_clasificare.csv, scris de cod/09_cap10_arbori_ctree.R
  4. reguli_atac.csv, scris de cod/06_cap11_reguli_asociere.py (cu al doilea argument)

Ieșire:
  - clase.json       câte pachete are fiecare clasă (cap. 1)
  - corelatii.json   matricile Spearman pe tot setul și pe fiecare clasă (cap. 7)
  - arbore.json      arborele de clasificare, cu nodurile imbricate (cap. 10.4)
  - reguli.json      regulile de asociere pentru fiecare atac (cap. 11.4)

Rulare:
  python3 scripts/date_grafice.py date.csv rezultate/corelatii noduri_clasificare.csv reguli_atac.csv
"""
import csv
import json
import math
import sys
from collections import Counter
from pathlib import Path

cale_date, folder_corelatii, cale_noduri, cale_reguli = sys.argv[1:5]

FOLDER_IESIRE = Path(__file__).resolve().parent.parent / 'public/date'
FOLDER_IESIRE.mkdir(parents=True, exist_ok=True)

CLASE = ['legitimate', 'dos', 'bruteforce', 'malformed', 'slowite', 'flood']


def scrie_json(nume_fisier, valoare):
    # fără spații, ca fișierele să fie cât mai mici
    (FOLDER_IESIRE / nume_fisier).write_text(json.dumps(valoare, ensure_ascii=False, separators=(',', ':')))


# --- 1) numărul de pachete pe clase ---

with open(cale_date) as fisier:
    pachete_pe_clasa = Counter(rand['target'] for rand in csv.DictReader(fisier))
scrie_json('clase.json', [{'clasa': clasa, 'pachete': pachete_pe_clasa[clasa]} for clasa in CLASE])


# --- 2) matricile de corelație Spearman ---

def citeste_matrice(cale):
    """Matricea dintr-un CSV cu antet pe primul rând și pe prima coloană.
    Celulele goale sau NaN (variabilă constantă în clasa respectivă) devin None, adică null în JSON."""
    randuri = list(csv.reader(open(cale)))
    variabile = randuri[0][1:]
    matrice = [[round(float(valoare), 3) if valoare and not math.isnan(float(valoare)) else None for valoare in rand[1:]]
               for rand in randuri[1:]]
    return {'variabile': variabile, 'matrice': matrice}


corelatii = {nume: citeste_matrice(f'{folder_corelatii}/matrice_{nume}.csv') for nume in ['tot_setul'] + CLASE}
scrie_json('corelatii.json', corelatii)


# --- 3) arborele de clasificare ---

# Un rând pe nod: id, copii („2;29”), variabila, p, condițiile ramurilor („<= 0|> 0”), n și câte pachete din fiecare clasă.
noduri = {int(rand['id']): rand for rand in csv.DictReader(open(cale_noduri))}


def construieste_nod(id_nod, conditie_ramura=''):
    """Nodul și, recursiv, copiii lui, în forma folosită de graficul de pe site."""
    rand = noduri[id_nod]
    pachete_pe_clase = {clasa: int(rand[clasa]) for clasa in CLASE}
    total = int(rand['n'])
    nod = {
        'id': id_nod,
        'ramura': conditie_ramura,
        'n': total,
        'atac': round(1 - pachete_pe_clase['legitimate'] / total, 4),  # proporția de atacuri din nod
        'clase': pachete_pe_clase,
    }
    if rand['copii']:  # nod intern: are o variabilă de împărțire și copii
        nod['var'] = rand['var']
        nod['p'] = float(rand['p'])
        copii = rand['copii'].split(';')
        conditii = rand['ramuri'].split('|')
        nod['children'] = [construieste_nod(int(copil), conditie) for copil, conditie in zip(copii, conditii)]
    return nod


scrie_json('arbore.json', construieste_nod(1))


# --- 4) regulile pentru fiecare atac ---

def converteste_regula(rand):
    return {
        'stanga': rand['stanga'].replace('msgtype=fara', 'msgtype=fără MQTT'),  # eticheta din docx
        'atac': rand['atac'],
        'pachete': int(rand['pachete']),
        'support': float(rand['support']),
        'confidence': float(rand['confidence']),
        'lift': float(rand['lift']),
    }


scrie_json('reguli.json', [converteste_regula(rand) for rand in csv.DictReader(open(cale_reguli))])

print(sorted(fisier.name for fisier in FOLDER_IESIRE.glob('*.json')), sum(pachete_pe_clasa.values()))
