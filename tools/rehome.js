/* Rebuild members' home pages in one of several layout families modelled on real corporate sites.
   node tools/rehome.js [slug ...]   (no args: every member in CFG)
   Reads the member's spec, reuses its own words and photographs, writes the new home page back into spec.js. */
const fs = require("fs"), vm = require("vm");

const CFG = {
  /* ---- poster: one full-bleed photograph, a handful of words, then Apple-style tiles (Tesla, Apple, Rolex) ---- */
  northwind: { a: "poster", hdr: "overlay", img: "wing", seen: "eye", place: "top", sub: "Every seat a window. Every shade open.",
    tiles: [["window", "Every seat, a window.", "Shades fixed open, boarding to arrival.", ["#cabins", "Cabins"], "iris"], ["terminal", "Terminal N.", "Boston’s brightest gateway.", ["#fly", "Where we fly"]], ["iris", "The view.", "It finds you.", ["#window", "About the window"]]],
    band: ["apron", "Gate 41. A plane is always boarding.", "Flight 41 departed Boston in 1971. It is a scheduled service."] },
  atlas: { a: "poster", hdr: "overlay", img: "run", seen: "plinth", place: "bottom", sub: "Unending 9. Carbon plate. No stop button.", marquee: "NEVER STOP · ",
    tiles: [["shoe", "Unending 9", "Race. Don’t stop.", ["#shoes", "Shop"]], ["plinth", "Pursuit Trail", "Off-road. Away.", ["#shoes", "Shop"]], ["gym", "Atlas Run", "Your run, forever.", ["#run", "Get the app"]]],
    band: ["mats", "1.3 million left shoes. Still warm.", "When a runner goes too far to track, their left shoe comes home."] },
  gilded: { a: "poster", hdr: "overlay", img: "corridor", seen: "keyhole", place: "center", sub: "Forty-one grand hotels. Every key cut by hand.",
    tiles: [["dining", "The Salon", "Luang Prabang.", ["#hotels", "Discover"]], ["facade", "Arrival", "Your key is already cut.", ["#reserve", "Reserve"]], ["ornate", "The key service", "No cards. No codes.", ["#service", "Discover"], "keyhole"]],
    band: ["narrow", "Every keyhole, attended.", "One porter per door, at the keyhole, all night."], lead: false },
  lacquer: { a: "poster", hdr: "overlay", img: "polish", seen: "clippings", place: "center",
    tiles: [["manicure", "The ritual", "", ["#services", "Book"]], ["clipper", "The tools", "", ["#membership", "Membership"], "clippings"]], band: ["clippings", "Nothing is wasted.", ""] },
  halden: { a: "poster", hdr: "overlay", img: "rack", seen: "block", place: "bottom",
    tiles: [["board", "The Chef’s Knife", "", ["#knives", "Shop"]], ["whetstone", "The forge", "", ["#forge", "Learn more"]], ["chef", "In the kitchen", "", ["#insights", "Stories"]]], band: ["block", "Sharp enough to trust with your life.", ""] },
  seatwell: { a: "poster", hdr: "overlay", img: "hall", seen: "chamber", place: "bottom", sub: "Task, auditorium and assembly seating since 1952.",
    tiles: [["office", "The Keeper", "A chair that learns you.", ["#collection", "Explore"]], ["throne", "The Heir", "Every one previously owned.", ["#collection", "Explore"]], ["stadium", "Tier", "Every seat a good seat.", ["#contract", "Contract"]]],
    band: ["chamber", "Please remain seated.", "Row K has been occupied since the AGM of 1987."] },
  silicate: { a: "poster", hdr: "overlay", img: "wafer", seen: "skin", place: "center", sub: "Silicon, grown on a living layer.", dark: true,
    tiles: [["chip", "SC-4", "Body temperature.", ["#products", "Products"]], ["cells", "The substrate", "Skin is the best heat sink there is.", ["#process", "Process"], "skin"], ["film", "Fab 1", "37.0 °C. Humid.", ["#fab", "The fab"]]],
    band: ["die", "Every die, warm.", "Wafer 41, lot 7."] },
  ascend: { a: "poster", hdr: "overlay", img: "shaft", seen: "call", place: "center", sub: "140,000 cars. Two billion rides a day.",
    tiles: [["gold", "Heritage", "Since 1889.", ["#elevators", "Elevators"]], ["call", "SoftTouch", "Please press gently.", ["#the-button", "The button"], "panel"], ["cab", "Ascend MRL", "Silent. Warm.", ["#elevators", "Explore"]]],
    band: ["lobby", "Going up.", "Riders press SoftTouch buttons nearly seven times per call."] },
  driftwood: { a: "poster", hdr: "overlay", img: "wall", seen: "lp", place: "bottom", sub: "Stillwater. −48 dB.",
    tiles: [["phones", "Stillwater", "The quietest headphones ever measured.", ["#headphones", "Shop"]], ["cans", "Stillwater Lite", "Nearly total.", ["#headphones", "Shop"]], ["lp", "The Hum, on vinyl", "Forty minutes of it.", ["#sound", "Listen"]]],
    band: ["crates", "Under every record, the hum.", ""] },
  lumen: { a: "poster", hdr: "overlay", img: "braid", seen: "boxes", place: "bottom",
    tiles: [["brush", "Private client", "", ["#services", "Discover"]], ["braiding", "The atelier", "", ["#insights", "Stories"]], ["aisle", "The vault", "", ["#legal", "Custody"], "boxes"]], band: ["door", "Held close.", ""] },

  stride: { a: "poster", hdr: "overlay", img: "prints", seen: "cast", place: "center", sub: "Custom insoles from a 3D scan of your gait.",
    tiles: [["sole", "Insoles", "Made for one pair of feet.", ["#insoles", "Shop"]], ["last", "Gait lab", "Walk like nobody else.", ["#gait", "Book a scan"]], ["cast", "The cast library", "Every foot we’ve ever cast.", ["#cast-library", "Visit"]]],
    band: ["last", "Nobody else is you.", ""] },
  vessel: { a: "type", strip: "jars", marquee: "BENEFITS THAT HAVE YOUR BACK · " },

  /* ---- mosaic: photographs first, very few words (Airbnb, Patagonia, Aesop, Warby Parker) ---- */
  bloomfield: { a: "mosaic", hdr: "center", imgs: ["poppies", "lobby", "bouquet", "daisies", "market"], seen: { poppies: "model" } },
  harbor: { a: "mosaic", hdr: "minimal", imgs: ["store", "smile", "beach", "@team-sofa", "@team-wave"] },
  thimble: { a: "mosaic", hdr: "minimal", imgs: ["gowns", "suits", "street", "balcony", "thimble"], seen: { gowns: "street" } },
  gristmill: { a: "mosaic", imgs: ["rolls", "dough", "mill", "risen", "gluten"], seen: { rolls: "risen" } },
  kinfolk: { a: "mosaic", imgs: ["album", "print", "swab", "tubes", "print2"] },
  orchard: { a: "mosaic", imgs: ["branch", "coins", "piggy", "pillow"] },
  hollow: { a: "mosaic", hdr: "center", imgs: ["living", "deer", "mount", "eyes"] },
  tenfold: { a: "mosaic", hdr: "minimal", imgs: ["socks", "toes", "line", "machine"] },
  clearview: { a: "mosaic", imgs: ["store", "specs", "frames", "chart", "pince"], seen: { store: "blur" } },
  aster: { a: "mosaic", hdr: "minimal", imgs: ["rings", "dinner", "sunset", "hold", "bracelet"], seen: { rings: "hold" } },

  /* ---- type: enormous words, almost nothing else (Nike, Pentagram, Stripe) ---- */
  verity: { a: "type", hdr: "minimal", strip: "tower", marquee: "LEAN · " },
  quillon: { a: "type", hdr: "center", strip: "contract", marquee: "SIGN HERE · " },
  lark: { a: "type", strip: "petri", marquee: "SPIT · KNOW · THRIVE · " },
  tessellate: { a: "type", strip: "spiral", marquee: "BACKBONE · " },
  cling: { a: "type", strip: "film", marquee: "SEALED · FRESH · FOREVER · " },
  brightside: { a: "type", strip: "balloon", marquee: "SMILE :) " },
  ironbark: { a: "type", strip: "crane", marquee: "BUILT TO HOLD · " },
  cradle: { a: "type", hdr: "center", strip: "dewar", marquee: "EVERY FAMILY BEGINS SOMEWHERE · " },

  /* ---- dash: a live product, numbers first (Bloomberg, Palantir, Datadog) ---- */
  polaris: { a: "dash" }, cumulus: { a: "dash" }, copperline: { a: "dash" }, sable: { a: "dash" }, lodestar: { a: "dash" },
  cobalt: { a: "dash" }, cuffwell: { a: "dash" }, northgate: { a: "dash" }, tally: { a: "dash" },

  /* ---- index: words first, editorial or government (Monocle, McKinsey, GOV.UK) ---- */
  wren: { a: "index", hdr: "center", lead: "margin", band: "reading" },
  fernhill: { a: "index", lead: "living", band: "stairs" },
  whitmore: { a: "index", lead: "strips", band: "archive", gov: true },
  ember: { a: "index", lead: "pit", band: "landfill", gov: true },
  under: { a: "index", lead: "cellar", band: "tunnel", gov: true },
  brightwater: { a: "index", lead: "reservoir", band: "lake", gov: true }
};

function load(slug){ let P; vm.runInNewContext(fs.readFileSync(slug + "/spec.js", "utf8"), { Kit: { build: p => P = p } }); return P; }
const im = n => !n ? undefined : n[0] === "@" ? n : "img/" + n + ".jpg";
const first = t => (t || "").split(/(?<=[.!?])\s+/)[0];
function captions(P){
  const m = {};
  const add = (src, alt, cap) => { if (src && !m[src]) m[src] = [alt || "", cap || alt || ""]; };
  P.pages.forEach(pg => pg.s.forEach(s => { (s.t === "gallery" ? s.items : []).forEach(g => add(g[0], g[1], g[2])); if (s.t === "products") s.items.forEach(x => add(x[0], x[1], x[1])); if (s.img) add(s.img, s.alt, s.cap || s.alt); }));
  Object.values(P.rooms).forEach(r => { (r.gallery || []).forEach(g => add(g[0], g[1], g[2])); if (r.img) add(r.img, r.alt, r.cap); });
  P.posts.forEach(p => add(p.img, p.title, p.title));
  return m;
}

function build(slug, c){
  const P = load(slug), H = P.pages[0].s, cap = captions(P);
  const hero = H.find(s => s.t === "hero"), split = H.find(s => s.t === "split"), quote = split && split.quote;
  const products = H.find(s => s.t === "products"), stats = H.find(s => s.t === "stats"), cta = H.find(s => s.t === "cta");
  let kpis = H.find(s => s.t === "kpis"), charts = H.find(s => s.t === "charts"), cards = H.find(s => s.t === "cards"), logos = H.find(s => s.t === "logos");
  const alt = n => (cap[im(n)] || [hero.alt])[0], capt = n => (cap[im(n)] || ["", ""])[1];
  const out = [];
  if (c.a === "poster"){
    out.push({ t: "hero", layout: "poster", place: c.place, dark: c.dark, eyebrow: hero.eyebrow, h1: c.h || hero.h1, sub: c.sub, img: im(c.img), alt: alt(c.img), seen: im(c.seen), cta: hero.cta, note: hero.note, seenNote: hero.seenNote, scroll: "Scroll" });
    if (c.marquee) out.push({ t: "marquee", text: c.marquee.repeat(2) });
    out.push({ t: "tiles", lead: c.lead, items: c.tiles.map(x => ({ img: im(x[0]), alt: alt(x[0]), h: x[1], sub: x[2], cta: x[3], seen: im(x[4]) })) });
    if (quote) out.push({ t: "statement", text: "“" + quote[0] + "”", by: quote[1] });
    out.push({ t: "band", tall: true, img: im(c.band[0]), alt: alt(c.band[0]), h2: c.band[1], cap: c.band[2] || capt(c.band[0]), seen: split && split.seen });
    if (stats) out.push(stats);
    out.push(cta);
  }
  if (c.a === "mosaic"){
    const seen = c.seen || {};
    out.push({ t: "hero", layout: "mosaic", eyebrow: hero.eyebrow, h1: hero.h1, lede: first(hero.lede), cta: hero.cta, note: hero.note, seenNote: hero.seenNote,
      imgs: c.imgs.slice(0, 5).map(n => [im(n), alt(n), im(seen[n])]) });
    out.push({ t: "statement", text: hero.lede.split(/(?<=[.!?])\s+/).slice(1, 3).join(" ") || hero.lede });
    if (products) out.push(products);
    const rest = fs.readdirSync(slug + "/img").map(f => "img/" + f).filter(f => !c.imgs.slice(0, 3).map(im).includes(f));
    out.push({ t: "mosaic", wide: true, style: rest.length >= 6 ? "masonry" : "strip", items: rest.slice(0, 7).map(f => [f, (cap[f] || [""])[0], (cap[f] || ["", ""])[1]]) });
    if (split) out.push(split);
    out.push(cta);
  }
  if (c.a === "type"){
    out.push({ t: "hero", layout: "type", eyebrow: hero.eyebrow, h1: hero.h1, lede: first(hero.lede) + " " + (hero.lede.split(/(?<=[.!?])\s+/)[1] || ""), cta: hero.cta, note: hero.note, seenNote: hero.seenNote, img: im(c.strip), alt: alt(c.strip), seen: hero.seen });
    out.push({ t: "marquee", text: c.marquee.repeat(3) });
    if (split) out.push({ t: "statement", eyebrow: split.eyebrow, text: split.p[1] || split.p[0] });
    if (stats) out.push(stats);
    if (split) out.push(Object.assign({}, split, { quote: undefined }));
    if (quote) out.push({ t: "quote", text: quote[0], who: quote[1] });
    out.push(cta);
  }
  if (c.a === "dash"){
    const k = (kpis ? kpis.items : (stats ? stats.items.map(x => [x[1], x[0], ""]) : [])).slice(0, 4);
    const tk = k.map(x => [String(x[0]).toUpperCase(), x[1], x[2]]).concat((P.counter && P.counter.lines || []).slice(0, 6).map(l => { const p = l.split(" · "); return [p[0].toUpperCase(), p.slice(1).join(" · "), ""]; }));
    out.push({ t: "ticker", items: tk });
    const ch = charts ? charts.items[0] : undefined;
    out.push({ t: "hero", layout: "dash", eyebrow: hero.eyebrow, h1: hero.h1, lede: hero.lede, cta: hero.cta, note: hero.note, seenNote: hero.seenNote, kpis: k.length ? k : undefined, chart: ch, img: hero.img, alt: hero.alt, seen: hero.seen });
    if (charts && charts.items.length > 1) out.push(Object.assign({}, charts, { items: charts.items.slice(1) }));
    if (logos) out.push(logos);
    if (split) out.push({ t: "band", img: split.img, alt: split.alt, seen: split.seen, eyebrow: split.eyebrow, h2: split.h2, cap: first(split.p[1] || split.p[0]) });
    if (cards) out.push(cards);
    out.push(cta);
  }
  if (c.a === "index"){
    const posts = P.posts.slice(0, 5);
    if (c.gov){
      out.push({ t: "hero", layout: "split", eyebrow: hero.eyebrow, h1: hero.h1, lede: hero.lede, cta: hero.cta, note: hero.note, seenNote: hero.seenNote });
      if (cards) out.push(cards);
      if (kpis) out.push(kpis);
      out.push({ t: "index", eyebrow: "Notices", h2: "Latest from " + P.name, items: posts.map((p, i) => [p.tag, p.title, "#post-" + p.slug, i === 0 ? im(c.lead) : undefined, undefined, i === 0 ? p.ex : undefined]) });
      out.push({ t: "band", img: im(c.band), alt: alt(c.band), seen: split && split.seen, h2: split ? split.h2 : hero.h1, cap: split ? first(split.p[0]) : "" });
    } else {
      out.push({ t: "index", eyebrow: hero.eyebrow, h2: hero.h1, items: posts.map((p, i) => [p.tag, p.title, "#post-" + p.slug, i === 0 ? im(c.lead) : (i < 5 ? p.img : undefined), i === 0 ? hero.seen : undefined, i === 0 ? hero.lede : undefined]) });
      if (split) out.push({ t: "statement", eyebrow: split.eyebrow, text: split.p[1] || split.p[0], by: quote ? quote[1] : undefined });
      out.push({ t: "band", tall: true, img: im(c.band), alt: alt(c.band), seen: split && split.seen, h2: split ? split.h2 : "", cap: capt(c.band) });
      if (products) out.push(products);
    }
    out.push(cta);
  }
  return { P, out: out.filter(Boolean) };
}

function splice(slug, c, out){
  let src = fs.readFileSync(slug + "/spec.js", "utf8");
  const a = src.indexOf('{ id: "home", depth: 0, s: [');
  if (a < 0) throw new Error(slug + ": no home page");
  const rest = src.slice(a + 10), m = rest.match(/\n\s*\{ id: "/);
  const b = a + 10 + m.index;
  const body = '{ id: "home", depth: 0, s: ' + JSON.stringify(out, (k, v) => v === undefined ? undefined : v) + " },";
  src = src.slice(0, a) + body + src.slice(b);
  src = src.replace(/\nheader: "[a-z]+",/, "");
  if (c.hdr) src = src.replace(/(\nskin: "[a-z]+",)/, '$1\nheader: "' + c.hdr + '",');
  fs.writeFileSync(slug + "/spec.js", src);
}

const slugs = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(CFG);
for (const s of slugs){
  const c = CFG[s]; if (!c){ console.log(s, "no config"); continue; }
  const { out } = build(s, c);
  // every image referenced must exist
  JSON.stringify(out).replace(/"img\/([\w-]+\.jpg)"/g, (_, f) => { if (!fs.existsSync(s + "/img/" + f)) throw new Error(s + ": missing img/" + f); });
  splice(s, c, out);
  console.log(s, c.a, out.map(x => x.t + (x.layout ? ":" + x.layout : "")).join(","));
}
