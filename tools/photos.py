#!/usr/bin/env python3
"""Stock photos for Chamber members, from Wikimedia Commons, with credits.

  photos.py fetch <slug> "query one" "query two" ...   candidates + a numbered contact sheet
  photos.py pick  <slug> name=index[:ratio[:fx,fy]] ... copy chosen candidates into <slug>/img/, write credits.json

ratio is w/h like 4/5, 16/9, 1 (default: keep). fx,fy is the crop focus (0..1, default .5,.5).
Only freely licensed files are kept (CC0, public domain, CC BY, CC BY-SA); each keeps its author and licence.
"""
import sys, os, json, re, io, html, urllib.request, urllib.parse
from PIL import Image, ImageCms, ImageDraw, ImageFont, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAND = "/home/claude/build/cand"
UA = {"User-Agent": "ChamberSatireSites/1.0 (https://github.com/samuelling/Chamber; satire art project)"}
OK_LIC = re.compile(r"^(CC0|Public domain|PD|CC BY(-SA)? ?\d(\.\d)?|CC BY(-SA)?)", re.I)
BAD = re.compile(r"drawing|painting|illustration|anime|fantasy|cartoon|poster|nude|naked|nsfw|sex|penis|vagina|genital|erotic|porn|breast|nipple|corpse|dead body|autopsy|cadaver|gore|wound|injur|lynch|execution|holocaust|nazi|swastika|child|kid|baby|infant|boy|girl|portrait of|selfie", re.I)

import time
def get(url, binary=False):
    for attempt in range(5):
        time.sleep(1.2)   # be polite: Commons rate-limits bursts
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=40) as r: data = r.read()
            return data if binary else json.loads(data)
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == 4: raise
            time.sleep(8 * (attempt + 1))

def search(q, n=12):
    want = [w.rstrip("s") for w in re.sub(r"incategory:\S+", "", q).lower().split() if len(w) > 3]
    p = {"action": "query", "format": "json", "generator": "search", "gsrnamespace": 6, "gsrsearch": q + " filetype:bitmap", "gsrlimit": n,
         "prop": "imageinfo", "iiprop": "url|size|mime|extmetadata", "iiurlwidth": 1280}
    d = get("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(p))
    out = []
    for pg in sorted((d.get("query") or {}).get("pages", {}).values(), key=lambda x: x.get("index", 0)):
        ii = (pg.get("imageinfo") or [{}])[0]; md = ii.get("extmetadata", {})
        lic = md.get("LicenseShortName", {}).get("value", "")
        title = pg["title"]; desc = re.sub("<[^>]+>", "", md.get("ImageDescription", {}).get("value", ""))[:200]
        if ii.get("mime") != "image/jpeg" or ii.get("width", 0) < 900 or ii.get("height", 0) < 600: continue
        if not OK_LIC.match(lic) or BAD.search(title + " " + desc): continue
        if md.get("Restrictions", {}).get("value"): continue
        if want and not any(w in (title + " " + desc).lower() for w in want): continue
        artist = html.unescape(re.sub("<[^>]+>", "", md.get("Artist", {}).get("value", "unknown"))).strip()[:80]
        out.append({"title": title, "thumb": ii.get("thumburl") or ii["url"], "page": ii.get("descriptionurl"), "license": lic, "artist": artist, "desc": html.unescape(desc)})
    return out

def to_srgb(im):
    icc = im.info.get("icc_profile")
    if icc:
        try: im = ImageCms.profileToProfile(im, ImageCms.ImageCmsProfile(io.BytesIO(icc)), ImageCms.createProfile("sRGB"), outputMode="RGB")
        except Exception: pass
    return ImageOps.exif_transpose(im).convert("RGB")

def fetch(slug, queries):
    d = os.path.join(CAND, slug); os.makedirs(d, exist_ok=True)
    meta, seen = [], set()
    for q in queries:
        qq = q if "incategory" in q else q
        got = []
        for attempt in (qq,):
            try: got = search(attempt, 14)
            except Exception as e: print("search failed", attempt, e); got = []
            got = [g for k, g in enumerate(got) if g["title"] not in seen and g["title"] not in [x["title"] for x in got[:k]]]
            if len(got) >= 3: break
        for g in got[:5]:
            if len(meta) >= 20: break
            try: im = to_srgb(Image.open(io.BytesIO(get(g["thumb"].replace("/1280px-", "/330px-"), True))))
            except Exception as e: print("skip", g["title"], e); continue
            i = len(meta); im.save(f"{d}/c{i:02d}.jpg", quality=86); seen.add(g["title"]); g["q"] = q; meta.append(g)
    json.dump(meta, open(f"{d}/meta.json", "w"), indent=1)
    T = 230; cols = 5; rows = (len(meta) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * T, rows * T), (20, 20, 20)); dr = ImageDraw.Draw(sheet)
    for i in range(len(meta)):
        im = Image.open(f"{d}/c{i:02d}.jpg"); im.thumbnail((T - 6, T - 22))
        x, y = (i % cols) * T, (i // cols) * T; sheet.paste(im, (x + 3, y + 3))
        dr.rectangle([x + 3, y + T - 19, x + 40, y + T - 3], fill=(0, 0, 0)); dr.text((x + 7, y + T - 18), str(i), fill=(255, 220, 0))
    sheet.save(f"{d}/sheet.jpg", quality=80)
    for i, m in enumerate(meta): print(i, m["q"], "|", m["title"][5:60])
    print("sheet", f"{d}/sheet.jpg")

def pick(slug, picks):
    d = os.path.join(CAND, slug); meta = json.load(open(f"{d}/meta.json"))
    out = os.path.join(ROOT, slug, "img"); os.makedirs(out, exist_ok=True)
    cp = os.path.join(ROOT, slug, "credits.json")
    credits = json.load(open(cp)) if os.path.exists(cp) else []
    for p in picks:
        name, spec = p.split("="); parts = spec.split(":"); i = int(parts[0])
        big = f"{d}/b{i:02d}.jpg"
        if not os.path.exists(big): to_srgb(Image.open(io.BytesIO(get(meta[i]["thumb"], True)))).save(big, quality=90)
        im = Image.open(big)
        if len(parts) > 1 and parts[1] not in ("", "keep"):
            a, b = (parts[1].split("/") + ["1"])[:2]; ar = float(a) / float(b)
            fx, fy = (map(float, parts[2].split(","))) if len(parts) > 2 else (0.5, 0.5)
            w, h = im.size
            if w / h > ar: nw = round(h * ar); x0 = int(min(max(0, fx * w - nw / 2), w - nw)); im = im.crop((x0, 0, x0 + nw, h))
            else: nh = round(w / ar); y0 = int(min(max(0, fy * h - nh / 2), h - nh)); im = im.crop((0, y0, w, y0 + nh))
        if im.width > 1400: im = im.resize((1400, round(im.height * 1400 / im.width)), Image.LANCZOS)
        im.save(f"{out}/{name}.jpg", quality=78, optimize=True, progressive=True)
        m = meta[i]; credits = [c for c in credits if c["file"] != f"img/{name}.jpg"]
        credits.append({"file": f"img/{name}.jpg", "title": m["title"][5:], "artist": m["artist"], "license": m["license"], "source": m["page"]})
    json.dump(credits, open(cp, "w"), indent=1)
    print("picked", len(picks), "->", out)

if __name__ == "__main__":
    cmd, slug = sys.argv[1], sys.argv[2]
    (fetch if cmd == "fetch" else pick)(slug, sys.argv[3:])
