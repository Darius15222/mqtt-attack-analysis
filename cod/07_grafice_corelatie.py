"""
Graficele de corelație (tema MQTTset, cap. 7.1-7.3).

Reproduce:
  - corr_tot.png: harta corelațiilor Spearman pe tot setul;
  - corr_<clasă>.png: aceeași hartă pe fiecare clasă
    (corr_legitimate.png, corr_dos.png, ..., corr_flood.png);
  - corr_scatter.png: trei diagrame de dispersie pe ranguri, cu dreapta de regresie
    și ρ Spearman; la consolă se afișează ρ și p pentru fiecare pereche.

Intrare:  CSV-ul MQTTset și folderul de ieșire (trebuie să existe).
Ieșire:   fișierele PNG de mai sus + text la consolă.

Rulare:
    python 07_grafice_corelatie.py ../mqttdataset_reduced.csv.zip grafice
"""
import sys

import matplotlib
import numpy as np
import pandas as pd

matplotlib.use("Agg")  # fără fereastră, doar salvare în fișiere
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
from scipy import stats

date = pd.read_csv(sys.argv[1], low_memory=False)
folder_iesire = sys.argv[2]

VARIABILE = [
    "tcp.time_delta", "tcp.len", "mqtt.len", "mqtt.kalive", "mqtt.qos",
    "mqtt.dupflag", "mqtt.retain", "mqtt.conflag.cleansess", "mqtt.conflag.passwd",
    "mqtt.conflag.uname", "mqtt.proto_len", "mqtt.ver", "mqtt.conack.val",
]


def format_ro(valoare, zecimale=2):
    """Număr în format românesc: virgulă zecimală, minus tipografic, fără „−0,00”."""
    if round(valoare, zecimale) == 0:
        valoare = 0.0
    return f"{valoare:.{zecimale}f}".replace(".", ",").replace("-", "−")


# celulele NaN (corelație imposibilă) apar gri
paleta = plt.get_cmap("RdBu").copy()
paleta.set_bad("#dddddd")


def harta_corelatie(subset, titlu, nume_fisier):
    """Harta corelațiilor Spearman dintre VARIABILE, cu valoarea scrisă în fiecare celulă."""
    # o variabilă constantă în subset dă NaN (nu are ranguri diferite)
    corelatii = subset[VARIABILE].corr("spearman").values
    fig, ax = plt.subplots(figsize=(11.7, 9.88), dpi=100)
    imagine = ax.imshow(np.ma.masked_invalid(corelatii), cmap=paleta, vmin=-1, vmax=1)

    for i in range(len(VARIABILE)):
        for j in range(len(VARIABILE)):
            if not np.isnan(corelatii[i, j]):
                # text alb pe celulele închise la culoare, negru în rest
                culoare_text = "white" if abs(corelatii[i, j]) > 0.5 else "black"
                ax.text(j, i, format_ro(corelatii[i, j]),
                        ha="center", va="center", fontsize=7.5, color=culoare_text)

    ax.set_xticks(range(len(VARIABILE)))
    ax.set_xticklabels(VARIABILE, rotation=90, fontsize=9)
    ax.set_yticks(range(len(VARIABILE)))
    ax.set_yticklabels(VARIABILE, fontsize=9)
    bara_culori = fig.colorbar(imagine, ax=ax, shrink=0.8)
    bara_culori.ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: format_ro(v)))
    ax.set_title(titlu, fontsize=10)
    fig.tight_layout()
    fig.savefig(f"{folder_iesire}/{nume_fisier}")
    plt.close(fig)


# ---------------------------------------------------------------
# 7.1 Corelația Spearman pe tot setul (corr_tot.png)
# ---------------------------------------------------------------
harta_corelatie(date,
                "Corelația Spearman, variabile numerice, ordinale și binare, tot setul (gri = nu se poate calcula)",
                "corr_tot.png")

# ---------------------------------------------------------------
# 7.3 Corelația Spearman pe fiecare clasă (corr_<clasă>.png)
# ---------------------------------------------------------------
CLASE = ["legitimate", "dos", "bruteforce", "malformed", "slowite", "flood"]
for clasa in CLASE:
    harta_corelatie(date[date.target == clasa],
                    f"Corelația Spearman, {clasa} (gri = variabilă constantă în această clasă)",
                    f"corr_{clasa}.png")

# ---------------------------------------------------------------
# 7.2 Diagrame de dispersie pe ranguri (corr_scatter.png)
# ---------------------------------------------------------------
# 8000 de pachete ajung pentru grafic; R și p se calculează pe tot setul.
esantion = date.sample(8000, random_state=42)
PERECHI = [("tcp.len", "mqtt.len"), ("tcp.time_delta", "tcp.len"), ("tcp.time_delta", "mqtt.len")]

fig, axe = plt.subplots(1, 3, figsize=(15.6, 4.94), dpi=100)
for ax, (var_x, var_y) in zip(axe, PERECHI):
    R, p = stats.spearmanr(date[var_x], date[var_y])

    # Spearman = Pearson pe ranguri, deci desenăm rangurile, nu valorile
    rang_x = esantion[var_x].rank()
    rang_y = esantion[var_y].rank()
    ax.scatter(rang_x, rang_y, s=4, c="black", alpha=0.3)

    panta, intercept = np.polyfit(rang_x, rang_y, 1)
    capete_x = np.array([rang_x.min(), rang_x.max()])
    ax.plot(capete_x, intercept + panta * capete_x, color="#3355aa")

    ax.set_xlabel(f"{var_x} (rang)")
    ax.set_ylabel(f"{var_y} (rang)")
    ax.set_title(f"ρ (Spearman) = {format_ro(R)}, p < 0,001", fontsize=10)
    print(var_x, var_y, R, p)

fig.tight_layout()
fig.savefig(f"{folder_iesire}/corr_scatter.png")
plt.close(fig)
