"""
Transformă documentul temei (MQTTset_tema.docx) în datele site-ului.

Ieșire:
  - src/data/capNN.ts     câte un fișier pe capitol, cu lista de blocuri (vezi tipurile din src/data/tipuri.ts)
  - public/img/*.png      imaginile din document, cu numele din docx (ex. arbore_clasificare.png)

Rulare (din folderul site-ului):
  python3 scripts/genereaza.py ../../Facultate/ai-ml/MQTTset_tema.docx

Atenție: suprascrie fișierele de mai sus. Modificările făcute de mână în capNN.ts se pierd.

Cum se recunoaște fiecare bloc în docx:
  - stilul Heading1                          → începe un capitol nou
  - paragraf îngroșat „Ce facem și de ce” / „Ipoteza” (sau „Scopul”) / „Pașii” / „Demonstrația” / „Concluzia”
                                             → partea unui capitol (toate capitolele au aceeași ordine)
  - paragraf îngroșat de forma „10.3 ...”     → secțiune (subcapitol)
  - paragraf care începe cu „Eticheta: ” bold → casetă de pas (Intrare / Calcul / Ieșire / Decizie);
    lista cu puncte de imediat sub el intră în aceeași casetă
                                                sau text cu etichetă („Ce arată: ...”)
  - paragraf scris cu Courier New            → fragment de cod
  - stilul ListParagraph                     → listă (numerotarea 7 = bibliografia, restul liste cu puncte)
  - tabel cu imagini                         → galerie; orice alt tabel → tabel
"""
import json
import re
import struct
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

# Spațiile de nume din XML-ul Word
W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'

# Eticheta din document → tipul casetei de pas de pe site
ETICHETE_PAS = {'Intrare': 'intrare', 'Calcul': 'calcul', 'Ieșire': 'iesire', 'Decizie': 'decizie', 'Decizii': 'decizie'}

# Titlurile celor 5 părți ale unui capitol (paragraf bold, nenumerotat) → tipul părții pe site
PARTI = {'Ce facem și de ce': 'context', 'Ipoteza': 'ipoteza', 'Scopul': 'ipoteza', 'Pașii': 'pasi', 'Demonstrația': 'demonstratie', 'Concluzia': 'concluzie'}

# În docx, listele numerotate (bibliografia, articolele) folosesc numerotarea cu id-ul 7.
ID_LISTA_NUMEROTATA = '7'

FOLDER_SITE = Path(__file__).resolve().parent.parent
FOLDER_IMAGINI = FOLDER_SITE / 'public/img'
FOLDER_DATE = FOLDER_SITE / 'src/data'


# --- citirea documentului ---

docx = zipfile.ZipFile(sys.argv[1])
corp_document = ET.fromstring(docx.read('word/document.xml')).find(W + 'body')
# rId → calea fișierului din arhivă (pentru imagini)
legaturi = {rel.get('Id'): rel.get('Target') for rel in ET.fromstring(docx.read('word/_rels/document.xml.rels'))}

FOLDER_IMAGINI.mkdir(parents=True, exist_ok=True)
FOLDER_DATE.mkdir(parents=True, exist_ok=True)


def bucati_text(paragraf):
    """Pentru fiecare bucată de text (run) din paragraf: (text, e_ingrosat, e_cod).
    Include și bucățile din interiorul linkurilor."""
    for run in paragraf.iter(W + 'r'):
        text = ''.join(nod.text or '' for nod in run.iter() if nod.tag in (W + 't', W + 'tab'))
        format_run = run.find(W + 'rPr')
        ingrosat = format_run is not None and format_run.find(W + 'b') is not None
        font = format_run.find(W + 'rFonts') if format_run is not None else None
        e_cod = font is not None and 'Courier' in (font.get(W + 'ascii') or '')
        yield text, ingrosat, e_cod


def text_paragraf(paragraf):
    return ''.join(text for text, _, _ in bucati_text(paragraf))


def stil_paragraf(paragraf):
    stil = paragraf.find(f'{W}pPr/{W}pStyle')
    return stil.get(W + 'val') if stil is not None else 'Normal'


def extrage_imagini(element):
    """Salvează imaginile din element în public/img/ și întoarce câte un bloc 'imagine' pentru fiecare."""
    blocuri = []
    for desen in element.iter(W + 'drawing'):
        nume_in_docx = next((nod.get('name') for nod in desen.iter() if nod.tag.endswith('docPr')), '')
        id_legatura = next(nod.get(R + 'embed') for nod in desen.iter() if nod.get(R + 'embed'))
        cale_in_arhiva = legaturi[id_legatura]
        # numele dat în docx (ex. „reg1_reziduuri.png”), altfel numele fișierului din arhivă (ex. „image41.png”)
        nume = nume_in_docx if nume_in_docx.endswith('.png') else cale_in_arhiva.split('/')[-1]
        continut = docx.read('word/' + cale_in_arhiva)
        (FOLDER_IMAGINI / nume).write_bytes(continut)
        # lățimea și înălțimea din antetul PNG: pagina rezervă locul imaginii înainte să se încarce
        latime, inaltime = struct.unpack('>II', continut[16:24])
        blocuri.append({'tip': 'imagine', 'src': nume, 'latime': latime, 'inaltime': inaltime})
    return blocuri


# --- parcurgerea documentului, în ordine ---

capitole = []  # fiecare: {'titlu': ..., 'blocuri': [...]}
capitol_curent = None
numar_referinta = 0  # numerotarea listelor numerotate continuă între capitole (articolele 1-5)


def blocuri_curente():
    return capitol_curent['blocuri'] if capitol_curent else []  # ce e înainte de capitolul 1 nu intră pe site


def adauga(bloc):
    blocuri_curente().append(bloc)


def ultimul_bloc():
    blocuri = blocuri_curente()
    return blocuri[-1] if blocuri else None


for element in corp_document:
    # tabel de imagini (graficele din cap. 5-7 sunt așezate câte două pe rând într-un tabel)
    if element.tag == W + 'tbl' and list(element.iter(W + 'drawing')):
        imagini = [dict(imagine, legenda=text_paragraf(celula).strip())
                   for celula in element.iter(W + 'tc')
                   for imagine in extrage_imagini(celula)]
        adauga({'tip': 'galerie', 'imagini': imagini})
        continue

    # tabel obișnuit: primul rând e antetul; o celulă cu mai multe paragrafe devine text pe mai multe rânduri
    if element.tag == W + 'tbl':
        randuri = [['\n'.join(text_paragraf(p) for p in celula.iter(W + 'p')).strip() for celula in rand.findall(W + 'tc')]
                   for rand in element.findall(W + 'tr')]
        adauga({'tip': 'tabel', 'antet': randuri[0], 'randuri': randuri[1:]})
        continue

    if element.tag != W + 'p':
        continue

    stil = stil_paragraf(element)
    text = text_paragraf(element).strip()
    bucati = list(bucati_text(element))

    for imagine in extrage_imagini(element):
        adauga(imagine)
    if stil == 'Title' or not text:
        continue

    if stil == 'Heading1':
        capitol_curent = {'titlu': text, 'blocuri': []}
        capitole.append(capitol_curent)
        continue

    # cuprinsul de la început („1. Dataset: MQTTset”, ...) nu intră pe site: meniul ține locul lui
    if capitol_curent is None and re.match(r'^\d+\. ', text) and not bucati[0][1]:
        continue
    if text == 'Cuprins':
        continue

    # cod (Courier New): liniile consecutive se lipesc într-un singur bloc
    if all(e_cod for bucata, _, e_cod in bucati if bucata.strip()):
        anterior = ultimul_bloc()
        if anterior and anterior['tip'] == 'cod':
            anterior['text'] += '\n' + text_paragraf(element)
        else:
            adauga({'tip': 'cod', 'text': text_paragraf(element)})
        continue

    # elementele de listă consecutive (de același fel) se adună într-o singură listă
    if stil == 'ListParagraph':
        numerotare = element.find(f'{W}pPr/{W}numPr/{W}numId')
        numerotata = numerotare is not None and numerotare.get(W + 'val') == ID_LISTA_NUMEROTATA
        if numerotata:
            numar_referinta += 1
        anterior = ultimul_bloc()
        if anterior and anterior['tip'] == 'pas' and not numerotata:  # punctele de sub „Calcul:” intră în caseta pasului
            anterior.setdefault('puncte', []).append(text)
        elif anterior and anterior['tip'] == 'lista' and anterior['ordonata'] == numerotata:
            anterior['elemente'].append(text)
        else:
            adauga({'tip': 'lista', 'ordonata': numerotata, 'start': numar_referinta if numerotata else 1, 'elemente': [text]})
        continue

    text_ingrosat = ''.join(bucata for bucata, ingrosat, _ in bucati if ingrosat).strip()

    # titlul unei părți: „Ce facem și de ce”, „Ipoteza”, „Pașii”, „Demonstrația”, „Concluzia”
    if text_ingrosat == text and text in PARTI:
        adauga({'tip': 'parte', 'fel': PARTI[text], 'titlu': text})
        continue

    # titlu de secțiune: tot paragraful e îngroșat și începe cu „N.M ” sau cu „Metoda ” (metoda capitolului, fără număr)
    if text_ingrosat == text and re.match(r'^(\d+\.\d+|Metoda) ', text):
        adauga({'tip': 'sectiune', 'titlu': text})
        continue

    # paragraf cu etichetă îngroșată la început: „Intrare: ...”, „Ce arată: ...”
    eticheta = re.match(r'^([^:]{1,40}):\s*', text)
    if eticheta and bucati[0][1] and text_ingrosat.rstrip(':') == eticheta[1]:
        nume_eticheta, rest = eticheta[1], text[eticheta.end():]
        if nume_eticheta in ETICHETE_PAS:
            adauga({'tip': 'pas', 'fel': ETICHETE_PAS[nume_eticheta], 'eticheta': nume_eticheta, 'text': rest})
        else:
            adauga({'tip': 'text', 'eticheta': nume_eticheta, 'text': rest})
        continue

    if text_ingrosat == text:
        adauga({'tip': 'subtitlu', 'text': text})
        continue

    adauga({'tip': 'text', 'text': text})


# --- scrierea fișierelor TypeScript ---

def scrie_ts(nume_fisier, valoare, tip):
    tip_importat = tip.rstrip('[]')  # „Bloc[]” → se importă „Bloc”
    continut = json.dumps(valoare, ensure_ascii=False, indent=1)
    (FOLDER_DATE / nume_fisier).write_text(
        f"import type {{ {tip_importat} }} from './tipuri'\n\nconst date: {tip} = {continut}\n\nexport default date\n")


for numar, capitol in enumerate(capitole, 1):
    scrie_ts(f'cap{numar:02d}.ts', capitol, 'Capitol')

# rezumat, ca să se vadă dacă s-a recunoscut tot
total_blocuri = sum(len(capitol['blocuri']) for capitol in capitole)
total_imagini = len(list(FOLDER_IMAGINI.glob('*.png')))
print(len(capitole), 'capitole;', total_blocuri, 'blocuri;', total_imagini, 'imagini')
for capitol in capitole:
    numarate = {tip: sum(bloc['tip'] == tip for bloc in capitol['blocuri']) for tip in ['pas', 'tabel', 'imagine', 'galerie', 'cod', 'sectiune']}
    print(capitol['titlu'], len(capitol['blocuri']), numarate)
