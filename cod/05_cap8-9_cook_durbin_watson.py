"""
Distanța Cook, reziduuri deviance, Durbin-Watson și verificarea câmpurilor „0”
(tema MQTTset, cap. 8 și 9).

Reproduce:
  - cap. 9.3: distanța Cook pentru regresia logistică atac/legitim
    (maximul, câte puncte trec de pragurile 4/n și 0,5) și reziduurile deviance;
  - cap. 8:   testul Durbin-Watson pentru cele două regresii liniare;
  - verificarea că valorile „0” din câmpurile MQTT înseamnă „câmp lipsă”
    (pachete fără MQTT), nu valoarea zero.

Intrare:  CSV-ul MQTTset și calea fișierului .npy de ieșire.
Ieșire:   text la consolă + fișierul .npy cu distanța Cook pentru fiecare pachet
          (folosit de 08_grafice_restul.py).

Rulare:
    python 05_cap8-9_cook_durbin_watson.py ../mqttdataset_reduced.csv.zip cook.npy
"""
import sys

import numpy as np
import pandas as pd
import statsmodels.api as sm
from statsmodels.stats.stattools import durbin_watson

date = pd.read_csv(sys.argv[1], low_memory=False)
fisier_cook = sys.argv[2]

# ---------------------------------------------------------------
# 9.3 Distanța Cook pentru regresia logistică
# ---------------------------------------------------------------
y = (date.target != "legitimate").astype(int).values
X = sm.add_constant(date[["tcp.len", "tcp.time_delta", "mqtt.len"]]).values
model_logistic = sm.GLM(y, X, family=sm.families.Binomial()).fit()

# clip: p exact 0 sau 1 ar da împărțire la zero mai jos
p = np.clip(model_logistic.predict(), 1e-12, 1 - 1e-12)
w = p * (1 - p)

# levierul h = diagonala matricei hat W^(1/2) X (X'WX)^-1 X' W^(1/2)
informatie_inv = np.linalg.inv((X * w[:, None]).T @ X)
levier = w * np.einsum("ij,jk,ik->i", X, informatie_inv, X)

# Cook pentru GLM: D_i = r_i^2 * h_i / (k * (1 - h_i)^2), cu r_i reziduul Pearson
reziduu_pearson = (y - p) / np.sqrt(w)
k = X.shape[1]  # numărul de parametri (cu intercept)
cook = reziduu_pearson**2 * levier / (k * (1 - levier) ** 2)

# Praguri uzuale: 4/n (regulă practică, depinde de mărimea setului) și 0,5 (influență mare)
n = len(y)
prag_4_n = 4 / n
print("cook max", cook.max(),
      "argmax row", cook.argmax() + 1,
      "n>4/n", (cook > prag_4_n).sum(), (cook > prag_4_n).mean(),
      "n>0.5", (cook > 0.5).sum(),
      "4/n", prag_4_n)

reziduu_deviance = model_logistic.resid_deviance
print("reziduuri deviance: max", np.abs(reziduu_deviance).max(),
      ">2", (np.abs(reziduu_deviance) > 2).sum(),
      ">3", (np.abs(reziduu_deviance) > 3).sum())

print("top5", np.sort(cook)[-5:])
np.save(fisier_cook, cook)

# ---------------------------------------------------------------
# Cap. 8 Durbin-Watson pentru cele două regresii liniare
# ---------------------------------------------------------------
# Regresia 1: mqtt.len ~ tcp.len; regresia 2: tcp.time_delta ~ tcp.len + mqtt.len
regresia1 = sm.OLS(date["mqtt.len"], sm.add_constant(date["tcp.len"])).fit()
regresia2 = sm.OLS(date["tcp.time_delta"], sm.add_constant(date[["tcp.len", "mqtt.len"]])).fit()
print("DW1", durbin_watson(regresia1.resid), "DW2", durbin_watson(regresia2.resid))

# ---------------------------------------------------------------
# Verificarea câmpurilor „0”: apar doar la pachetele fără MQTT (msgtype 0)?
# ---------------------------------------------------------------
# astype(str) separă „0” (câmp lipsă) de „0x00000000” (valoare reală)
print(pd.crosstab(date["mqtt.conack.flags"].astype(str), date["mqtt.msgtype"]))
print(pd.crosstab(date["mqtt.protoname"].astype(str), date["mqtt.msgtype"]))

fara_mqtt = date[date["mqtt.msgtype"] == 0]
print("msgtype0: hdrflags", fara_mqtt["mqtt.hdrflags"].astype(str).unique()[:5],
      "mqtt.len max", fara_mqtt["mqtt.len"].max())

print(pd.crosstab(date["mqtt.kalive"], date.target))
