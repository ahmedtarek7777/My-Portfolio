"""Run with python tests/expansion.py after playwright install chromium."""
from pathlib import Path
import json, subprocess, sys
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
projects=json.loads((ROOT/'projects.json').read_text())
assert len(projects)==55
assert sum(p[2] in ['Games','ألعاب'] for p in projects)==15
assert sum(p[2] in ['Creative','إبداع'] for p in projects)==15
server=subprocess.Popen([sys.executable,'-m','http.server','8765','--directory',str(ROOT)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
 with sync_playwright() as p:
  browser=p.chromium.launch()
  page=browser.new_page(viewport={'width':390,'height':844})
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  for slug,*_ in projects:
   page.goto('http://localhost:8765/'+slug+'/')
   assert not page.evaluate('document.documentElement.scrollWidth>innerWidth'),slug
  page.goto('http://localhost:8765/code-studio/')
  page.wait_for_function('document.querySelector("#language").options.length >= 15')
  page.wait_for_function('document.querySelector("#preview").srcdoc.length>0',timeout=60000)
  page.frame_locator('#preview').locator('button').click()
  assert 'It works' in page.frame_locator('#preview').locator('h1').inner_text()
  page.goto('http://localhost:8765/noise-maker/')
  page.locator('#play').click()
  page.wait_for_function("['وقّف الصوت','Stop sound'].includes(document.querySelector('#play').textContent)")
  assert not errors,errors
  browser.close()
finally:
 server.terminate()
 server.wait()
print('55 routes, 15 Games, 15 Creative, mobile layout, editor execution and audio activation passed.')
