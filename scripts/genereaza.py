# docx -> src/data/capNN.ts (blocuri tipate) + public/img/*.png
# Rulare: python3 scripts/genereaza.py ../../Facultate/ai-ml/MQTTset_tema.docx
import sys, json, re, zipfile, xml.etree.ElementTree as ET
from pathlib import Path

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
PAS = {'Intrare': 'intrare', 'Calcul': 'calcul', 'Ieșire': 'iesire', 'Decizie': 'decizie', 'Decizii': 'decizie'}
root = Path(__file__).resolve().parent.parent
z = zipfile.ZipFile(sys.argv[1])
body = ET.fromstring(z.read('word/document.xml')).find(W + 'body')
rels = {r.get('Id'): r.get('Target') for r in ET.fromstring(z.read('word/_rels/document.xml.rels'))}
(root / 'public/img').mkdir(parents=True, exist_ok=True)
(root / 'src/data').mkdir(parents=True, exist_ok=True)

def runs(p):  # (text, bold, cod) pentru fiecare run, inclusiv cele din hyperlink-uri
    for r in p.iter(W + 'r'):
        t = ''.join(x.text or '' for x in r.iter() if x.tag in (W + 't', W + 'tab'))
        rp = r.find(W + 'rPr')
        b = rp is not None and rp.find(W + 'b') is not None
        f = rp.find(W + 'rFonts') if rp is not None else None
        yield t, b, f is not None and 'Courier' in (f.get(W + 'ascii') or '')

def text(p): return ''.join(t for t, _, _ in runs(p))

def imagini(p):
    out = []
    for d in p.iter(W + 'drawing'):
        nume = next((e.get('name') for e in d.iter() if e.tag.endswith('docPr')), '')
        emb = next(e.get(R + 'embed') for e in d.iter() if e.get(R + 'embed'))
        src = rels[emb].split('/')[-1]
        nume = nume if nume.endswith('.png') else src
        (root / 'public/img' / nume).write_bytes(z.read('word/' + rels[emb]))
        out.append({'tip': 'imagine', 'src': nume})
    return out

def stil(p):
    s = p.find(f'{W}pPr/{W}pStyle'); return s.get(W + 'val') if s is not None else 'Normal'

intro, capitole, cur, nr_ref = [], [], None, 0
def add(b):
    (cur['blocuri'] if cur else intro).append(b)

for el in body:
    if el.tag == W + 'tbl' and list(el.iter(W + 'drawing')):  # tabel de imagini = galerie
        el_ = [dict(im, legenda=text(c).strip()) for c in el.iter(W + 'tc') for im in imagini(c)]
        add({'tip': 'galerie', 'imagini': el_}); continue
    if el.tag == W + 'tbl':
        rows = [[ '\n'.join(text(p) for p in c.iter(W + 'p')).strip() for c in tr.findall(W + 'tc')] for tr in el.findall(W + 'tr')]
        add({'tip': 'tabel', 'antet': rows[0], 'randuri': rows[1:]}); continue
    if el.tag != W + 'p': continue
    st, t, rr = stil(el), text(el).strip(), list(runs(el))
    for im in imagini(el): add(im)
    if st == 'Title' or not t: continue
    if st == 'Heading1':
        cur = {'titlu': t, 'blocuri': []}; capitole.append(cur); continue
    if cur is None and re.match(r'^\d+\. ', t) and not rr[0][1]: continue  # cuprinsul
    if t == 'Cuprins': continue
    if all(c for x, _, c in rr if x.strip()):  # cod (Courier New): se lipesc liniile consecutive
        bl = (cur['blocuri'] if cur else intro)
        if bl and bl[-1]['tip'] == 'cod': bl[-1]['text'] += '\n' + text(el)
        else: add({'tip': 'cod', 'text': text(el)})
        continue
    if st == 'ListParagraph':
        num = el.find(f'{W}pPr/{W}numPr/{W}numId'); ord_ = num is not None and num.get(W + 'val') == '7'
        bl = (cur['blocuri'] if cur else intro)
        if ord_: nr_ref += 1
        if bl and bl[-1]['tip'] == 'lista' and bl[-1]['ordonata'] == ord_: bl[-1]['elemente'].append(t)
        else: add({'tip': 'lista', 'ordonata': ord_, 'start': nr_ref if ord_ else 1, 'elemente': [t]})
        continue
    bold = ''.join(x for x, b, _ in rr if b)
    sp = el.find(f'{W}pPr/{W}spacing')
    if bold.strip() == t and re.match(r'^\d+\.\d+ ', t):
        add({'tip': 'sectiune', 'titlu': t}); continue
    m = re.match(r'^([^:]{1,40}):\s*', t)
    if m and rr[0][1] and bold.strip().rstrip(':') == m[1]:
        lab, rest = m[1], t[m.end():]
        if lab in PAS: add({'tip': 'pas', 'fel': PAS[lab], 'eticheta': lab, 'text': rest})
        else: add({'tip': 'text', 'eticheta': lab, 'text': rest})
        continue
    if bold.strip() == t: add({'tip': 'subtitlu', 'text': t}); continue
    add({'tip': 'text', 'text': t})

def ts(nume, val, tip):
    (root / 'src/data' / nume).write_text(f"import type {{ {tip.rstrip('[]')} }} from './tipuri'\n\nconst date: {tip} = {json.dumps(val, ensure_ascii=False, indent=1)}\n\nexport default date\n")

ts('intro.ts', intro, 'Bloc[]')
for i, c in enumerate(capitole, 1):
    ts(f'cap{i:02d}.ts', c, 'Capitol')
print(len(intro), 'blocuri intro;', len(capitole), 'capitole;', sum(len(c['blocuri']) for c in capitole), 'blocuri;',
      len(list((root / 'public/img').glob('*.png'))), 'imagini')
for c in capitole: print(c['titlu'], len(c['blocuri']), {k: sum(b['tip'] == k for b in c['blocuri']) for k in ['pas', 'tabel', 'imagine', 'galerie', 'cod', 'sectiune']})
