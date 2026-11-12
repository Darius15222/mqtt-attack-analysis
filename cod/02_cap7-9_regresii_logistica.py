"""Corelații pe clase, regresii liniare și regresie logistică pentru MQTTset (cap. 7-9).

Reproduce cifrele din:
  - matricea Spearman pe tot setul și pe fiecare clasă (cap. 7);
  - verificările pe flood / tcp.len > 1460 și valorile maxime (cap. 8);
  - regresiile liniare 1-3, inclusiv variantele logaritmice (cap. 8-9);
  - regresia logistică: modelul final cu 3 predictori, separarea modelului cu 5 predictori
    (pașii 10-30), probabilitățile prezise pe clase, medianele din 9.1, msgtype pe clase (cap. 9).

Intrare:  fișierul CSV MQTTset (merge și .zip, pandas îl citește direct).
Ieșire:   doar text la stdout.

Rulare:
    python 02_cap7-9_regresii_logistica.py ../mqttdataset_reduced.csv.zip
"""
import sys

import numpy as np
import pandas as pd
import statsmodels.api as sm
from scipy import stats

date = pd.read_csv(sys.argv[1], low_memory=False)
date["is_attack"] = (date.target != "legitimate").astype(int)

# Cele 13 coloane numerice folosite în matricea de corelație (cap. 7).
COLOANE_NUMERICE = [
    "tcp.time_delta", "tcp.len", "mqtt.len", "mqtt.kalive", "mqtt.qos",
    "mqtt.dupflag", "mqtt.retain", "mqtt.conflag.cleansess", "mqtt.conflag.passwd",
    "mqtt.conflag.uname", "mqtt.proto_len", "mqtt.ver", "mqtt.conack.val",
]
PREDICTORI_5 = ["tcp.len", "mqtt.len", "tcp.time_delta", "mqtt.qos", "mqtt.dupflag"]
PREDICTORI_3 = ["tcp.len", "tcp.time_delta", "mqtt.len"]

# --- Cap. 7: matricea Spearman ---
pd.set_option("display.width", 250)  # ca matricea 13×13 să încapă pe un rând
spearman = date[COLOANE_NUMERICE].corr("spearman")
print(spearman.round(2).to_string())

# Pe fiecare clasă: câte perechi de coloane sunt practic identice (ρ ≥ 0,995).
# Coloanele constante în clasă sunt scoase, altfel corelația lor e NaN.
for clasa, grup in date.groupby("target"):
    coloane_variabile = [c for c in COLOANE_NUMERICE if grup[c].nunique() > 1]
    matrice = grup[coloane_variabile].corr("spearman").values
    deasupra_diagonalei = np.triu_indices(len(coloane_variabile), 1)
    print(clasa,
          "pairs", len(deasupra_diagonalei[0]),
          "r>=0.995", (matrice[deasupra_diagonalei] >= 0.995).sum())

print("pearson qos-mqtt.len", date["mqtt.qos"].corr(date["mqtt.len"]))

# --- Cap. 8: verificări pe flood și pe valorile mari ---
# 1460 = payload-ul TCP maxim într-un cadru Ethernet (MSS tipic).
flood = date[date.target == "flood"]
print("flood mqtt.len when tcp.len>1460", flood[flood["tcp.len"] > 1460]["mqtt.len"].describe().to_dict())
print("flood ACK empty", ((flood["tcp.flags"] == "0x00000010") & (flood["tcp.len"] == 0)).sum(),
      "tcp.len>1460 all", (date["tcp.len"] > 1460).sum(),
      date[date["tcp.len"] > 1460].target.unique())
print("legit tcp.len max", date[date.target == "legitimate"]["tcp.len"].max(),
      "time_delta max", date["tcp.time_delta"].max(),
      (date["tcp.time_delta"] > 50).sum())

# --- Regresia 1: mqtt.len ~ tcp.len (simplă și pe log(1 + x)) ---
regresia1 = sm.OLS(date["mqtt.len"], sm.add_constant(date[["tcp.len"]])).fit()
print("R1", regresia1.params.round(4).to_dict(), round(regresia1.rsquared, 4),
      "ssr", regresia1.ssr,
      "res skew/kurt", round(stats.skew(regresia1.resid), 2), round(stats.kurtosis(regresia1.resid), 1))

date_log = np.log1p(date[["tcp.len", "mqtt.len"]])  # log1p pentru că există multe valori 0
regresia1_log = sm.OLS(date_log["mqtt.len"], sm.add_constant(date_log["tcp.len"])).fit()
print("R1log", regresia1_log.params.round(3).to_dict(), round(regresia1_log.rsquared, 3),
      round(stats.skew(regresia1_log.resid), 2), round(stats.kurtosis(regresia1_log.resid), 1))

# --- Regresia 2: tcp.time_delta ~ tcp.len + mqtt.len ---
regresia2 = sm.OLS(date["tcp.time_delta"], sm.add_constant(date[["tcp.len", "mqtt.len"]])).fit()
print("R2", regresia2.params.to_dict(), regresia2.pvalues.to_dict(), regresia2.rsquared,
      stats.skew(regresia2.resid), stats.kurtosis(regresia2.resid))

# --- Regresia 3: regresia 1 pe fiecare clasă (simplă și logaritmică) ---
for clasa, grup in date.groupby("target"):
    simpla = sm.OLS(grup["mqtt.len"], sm.add_constant(grup["tcp.len"])).fit()
    grup_log = np.log1p(grup[["tcp.len", "mqtt.len"]])
    logaritmica = sm.OLS(grup_log["mqtt.len"], sm.add_constant(grup_log["tcp.len"])).fit()
    print("R3", clasa, len(grup), simpla.params.round(4).tolist(),
          round(simpla.rsquared, 3), round(logaritmica.rsquared, 3))

# Concluzia cap. 8: cât din fiecare clasă stă la cel mult 2 bytes de dreapta traficului normal.
normal = date[date.target == "legitimate"]
dreapta_normal = sm.OLS(normal["mqtt.len"], sm.add_constant(normal["tcp.len"])).fit().params
distanta = (date["mqtt.len"] - (dreapta_normal["const"] + dreapta_normal["tcp.len"] * date["tcp.len"])).abs()
print("R3 pe dreapta normalului (<= 2 bytes, %)", (distanta <= 2).groupby(date.target).mean().mul(100).round(1).to_dict())

# --- Cap. 9: regresia logistică is_attack ~ 3 predictori (modelul final) ---
logistica3 = sm.GLM(date.is_attack, sm.add_constant(date[PREDICTORI_3]),
                    family=sm.families.Binomial()).fit()
print("LOG6", logistica3.params.round(4).to_dict(), logistica3.bse.round(4).to_dict(),
      logistica3.tvalues.round(2).to_dict(),
      logistica3.null_deviance, logistica3.deviance, logistica3.aic,
      "iters", logistica3.fit_history["iteration"])

# Modelul cu 5 predictori are separare cvasi-completă (qos = 1 și dupflag = 1 doar la atac):
# coeficienții și erorile standard cresc
# la fiecare pas. tol=1e-30 împiedică oprirea timpurie, ca să vedem pașii 10-30.
for nr_pasi in [10, 15, 20, 25, 30]:
    logistica5 = sm.GLM(date.is_attack, sm.add_constant(date[PREDICTORI_5]),
                        family=sm.families.Binomial()).fit(maxiter=nr_pasi, tol=1e-30)
    print("LOG5 it", nr_pasi, logistica5.params.round(3).to_dict(), logistica5.bse.round(1).to_dict(),
          round(logistica5.deviance, 1))

# Probabilitățile prezise de modelul final, pe clase.
# „~0.42” = ponderea rândurilor cu probabilitatea ≈ 0,4235 (valoarea discutată în 9.4).
probabilitati = pd.Series(logistica3.predict(), index=date.index)
for clasa in date.target.unique():
    p = probabilitati[date.target == clasa]
    print("prob", clasa,
          "max", round(p.max(), 3),
          "med", round(p.median(), 3),
          ">0.9", round((p > 0.9).mean(), 3),
          "~0.42", round((np.abs(p - 0.4235) < 0.005).mean(), 3))

# --- 9.1: mediana și quartilele pentru atacuri ---
atacuri = date[date.is_attack == 1]
for coloana in ["tcp.time_delta", "tcp.len", "mqtt.len"]:
    print("9.1", coloana, atacuri[coloana].median(), atacuri[coloana].quantile([.25, .75]).tolist())

print("msgtype by class", pd.crosstab(date["mqtt.msgtype"], date.target).to_string())
