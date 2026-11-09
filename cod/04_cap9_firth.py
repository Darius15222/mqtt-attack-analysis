"""
Regresia logistică Firth (cap. 9.5 din tema MQTTset).

Reproduce: coeficienții, erorile standard și statisticile Chisq
(testul raportului de verosimilitate penalizată) pentru fiecare predictor.

Intrare:  CSV-ul MQTTset (sau arhiva .zip, pandas o citește direct).
Ieșire:   doar text la consolă.

Rulare:
    python 04_cap9_firth.py ../mqttdataset_reduced.csv.zip

Firth este implementat manual (numpy), fără pachete suplimentare.
Motivul folosirii Firth: datele au separare (aproape) completă, iar regresia
logistică obișnuită dă coeficienți care fug la infinit. Penalizarea Firth
ține coeficienții finiți.
"""
import sys

import numpy as np
import pandas as pd

# ---------------------------------------------------------------
# Date: y = 1 pentru orice atac, 0 pentru trafic legitim
# ---------------------------------------------------------------
PREDICTORI = ["tcp.len", "mqtt.len", "tcp.time_delta", "mqtt.qos", "mqtt.dupflag"]

date = pd.read_csv(sys.argv[1], low_memory=False, usecols=PREDICTORI + ["target"])
y = (date.target != "legitimate").values.astype(float)
# prima coloană = 1, pentru interceptul modelului
X = np.column_stack([np.ones(len(date)), date[PREDICTORI].values])


# ---------------------------------------------------------------
# Algoritmul Firth
# ---------------------------------------------------------------
def verosimilitate_penalizata(X, y, beta):
    """Log-verosimilitatea penalizată Firth: log L(beta) + 0.5 * log det I(beta).

    Întoarce și p (probabilitățile), w = p(1-p) și matricea de informație I,
    care sunt refolosite de pasul Newton.
    """
    eta = np.clip(X @ beta, -500, 500)  # clip ca exp() să nu dea overflow
    p = 1 / (1 + np.exp(-eta))
    w = p * (1 - p)
    informatie = (X * w[:, None]).T @ X  # I = X' W X
    # 1e-300 evită log(0) când p ajunge exact 0 sau 1
    log_verosimilitate = np.sum(y * np.log(p + 1e-300) + (1 - y) * np.log(1 - p + 1e-300))
    penalizare = 0.5 * np.linalg.slogdet(informatie)[1]
    return log_verosimilitate + penalizare, p, w, informatie


def ajusteaza_firth(X, y, coef_fixat=None, max_iteratii=200):
    """Estimează coeficienții Firth prin Newton-Raphson cu înjumătățirea pasului.

    coef_fixat: indicele unui coeficient ținut la 0 (pentru modelul restrâns
    din testul Chisq). Întoarce (coeficienți, erori standard, log-verosimilitate
    penalizată).

    Pașii unei iterații:
      1. calculăm p, W și I = X'WX în punctul curent;
      2. h = diagonala matricei hat H = W^(1/2) X I^-1 X' W^(1/2);
      3. scorul modificat Firth: U = X' (y - p + h (0.5 - p));
      4. pasul Newton: I^-1 U (doar pe coeficienții liberi);
      5. înjumătățim pasul până când verosimilitatea penalizată nu scade.
    """
    beta = np.zeros(X.shape[1])
    liber = np.ones(X.shape[1], bool)
    if coef_fixat is not None:
        liber[coef_fixat] = False  # rămâne la valoarea de start, 0

    for _ in range(max_iteratii):
        L, p, w, informatie = verosimilitate_penalizata(X, y, beta)
        informatie_inv = np.linalg.inv(informatie)
        h = w * np.einsum("ij,jk,ik->i", X, informatie_inv, X)
        scor = X.T @ (y - p + h * (0.5 - p))
        informatie_libera = informatie[np.ix_(liber, liber)]
        pas = np.linalg.solve(informatie_libera, scor[liber])

        factor = 1.0
        while True:
            beta_nou = beta.copy()
            beta_nou[liber] += factor * pas
            if verosimilitate_penalizata(X, y, beta_nou)[0] >= L - 1e-9 or factor < 1e-4:
                break
            factor /= 2
        beta = beta_nou

        if np.max(np.abs(factor * pas)) < 1e-8:  # convergență
            break

    L, p, w, informatie = verosimilitate_penalizata(X, y, beta)
    erori_standard = np.sqrt(np.diag(np.linalg.inv(informatie)))
    return beta, erori_standard, L


# ---------------------------------------------------------------
# 9.5 Modelul complet: coeficienți și erori standard
# ---------------------------------------------------------------
coeficienti, erori_standard, L_complet = ajusteaza_firth(X, y)
print("coef", np.round(coeficienti, 4))
print("se", np.round(erori_standard, 4))

# ---------------------------------------------------------------
# 9.5 Chisq pe predictor: 2 * (L complet - L fără predictor)
# ---------------------------------------------------------------
# Modelul restrâns ține coeficientul j la 0 (j = 0 este interceptul, deci pornim de la 1).
for j, nume in enumerate(PREDICTORI, 1):
    _, _, L_restrans = ajusteaza_firth(X, y, coef_fixat=j)
    print(nume, "chisq", round(2 * (L_complet - L_restrans), 2))
