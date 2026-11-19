# The Chamber

The Meridian Chamber of Commerce: a directory of fifty fictional businesses, each slick on the surface and obsessed with one thing underneath. Every member can bleed into the others.

Live at https://samuelling.github.io/Chamber/

## What's here

| Path | What it is |
|---|---|
| `index.html` | The front door: the member directory, and the Members' console (a patch bay for every member open in your browser) |
| `directory.json` | All 50 members, their slots, and which ones are open |
| `engine/` | The shared engine every member runs on: `engine.css`, `engine.js` (router, depth, rooms, ASCII, hidden specks, the endless dive), `bridge.js` (the network), `invisible-hands.js` (protocol 1), and shared stock photos |
| `kestrel/` | Kestrel Capital, member No. 02: venture capital that incubates. Literally. |

MouthBreeder (Corpora Meridian, No. 01) lives in its own repo and joins the network by loading `engine/bridge.js` and publishing its own `atoms.json`.

## Making a member

A member is a folder with three files:

- `index.html`: the site's own tokens and a few styles, then `site.js`, `../engine/engine.js`, `../engine/invisible-hands.js` and `../engine/bridge.js`.
- `site.js`: `window.SITE`, which holds everything else: pages, posts, rooms, the motif (`motif.polys(n, rng, weirdness)` returns polygons for level `n` of the dive), the trapped character, chat, cookie banner and forms.
- `atoms.json`: what siblings may borrow. Generate it with `node tools/atoms.mjs <folder>`.

Then mark it `"live": true` in `directory.json`.

## The network

Only numbers from 0 to 1 travel. Each member exposes `source`, `bleed`, `motif`, `rot`, `palette`, `depth`, `pulse` and `visitor`, and reports `depth`, `dwell`, `dive`, `flinch` and `count`. The numbers pick which sibling's `atoms.json` to borrow from and how much of the page to hand over.

- **Alone:** members open in tabs of the same browser find each other over a BroadcastChannel and drive each other with slow LFOs.
- **The console:** the front door's patch bay sends to any member open in the same browser, with its own LFO.
- **A room:** members join rooms over the internet through the Invisible Hands relay at `wss://invisible-hands.samuelling.workers.dev` (start one from any Network panel, or open a member with `?room=<code>`).

Every member has a Network switch (footer link, or the chip that appears when something is leaning on the page) that stops remote control and puts the page back.

## This is satire

Every business here is fictional. Nothing is a real offer, the forms send nothing, and nobody is in residence. Shared stock photos in engine/img are from Unsplash under the Unsplash License. Each member's own photos (300 in all) are from Wikimedia Commons under CC0, public domain, CC BY or CC BY-SA; every one is credited by author and licence on that member's Legal page and in its credits.json. Photos were chosen to avoid identifiable people.

## Home page layouts

Members' front pages come in six families, each modelled on a kind of real corporate site, so the Chamber doesn't read as fifty copies of one template:

| Family | After | Members |
|---|---|---|
| Poster (`hero layout: "poster"` + `tiles` + `band`) | Tesla, Apple, Rolex | Northwind, Atlas, Gilded, Lacquer, Halden, Seatwell, Silicate, Ascend, Driftwood, Lumen, Stride |
| Mosaic (`"mosaic"` + `mosaic`) | Airbnb, Patagonia, Aesop, Warby Parker | Bloomfield, Harbor, Thimble, Gristmill, Kinfolk, Orchard, Hollow, Tenfold, Clearview, Aster |
| Type (`"type"` + `marquee` + `statement`) | Nike, Pentagram, Stripe | Verity, Quillon, Lark, Tessellate, Cling, Brightside, Ironbark, Cradle, Vessel |
| Dashboard (`ticker` + `"dash"`) | Bloomberg, Palantir, Datadog | Polaris, Cumulus, Copperline, Sable, Lodestar, Cobalt, Cuffwell, Northgate, Tally |
| Index (`index` + `band`) | Monocle, McKinsey, GOV.UK | Wren, Fernhill, Whitmore, Ember, Under, Brightwater |
| Classic SaaS | every B2B startup | Ossian, Saltmarsh, Driftwell |

Headers vary too (`header: "overlay" | "center" | "minimal"`). `node tools/rehome.js <slug>` rebuilds a home page from its family config; run it on the spec as committed before the rehome, not twice.
