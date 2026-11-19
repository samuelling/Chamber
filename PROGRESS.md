# Build progress

Members are built from `<slug>/spec.js` with the kit (`engine/kit.js`, `engine/kit.css`, `engine/motifs.js`).
Workflow per member: `python3 tools/photos.py fetch <slug> "query" …` → look at the contact sheet → `tools/photos.py pick <slug> name=index:ratio …`
→ write `spec.js` → `node tools/build.mjs <slug>` (writes index.html, atoms.json, marks live) → crawl → commit.

Shared stock is described in `engine/img/README.md` (exec-1..6 are mouths, not portraits; use h1..h12 for people).

| # | Member | Skin | Motif | Status |
|---|---|---|---|---|
| 1 | Corpora Meridian (MouthBreeder repo) | custom | tooth | live |
| 2 | Kestrel Capital | custom site.js | egg | live |
| 3 | Lumen & Ledger | luxury | braid | live |
| 4 | Driftwell Cloud | tech | pill | live |
| 5 | Northgate Freight | dashboard | door | live |
| 6 | Ossian Life | saas | clock | live |
| 7 | Kinfolk Ancestry | retail | fingerprint | live |
| 8 | Fernhill Realty | editorial | plan | live |
| 9 | Saltmarsh Therapeutics | clinical | fly | live |
| 10 | Tessellate Architects | brutal | stair | live |
| 11 | Orchard Savings | warm | coin | live |
| 12 | Polaris Earth Imaging | dashboard (dark) | face | live |
| 13 | Tally | saas | receipt | live |
| 14 | Vessel Health | saas | heart | live |
| 15 | Stride Orthotics | clinical | foot | live |
| 16 | Tenfold | retail | toe | live |
| 17 | Lacquer | luxury (light) | crescent | live |
| 18 | Cradle Cryobank | editorial | vial | live |
| 19 | Lark Labs | brutal (lime) | droplet | live |
| 20 | Hollow & Hart | warm | orb (glass eye) | live |
| 21 | Halden Steel | tech (steel) | blade | live |
| 22 | Bright Side Events | saas (yellow) | smile | live |
| 23 | Under & Co. | civic | arch | live |
| 24 | Cuffwell | dashboard (light, violet) | cuff | live |
| 25 | Cling | brutal (ice) | film | live |
| 26 | Seatwell | luxury (dark, rust) | chair | live |
| 27 | Ember | civic | flame | live |
| 28 | Brightwater | clinical | droplet | live |
| 29 | Copperline | tech (copper) | wave | live |
| 30 | Atlas | retail (orange) | shoe | live |
| 31 | Gilded | luxury (gold) | keyhole | live |
| 32 | Quillon | legal | signature | live |
| 33 | Harbor | warm (green) | cup | live |
| 34 | Wren | editorial (ink blue) | letter | live |
| 35 | Cumulus | saas (sky) | cloud | live |
| 36 | Sable | dashboard (night green) | moth | live |
| 37 | Silicate | tech (light, violet) | grain | live |
| 38 | Aster | saas (coral) | hand | live |
| 39 | Northwind | editorial (navy) | window | live |
| 40 | Thimble | brutal (pink) | mannequin | live |
| 41 | Whitmore | civic (grey) | strip | live |
| 42 | Driftwood | retail (sand) | note | live |
