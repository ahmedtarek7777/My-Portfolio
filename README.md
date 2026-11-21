# Ahmed Tarek / Digital Playground

Responsive static portfolio and interactive frontend demos. No build step. Serve with `python -m http.server` or GitHub Pages.

## Release 1

- New responsive portfolio with project filtering, search, persistent theme/accent/layout/motion settings.
- NOVA Exchange: simulated prices, virtual buy/sell orders, weighted cost basis, portfolio valuation, chart, history and export. All market data is synthetic.
- PLAY / LAB: Memory, Tic Tac Toe vs computer, Reaction, Word Puzzle and 2048.
- Shop Lane: real product photos from DummyJSON, cart persistence and demo checkout.
- Taskly, Weather Now and Ember & Oak retained and linked.

## Data and limits

No backend, real trading, payments or actual bookings. Browser storage is device-local and is not encrypted or backed up. Weather uses Open-Meteo and requires internet. External fonts are optional. Product photography provenance is in IMAGE-SOURCES.md. Product prices are illustrative.

## Complete project index

1. [NOVA Exchange](paper-trade/) – Paper trading, portfolio analytics and a simulated market.
2. [PLAY / LAB](arcade/) – Five games, personal bests and instant play.
3. [Shop Lane](shop-lane/) – Real product photography, filters and a persistent cart.
4. [Taskly](taskly/) – Plan your day with drag-and-drop tasks and dark mode.
5. [Weather Now](weather-now/) – City search, live conditions and a five-day forecast.
6. [Ember & Oak](cafe-landing/) – An atmospheric cafe concept and local demo booking.
7. [Flow Board](flow-board/) – A project board with priorities, search, movable cards and JSON backup.
8. [Budget Lab](budget-lab/) – Income, expenses, category budgets, charts and transaction exports.
9. [Invoice Studio](invoice-studio/) – Editable line items, tax, discounts, saved drafts and print-ready invoices.
10. [Ink Notes](ink-notes/) – A searchable notebook with tags, safe Markdown preview and export.
11. [Habit Garden](habit-garden/) – Habit tracking with weekly history, streaks and completion analytics.
12. [Focus Room](focus-room/) – A configurable focus timer with breaks, task queue and session log.
13. [Daylight Calendar](calendar-studio/) – Monthly planning with event editing, reminders on the page and ICS export.
14. [Fair Share](split-bills/) – Group expenses, equal splits, net balances and simplified settlements.
15. [Client Desk](client-desk/) – A local CRM with contacts, deal stages, notes, search and pipeline value.
16. [Stock Room](stock-room/) – Inventory with real product imagery, stock movements, low-stock flags and search.
17. [Route Book](route-book/) – A multi-day itinerary builder with budgets, packing and trip exports.
18. [Meal Studio](meal-studio/) – Recipe search, serving scaling, a weekly meal plan and shopping list.
19. [Rep Studio](workout-log/) – Workout sessions, exercise sets, training volume and personal records.
20. [Quiz Academy](quiz-academy/) – Topic quizzes with explanations, review mode and progress history.
21. [Sound Lab](sound-lab/) – A browser synthesizer and step sequencer with tempo, waveforms and pattern storage.
22. [Pixel Studio](image-studio/) – Private image editing with filters, rotation, resizing and PNG export.
23. [Pathfinder](pathfinder/) – Interactive BFS and Dijkstra pathfinding with walls, weights and animation.
24. [Type Racer](type-racer/) – Timed typing practice with live accuracy, WPM, progress and personal history.
25. [Data Lens](data-lens/) – CSV import, numeric summaries, sortable tables, category charts and export.

## Running locally

```sh
python -m http.server 8080
```

Open `http://localhost:8080`. All projects are browser-only. Do not enter real customer records, passwords or confidential financial information. Browser data is not synchronized between devices. Export controls are available in the apps that support backups. There is no server-side authentication, database, real-time collaboration or payment processing.

## Verification

Key interactions have been checked in desktop Chrome and responsive 390px mobile layouts. Automated smoke tests are in `tests/smoke.py`, using Python Playwright. Install `playwright`, install its Chromium browser, then run `python tests/smoke.py`. These tests cover core user flows, not every edge case or all browser engines.

## Shop Lane large-catalog release

Shop Lane now contains a 20,000-record real grocery catalog imported from the official Open Food Facts bulk export. This is not a repeated list of invented SKUs. Barcode and name/brand/quantity combinations are unique within the selection. All grocery records include source image URLs, with lazy loading and a photo-unavailable fallback. Demo prices are generated and explicitly labeled. The original 12 tech/style products remain a separate collection. See `shop-lane/catalog/LICENSE.md` for ODbL, DbCL and CC-BY-SA attribution and reuse terms.

The store renders only 24, 48 or 96 items at a time, with page navigation/jump, brand/name/barcode search, categories, price/sort filters, persistent saved items, details and a quantity-based cart. No orders, stock checks or payments occur.

## Project cover art

The gallery cards use themed web-sourced photographs with custom typography and color treatment, not screenshots from inside the apps. Photo source pages and license credits are in `COVER-CREDITS.md` and `assets/covers/credits.json`. Files are stored locally for reliable loading.


## November expansion

55 separate project routes, including 15 Games and 15 Creative projects. New tools: 20-language Monaco editor with HTML/CSS/JavaScript sandbox execution (other languages are editing only), MyMemory translator, and an integrated portfolio assistant. The assistant uses the published portfolio as its knowledge base. Optional real multilingual semantic search runs in the browser using Transformers.js and the 118 MB quantized Xenova/paraphrase-multilingual-MiniLM-L12-v2 model. It is retrieval, not general-purpose generative chat. Keyword search remains available without downloading the model. Questions are not sent to a hosted chat API.

Noise Maker generates white, pink and brown noise locally. Audio starts after a user gesture and awaits AudioContext.resume() before scheduling sound. Audio output was tested with an analyser at the destination for Noise Maker, Sound Lab and Drum Machine. Device mute switches, browser background suspension and hardware volume remain under the visitor's control.

External runtime dependencies: Monaco Editor 0.52.2 from jsDelivr (MIT), Transformers.js 3.7.3 from jsDelivr (Apache-2.0), model files from Hugging Face (Apache-2.0). Translation text is sent to api.mymemory.translated.net only after clicking Translate; public service quotas and availability apply. Weather remains Open-Meteo. No API keys are embedded.


## Final catalog expansion
Exactly 50,000 distinct records including 556 preserved Fresh models. {'groceries': 23873, 'technology': 4229, 'household': 21898}. Original source names and per-record source/license fields retained. All prices generated demo EGP. Household includes personal care. Some images remain unchecked and use a clear unavailable-photo fallback. See shop-lane/catalog/SOURCES.md for licensing, attribution and market-vs-manufacture caveats.

Final post-quality counts: 23,639 supermarket + 4,238 technology + 22,123 home/personal care = 50,000. Removed 166 obvious test/invalid food records and reclassified 68 non-food records. Product names are community/source-authored and not all individually audited.
