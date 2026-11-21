from pathlib import Path
import subprocess,sys
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
server=subprocess.Popen([sys.executable,'-m','http.server','8765','--directory',str(ROOT)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
 with sync_playwright() as p:
  browser=p.chromium.launch()
  page=browser.new_page(viewport={"width":1360,"height":950})
  page.goto('http://127.0.0.1:8765/paper-trade/')
  page.locator('#trade button').click()
  assert 'AAPL' in page.locator('#positions').inner_text()
  page.goto('http://127.0.0.1:8765/arcade/')
  assert page.locator('#board button').count()==16
  page.get_by_role('button',name='2048',exact=True).click()
  page.keyboard.press('ArrowLeft')
  errors=[]
  page.on("pageerror",lambda error:errors.append(str(error)))
  def go(slug):page.goto('http://127.0.0.1:8765/'+slug+'/')
  go('flow-board');page.fill('#title','New test card');page.locator('#add button').click();assert 'New test card' in page.locator('#board').inner_text()
  go('budget-lab');page.fill('#description','Lunch');page.fill('#amount','15');page.locator('#add button').click();assert '$15.00' in page.locator('#stats').inner_text()
  go('invoice-studio');page.fill('#description','Consultation');page.fill('#rate','100');page.locator('#add button').click();assert '$1,300.00' in page.locator('#totals').inner_text()
  go('ink-notes');page.fill('#content','# Test\n\n**Bold**');page.locator('#preview').click();assert page.locator('#rendered strong').inner_text()=='Bold'
  go('habit-garden');page.locator('[data-date]:not([disabled])').first.click();assert '✓' in page.locator('#grid').inner_text()
  go('focus-room');page.locator('#start').click();assert page.locator('#start').inner_text()=='Pause';page.locator('#start').click()
  go('calendar-studio');page.fill('#title','Design review');page.locator('#add button').click();assert 'Design review' in page.locator('#events').inner_text()
  go('split-bills');page.fill('#title','Dinner');page.fill('#amount','90');page.locator('#add button').click();assert '$30.00' in page.locator('#settlements').inner_text()
  go('client-desk');page.fill('#name','Test Contact');page.locator('#add button').click();assert 'Test Contact' in page.locator('#contacts').inner_text()
  go('stock-room');page.fill('#name','Test Product');page.fill('#sku','TEST-001');page.locator('#add button').click();assert 'Test Product' in page.locator('#products').inner_text()
  def go(slug):page.goto('http://127.0.0.1:8765/'+slug+'/')
  go('route-book');page.fill('#title','Museum');page.fill('#cost','20');page.locator('#add button').click();assert 'Museum' in page.locator('#days').inner_text()
  go('meal-studio');page.select_option('[data-day="Monday"]','0');assert 'pasta' in page.locator('#shopping').inner_text();page.fill('#servings','4');assert '400' in page.locator('#ingredients').inner_text()
  go('workout-log');page.locator('#add button').click();assert '480' in page.locator('#stats').inner_text()
  go('quiz-academy')
  for i in range(5):
   page.locator('[data-answer]').first.click();page.locator('#next').click()
  assert 'Your review' in page.locator('#quiz').inner_text()
  go('sound-lab');page.locator('#play').click();assert page.locator('#play').inner_text()=='Stop';page.locator('#play').click();page.locator('[data-r]').first.click()
  go('image-studio');page.wait_for_function('document.querySelector("#info").textContent.includes("pixels")');page.locator('#rotate').click();assert page.locator('#info').inner_text()!=''
  go('pathfinder');page.fill('#speed','0');page.locator('#run').click();assert 'Total cost' in page.locator('#status').inner_text()
  go('type-racer');page.locator('#input').press_sequentially('The best ');page.locator('#finish').click();assert 'Session complete' in page.locator('#result').inner_text()
  go('data-lens');assert page.locator('#table tbody tr').count()==8;assert '29,300' in page.locator('#stats').inner_text();page.fill('#search','North');assert page.locator('#table tbody tr').count()==2
  print('Functional wave three tests passed')
  assert not errors,errors
  print("Core user-flow smoke tests passed.")
  browser.close()
finally:
 server.terminate()
 server.wait()
