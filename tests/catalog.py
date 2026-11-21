from pathlib import Path
import json
R=Path(__file__).resolve().parent.parent/'shop-lane/catalog'
m=json.loads((R/'manifest.json').read_text())
items=[]
for c in m['collections'].values():
 a=json.loads((R/Path(c['file']).name).read_text());assert len(a)==c['count'];items+=a
assert len(items)==50000
assert len({p['id'] for p in items})==50000
assert sum(p.get('origin')=='fresh' for p in items)==556
assert all(p['name'] and p['image'] and p['source'] and p['license'] and p['price']>0 for p in items)
print('50,000 distinct records; 556 Fresh models retained; source, image, license and demo EGP fields complete.')
