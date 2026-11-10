"""Statistici descriptive, teste și corelații pentru MQTTset (cap. 1-7 din raport).

Reproduce cifrele din:
  - distribuția claselor și coloanele constante;
  - statisticile descriptive (cap. 5) și valorile extreme după regula IQR;
  - tabelul pe clase, testul Kruskal-Wallis, χ² pe tcp.flags și mqtt.conack.val,
    testul Mann-Whitney flood vs. legitimate (cap. 6);
  - corelațiile Spearman/Pearson și verificările din cap. 7;
  - exemplele de rânduri și tabelul cu valori tipice normal/atac (cap. 3).

Intrare:  fișierul CSV MQTTset (merge și .zip, pandas îl citește direct).
Ieșire:   doar text la stdout.

Rulare:
    python 01_cap1-7_statistici_corelatii.py ../mqttdataset_reduced.csv.zip
"""
import sys

import pandas as pd
from scipy import stats

date = pd.read_csv(sys.argv[1], low_memory=False)

# Cele 13 coloane numerice folosite în matricea de corelație (cap. 7).
COLOANE_NUMERICE = [
    "tcp.time_delta", "tcp.len", "mqtt.len", "mqtt.kalive", "mqtt.qos",
    "mqtt.dupflag", "mqtt.retain", "mqtt.conflag.cleansess", "mqtt.conflag.passwd",
    "mqtt.conflag.uname", "mqtt.proto_len", "mqtt.ver", "mqtt.conack.val",
]

# Indicatorii binari / aproape constanți: îi descriem prin procentul de valori nenule.
INDICATORI = [
    "mqtt.dupflag", "mqtt.retain", "mqtt.conflag.cleansess", "mqtt.conflag.passwd",
    "mqtt.conflag.uname", "mqtt.proto_len", "mqtt.ver", "mqtt.conack.val", "mqtt.qos",
]

# --- Cap. 1-3: dimensiunea setului, clasele, coloanele constante ---
print(date.shape)
print(date.target.value_counts(), (date.target.value_counts(normalize=True) * 100).round(2))

coloane_constante = [c for c in date if date[c].nunique() == 1]
print("const", len(coloane_constante), coloane_constante)

# --- Cap. 5: statistică descriptivă pentru coloanele continue ---
for coloana in ["tcp.len", "tcp.time_delta", "mqtt.len", "mqtt.kalive"]:
    x = date[coloana]
    print(coloana,
          "mean", round(x.mean(), 2),
          "std", round(x.std(), 2),
          "med", x.median(),
          "q", x.quantile([.25, .75]).tolist(),
          "skew", round(x.skew(), 2),
          "kurt", round(x.kurt(), 1))

    # Valori extreme după regula IQR: în afara [Q1 - 1,5·IQR, Q3 + 1,5·IQR].
    q1, q3 = x.quantile([.25, .75])
    iqr = q3 - q1
    prag_sus = q3 + 1.5 * iqr
    extreme = (x < q1 - 1.5 * iqr) | (x > prag_sus)
    print("  IQR: peste", prag_sus,
          "n", extreme.sum(),
          round(extreme.mean() * 100, 2), "%",
          date.target[extreme].value_counts(normalize=True).round(3).to_dict())

# Coloanele categoriale: valoarea cea mai frecventă și ponderea ei.
# Le citim ca text pentru că amestecă numere ("0") cu valori hex ("0x00000010") și NaN.
for coloana in ["tcp.flags", "mqtt.hdrflags", "mqtt.msgtype", "mqtt.conflags",
                "mqtt.protoname", "mqtt.conack.flags", "mqtt.msg"]:
    frecvente = date[coloana].astype(str).value_counts(normalize=True)
    print(coloana, frecvente.index[0], round(frecvente.iloc[0] * 100, 2))

for coloana in INDICATORI:
    nenule = date[coloana] != 0
    print(coloana, "nonzero%", round(nenule.mean() * 100, 2), "count", nenule.sum(),
          date[coloana].unique()[:6])

# --- Cap. 6: comparații pe clase ---
legitim = date[date.target == "legitimate"]
tcp_len_legitim = legitim["tcp.len"]
print("leg tcp.len med q", tcp_len_legitim.median(), tcp_len_legitim.quantile([.25, .75]).tolist(),
      "mean", round(tcp_len_legitim.mean(), 2),
      "zero%", round((tcp_len_legitim == 0).mean() * 100, 1),
      "10-14%", round(tcp_len_legitim.between(10, 14).mean() * 100, 1))

# Mediana și quartilele pe clase, apoi Kruskal-Wallis (date puternic asimetrice, deci test neparametric).
for coloana in ["tcp.time_delta", "tcp.len", "mqtt.len"]:
    pe_clase = date.groupby("target")[coloana]
    print(coloana, {clasa: (g.median(), g.quantile(.25), g.quantile(.75)) for clasa, g in pe_clase})
    print(" KW H", stats.kruskal(*[g.values for _, g in pe_clase]))

for coloana in ["tcp.flags", "mqtt.hdrflags", "mqtt.msgtype"]:
    for clasa, grup in date.groupby("target"):
        frecvente = grup[coloana].astype(str).value_counts(normalize=True)
        print(" ", coloana, clasa, frecvente.index[0], round(frecvente.iloc[0] * 100, 2))

for coloana in ["mqtt.dupflag", "mqtt.retain", "mqtt.conflag.cleansess", "mqtt.conflag.passwd",
                "mqtt.conflag.uname", "mqtt.conack.val", "mqtt.qos"]:
    procent_nenule = date.groupby("target")[coloana].apply(lambda s: (s != 0).mean() * 100)
    print(coloana, procent_nenule.round(2).to_dict())

# 65535 = keep-alive maxim din MQTT, specific atacului slowite.
print("kalive slowite 65535%",
      round((date[date.target == "slowite"]["mqtt.kalive"] == 65535).mean() * 100, 2),
      date["mqtt.kalive"].unique()[:10])

# Testul χ² de independență: tcp.flags × clasă.
observate = pd.crosstab(date["tcp.flags"], date.target)
print(observate)
chi2_flags = stats.chi2_contingency(observate)
print("chi2", chi2_flags[0], chi2_flags[2])
asteptate = chi2_flags[3]
print("E FIN,ACK bf",
      asteptate[observate.index.get_loc("0x00000011"), observate.columns.get_loc("bruteforce")])

# Testul χ² pentru mqtt.conack.val × clasă (și frecvențele așteptate).
observate_conack = pd.crosstab(date["mqtt.conack.val"], date.target)
chi2_conack = stats.chi2_contingency(observate_conack)
print(observate_conack, "chi2", chi2_conack[0])
print("E", chi2_conack[3])

# Mann-Whitney pe tcp.time_delta: legitimate vs. flood, în ambele ordini (U se schimbă cu ordinea).
delta_legitim = legitim["tcp.time_delta"]
delta_flood = date[date.target == "flood"]["tcp.time_delta"]
print("MW", stats.mannwhitneyu(delta_legitim, delta_flood), len(delta_legitim) * len(delta_flood))
print("MW flipped", stats.mannwhitneyu(delta_flood, delta_legitim))

# --- Cap. 4: rânduri de exemplu (numerotate de la 1, ca în CSV) ---
for clasa in date.target.unique():
    print(clasa, list(date.index[date.target == clasa][:2] + 1))
print(date.loc[[0, 4, 1, 46, 36, 6, 1420], ["tcp.flags", "tcp.len", "mqtt.len", "target"]])

# --- Cap. 7: corelații Spearman / Pearson ---
spearman = date[COLOANE_NUMERICE].corr("spearman")
print(spearman.round(2))

date["is_attack"] = (date.target != "legitimate").astype(int)
perechi = [
    ("tcp.len", "mqtt.len"), ("tcp.time_delta", "tcp.len"), ("tcp.time_delta", "mqtt.len"),
    ("tcp.len", "is_attack"), ("mqtt.len", "is_attack"), ("tcp.time_delta", "is_attack"),
    ("mqtt.qos", "is_attack"), ("mqtt.dupflag", "is_attack"),
]
for a, b in perechi:
    print(a, b, round(date[a].corr(date[b]), 3), round(date[a].corr(date[b], method="spearman"), 3))

# Câmpurile de conectare (mqtt.ver, mqtt.kalive) sunt nenule exact pe aceleași rânduri.
ver_nenul = date["mqtt.ver"] != 0
print("conn nonzero rows", ver_nenul.sum(), (ver_nenul == (date["mqtt.kalive"] != 0)).all())

qos1 = date[date["mqtt.qos"] == 1]
print("qos1", len(qos1), qos1.target.unique(), qos1["mqtt.len"].min(), qos1["mqtt.len"].max(),
      date[date["mqtt.qos"] == 0]["mqtt.len"].mean())
# dupflag = 1 apare doar pe rânduri cu qos = 1 (rezultatul așteptat e 0).
print("dup1 subset qos1", ((date["mqtt.dupflag"] == 1) & (date["mqtt.qos"] != 1)).sum())

for clasa, grup in date.groupby("target"):
    constante_in_clasa = [c for c in COLOANE_NUMERICE if grup[c].nunique() == 1]
    print(clasa, "tcp-mqtt spearman",
          round(grup["tcp.len"].corr(grup["mqtt.len"], method="spearman"), 2),
          "nconst", len(constante_in_clasa), constante_in_clasa)

flood = date[date.target == "flood"]
print("tcp.len max flood", flood["tcp.len"].max(), "mqtt.len flood max", flood["mqtt.len"].max())

# Sumele din formula coeficientului Pearson, calculate de mână pentru exemplul din raport.
x = date["tcp.len"]
y = date["mqtt.len"]
print("sxy", ((x - x.mean()) * (y - y.mean())).sum(),
      "sxx", ((x - x.mean()) ** 2).sum(),
      "syy", ((y - y.mean()) ** 2).sum())

# --- Cap. 3: tabelul cu valori tipice „normal” vs. „atac” ---
# Pentru atac luăm cea mai frecventă valoare care apare (aproape) numai în atacuri:
# cel puțin 99% din rândurile cu acea valoare sunt atacuri.
atacuri = date[date.is_attack == 1]
for coloana in ["tcp.flags", "tcp.time_delta", "tcp.len", "mqtt.hdrflags", "mqtt.msgtype",
                "mqtt.len", "mqtt.qos", "mqtt.dupflag", "mqtt.kalive"]:
    valori_text = date[coloana].astype(str)
    pondere_atac = date.groupby(valori_text)["is_attack"].mean()
    valori_de_atac = pondere_atac[pondere_atac >= 0.99].index

    frecvente_atac = atacuri[coloana].astype(str).value_counts()
    frecvente_atac = frecvente_atac[frecvente_atac.index.isin(valori_de_atac)]
    frecvente_normal = legitim[coloana].astype(str).value_counts(normalize=True)

    if len(frecvente_atac):
        exemplu_atac = (frecvente_atac.index[0], round(frecvente_atac.iloc[0] / len(atacuri) * 100, 1))
    else:
        exemplu_atac = None
    print("T4", coloana,
          "normal", frecvente_normal.index[0], round(frecvente_normal.iloc[0] * 100, 1),
          "attack", exemplu_atac)
