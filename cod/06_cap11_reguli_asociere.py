"""
Reguli de asociere cu Apriori (tema MQTTset, cap. 11).

Reproduce:
  - tranzacțiile (fiecare pachet devine un set de itemi „atribut=valoare”);
  - itemseturile frecvente (support minim 5%) și cele 308 reguli după eliminarea
    regulilor redundante;
  - regulile care prezic fiecare tip de atac (support minim 300 / 150 pachete)
    și primele 3 reguli pe atac.

Intrare:  CSV-ul MQTTset; opțional, calea unui CSV de ieșire.
Ieșire:   text la consolă; dacă e dat al doilea argument, scrie în el regulile
          pe atacuri (folosit de graficul interactiv de pe site).

Rulare:
    python 06_cap11_reguli_asociere.py ../mqttdataset_reduced.csv.zip [reguli_atacuri.csv]

Notă: ordinea în care se afișează elementele unui frozenset depinde de
PYTHONHASHSEED; pentru o ieșire identică între rulări folosiți PYTHONHASHSEED=0.
"""
import sys

import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules

date = pd.read_csv(sys.argv[1], low_memory=False)

# ---------------------------------------------------------------
# 11.1 Tranzacțiile: discretizarea atributelor
# ---------------------------------------------------------------
FLAGURI_TCP = {
    "0x00000010": "ACK",
    "0x00000018": "PSH+ACK",
    "0x00000011": "FIN+ACK",
    "0x00000002": "SYN",
    "0x00000012": "SYN+ACK",
    "0x00000004": "RST",
    "0x00000019": "FIN+PSH+ACK",
    "0x00000014": "RST+ACK",
}
TIPURI_MESAJ_MQTT = {
    0: "fara",  # pachet TCP fără MQTT
    1: "CONNECT",
    2: "CONNACK",
    3: "PUBLISH",
    4: "PUBACK",
    5: "PUBREC",
    8: "SUBSCRIBE",
    9: "SUBACK",
    12: "PINGREQ",
    13: "PINGRESP",
    14: "DISCONNECT",
}

tranzactii = pd.DataFrame({
    "flags": date["tcp.flags"].map(FLAGURI_TCP),
    "msgtype": date["mqtt.msgtype"].astype(int).map(TIPURI_MESAJ_MQTT),
    "qos": date["mqtt.qos"].astype(int),
    "dupflag": date["mqtt.dupflag"].astype(int),
    # lungimea TCP: 0 = fără date, 1460 = MSS-ul obișnuit pe Ethernet
    "len": pd.cut(date["tcp.len"], [-1, 0, 20, 1460, 1e9],
                  labels=["0", "1-20", "21-1460", "1461+"]),
    # tcp.time_delta pe sferturi: limitele sunt cuartilele (Q1 iese 33% din cauza valorilor egale)
    "delta": pd.cut(date["tcp.time_delta"], [-1, 3e-6, 2.6e-5, 1.7e-4, 1e9],
                    labels=["Q1", "Q2", "Q3", "Q4"]),
    "target": date.target,
})
print(tranzactii.head(5).to_string())
print(tranzactii.delta.value_counts(normalize=True).round(3).to_dict())

# matricea one-hot: o coloană booleană pentru fiecare item „atribut=valoare”
itemi = pd.get_dummies(tranzactii.astype(str), prefix_sep="=")
print("items", itemi.shape[1])


# ---------------------------------------------------------------
# Funcții ajutătoare
# ---------------------------------------------------------------
def singurul_item(itemset):
    """Elementul unui frozenset cu un singur item (partea dreaptă a regulii)."""
    return next(iter(itemset))


def reguli_cu_un_item_in_dreapta(itemseturi, confidenta_minima):
    # Păstrăm doar reguli cu un singur item în dreapta, ca fiecare regulă să se citească
    # „aceste valori → o valoare” (decizia din 11.2).
    reguli = association_rules(itemseturi, metric="confidence", min_threshold=confidenta_minima)
    return reguli[reguli.consequents.apply(len) == 1]


def elimina_redundante(reguli):
    """Elimină regulile redundante.

    O regulă A => c e redundantă dacă există o regulă mai generală B => c
    (B submulțime strictă a lui A) cu confidența cel puțin la fel de mare:
    itemii în plus din A nu aduc nimic.
    """
    pastreaza = []
    for _, regula in reguli.iterrows():
        mai_generale = reguli[(reguli.consequents == regula.consequents)
                              & (reguli.antecedents.apply(lambda x: x < regula.antecedents))]
        pastreaza.append(len(mai_generale) == 0 or regula.confidence > mai_generale.confidence.max())
    return reguli[pastreaza]


# ---------------------------------------------------------------
# 11.2 Apriori pe tot setul: support >= 5%, confidență >= 0,6
# ---------------------------------------------------------------
frecvente = apriori(itemi, min_support=0.05, use_colnames=True)
frecvente["k"] = frecvente.itemsets.apply(len)
print("frequent per k", frecvente.k.value_counts().sort_index().to_dict())

reguli = reguli_cu_un_item_in_dreapta(frecvente, 0.6)
print("rules", len(reguli))

# n = numărul total de itemi din regulă (stânga + cel din dreapta)
reguli_finale = elimina_redundante(reguli)
reguli_finale = reguli_finale.assign(n=reguli_finale.antecedents.apply(len) + 1)
print("pruned", len(reguli_finale),
      reguli_finale.n.value_counts().sort_index().to_dict(),
      reguli_finale.support.min(), reguli_finale.support.max(),
      reguli_finale.lift.min(), reguli_finale.lift.max(), reguli_finale.lift.median())

cu_clasa_in_dreapta = reguli_finale[reguli_finale.consequents.apply(lambda x: singurul_item(x).startswith("target"))]
print("RHS classes", cu_clasa_in_dreapta.consequents.apply(singurul_item).value_counts().to_dict())

top10_lift = reguli_finale.sort_values("lift", ascending=False).head(10)
print(top10_lift[["antecedents", "consequents", "support", "confidence", "lift"]].to_string())

# ---------------------------------------------------------------
# 11.3 Reguli pe atacuri
# ---------------------------------------------------------------
# Atacurile rare (ex. flood) nu ating 5%, deci pragul de support se dă
# în număr absolut de pachete (300, apoi 150).
ATACURI = ["target=" + atac for atac in ["dos", "bruteforce", "malformed", "slowite", "flood"]]

for pachete_minime in [300, 150]:
    frecvente_atac = apriori(itemi, min_support=pachete_minime / len(itemi), use_colnames=True, max_len=7)
    reguli_atac = reguli_cu_un_item_in_dreapta(frecvente_atac, 0.5)
    # dreapta = un atac, stânga = doar atribute ale pachetului (fără clasă)
    reguli_atac = reguli_atac[
        reguli_atac.consequents.apply(lambda x: singurul_item(x) in ATACURI)
        & reguli_atac.antecedents.apply(lambda x: not any(item.startswith("target") for item in x))
    ]
    reguli_atac = elimina_redundante(reguli_atac)
    print(pachete_minime, reguli_atac.consequents.apply(singurul_item).value_counts().to_dict())

# De aici se folosesc regulile de la ultimul prag (150 de pachete).
if len(sys.argv) > 2:
    pd.DataFrame({
        "stanga": reguli_atac.antecedents.apply(lambda x: " & ".join(sorted(x))),
        "atac": reguli_atac.consequents.apply(lambda x: singurul_item(x)[len("target="):]),
        "pachete": (reguli_atac.support * len(itemi)).round().astype(int),
        "support": reguli_atac.support,
        "confidence": reguli_atac.confidence,
        "lift": reguli_atac.lift,
    }).to_csv(sys.argv[2], index=False)

# primele 3 reguli pe atac (după confidență, apoi support)
for atac in ATACURI:
    reguli_atacului = reguli_atac[reguli_atac.consequents.apply(lambda x: singurul_item(x) == atac)]
    primele3 = reguli_atacului.sort_values(["confidence", "support"], ascending=False).head(3)
    for _, regula in primele3.iterrows():
        print(atac, sorted(regula.antecedents),
              round(regula.support * len(itemi)),
              round(regula.support, 4),
              round(regula.confidence, 3),
              round(regula.lift, 1))
