# cod/*.py, *.R -> HTML colorat (pentru PDF-ul cu codul, tipărit apoi cu Chromium)
# Rulare: python3 scripts/cod_pdf.py iesire.html
import sys, html
from pathlib import Path
from pygments import highlight
from pygments.lexers import PythonLexer, SLexer
from pygments.formatters import HtmlFormatter

cod = Path(__file__).resolve().parent.parent / 'cod'
fisiere = sorted(p for p in cod.iterdir() if p.suffix in ('.py', '.R'))
fmt = HtmlFormatter(linenos='inline', style='friendly')
cuprins = ''.join(f'<li><code>{p.name}</code></li>' for p in fisiere)
corp = ''.join(f'<section><h2>{p.name}</h2>{highlight(p.read_text(), SLexer() if p.suffix == ".R" else PythonLexer(), fmt)}</section>' for p in fisiere)
Path(sys.argv[1]).write_text(f'''<!doctype html><html lang="ro"><head><meta charset="utf-8"><title>Codul analizei MQTTset</title><style>
{fmt.get_style_defs('.highlight')}
body {{ font-family: "DejaVu Sans", sans-serif; font-size: 10pt; color: #222; }}
h1 {{ font-size: 18pt; margin: 0 0 4pt; }} h2 {{ font-size: 12pt; border-bottom: 1px solid #ccc; padding-bottom: 3pt; margin-top: 0; }}
section {{ page-break-before: always; }}
pre {{ font-family: "DejaVu Sans Mono", monospace; font-size: 7.6pt; line-height: 1.35; white-space: pre-wrap; word-break: break-all; margin: 0; }}
.linenos {{ color: #aaa; padding-right: 6pt; }}
table.highlighttable {{ width: 100%; border-collapse: collapse; }} td.code {{ width: 100%; }}
</style></head><body>
<h1>Codul analizei MQTTset</h1>
<p>Scripturile care reproduc toate cifrele și graficele din document. Repo: https://github.com/Darius15222/mqtt-attack-analysis (folderul <code>cod/</code>); site: https://darius15222.github.io/mqtt-attack-analysis/</p>
<p>Rulare: <code>python3 -m venv venv &amp;&amp; venv/bin/pip install pandas scipy statsmodels mlxtend matplotlib</code>, apoi <code>venv/bin/python 01_cap1-7_statistici_corelatii.py mqttdataset_reduced.csv.zip</code>. Arborii: <code>Rscript 09_cap10_arbori_ctree.R mqttdataset_reduced.csv.zip arbori</code> (pachetul R partykit).</p>
<ol>{cuprins}</ol>{corp}</body></html>''')
print(len(fisiere), 'fișiere')
