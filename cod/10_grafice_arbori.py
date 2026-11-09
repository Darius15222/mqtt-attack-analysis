# Graficele din cap. 10, din CSV-urile scrise de 09_cap10_arbori_ctree.R.
# Rulare: python 10_grafice_arbori.py folder_csv folder_iesire
import sys, re, textwrap, numpy as np, pandas as pd, matplotlib
matplotlib.use("Agg"); import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Patch
from matplotlib.lines import Line2D

src, out = sys.argv[1], sys.argv[2]
CL = {"legitimate": "#2a7ad6", "dos": "#e8692f", "bruteforce": "#1aae80", "malformed": "#f0a30a", "slowite": "#e377a6", "flood": "#008000"}
ro = lambda v, dec: f"{v:,.{dec}f}".replace(",", " ").replace(".", ",").replace(" ", ".")
g = lambda v: ("%g" % v).replace(".", ",")

def ramura(s):  # "<= 1e-06" -> "≤ 1e-06"; "0x00000018" -> "0x18"; lista -> "∈ {...}"
    s = re.sub(r"0x0+([0-9a-f]{2})", r"0x\1", s)
    m = re.match(r"(<=|>) (.+)", s)
    if m: return ("≤ " if m[1] == "<=" else "> ") + g(float(m[2]))
    v = s.split(", ")
    return "= " + v[0] if len(v) == 1 else textwrap.fill("∈ {" + ", ".join(v) + "}", 16)

def arbore(csv, titlu, fisier, frunza, legenda):
    t = pd.read_csv(csv, keep_default_na=False).set_index("id")
    kids = {i: [int(k) for k in str(r.copii).split(";")] if r.copii else [] for i, r in t.iterrows()}
    x, y, frunze = {}, {}, []
    def pozitie(i, dep):
        y[i] = -dep
        if not kids[i]: x[i] = len(frunze); frunze.append(i)
        else:
            for k in kids[i]: pozitie(k, dep + 1)
            x[i] = np.mean([x[k] for k in kids[i]])
    pozitie(1, 0)
    jos = min(y.values()) - 0.6
    fig, ax = plt.subplots(figsize=(17, 12))
    for i in t.index:  # liniile și etichetele ramurilor
        if not kids[i]: continue
        r = t.loc[i]
        for k, lab in zip(kids[i], r.ramuri.split("|")):
            yk = jos if not kids[k] else y[k]
            ye = yk + (0.45 if not kids[k] else 0)
            ax.plot([x[i], x[k]], [y[i], ye], color="#999", lw=1, zorder=1)
            f = 0.8 if not kids[k] else 0.55  # eticheta mai aproape de copil, ca să nu se suprapună cu a fratelui
            ax.text(x[i] + f * (x[k] - x[i]), y[i] + f * (ye - y[i]), ramura(lab), ha="center", va="center", fontsize=9,
                    bbox=dict(fc="white", ec="none", pad=0.5), zorder=2)
        p = float(r.p)
        ax.text(x[i], y[i], f"{i}  {r['var']}\n" + ("p < 0,001" if p < 0.001 else "p = " + ro(p, 3)), ha="center", va="center",
                fontsize=10, bbox=dict(boxstyle="round", fc="#eef3fb", ec="#7f9fd4"), zorder=3)
    for i in frunze:
        ax.text(x[i], jos + 0.2, str(i), ha="center", fontsize=10)
        frunza(ax, x[i], jos, t.loc[i])
    ax.set_xlim(-0.8, len(frunze) - 0.2); ax.set_ylim(jos - 2.4, 0.5); ax.axis("off")
    ax.set_title(titlu, fontsize=13)
    ax.legend(handles=legenda, loc="lower center", ncol=len(legenda), frameon=False, bbox_to_anchor=(0.5, -0.02), fontsize=10)
    fig.tight_layout(); fig.savefig(f"{out}/{fisier}", dpi=100); plt.close(fig)

def bara(ax, xi, jos, r):  # bara din frunză: din ce clase sunt pachetele
    b = jos - 1.75
    for c, col in CL.items():
        h = 1.6 * r[c] / r.n
        ax.add_patch(Rectangle((xi - 0.25, b), 0.5, h, fc=col, ec="white", lw=0.8)); b += h
    atac = 1 - r.legitimate / r.n
    ax.text(xi, jos - 2.0, f"n = {ro(r.n, 0)}\natac {ro(100 * atac, 1)}%", ha="center", va="top", fontsize=9)

H = lambda v: 1.6 * np.log10(1 + v) / np.log10(1 + 32768)  # scară logaritmică, până la maximul tcp.len
def cutie(ax, xi, jos, r):  # boxplot tcp.len: Q1-Q3, mediana, media (valoarea prezisă)
    b = jos - 1.75
    ax.plot([xi, xi], [b + H(r["0%"]), b + H(r["100%"])], color="#444", lw=1)
    ax.add_patch(Rectangle((xi - 0.2, b + H(r["25%"])), 0.4, max(H(r["75%"]) - H(r["25%"]), 0.004), fc="#cfe2fb", ec="#2a7ad6"))
    ax.plot([xi - 0.2, xi + 0.2], [b + H(r["50%"])] * 2, color="#123f80", lw=2.5)
    ax.plot(xi, b + H(r.media), "D", color="#e8692f", ms=6)
    ax.text(xi, jos - 2.0, f"n = {ro(r.n, 0)}\nmedia {ro(r.media, 1)}", ha="center", va="top", fontsize=9)
    if xi == 0:
        for v in [0, 10, 100, 1000, 10000]:
            ax.text(-0.55, b + H(v), ro(v, 0), ha="right", va="center", fontsize=8, color="#666")
            ax.plot([-0.52, -0.47], [b + H(v)] * 2, color="#666", lw=1)
        ax.plot([-0.5, -0.5], [b, b + 1.6], color="#666", lw=1); ax.text(-0.5, b + 1.7, "tcp.len", ha="center", fontsize=8, color="#666")

arbore(f"{src}/noduri_clasificare.csv", "Arborele de clasificare (is_attack), maxdepth = 5", "arbore_clasificare.png", bara,
       [Patch(fc=c, label=k) for k, c in CL.items()])
arbore(f"{src}/noduri_regresie.csv", "Arborele de regresie (tcp.len), maxdepth = 4", "arbore_regresie.png", cutie,
       [Patch(fc="#cfe2fb", ec="#2a7ad6", label="Q1 până la Q3"), Line2D([], [], color="#123f80", lw=2.5, label="mediana"),
        Line2D([], [], marker="D", color="#e8692f", ls="", label="media (valoarea prezisă)")])

# alegerea adâncimii (10.3)
c = pd.read_csv(f"{src}/adancime_clasificare.csv"); r = pd.read_csv(f"{src}/adancime_regresie.csv")
fig, axs = plt.subplots(1, 2, figsize=(15.3, 5.78))
for ax, (tr, te, nume, ales) in zip(axs, [(c.f1, c["f1.1"], "Arborele de clasificare: F1", 5), (r.R2_constr, r.R2, "Arborele de regresie: R²", 4)]):
    ax.plot(c.maxdepth, tr, "o-", color="#2a7ad6", lw=2.5, ms=8, label="construcție (70%)")
    ax.plot(c.maxdepth, te, "o--", color="#e8692f", lw=2.5, ms=8, label="test (30%)")
    for md, v in zip(c.maxdepth, te): ax.annotate(ro(v, 3), (md, v), textcoords="offset points", xytext=(0, -16), ha="center", fontsize=9)
    ax.axvline(ales, color="gray", ls=":"); ax.text(ales + 0.08, ax.get_ylim()[0], f"ales: {ales}", color="gray", va="bottom")
    ax.set_title(nume); ax.set_xlabel("maxdepth"); ax.set_xticks(c.maxdepth); ax.legend(frameon=False, loc="upper left")
    ax.yaxis.set_major_formatter(lambda v, _: g(round(v, 3))); ax.grid(axis="y", alpha=0.3)
    ax.spines[["top", "right"]].set_visible(False)
fig.tight_layout(); fig.savefig(f"{out}/adancime.png", dpi=100); plt.close(fig)
