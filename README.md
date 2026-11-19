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
- **A room:** with an Invisible Hands relay configured, members join rooms over the internet (`?room=<code>`). No relay is deployed yet.

Every member has a Network switch (footer link, or the chip that appears when something is leaning on the page) that stops remote control and puts the page back.

## This is satire

Every business here is fictional. Nothing is a real offer, the forms send nothing, and nobody is in residence. Stock photos are from Unsplash under the Unsplash License.
