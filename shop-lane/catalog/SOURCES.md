# Product sources, licenses and limits

The combined catalog contains exactly 50,000 distinct source IDs: 23,639 supermarket records, 4,238 technology records and 22,123 home/personal-care records. The 556 original Fresh models are retained. The incoming bundle was trimmed and filtered, then reserve records filled the removed entries to keep the total exact. No records were multiplied to meet the target.

## Product databases

- Open Food Facts and contributors: https://world.openfoodfacts.org
- Open Beauty Facts and contributors: https://world.openbeautyfacts.org
- Open Products Facts and contributors: https://world.openproductsfacts.org

Their database is licensed ODbL 1.0, individual contents DbCL 1.0, and product photographs CC BY-SA 3.0 as identified by the source. Attribution and share-alike apply. Source links are retained per record. The redistributable derivative database is supplied as grocery.json, tech.json and home.json in this directory under ODbL 1.0, subject to distinct third-party image and manufacturer rights.

https://opendatacommons.org/licenses/odbl/1-0/
https://opendatacommons.org/licenses/dbcl/1-0/
https://creativecommons.org/licenses/by-sa/3.0/

## Technology sources

Wikidata: https://www.wikidata.org, structured data CC0. Wikimedia Commons photographs have per-file licenses, recorded in each record where available. Some license entries direct visitors to the Commons file page because bulk metadata lookup was rate-limited. Use each source_url / source link to inspect its original references and file credit before reusing a photograph. The site does not claim an open license for an image whose license has not been resolved. Images are externally hosted and retain the source's own description pages. Device records include historical and discontinued models, not only current retail stock.

## Egyptian manufacturer records

Fresh Egypt: https://fresh.com.eg/ar/products
556 original Fresh appliance/TV model records retain their model names and manufacturer photo URLs. Fresh is an Egyptian brand; this does not establish the country of manufacture of every model. Manufacturer images and trademarks belong to their owners, with no open license asserted. This is an attributed, noncommercial portfolio demo, not an authorized retail shop.

## Origin, names, prices and image checks

The local filter means a source record lists an Arab-region market, contains an Arabic product name, or is one of the Fresh manufacturer records. Market and language are not manufacturing origin. Original product names are not machine-translated into invented model names. Data is community-maintained and may contain errors.

All prices are deterministic generated demo EGP values, not real offers. No orders, payments, stock claims or actual availability.

22,190 incoming records had HTTP 200 HEAD image checks during collection; the remainder were not all independently checked. Failures found during sampling were dropped by the source worker. The UI has an explicit unavailable-photo placeholder for later failures, never a different product photo. Network restrictions and hotlink policies can prevent some photos from loading. Only visible page photos are requested. See image_status on each record; a prior HTTP response is not a guarantee of future availability.

## Full source-bundle metadata

See provenance.json for the original schema, dataset attributions and intake caveats. Its intake count excludes the pre-existing Fresh records; the current final counts are in manifest.json.

Entry-page thumbnails are cached resized WebP copies of the original images for reliable first-page loading. Their original URLs remain in imageOriginal and the same source/rights apply. No different product photo is substituted.

Final quality pass removed 166 obvious test/invalid food records (zero-prefix test barcodes, trivial names or number-only names) and replaced them from the trimmed household reserve. Nonfood cleaning/tobacco/cosmetics records found in the food source were reclassified. Final collection counts: {'grocery': 23639, 'tech': 4238, 'home': 22123}. Community data is not individually audited across all 50,000 records.

Entry-page thumbnails are cached resized WebP copies of the original images for reliable first-page loading. Their original URLs remain in imageOriginal and the same source/rights apply. No different product photo is substituted.
