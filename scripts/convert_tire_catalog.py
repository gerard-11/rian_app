#!/usr/bin/env python3
"""Convert the Auto-Camioneta sheet from Garay's XLSX into a compact CSV."""

from __future__ import annotations

import csv
import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path


MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
DOC_REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PKG_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
SOURCE_SHEET = "Auto-Camioneta"


def get_shared_strings(archive: zipfile.ZipFile) -> list[str]:
    try:
        root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    except KeyError:
        return []
    return ["".join(node.itertext()) for node in root.findall(f"{{{MAIN_NS}}}si")]


def get_cell_value(cell: ET.Element, strings: list[str]) -> str:
    value = cell.find(f"{{{MAIN_NS}}}v")
    if value is None:
        inline = cell.find(f"{{{MAIN_NS}}}is")
        return "" if inline is None else "".join(inline.itertext())
    raw = value.text or ""
    return strings[int(raw)] if cell.get("t") == "s" else raw


def column_name(reference: str) -> str:
    match = re.match(r"[A-Z]+", reference)
    return match.group(0) if match else ""


def sheet_path(archive: zipfile.ZipFile) -> str:
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    targets = {
        relation.get("Id"): relation.get("Target", "")
        for relation in relationships.findall(f"{{{PKG_REL_NS}}}Relationship")
    }
    sheets = workbook.find(f"{{{MAIN_NS}}}sheets")
    if sheets is None:
        raise ValueError("El archivo no contiene hojas")
    for sheet in sheets:
        if sheet.get("name") == SOURCE_SHEET:
            relation_id = sheet.get(f"{{{DOC_REL_NS}}}id", "")
            target = targets[relation_id].lstrip("/")
            return target if target.startswith("xl/") else f"xl/{target}"
    raise ValueError(f"No se encontró la hoja {SOURCE_SHEET!r}")


def clean_number(value: str) -> str:
    number = float(value)
    return str(int(number)) if number.is_integer() else format(number, ".2f").rstrip("0").rstrip(".")


def convert(source: Path, destination: Path) -> tuple[int, int, int]:
    with zipfile.ZipFile(source) as archive:
        strings = get_shared_strings(archive)
        root = ET.fromstring(archive.read(sheet_path(archive)))

    products: dict[str, dict[str, str]] = {}
    duplicate_rows = 0
    conflicting_skus: set[str] = set()
    for row in root.findall(f".//{{{MAIN_NS}}}sheetData/{{{MAIN_NS}}}row"):
        if int(row.get("r", "0")) < 3:
            continue
        cells = {
            column_name(cell.get("r", "")): get_cell_value(cell, strings).strip()
            for cell in row.findall(f"{{{MAIN_NS}}}c")
        }
        sku = cells.get("C", "")
        if not sku or not cells.get("D") or not cells.get("F"):
            continue
        product = {
            "SKU": sku,
            "Rin": cells.get("A", ""),
            "Medida": cells.get("B", ""),
            "Descripcion": " ".join(cells.get("D", "").split()),
            "Costo": clean_number(cells.get("E", "0")),
            "PrecioSugerido": clean_number(cells["F"]),
        }
        if sku in products:
            duplicate_rows += 1
            if products[sku] != product:
                conflicting_skus.add(sku)
            # The workbook repeats the same product for each branch. Retain one.
            continue
        products[sku] = product

    destination.parent.mkdir(parents=True, exist_ok=True)
    with destination.open("w", encoding="utf-8", newline="") as output:
        writer = csv.DictWriter(
            output,
            fieldnames=["SKU", "Rin", "Medida", "Descripcion", "Costo", "PrecioSugerido"],
            lineterminator="\n",
        )
        writer.writeheader()
        writer.writerows(products.values())
    return len(products), duplicate_rows, len(conflicting_skus)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Uso: convert_tire_catalog.py ORIGEN.xlsx DESTINO.csv")
    count, duplicates, conflicts = convert(Path(sys.argv[1]), Path(sys.argv[2]))
    print(
        f"Productos: {count}; filas duplicadas eliminadas: {duplicates}; "
        f"SKU con datos diferentes: {conflicts}"
    )
