import shutil
import sys
import zipfile
import re
from pathlib import Path

from lxml import etree

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NS = {"w": W_NS}
XML_SPACE = "{http://www.w3.org/XML/1998/namespace}space"
PLACEHOLDER_RE = re.compile(r"\{\{([A-Za-z0-9_-]+)\}\}")


def qn(local: str) -> str:
    return f"{{{W_NS}}}{local}"


def unzip_docx(docx_path: Path, out_dir: Path) -> None:
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(docx_path, "r") as zf:
        zf.extractall(out_dir)


def zip_docx(in_dir: Path, out_docx_path: Path) -> None:
    if out_docx_path.exists():
        out_docx_path.unlink()
    with zipfile.ZipFile(out_docx_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for path in in_dir.rglob("*"):
            if path.is_file():
                zf.write(path, path.relative_to(in_dir).as_posix())


def _preserve_spaces(t_el: etree._Element, text: str) -> None:
    if text.startswith(" ") or text.endswith(" "):
        t_el.set(XML_SPACE, "preserve")


def make_sdt(tag: str, placeholder_text: str, rpr: etree._Element | None) -> etree._Element:
    sdt = etree.Element(qn("sdt"))
    sdt_pr = etree.SubElement(sdt, qn("sdtPr"))
    tag_el = etree.SubElement(sdt_pr, qn("tag"))
    tag_el.set(qn("val"), tag)
    alias_el = etree.SubElement(sdt_pr, qn("alias"))
    alias_el.set(qn("val"), tag)
    etree.SubElement(sdt_pr, qn("text"))
    sdt_content = etree.SubElement(sdt, qn("sdtContent"))
    r = etree.SubElement(sdt_content, qn("r"))
    if rpr is not None:
        r.append(rpr)
    t = etree.SubElement(r, qn("t"))
    display = display_text_for_tag(tag)
    t.text = display
    _preserve_spaces(t, display)
    return sdt


def display_text_for_tag(tag: str) -> str:
    if tag.startswith("MEGJEGYZES_"):
        return "_______________________________________________________________"
    if tag.startswith("ERTEK_"):
        return "________________________"
    if tag.startswith("MEZO_"):
        return "__________________"
    return "__________________"


def make_run(text: str, rpr: etree._Element | None) -> etree._Element:
    r = etree.Element(qn("r"))
    if rpr is not None:
        r.append(etree.fromstring(etree.tostring(rpr)))
    t = etree.SubElement(r, qn("t"))
    t.text = text
    _preserve_spaces(t, text)
    return r


def wrap_xml_placeholders(xml_path: Path) -> int:
    parser = etree.XMLParser(remove_blank_text=False)
    tree = etree.parse(str(xml_path), parser)
    root = tree.getroot()
    changed = 0
    runs = root.xpath(".//w:r", namespaces=NS)
    for run in runs:
        texts = run.xpath("./w:t", namespaces=NS)
        if not texts:
            continue
        full = "".join((t.text or "") for t in texts)
        if not full or not PLACEHOLDER_RE.search(full):
            continue
        parent = run.getparent()
        if parent is None:
            continue
        rpr = run.find("w:rPr", namespaces=NS)
        idx = parent.index(run)
        pos = 0
        inserts = []
        for match in PLACEHOLDER_RE.finditer(full):
            if match.start() > pos:
                inserts.append(make_run(full[pos:match.start()], rpr))
            tag = match.group(1)
            inserts.append(make_sdt(tag, match.group(0), rpr))
            pos = match.end()
        if pos < len(full):
            inserts.append(make_run(full[pos:], rpr))
        for node in inserts:
            parent.insert(idx, node)
            idx += 1
        parent.remove(run)
        changed += 1
    tree.write(str(xml_path), xml_declaration=True, encoding="UTF-8", standalone="yes")
    return changed


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: wrap_fillable_docx_local.py INPUT.docx OUTPUT.docx")
        return 1
    input_docx = Path(sys.argv[1])
    output_docx = Path(sys.argv[2])
    work_dir = Path(__file__).resolve().parent / "docs" / "_sdt_work"
    unzip_docx(input_docx, work_dir)
    changed = 0
    word_dir = work_dir / "word"
    for part in [word_dir / "document.xml", *sorted(word_dir.glob("header*.xml")), *sorted(word_dir.glob("footer*.xml"))]:
        if part.exists():
            changed += wrap_xml_placeholders(part)
    zip_docx(work_dir, output_docx)
    print(f"wrapped {changed} placeholders into SDTs -> {output_docx}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
