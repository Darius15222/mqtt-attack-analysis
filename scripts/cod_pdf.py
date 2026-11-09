"""
Pregătește PDF-ul cu codul analizei: scrie o pagină HTML cu toate scripturile din cod/, colorate și cu numere de linie.
PDF-ul se obține tipărind pagina cu Chromium (Playwright, page.pdf, format A4), apoi se pune în public/MQTTset_cod.pdf.

Rulare:
  python3 scripts/cod_pdf.py iesire.html
"""
import sys
from pathlib import Path

from pygments import highlight
from pygments.formatters import HtmlFormatter
from pygments.lexers import PythonLexer, SLexer

FOLDER_COD = Path(__file__).resolve().parent.parent / 'cod'
ADRESA_REPO = 'https://github.com/Darius15222/mqtt-attack-analysis'
ADRESA_SITE = 'https://darius15222.github.io/mqtt-attack-analysis/'

scripturi = sorted(fisier for fisier in FOLDER_COD.iterdir() if fisier.suffix in ('.py', '.R'))
# numere de linie puse direct în fața liniei, ca să rămână aliniate și când o linie lungă se rupe pe două rânduri
formatare = HtmlFormatter(linenos='inline', style='friendly')


def script_html(fisier):
    limbaj = SLexer() if fisier.suffix == '.R' else PythonLexer()
    return f'<section><h2>{fisier.name}</h2>{highlight(fisier.read_text(), limbaj, formatare)}</section>'


STIL = f'''
{formatare.get_style_defs('.highlight')}
body {{ font-family: "DejaVu Sans", sans-serif; font-size: 10pt; color: #222; }}
h1 {{ font-size: 18pt; margin: 0 0 4pt; }}
h2 {{ font-size: 12pt; border-bottom: 1px solid #ccc; padding-bottom: 3pt; margin-top: 0; }}
section {{ page-break-before: always; }}  /* fiecare script începe pe pagină nouă */
pre {{ font-family: "DejaVu Sans Mono", monospace; font-size: 7.6pt; line-height: 1.35; white-space: pre-wrap; word-break: break-all; margin: 0; }}
.linenos {{ color: #aaa; padding-right: 6pt; }}
'''

INTRODUCERE = f'''
<h1>Codul analizei MQTTset</h1>
<p>Scripturile care reproduc toate cifrele și graficele din document. Repo: {ADRESA_REPO} (folderul <code>cod/</code>); site: {ADRESA_SITE}</p>
<p>Rulare: <code>python3 -m venv venv &amp;&amp; venv/bin/pip install pandas scipy statsmodels mlxtend matplotlib</code>,
apoi <code>venv/bin/python 01_cap1-7_statistici_corelatii.py mqttdataset_reduced.csv.zip</code>.
Arborii: <code>Rscript 09_cap10_arbori_ctree.R mqttdataset_reduced.csv.zip arbori</code> (pachetul R partykit).</p>
'''

cuprins = ''.join(f'<li><code>{fisier.name}</code></li>' for fisier in scripturi)
pagina = (f'<!doctype html><html lang="ro"><head><meta charset="utf-8"><title>Codul analizei MQTTset</title><style>{STIL}</style></head>'
          f'<body>{INTRODUCERE}<ol>{cuprins}</ol>{"".join(script_html(f) for f in scripturi)}</body></html>')

Path(sys.argv[1]).write_text(pagina)
print(len(scripturi), 'fișiere')
