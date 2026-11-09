# JSON-urile pentru graficele interactive (public/date/)
# Rulare: python3 scripts/date_grafice.py <date.csv> <rezultate/corelatii> <noduri_clasificare.csv> <reguli_atac.csv>
# noduri_clasificare.csv: scris de cod/09_cap10_arbori_ctree.R; reguli_atac.csv: cod/06_cap11_reguli_asociere.py cu al doilea argument
import sys, csv, json, math
from collections import Counter
from pathlib import Path

date_csv, cor_dir, noduri_csv, reguli_csv = sys.argv[1:5]
out = Path(__file__).resolve().parent.parent / 'public/date'; out.mkdir(parents=True, exist_ok=True)
CL = ['legitimate', 'dos', 'bruteforce', 'malformed', 'slowite', 'flood']
scrie = lambda f, v: (out / f).write_text(json.dumps(v, ensure_ascii=False, separators=(',', ':')))

# 1) clasele
with open(date_csv) as f: n = Counter(r['target'] for r in csv.DictReader(f))
scrie('clase.json', [{'clasa': c, 'pachete': n[c]} for c in CL])

# 2) corelațiile Spearman: tot setul + fiecare clasă
cor = {}
for nume in ['tot_setul'] + CL:
    rows = list(csv.reader(open(f'{cor_dir}/matrice_{nume}.csv')))
    vars_ = rows[0][1:]
    m = [[round(float(v), 3) if v and not math.isnan(float(v)) else None for v in r[1:]] for r in rows[1:]]
    cor[nume] = {'variabile': vars_, 'matrice': m}
scrie('corelatii.json', cor)

# 3) arborele de clasificare (noduri imbricate)
nod = {int(r['id']): r for r in csv.DictReader(open(noduri_csv))}
def arbore(i, ramura=''):
    r = nod[i]; clase = {c: int(r[c]) for c in CL}; n_ = int(r['n'])
    d = {'id': i, 'ramura': ramura, 'n': n_, 'atac': round(1 - clase['legitimate'] / n_, 4), 'clase': clase}
    if r['copii']:
        d['var'] = r['var']; d['p'] = float(r['p'])
        d['children'] = [arbore(int(k), lab) for k, lab in zip(r['copii'].split(';'), r['ramuri'].split('|'))]
    return d
scrie('arbore.json', arbore(1))

# 4) regulile pentru fiecare atac
scrie('reguli.json', [{k: (float(v) if k in ('support', 'confidence', 'lift') else int(v) if k == 'pachete' else v) for k, v in r.items()}
                      for r in csv.DictReader(open(reguli_csv))])
print(sorted(p.name for p in out.glob('*.json')), sum(n.values()))
