# Shop Lane grocery catalog: source and license

Contains data from Open Food Facts and its contributors, available under the Open Database License (ODbL 1.0). Individual database contents are available under the Database Contents License (DbCL 1.0). Product photographs are available under Creative Commons Attribution ShareAlike, credited to the contributors through each product's source page.

- Publisher: https://openfoodfacts.org
- Terms, licenses and attribution: https://pf-en.openfoodfacts.org/terms-of-use
- Original bulk export: https://static.openfoodfacts.org/data/en.openfoodfacts.org.products.csv.gz
- Data export documentation: https://pf-en.openfoodfacts.org/data
- This adapted grocery database is offered under ODbL 1.0, without technical access restrictions: [Download groceries.json](groceries.json).
- Import metadata and verified counts: [metadata.json](metadata.json).

Snapshot imported on November 21, 2026. Exactly 20,000 records selected from the official bulk CSV, each with a distinct barcode and a distinct name/brand/quantity combination. Names, brands, quantities, source category, product source URLs and photo URLs come from Open Food Facts. The app groups source category text into broad browsing categories. The small selection is not representative of all world products. Community-supplied information can contain errors and is not verified retailer inventory or health advice.

The `price` field was generated for this frontend demonstration using a deterministic barcode-derived formula. It does not come from Open Food Facts, a manufacturer or a retailer and must not be treated as a real offer. There is no stock data. The adapted database, including those demo fields, is shared under ODbL.

Photo copyright, trademarks and other rights in packaging can still apply. Open Food Facts licenses cover its contributors' contributions, not all third-party elements. This portfolio does not imply endorsement by product brands. Product photos are fetched lazily from Open Food Facts' image host and have a local fallback when unavailable. Each product detail view links to the source record for attribution.

The original 12 electronics/shoe demonstration products form a separate collection from DummyJSON, with credits in the repository's IMAGE-SOURCES.md. They are not part of groceries.json.
