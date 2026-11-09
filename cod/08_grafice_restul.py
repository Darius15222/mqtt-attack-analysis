"""
Graficele din raport care nu sunt produse de celelalte scripturi:
cap. 5 (distribuțiile variabilelor), cap. 6 (variabile pe clase),
7.4 (corelații Pearson / Spearman), cap. 8 (regresia liniară),
cap. 9 (distanța Cook, regresia logistică) și 11.4 (regulile de asociere).

Intrări:
  1. CSV-ul MQTTset redus (mqttdataset_reduced.csv)
  2. folderul în care se scriu imaginile
  3. fișierul .npy cu distanțele Cook, scris de 05_cap8-9_cook_durbin_watson.py

Ieșiri:
  imageN.png în folderul de ieșire (N = numărul figurii din document);
  la ecran: testele Mann-Whitney din cap. 6 și P(atac) la tcp.time_delta = 0.

Rulare:
  python 08_grafice_restul.py mqttdataset_reduced.csv folder_grafice cook.npy
"""
import sys

import matplotlib
import numpy as np
import pandas as pd
import statsmodels.api as sm

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
from mlxtend.frequent_patterns import apriori, association_rules
from scipy import stats

date = pd.read_csv(sys.argv[1], low_memory=False)
folder_iesire = sys.argv[2]
distante_cook = np.load(sys.argv[3])

date["is_attack"] = (date.target != "legitimate").astype(int)
CLASE = ["legitimate", "dos", "bruteforce", "malformed", "slowite", "flood"]
ATACURI = CLASE[1:]


# ---------------------------------------------------------------------------
# Funcții ajutătoare: formatare românească (virgulă zecimală, minus tipografic)
# ---------------------------------------------------------------------------

def format_axa(valoare, _=None):
    """Eticheta unei gradații: 0.5 -> „0,5”, -1 -> „−1”."""
    text = ("%g" % valoare).replace(".", ",")
    return text.replace("-", "−")


def format_zecimale(valoare, zecimale):
    text = f"{valoare:.{zecimale}f}"
    return text.replace(".", ",").replace("-", "−")


def virgule_pe_axe(ax, si_pe_x=True):
    """Virgulă zecimală pe axele liniare. si_pe_x=False păstrează etichetele de categorii de pe x."""
    if si_pe_x and ax.get_xscale() == "linear":
        ax.xaxis.set_major_formatter(FuncFormatter(format_axa))
    if ax.get_yscale() == "linear":
        ax.yaxis.set_major_formatter(FuncFormatter(format_axa))


def eticheta_valoare(valoare):
    """3.0 -> „3”, 65535.0 -> „65.535”; valorile hex / text rămân neschimbate."""
    if isinstance(valoare, float) and valoare.is_integer():
        return f"{int(valoare):,}".replace(",", ".")
    return str(valoare)


def salveaza(fig, nume_fisier, latime_px, inaltime_px):
    fig.set_size_inches(latime_px / 100, inaltime_px / 100)
    fig.savefig(f"{folder_iesire}/{nume_fisier}", dpi=100)
    plt.close(fig)


def stele(p):
    if p < 0.001:
        return "***"
    if p < 0.01:
        return "**"
    if p < 0.05:
        return "*"
    return "ns"


# ---------------------------------------------------------------------------
# Cap. 5: distribuția fiecărei variabile (bare cu % din pachete)
# ---------------------------------------------------------------------------

FIGURI_CAP5 = {
    2: "mqtt.conack.flags", 3: "mqtt.conack.val", 4: "mqtt.conflag.cleansess",
    5: "mqtt.conflag.passwd", 6: "mqtt.conflag.uname", 7: "mqtt.conflags",
    8: "mqtt.dupflag", 9: "mqtt.hdrflags", 12: "mqtt.msgtype", 13: "mqtt.proto_len",
    14: "mqtt.protoname", 15: "mqtt.qos", 16: "mqtt.retain", 17: "mqtt.ver", 18: "tcp.flags",
}


def figura_distributie(numar_figura, coloana):
    procente = date[coloana].value_counts(normalize=True) * 100
    # peste 10 valori distincte: primele 10, restul adunate în „Altele”
    if len(procente) > 10:
        procente = pd.concat([procente.iloc[:10], pd.Series({"Altele": procente.iloc[10:].sum()})])
    fig, ax = plt.subplots()
    ax.bar([eticheta_valoare(v) for v in procente.index], procente.values)
    ax.set_title(coloana)
    ax.set_ylabel("% din pachete")
    plt.setp(ax.get_xticklabels(), rotation=45, ha="right")
    virgule_pe_axe(ax, si_pe_x=False)
    fig.tight_layout()
    salveaza(fig, f"image{numar_figura}.png", 600, 420)


for numar_figura, coloana in FIGURI_CAP5.items():
    figura_distributie(numar_figura, coloana)


# ---------------------------------------------------------------------------
# Cap. 6: fiecare variabilă pe clase (boxplot pentru numerice, bare pentru categorice)
# ---------------------------------------------------------------------------

FIGURI_CAP6 = {
    21: "tcp.flags", 22: "tcp.time_delta", 23: "tcp.len", 24: "mqtt.hdrflags",
    25: "mqtt.msgtype", 26: "mqtt.dupflag", 27: "mqtt.qos", 28: "mqtt.retain",
    29: "mqtt.len", 30: "mqtt.conflags", 31: "mqtt.conflag.cleansess",
    32: "mqtt.conflag.passwd", 33: "mqtt.conflag.uname", 34: "mqtt.kalive",
    35: "mqtt.protoname", 36: "mqtt.proto_len", 37: "mqtt.ver",
    38: "mqtt.conack.flags", 39: "mqtt.conack.val",
}
NUMERICE = ["tcp.time_delta", "tcp.len", "mqtt.len"]
# variabile ordinale desenate ca bare, dar testate cu Kruskal-Wallis / Mann-Whitney, nu chi-pătrat
ORDINALE_CU_BARE = ["mqtt.qos", "mqtt.kalive"]
legitime = date[date.target == "legitimate"]


def mann_whitney_atac_vs_normal(coloana):
    """Stelele testului Mann-Whitney pentru fiecare atac comparat cu traficul normal."""
    rezultat = {}
    for atac in ATACURI:
        normal = legitime[coloana].values
        din_atac = date[date.target == atac][coloana].values
        # o singură valoare în ambele grupuri: testul nu are sens
        if np.unique(np.r_[normal, din_atac]).size == 1:
            rezultat[atac] = "-"
        else:
            rezultat[atac] = stele(stats.mannwhitneyu(normal, din_atac).pvalue)
    return rezultat


def boxplot_pe_clase(ax, coloana):
    valori = [date[date.target == clasa][coloana].values for clasa in CLASE]
    if coloana == "tcp.time_delta":
        # scara log nu poate afișa 0, așa că 0 este desenat ca 1e-6 s
        valori = [np.where(v == 0, 1e-6, v) for v in valori]
        ax.set_yscale("log")
        nota = "; 0 afișat ca 1e-06 s"
    else:
        ax.set_yscale("symlog", linthresh=1)
        nota = ""
    ax.boxplot(valori, showfliers=False, widths=0.5)
    ax.set_xticks(range(1, 7))
    ax.set_xticklabels(CLASE)
    sus = ax.get_ylim()[1]
    teste = mann_whitney_atac_vs_normal(coloana)
    for pozitie, atac in enumerate(ATACURI, 2):
        ax.text(pozitie, sus, teste[atac], ha="center", va="bottom")
    # loc deasupra cutiilor pentru stele (axele sunt logaritmice, deci înmulțim)
    ax.set_ylim(top=sus * (30 if coloana == "tcp.time_delta" else 8))
    ax.set_title(f"{coloana}  (Kruskal-Wallis ***; stele: atac vs normal{nota})", fontsize=9)
    print(coloana, teste)


def bare_pe_clase(ax, coloana):
    if date[coloana].dtype != object:
        valori = date[coloana].map(eticheta_valoare)
    else:
        valori = date[coloana].astype(str)
    # cele mai frecvente 6 valori, restul „Altele”
    frecvente = valori.value_counts().index[:6]
    valori = valori.where(valori.isin(frecvente), "Altele")
    if coloana == "mqtt.kalive":
        grupe_kalive = {0: "0", 60: "60", 65535: "65.535"}
        valori = date[coloana].map(lambda v: grupe_kalive.get(v, "altele (1, 2, 3, 234)"))
    procente = pd.crosstab(valori, date.target, normalize="columns")[CLASE] * 100
    # ordinea în legendă: valorile scurte întâi, „Altele” la final
    ordine = [v for v in sorted(procente.index, key=lambda v: (v.startswith(("Altele", "altele")), len(v), v))]
    procente = procente.loc[ordine]
    numar_valori = len(procente)
    latime_bara = 0.8 / numar_valori
    for i, (valoare, rand) in enumerate(procente.iterrows()):
        deplasare = (i - (numar_valori - 1) / 2) * latime_bara
        ax.bar(np.arange(6) + deplasare, rand.values, latime_bara, label=valoare)
    ax.set_xticks(range(6))
    ax.set_xticklabels(CLASE)
    ax.set_ylabel("% din clasă")
    if coloana in ORDINALE_CU_BARE:
        teste = mann_whitney_atac_vs_normal(coloana)
        ax.set_ylim(0, 112)
        for pozitie, atac in enumerate(ATACURI, 1):
            ax.text(pozitie, 104, teste[atac], ha="center")
        ax.set_title(f"{coloana}  (Kruskal-Wallis ***; stele: atac vs normal)", fontsize=9)
        print(coloana, teste)
    else:
        ax.set_title(f"{coloana}  (chi-pătrat ***)", fontsize=9)
    ax.legend(title="valoare", fontsize=7, title_fontsize=7, loc="upper left", bbox_to_anchor=(1.01, 1))


for numar_figura, coloana in FIGURI_CAP6.items():
    fig, ax = plt.subplots()
    if coloana in NUMERICE:
        boxplot_pe_clase(ax, coloana)
    else:
        bare_pe_clase(ax, coloana)
    plt.setp(ax.get_xticklabels(), rotation=30, ha="right")
    virgule_pe_axe(ax, si_pe_x=False)
    fig.set_size_inches(7.8, 5.04)
    fig.tight_layout()
    salveaza(fig, f"image{numar_figura}.png", 780, 504)


# ---------------------------------------------------------------------------
# 7.4: matricile de corelație Pearson și Spearman (figura 48)
# ---------------------------------------------------------------------------

def figura_corelatii():
    variabile = ["tcp.len", "mqtt.len", "tcp.time_delta", "mqtt.qos", "mqtt.dupflag", "is_attack"]
    fig, axs = plt.subplots(1, 2, figsize=(12.53, 5.87))
    for ax, metoda in zip(axs, ["pearson", "spearman"]):
        corelatii = date[variabile].corr(metoda).values
        imagine = ax.imshow(corelatii, cmap="RdBu", vmin=-1, vmax=1)
        for i in range(6):
            for j in range(6):
                culoare_text = "white" if abs(corelatii[i, j]) > 0.5 else "black"
                ax.text(j, i, format_zecimale(corelatii[i, j], 2), ha="center", va="center",
                        fontsize=8, color=culoare_text)
        ax.set_xticks(range(6))
        ax.set_xticklabels(variabile, rotation=40, ha="right", fontsize=8)
        ax.set_yticks(range(6))
        # numele variabilelor doar pe matricea din stânga
        ax.set_yticklabels(variabile if metoda == "pearson" else [], fontsize=8)
        ax.set_title(metoda.capitalize())
    bara_culori = fig.colorbar(imagine, ax=axs, shrink=0.85)
    bara_culori.ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: format_zecimale(v, 2)))
    salveaza(fig, "image48.png", 1253, 587)


figura_corelatii()


# ---------------------------------------------------------------------------
# Cap. 8: regresia liniară (figurile 49-52)
# ---------------------------------------------------------------------------

# 8000 de pachete pentru norii de puncte; dreptele se calculează pe toate datele
esantion = date.sample(8000, random_state=42)

model_brut = sm.OLS(date["mqtt.len"], sm.add_constant(date["tcp.len"])).fit()
logaritmi = np.log1p(date[["tcp.len", "mqtt.len"]])
model_log = sm.OLS(logaritmi["mqtt.len"], sm.add_constant(logaritmi["tcp.len"])).fit()


def dreapta(ax, model, x_min, x_max):
    xx = np.array([x_min, x_max])
    ax.plot(xx, model.params.iloc[0] + model.params.iloc[1] * xx, "r")


def figura_mqtt_len_din_tcp_len():
    fig, axs = plt.subplots(1, 2)

    axs[0].scatter(esantion["tcp.len"], esantion["mqtt.len"], s=4, alpha=0.4)
    dreapta(axs[0], model_brut, 0, date["tcp.len"].max())
    axs[0].set_title(f"Valori brute, R² = {format_zecimale(model_brut.rsquared, 3)}")
    axs[0].set_xlabel("tcp.len")
    axs[0].set_ylabel("mqtt.len")

    esantion_log = np.log1p(esantion[["tcp.len", "mqtt.len"]])
    axs[1].scatter(esantion_log["tcp.len"], esantion_log["mqtt.len"], s=4, alpha=0.4)
    dreapta(axs[1], model_log, 0, logaritmi["tcp.len"].max())
    axs[1].set_title(f"După logaritm, R² = {format_zecimale(model_log.rsquared, 3)}")
    axs[1].set_xlabel("log(1 + tcp.len)")
    axs[1].set_ylabel("log(1 + mqtt.len)")

    for ax in axs:
        virgule_pe_axe(ax)
    fig.set_size_inches(14.3, 5.46)
    fig.tight_layout()
    salveaza(fig, "image49.png", 1430, 546)


def reziduuri(ax_puncte, ax_histograma, prezise, reziduu, sufix_titlu=""):
    """Reziduuri față de predicție + histograma lor cu curba normală (media și abaterea reziduurilor)."""
    i = esantion.index
    ax_puncte.scatter(prezise[i], reziduu[i], s=4, alpha=0.4)
    ax_puncte.axhline(0, color="r")
    ax_puncte.set_title("Reziduuri față de predicție" + sufix_titlu)
    ax_puncte.set_xlabel("valoare prezisă")
    ax_puncte.set_ylabel("reziduu")

    # fără 1% din fiecare capăt, altfel câteva valori extreme strivesc histograma
    cuantile = reziduu.quantile([.01, .99])
    centrale = reziduu[(reziduu >= cuantile.iloc[0]) & (reziduu <= cuantile.iloc[1])]
    _, margini, _ = ax_histograma.hist(centrale, bins=50)
    xs = np.linspace(margini[0], margini[-1], 300)
    latime_bin = margini[1] - margini[0]
    curba = len(centrale) * latime_bin * stats.norm.pdf(xs, centrale.mean(), centrale.std())
    ax_histograma.plot(xs, curba, "r", lw=2, label="curba normală")
    ax_histograma.set_title("Histograma reziduurilor, 1% până la 99%" + sufix_titlu)
    ax_histograma.set_xlabel("reziduu")
    ax_histograma.legend(frameon=False)
    virgule_pe_axe(ax_puncte)
    virgule_pe_axe(ax_histograma)


def figura_reziduuri_mqtt_len():
    fig, axs = plt.subplots(2, 2)
    reziduuri(*axs[0], model_brut.fittedvalues, model_brut.resid, " (brute)")
    reziduuri(*axs[1], model_log.fittedvalues, model_log.resid, " (logaritm)")
    fig.set_size_inches(14.3, 9.1)
    fig.tight_layout()
    salveaza(fig, "image50.png", 1430, 910)


def figura_reziduuri_time_delta():
    model_timp = sm.OLS(date["tcp.time_delta"], sm.add_constant(date[["tcp.len", "mqtt.len"]])).fit()
    fig, axs = plt.subplots(1, 2)
    reziduuri(*axs, model_timp.fittedvalues, model_timp.resid)
    fig.set_size_inches(14.3, 5.46)
    fig.tight_layout()
    salveaza(fig, "image51.png", 1430, 546)


def figura_regresie_pe_clase():
    fig, axs = plt.subplots(2, 3)
    for ax, clasa in zip(axs.flat, CLASE):
        din_clasa = date[date.target == clasa]
        model = sm.OLS(din_clasa["mqtt.len"], sm.add_constant(din_clasa["tcp.len"])).fit()
        puncte = din_clasa if len(din_clasa) < 3000 else din_clasa.sample(3000, random_state=42)
        ax.scatter(puncte["tcp.len"], puncte["mqtt.len"], s=4, alpha=0.4)
        dreapta(ax, model, din_clasa["tcp.len"].min(), din_clasa["tcp.len"].max())
        panta = format_zecimale(model.params.iloc[1], 3)
        ax.set_title(f"{clasa}: panta {panta}, R² = {format_zecimale(model.rsquared, 3)}", fontsize=9)
        ax.set_xlabel("tcp.len", fontsize=8)
        ax.set_ylabel("mqtt.len", fontsize=8)
        ax.tick_params(labelsize=7)
        virgule_pe_axe(ax)
    fig.set_size_inches(16.9, 9.1)
    fig.tight_layout()
    salveaza(fig, "image52.png", 1690, 910)


figura_mqtt_len_din_tcp_len()
figura_reziduuri_mqtt_len()
figura_reziduuri_time_delta()
figura_regresie_pe_clase()


# ---------------------------------------------------------------------------
# Cap. 9: distanța Cook, curba P(atac) și probabilitățile prezise (figurile 53, 56, 57)
# ---------------------------------------------------------------------------

def figura_cook():
    n = len(distante_cook)
    fig, ax = plt.subplots()
    ax.vlines(np.arange(1, n + 1), 0, distante_cook, lw=0.5, alpha=0.6)
    # 4/n este pragul uzual pentru „influent”; 0,5 sau 1 sunt pragurile critice
    ax.axhline(4 / n, color="r", ls="--", lw=0.8, label=f"4/n = {format_zecimale(4 / n * 1e5, 1)} · 10⁻⁵")
    ax.set_title("Distanța Cook, modelul fără separare (maxim " + format_zecimale(distante_cook.max(), 4)
                 + ", pragul critic 0,5 sau 1)", fontsize=10)
    ax.set_xlabel("numărul pachetului (rândul din fișier)")
    ax.set_ylabel("distanța Cook")
    ax.legend(fontsize=8)
    virgule_pe_axe(ax)
    ax.xaxis.set_major_formatter(FuncFormatter(lambda v, _: f"{int(v):,}".replace(",", ".")))
    fig.set_size_inches(13, 5.2)
    fig.tight_layout()
    salveaza(fig, "image53.png", 1300, 520)


# modelul logistic final: is_attack ~ tcp.len + tcp.time_delta + mqtt.len
model_logistic = sm.GLM(date.is_attack, sm.add_constant(date[["tcp.len", "tcp.time_delta", "mqtt.len"]]),
                        family=sm.families.Binomial()).fit()


def figura_curba_probabilitate():
    coef = model_logistic.params
    timp = np.linspace(0, 2, 200)
    # tcp.len și mqtt.len fixate la valorile tipice (12 și 10)
    logit = coef.iloc[0] + coef["tcp.len"] * 12 + coef["tcp.time_delta"] * timp + coef["mqtt.len"] * 10
    probabilitate = 1 / (1 + np.exp(-logit))
    fig, ax = plt.subplots()
    ax.plot(timp, probabilitate, color="#d62728", lw=2)
    ax.axhline(0.5, color="gray", ls=":")
    ax.set_ylim(0, 1)
    ax.set_title("Probabilitatea de atac prezisă de modelul final\n"
                 "(tcp.len = 12 și mqtt.len = 10, valorile tipice; doar timpul variază)", fontsize=10)
    ax.set_xlabel("tcp.time_delta (secunde)")
    ax.set_ylabel("P(atac)")
    virgule_pe_axe(ax)
    fig.set_size_inches(10.5, 4.8)
    fig.tight_layout()
    salveaza(fig, "image56.png", 1050, 480)
    print("curve p0", probabilitate[0])


def figura_probabilitati_prezise():
    prezise = model_logistic.predict()
    fig, ax = plt.subplots()
    intervale = np.linspace(0, 1, 51)
    ax.hist(prezise[date.is_attack == 0], bins=intervale, alpha=0.6, label="normal (0)")
    ax.hist(prezise[date.is_attack == 1], bins=intervale, alpha=0.6, color="#e15759", label="atac (1)")
    ax.set_yscale("log")
    ax.set_xlabel("probabilitatea de atac prezisă")
    ax.set_ylabel("pachete (scară log)")
    ax.set_title("Ce scoate modelul final pentru fiecare pachet, separat pe grupul real", fontsize=10)
    ax.legend()
    virgule_pe_axe(ax)
    fig.set_size_inches(10.5, 4.8)
    fig.tight_layout()
    salveaza(fig, "image57.png", 1050, 480)


figura_cook()
figura_curba_probabilitate()
figura_probabilitati_prezise()


# ---------------------------------------------------------------------------
# 11.4: regulile de asociere, support față de confidence (figura 64)
# ---------------------------------------------------------------------------

NUME_FLAGURI_TCP = {
    "0x00000010": "ACK", "0x00000018": "PSH+ACK", "0x00000011": "FIN+ACK", "0x00000002": "SYN",
    "0x00000012": "SYN+ACK", "0x00000004": "RST", "0x00000019": "FIN+PSH+ACK", "0x00000014": "RST+ACK",
}
NUME_MESAJE_MQTT = {
    0: "fara", 1: "CONNECT", 2: "CONNACK", 3: "PUBLISH", 4: "PUBACK", 5: "PUBREC",
    8: "SUBSCRIBE", 9: "SUBACK", 12: "PINGREQ", 13: "PINGRESP", 14: "DISCONNECT",
}
CULORI_ATACURI = {"dos": "#e8692f", "bruteforce": "#1aae80", "malformed": "#f0a30a",
                  "slowite": "#e377a6", "flood": "#008000"}

# fiecare pachet devine o tranzacție; variabilele continue sunt împărțite în intervale
tranzactii = pd.DataFrame({
    "flags": date["tcp.flags"].map(NUME_FLAGURI_TCP),
    "msgtype": date["mqtt.msgtype"].astype(int).map(NUME_MESAJE_MQTT),
    "qos": date["mqtt.qos"].astype(int),
    "dupflag": date["mqtt.dupflag"].astype(int),
    "len": pd.cut(date["tcp.len"], [-1, 0, 20, 1460, 1e9], labels=["0", "1-20", "21-1460", "1461+"]),
    "delta": pd.cut(date["tcp.time_delta"], [-1, 3e-6, 2.6e-5, 1.7e-4, 1e9], labels=["Q1", "Q2", "Q3", "Q4"]),
    "target": date.target,
})
itemi = pd.get_dummies(tranzactii.astype(str), prefix_sep="=")


def elimina_redundante(reguli):
    """Păstrează o regulă doar dacă are confidence mai mare decât orice regulă mai scurtă cu aceeași concluzie."""
    pastreaza = []
    for _, regula in reguli.iterrows():
        mai_scurte = reguli[(reguli.consequents == regula.consequents)
                            & (reguli.antecedents.apply(lambda x: x < regula.antecedents))]
        pastreaza.append(len(mai_scurte) == 0 or regula.confidence > mai_scurte.confidence.max())
    return reguli[pastreaza]


def concluzia(itemset):
    return next(iter(itemset))


# rularea generală: support ≥ 5%, confidence ≥ 60%, o singură concluzie
reguli_generale = association_rules(apriori(itemi, min_support=0.05, use_colnames=True),
                                    metric="confidence", min_threshold=0.6)
reguli_generale = elimina_redundante(reguli_generale[reguli_generale.consequents.apply(len) == 1])

# rularea pe atacuri: support de doar 150 de pachete (atacurile rare), concluzia este un atac,
# iar premisele nu conțin clasa
reguli_atacuri = association_rules(apriori(itemi, min_support=150 / len(itemi), use_colnames=True),
                                   metric="confidence", min_threshold=0.5)
reguli_atacuri = reguli_atacuri[reguli_atacuri.consequents.apply(len) == 1]
concluzii_atac = ["target=" + atac for atac in ATACURI]
concluzie_e_atac = reguli_atacuri.consequents.apply(lambda x: concluzia(x) in concluzii_atac)
premise_fara_clasa = reguli_atacuri.antecedents.apply(lambda x: not any(i.startswith("target") for i in x))
reguli_atacuri = elimina_redundante(reguli_atacuri[concluzie_e_atac & premise_fara_clasa])


def figura_reguli():
    fig, axs = plt.subplots(1, 2)

    puncte = axs[0].scatter(reguli_generale.support, reguli_generale.confidence, c=reguli_generale.lift,
                            cmap="Blues", s=14, edgecolors="gray", linewidths=0.3)
    bara_culori = fig.colorbar(puncte, ax=axs[0])
    bara_culori.set_label("lift")
    bara_culori.ax.yaxis.set_major_formatter(FuncFormatter(format_axa))
    axs[0].set_title(f"Rularea generală ({len(reguli_generale)} reguli)")
    axs[0].set_xlabel("support")
    axs[0].set_ylabel("confidence")

    for atac in ATACURI:
        ale_atacului = reguli_atacuri[reguli_atacuri.consequents.apply(lambda x: concluzia(x) == "target=" + atac)]
        axs[1].scatter(ale_atacului.support, ale_atacului.confidence, s=14, color=CULORI_ATACURI[atac], label=atac)
    axs[1].set_xscale("log")
    axs[1].set_title(f"Reguli pe atacuri ({len(reguli_atacuri)} reguli)")
    axs[1].set_xlabel("support (scară logaritmică)")
    axs[1].set_ylabel("confidence")
    axs[1].legend(fontsize=8)

    for ax in axs:
        virgule_pe_axe(ax)
    fig.set_size_inches(18, 7.6)
    fig.tight_layout()
    salveaza(fig, "image64.png", 1800, 760)


figura_reguli()
