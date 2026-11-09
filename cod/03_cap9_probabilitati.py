"""Probabilitățile prezise de regresia logistică și verificările din cap. 9 pentru MQTTset.

Reproduce cifrele din:
  - 9.6: probabilitățile prezise pe clase și curva logistică pentru un pachet tipic;
  - tabelul 9.2: mediana și quartilele pentru atacuri;
  - mqtt.msgtype pe clase și pachetele PUBLISH+ACK din dos;
  - câteva calcule de verificare citate în text (tcp.time_delta = 3e-6,
    exemplul de asimetrie/aplatizare, contribuția χ² pentru conack).

Intrare:  fișierul CSV MQTTset (merge și .zip, pandas îl citește direct).
Ieșire:   doar text la stdout.

Rulare:
    python 03_cap9_probabilitati.py ../mqttdataset_reduced.csv.zip
"""
import sys

import numpy as np
import pandas as pd
import statsmodels.api as sm

date = pd.read_csv(sys.argv[1], low_memory=False)
date["is_attack"] = (date.target != "legitimate").astype(int)

# --- 9.6: modelul logistic final și probabilitățile prezise pe clase ---
model = sm.GLM(date.is_attack, sm.add_constant(date[["tcp.len", "tcp.time_delta", "mqtt.len"]]),
               family=sm.families.Binomial()).fit()
probabilitati = pd.Series(np.asarray(model.predict()), index=date.index)
for clasa in date.target.unique():
    p = probabilitati[date.target == clasa]
    print("prob", clasa,
          "max", round(p.max(), 3),
          "med", round(p.median(), 3),
          ">0.9", round((p > 0.9).mean(), 3),
          "~0.42", round((np.abs(p - 0.4235) < 0.005).mean(), 3))

# Probabilitatea pentru un pachet tipic: tcp.len = 13, mqtt.len = 11, tcp.time_delta = 0.
coef = model.params
print("curve d=0 typical", 1 / (1 + np.exp(-(coef.const + coef["tcp.len"] * 13 + coef["mqtt.len"] * 11))))

# --- Tabelul 9.2: mediana și quartilele pentru atacuri ---
atacuri = date[date.is_attack == 1]
for coloana in ["tcp.time_delta", "tcp.len", "mqtt.len"]:
    print("9.2", coloana, atacuri[coloana].median(), atacuri[coloana].quantile([.25, .75]).tolist())

# --- mqtt.msgtype pe clase ---
print(pd.crosstab(date["mqtt.msgtype"], date.target).to_string())

# Pachetele dos de tip PUBLISH (msgtype 3) cu flag-ul TCP ACK (0x10).
dos_publish_ack = date[(date.target == "dos")
                       & (date["mqtt.msgtype"] == 3)
                       & (date["tcp.flags"] == "0x00000010")]
print("dos publish ACK", len(dos_publish_ack), dos_publish_ack["tcp.len"].unique()[:5],
      "70%", round(len(dos_publish_ack) * .7))

# --- Verificări pentru cifre citate în text ---
print("time_delta =3e-6 share", (date["tcp.time_delta"] == 3e-6).mean(),
      "<=3e-6", (date["tcp.time_delta"] <= 3e-6).mean())

# Exemplul mic de asimetrie și aplatizare din raport.
exemplu = pd.Series([1, 2, 2, 3, 10])
print(exemplu.skew(), exemplu.kurt())

# Contribuția unei celule la χ²: (O - E)² / E, cu O = 1428 și E = 62,5742.
print("conack contrib", (1428 - 62.5742) ** 2 / 62.5742)
