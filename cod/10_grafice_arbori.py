"""
Graficele din cap. 10 (arborii de decizie), desenate din CSV-urile scrise de
09_cap10_arbori_ctree.R.

Intrări (în folderul dat ca prim argument):
  noduri_clasificare.csv, noduri_regresie.csv  - tabelul nodurilor celor doi arbori
  adancime_clasificare.csv, adancime_regresie.csv  - metricile pe maxdepth 2-6 (10.3)

Ieșiri (în folderul dat ca al doilea argument):
  arbore_clasificare.png  - arborele is_attack; în fiecare frunză, bara cu clasele pachetelor
  arbore_regresie.png     - arborele tcp.len; în fiecare frunză, boxplot pe scară log
  adancime.png            - F1 / R² pe toate pachetele, în funcție de maxdepth

Rulare:
  python 10_grafice_arbori.py folder_csv folder_iesire
"""
import re
import sys
import textwrap

import matplotlib
import numpy as np
import pandas as pd

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from matplotlib.patches import Patch, Rectangle

folder_csv = sys.argv[1]
folder_iesire = sys.argv[2]

CULORI_CLASE = {"legitimate": "#2a7ad6", "dos": "#e8692f", "bruteforce": "#1aae80",
                "malformed": "#f0a30a", "slowite": "#e377a6", "flood": "#008000"}


def format_zecimale(valoare, zecimale):
    """Format românesc: 12345.6 -> „12.345,6”."""
    text = f"{valoare:,.{zecimale}f}"
    return text.replace(",", " ").replace(".", ",").replace(" ", ".")


def format_scurt(valoare):
    return ("%g" % valoare).replace(".", ",")


def eticheta_ramura(text):
    """Eticheta unei ramuri din R: „<= 1e-06” -> „≤ 1e-06”; „0x00000018” -> „0x18”; listă -> „∈ {...}”."""
    text = re.sub(r"0x0+([0-9a-f]{2})", r"0x\1", text)
    prag = re.match(r"(<=|>) (.+)", text)
    if prag:
        semn = "≤ " if prag[1] == "<=" else "> "
        return semn + format_scurt(float(prag[2]))
    valori = text.split(", ")
    if len(valori) == 1:
        return "= " + valori[0]
    return textwrap.fill("∈ {" + ", ".join(valori) + "}", 16)


# ---------------------------------------------------------------------------
# Desenul unui arbore: nodurile interne sus, toate frunzele pe ultimul rând
# ---------------------------------------------------------------------------

def deseneaza_arbore(fisier_csv, titlu, fisier_png, deseneaza_frunza, legenda):
    noduri = pd.read_csv(fisier_csv, keep_default_na=False).set_index("id")
    copii = {i: [int(k) for k in str(nod.copii).split(";")] if nod.copii else [] for i, nod in noduri.iterrows()}

    # poziții: frunzele la x = 0, 1, 2, ... în ordinea parcurgerii,
    # fiecare nod intern deasupra mijlocului copiilor lui; y = -adâncimea
    x, y, frunze = {}, {}, []

    def pozitioneaza(nod, adancime):
        y[nod] = -adancime
        if not copii[nod]:
            x[nod] = len(frunze)
            frunze.append(nod)
        else:
            for copil in copii[nod]:
                pozitioneaza(copil, adancime + 1)
            x[nod] = np.mean([x[copil] for copil in copii[nod]])

    pozitioneaza(1, 0)
    y_frunze = min(y.values()) - 0.6

    fig, ax = plt.subplots(figsize=(17, 12))
    for nod in noduri.index:  # liniile și etichetele ramurilor, apoi caseta nodului
        if not copii[nod]:
            continue
        rand = noduri.loc[nod]
        for copil, eticheta in zip(copii[nod], rand.ramuri.split("|")):
            este_frunza = not copii[copil]
            y_copil = y_frunze if este_frunza else y[copil]
            y_capat = y_copil + (0.45 if este_frunza else 0)
            ax.plot([x[nod], x[copil]], [y[nod], y_capat], color="#999", lw=1, zorder=1)
            # eticheta mai aproape de copil, ca să nu se suprapună cu a fratelui
            f = 0.8 if este_frunza else 0.55
            ax.text(x[nod] + f * (x[copil] - x[nod]), y[nod] + f * (y_capat - y[nod]), eticheta_ramura(eticheta),
                    ha="center", va="center", fontsize=9, bbox=dict(fc="white", ec="none", pad=0.5), zorder=2)
        p = float(rand.p)
        text_p = "p < 0,001" if p < 0.001 else "p = " + format_zecimale(p, 3)
        ax.text(x[nod], y[nod], f"{nod}  {rand['var']}\n" + text_p, ha="center", va="center",
                fontsize=10, bbox=dict(boxstyle="round", fc="#eef3fb", ec="#7f9fd4"), zorder=3)

    for nod in frunze:
        ax.text(x[nod], y_frunze + 0.2, str(nod), ha="center", fontsize=10)
        deseneaza_frunza(ax, x[nod], y_frunze, noduri.loc[nod])

    ax.set_xlim(-0.8, len(frunze) - 0.2)
    ax.set_ylim(y_frunze - 2.4, 0.5)
    ax.axis("off")
    ax.set_title(titlu, fontsize=13)
    ax.legend(handles=legenda, loc="lower center", ncol=len(legenda), frameon=False,
              bbox_to_anchor=(0.5, -0.02), fontsize=10)
    fig.tight_layout()
    fig.savefig(f"{folder_iesire}/{fisier_png}", dpi=100)
    plt.close(fig)


def frunza_clasificare(ax, x, y_frunze, nod):
    """Bara stivuită din frunză: din ce clase sunt pachetele."""
    baza = y_frunze - 1.75
    for clasa, culoare in CULORI_CLASE.items():
        inaltime = 1.6 * nod[clasa] / nod.n
        ax.add_patch(Rectangle((x - 0.25, baza), 0.5, inaltime, fc=culoare, ec="white", lw=0.8))
        baza += inaltime
    procent_atac = 100 * (1 - nod.legitimate / nod.n)
    ax.text(x, y_frunze - 2.0, f"n = {format_zecimale(nod.n, 0)}\natac {format_zecimale(procent_atac, 1)}%",
            ha="center", va="top", fontsize=9)


def inaltime_log(valoare):
    """Scară logaritmică pentru tcp.len, de la 0 la 32768 (maximul tcp.len) pe 1,6 unități."""
    return 1.6 * np.log10(1 + valoare) / np.log10(1 + 32768)


def frunza_regresie(ax, x, y_frunze, nod):
    """Boxplot tcp.len în frunză: minim-maxim, Q1-Q3, mediana, media (valoarea prezisă)."""
    baza = y_frunze - 1.75
    ax.plot([x, x], [baza + inaltime_log(nod["0%"]), baza + inaltime_log(nod["100%"])], color="#444", lw=1)
    # înălțime minimă, ca o cutie cu Q1 = Q3 să rămână vizibilă
    inaltime_cutie = max(inaltime_log(nod["75%"]) - inaltime_log(nod["25%"]), 0.004)
    ax.add_patch(Rectangle((x - 0.2, baza + inaltime_log(nod["25%"])), 0.4, inaltime_cutie, fc="#cfe2fb", ec="#2a7ad6"))
    ax.plot([x - 0.2, x + 0.2], [baza + inaltime_log(nod["50%"])] * 2, color="#123f80", lw=2.5)
    ax.plot(x, baza + inaltime_log(nod.media), "D", color="#e8692f", ms=6)
    ax.text(x, y_frunze - 2.0, f"n = {format_zecimale(nod.n, 0)}\nmedia {format_zecimale(nod.media, 1)}",
            ha="center", va="top", fontsize=9)
    if x == 0:  # axa tcp.len, o singură dată, lângă prima frunză
        for valoare in [0, 10, 100, 1000, 10000]:
            ax.text(-0.55, baza + inaltime_log(valoare), format_zecimale(valoare, 0), ha="right", va="center",
                    fontsize=8, color="#666")
            ax.plot([-0.52, -0.47], [baza + inaltime_log(valoare)] * 2, color="#666", lw=1)
        ax.plot([-0.5, -0.5], [baza, baza + 1.6], color="#666", lw=1)
        ax.text(-0.5, baza + 1.7, "tcp.len", ha="center", fontsize=8, color="#666")


# ---------------------------------------------------------------------------
# 10.4 și 10.6: cei doi arbori
# ---------------------------------------------------------------------------

deseneaza_arbore(f"{folder_csv}/noduri_clasificare.csv", "Arborele de clasificare (is_attack), maxdepth = 5",
                 "arbore_clasificare.png", frunza_clasificare,
                 [Patch(fc=culoare, label=clasa) for clasa, culoare in CULORI_CLASE.items()])
deseneaza_arbore(f"{folder_csv}/noduri_regresie.csv", "Arborele de regresie (tcp.len), maxdepth = 4",
                 "arbore_regresie.png", frunza_regresie,
                 [Patch(fc="#cfe2fb", ec="#2a7ad6", label="Q1 până la Q3"),
                  Line2D([], [], color="#123f80", lw=2.5, label="mediana"),
                  Line2D([], [], marker="D", color="#e8692f", ls="", label="media (valoarea prezisă)")])


# ---------------------------------------------------------------------------
# 10.3: alegerea adâncimii maxime
# ---------------------------------------------------------------------------

clasificare = pd.read_csv(f"{folder_csv}/adancime_clasificare.csv")
regresie = pd.read_csv(f"{folder_csv}/adancime_regresie.csv")
adancimi = clasificare.maxdepth
# (valori pe toate pachetele, titlu, adâncimea aleasă)
panouri = [(clasificare.f1, "Arborele de clasificare: F1", 5),
           (regresie.R2, "Arborele de regresie: R²", 4)]

fig, axs = plt.subplots(1, 2, figsize=(15.3, 5.78))
for ax, (valori, titlu, aleasa) in zip(axs, panouri):
    ax.plot(adancimi, valori, "o-", color="#2a7ad6", lw=2.5, ms=8)
    for adancime, valoare in zip(adancimi, valori):
        ax.annotate(format_zecimale(valoare, 3), (adancime, valoare), textcoords="offset points", xytext=(0, -16),
                    ha="center", fontsize=9)
    ax.axvline(aleasa, color="gray", ls=":")
    ax.text(aleasa + 0.08, ax.get_ylim()[0], f"ales: {aleasa}", color="gray", va="bottom")
    ax.set_title(titlu)
    ax.set_xlabel("maxdepth")
    ax.set_xticks(adancimi)
    ax.yaxis.set_major_formatter(lambda v, _: format_scurt(round(v, 3)))
    ax.grid(axis="y", alpha=0.3)
    ax.spines[["top", "right"]].set_visible(False)
fig.tight_layout()
fig.savefig(f"{folder_iesire}/adancime.png", dpi=100)
plt.close(fig)
