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
| 9 | Saltmarsh Therapeutics | clinical | fly | spec written; photos: fly, flies, vials, fruit, lab |
| 10 | Tessellate Architects | brutal | stair | spec written; photos: spiral, concrete-stair, ribs, model |
| 11 | Orchard Savings | warm | coin | spec written; photos: pillow, coins, piggy, branch |
