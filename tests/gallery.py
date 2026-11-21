"""Gallery regression: python tests/gallery.py [deployed-homepage-url]."""
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
import json, sys
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parent.parent
projects = json.loads((root / 'projects.json').read_text())
server = None
if len(sys.argv) > 1:
    url = sys.argv[1]
else:
    server = ThreadingHTTPServer(('127.0.0.1', 0), partial(SimpleHTTPRequestHandler, directory=str(root)))
    Thread(target=server.serve_forever, daemon=True).start()
    url = f'http://127.0.0.1:{server.server_port}/'
try:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 390, 'height': 844})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        assert page.goto(url).status == 200
        page.wait_for_function('document.querySelectorAll(".project").length === 55')
        page.evaluate('document.querySelectorAll(".coverPhoto").forEach(image => image.loading = "eager")')
        page.wait_for_function('Array.from(document.querySelectorAll(".coverPhoto")).every(image => image.complete && image.naturalWidth > 0)', timeout=60000)
        assert page.locator('.coverPhoto[src$=".webp"]').count() == 55
        for slug, title, *_ in projects:
            page.locator('#search').fill(title)
            assert page.locator(f'.project[href^="{slug}/"]').count() == 1, title
        for term, slug in [('snake', 'snake'), ('drawing board', 'drawing-board'), ('code studio', 'code-studio'), ('الثعبان', 'snake')]:
            page.locator('#search').fill(term)
            assert page.locator(f'.project[href^="{slug}/"]').count() == 1, term
        page.locator('#search').fill('no-matching-project-zzz')
        assert page.locator('.project').count() == 0
        page.locator('#clearSearch').click()
        assert page.locator('.project').count() == 55
        page.locator('#searchLink').click()
        assert page.locator('#search').evaluate('element => element === document.activeElement')
        assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')
        assert not errors, errors
        browser.close()
finally:
    if server:
        server.shutdown()
print('55 covers, all project titles, bilingual search, clear/reset, mobile layout and navigation passed.')
