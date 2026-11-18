#!/usr/bin/env python3
"""Gera e valida os pacotes estáticos de entrega para Netlify e GitHub sem subpastas."""

from __future__ import annotations

import glob
import os
import re
import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST_DIR = ROOT / "dist"
OUT_DIR = ROOT / "entrega"
FLAT_DIR = OUT_DIR / "sem-subpastas"
NETLIFY_ZIP = OUT_DIR / "angelicalamounierbeauty-netlify.zip"
FLAT_ZIP = OUT_DIR / "angelicalamounierbeauty-github-sem-subpastas.zip"

NETLIFY_TOML = """[build]
  publish = "."
  command = ""

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
"""

REDIRECTS_FILE = "/* /index.html 200\n"


def main() -> None:
    if not (DIST_DIR / "index.html").exists():
        raise SystemExit("Erro: dist/index.html não encontrado. Execute `npm run build` antes.")

    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)
    OUT_DIR.mkdir(parents=True)
    FLAT_DIR.mkdir(parents=True)

    assets_dir = DIST_DIR / "assets"
    asset_files = sorted(p for p in assets_dir.iterdir() if p.is_file())
    js_files = [p for p in asset_files if p.suffix == ".js"]
    css_files = [p for p in asset_files if p.suffix == ".css"]
    media_files = [p for p in asset_files if p.suffix not in (".js", ".css")]

    if len(js_files) != 1 or len(css_files) != 1:
        raise SystemExit(
            f"Esperado 1 arquivo JS e 1 CSS em dist/assets, encontrado: "
            f"{len(js_files)} JS, {len(css_files)} CSS."
        )

    js_src = js_files[0]
    css_src = css_files[0]

    # 1. Pacote ZIP padrão Netlify (com index.html na raiz + pasta assets/)
    with zipfile.ZipFile(NETLIFY_ZIP, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.write(DIST_DIR / "index.html", arcname="index.html")
        for asset in asset_files:
            zf.write(asset, arcname=f"assets/{asset.name}")
        zf.writestr("netlify.toml", NETLIFY_TOML)
        zf.writestr("_redirects", REDIRECTS_FILE)
        if (ROOT / "PUBLICACAO.md").exists():
            zf.write(ROOT / "PUBLICACAO.md", arcname="PUBLICACAO.md")

    # 2. Versão sem subpastas (todos os arquivos na raiz de entrega/sem-subpastas)
    html_text = (DIST_DIR / "index.html").read_text(encoding="utf-8")
    js_text = js_src.read_text(encoding="utf-8")
    css_text = css_src.read_text(encoding="utf-8")

    # Ajusta caminhos de /assets/<arquivo> para ./<arquivo>
    html_flat = html_text.replace(f"/assets/{js_src.name}", "./app.js").replace(
        f"/assets/{css_src.name}", "./style.css"
    )
    js_flat = js_text
    css_flat = css_text

    for media in media_files:
        shutil.copy2(media, FLAT_DIR / media.name)
        js_flat = js_flat.replace(f"/assets/{media.name}", f"./{media.name}")
        css_flat = css_flat.replace(f"/assets/{media.name}", f"./{media.name}")
        html_flat = html_flat.replace(f"/assets/{media.name}", f"./{media.name}")

    (FLAT_DIR / "index.html").write_text(html_flat, encoding="utf-8")
    (FLAT_DIR / "app.js").write_text(js_flat, encoding="utf-8")
    (FLAT_DIR / "style.css").write_text(css_flat, encoding="utf-8")
    (FLAT_DIR / "netlify.toml").write_text(NETLIFY_TOML, encoding="utf-8")
    (FLAT_DIR / "_redirects").write_text(REDIRECTS_FILE, encoding="utf-8")
    if (ROOT / "PUBLICACAO.md").exists():
        shutil.copy2(ROOT / "PUBLICACAO.md", FLAT_DIR / "PUBLICACAO.md")

    with zipfile.ZipFile(FLAT_ZIP, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for item in sorted(FLAT_DIR.iterdir()):
            if item.is_dir():
                raise SystemExit(f"Falha: subpasta inesperada encontrada em {item}")
            zf.write(item, arcname=item.name)

    # 3. Validações automáticas dos dois pacotes
    validate_netlify_zip(NETLIFY_ZIP)
    validate_flat_dir_and_zip(FLAT_DIR, FLAT_ZIP)
    print("Pacotes gerados e validados com sucesso:")
    print(f" - {NETLIFY_ZIP.relative_to(ROOT)} ({NETLIFY_ZIP.stat().st_size // 1024} KB)")
    print(f" - {FLAT_ZIP.relative_to(ROOT)} ({FLAT_ZIP.stat().st_size // 1024} KB)")
    print(f" - {FLAT_DIR.relative_to(ROOT)}/ ({len(list(FLAT_DIR.iterdir()))} arquivos na raiz, 0 subpastas)")


def validate_netlify_zip(zip_path: Path) -> None:
    with zipfile.ZipFile(zip_path, "r") as zf:
        names = set(zf.namelist())
        assert "index.html" in names, "index.html ausente na raiz do ZIP Netlify"
        assert "netlify.toml" in names, "netlify.toml ausente na raiz do ZIP Netlify"
        assert "_redirects" in names, "_redirects ausente na raiz do ZIP Netlify"

        index_html = zf.read("index.html").decode("utf-8")
        refs = re.findall(r'(?:src|href)="(/assets/[^"]+)"', index_html)
        assert refs, "Nenhuma referência /assets/ encontrada em index.html"
        for ref in refs:
            rel = ref.lstrip("/")
            assert rel in names, f"Recurso referenciado ausente no ZIP: {rel}"


def validate_flat_dir_and_zip(flat_dir: Path, flat_zip: Path) -> None:
    entries = list(flat_dir.iterdir())
    assert all(p.is_file() for p in entries), "Existem subpastas em entrega/sem-subpastas"

    index_html = (flat_dir / "index.html").read_text(encoding="utf-8")
    assert "./app.js" in index_html, "./app.js não encontrado no index.html plano"
    assert "./style.css" in index_html, "./style.css não encontrado no index.html plano"
    assert "/assets/" not in index_html, "Ainda existem referências /assets/ no index.html plano"

    js_text = (flat_dir / "app.js").read_text(encoding="utf-8")
    media_refs = re.findall(r'\./([A-Za-z0-9_.-]+\.(?:jpg|jpeg|png|webp|svg))', js_text)
    assert len(media_refs) >= 8, f"Esperado >= 8 imagens referenciadas em app.js, obtido {len(media_refs)}"
    for filename in media_refs:
        assert (flat_dir / filename).exists(), f"Imagem ausente na pasta plana: {filename}"

    with zipfile.ZipFile(flat_zip, "r") as zf:
        names = zf.namelist()
        assert all("/" not in n for n in names), f"Subpastas encontradas no ZIP plano: {names}"
        assert "index.html" in names and "app.js" in names and "style.css" in names


if __name__ == "__main__":
    main()
