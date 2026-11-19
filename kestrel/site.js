/* Kestrel Capital: venture capital that incubates. Literally. */
(function(){
var E = "../engine/img/";

/* ---------- the egg ---------- */
function egg(n, r, w){
  var pts = [], N = 56, lobes = 3 + Math.floor(r() * 5), amp = w * (0.03 + r() * 0.07), ph = r() * 6.28;
  var pinch = w * (r() - 0.3) * 0.5, tall = 1 + w * (r() - 0.4) * 0.5, tip = 0.15 + w * (r() - 0.2) * 0.4, lean = w * (r() - 0.5) * 0.5;
  for (var i = 0; i < N; i++){
    var t = i / N * Math.PI * 2, c = Math.cos(t), s = Math.sin(t);
    var x = 0.38 * s * (1 - tip * c), y = -0.5 * c * tall;
    var k = 1 + amp * Math.sin(t * lobes + ph) - pinch * Math.exp(-c * c * 9) * 0.6;
    pts.push([x * k + lean * y * 0.4, y * (1 + amp * 0.4 * Math.cos(t * (lobes + 1) + ph))]);
  }
  return [pts];
}
/* something curled up inside, seen as if through a candle; it shows in the gaps */
function inside(g, n){
  if (n < 3) return;
  g.save();
  var a = Math.min(0.55, (n - 2) * 0.07);
  var grd = g.createRadialGradient(0, 0.02, 0.02, 0, 0.02, 0.42);
  grd.addColorStop(0, "rgba(255,196,120," + (a * 0.9).toFixed(3) + ")"); grd.addColorStop(1, "rgba(255,160,80,0)");
  g.fillStyle = grd; g.fillRect(-0.5, -0.5, 1, 1);
  g.globalAlpha = a; g.strokeStyle = g.fillStyle = "rgb(70,26,14)";
  g.lineWidth = 0.07; g.lineCap = "round";
  g.beginPath(); g.arc(0.0, 0.1, 0.15, 0.6, 5.2 + Math.sin(n) * 0.3); g.stroke();
  g.beginPath(); g.arc(0.1, -0.06, 0.075, 0, 6.29); g.fill();
  g.restore();
}

/* ---------- little charts ---------- */
function chartArea(svg, vals, labels, unit){
  var W = 560, H = 210, L = 34, B = 22, max = Math.max.apply(null, vals) * 1.1, n = vals.length;
  var X = function(i){ return L + (W - L - 8) * i / (n - 1); }, Y = function(v){ return 10 + (H - B - 10) * (1 - v / max); };
  var d = vals.map(function(v, i){ return (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1); }).join("");
  var g = "";
  for (var k = 0; k <= 4; k++){ var v = max / 1.1 * k / 4, y = Y(v); g += "<line x1='" + L + "' x2='" + W + "' y1='" + y + "' y2='" + y + "' stroke='currentColor' stroke-opacity='.1'/><text class='axis' x='0' y='" + (y + 4) + "'>" + Math.round(v) + unit + "</text>"; }
  labels.forEach(function(t, i){ if (i % 2 === 0 || i === n - 1) g += "<text class='axis' x='" + X(i) + "' y='" + (H - 4) + "' text-anchor='middle'>" + t + "</text>"; });
  svg.innerHTML = "<defs><linearGradient id='ga' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='var(--accent)' stop-opacity='.35'/><stop offset='1' stop-color='var(--accent)' stop-opacity='0'/></linearGradient></defs>" + g +
    "<path d='" + d + "L" + X(n - 1) + " " + Y(0) + "L" + X(0) + " " + Y(0) + "Z' fill='url(#ga)'/><path d='" + d + "' fill='none' stroke='var(--accent)' stroke-width='2.5' stroke-linejoin='round'/>" +
    "<circle cx='" + X(n - 1) + "' cy='" + Y(vals[n - 1]) + "' r='4.5' fill='var(--accent)'/>";
}
function chartBars(svg, vals, labels){
  var W = 320, H = 210, B = 24, max = Math.max.apply(null, vals) * 1.15, bw = (W - 20) / vals.length;
  svg.innerHTML = vals.map(function(v, i){
    var h = (H - B - 12) * v / max, x = 10 + i * bw + bw * 0.18;
    return "<rect x='" + x + "' y='" + (H - B - h) + "' width='" + (bw * 0.64) + "' height='" + h + "' rx='5' fill='var(--accent)' fill-opacity='" + (0.45 + 0.55 * i / (vals.length - 1)) + "'/><text class='axis' x='" + (x + bw * 0.32) + "' y='" + (H - 6) + "' text-anchor='middle'>" + labels[i] + "</text><text class='axis' x='" + (x + bw * 0.32) + "' y='" + (H - B - h - 6) + "' text-anchor='middle'>" + v + "</text>";
  }).join("");
}
var drawn = false;
function drawCharts(){
  if (drawn) return; drawn = true;
  var a = document.getElementById("chart-hatch"), b = document.getElementById("chart-days"), c = document.getElementById("chart-temp");
  if (a) chartArea(a, [12, 19, 31, 44, 63, 88, 117, 149, 182, 214], ["’17", "’18", "’19", "’20", "’21", "’22", "’23", "’24", "’25", "’26"], "");
  if (b) chartBars(b, [34, 29, 26, 23, 21], ["F0", "FI", "FII", "FIII", "FIV"]);
  if (c) chartArea(c, [37.2, 37.5, 37.6, 37.5, 37.4, 37.5, 37.5, 37.7, 37.5, 37.5, 37.5, 37.5], ["0", "2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "21"], "°");
}
/* portfolio filters, and a light that follows you in the candling room */
document.addEventListener("click", function(e){
  var b = e.target.closest && e.target.closest(".filters button"); if (!b) return;
  var f = b.getAttribute("data-f");
  Array.prototype.forEach.call(document.querySelectorAll(".filters button"), function(x){ x.classList.toggle("on", x === b); });
  Array.prototype.forEach.call(document.querySelectorAll("[data-co]"), function(c){ c.style.display = f === "all" || c.getAttribute("data-co") === f ? "" : "none"; });
});
document.addEventListener("mousemove", function(e){
  var c = e.target.closest && e.target.closest(".candle"); if (!c) return;
  var b = c.getBoundingClientRect();
  c.style.setProperty("--cx", ((e.clientX - b.left) / b.width * 100).toFixed(1) + "%");
  c.style.setProperty("--cy", ((e.clientY - b.top) / b.height * 100).toFixed(1) + "%");
}, { passive: true });

/* ---------- portfolio ---------- */
var CO = [
  ["Albumen", "Data infrastructure", "hatched", "Hatched 2019 · acquired"],
  ["Yolk", "AI for supply chains", "hatched", "Hatched 2021 · Series C"],
  ["Chalaza Labs", "Developer tools", "hatched", "Hatched 2020 · public"],
  ["Clutch Health", "Care navigation", "in", "Incubating · day 14"],
  ["Brood Robotics", "Warehouse automation", "hatched", "Hatched 2022 · Series B"],
  ["Ovum Pay", "B2B payments", "in", "Incubating · day 19"],
  ["Nestwork", "Future of work", "no", "Did not hatch · founders retained"],
  ["Pip", "Consumer fintech", "hatched", "Hatched 2023 · Series A"],
  ["Candlewick Security", "Identity", "in", "Incubating · day 7, candled"],
  ["Membrane Bio", "Synthetic biology", "no", "Did not hatch · founders retained"],
  ["Air Cell", "Climate hardware", "in", "Incubating · day 18, lockdown"],
  ["Bloom", "Retail media", "hatched", "Hatched 2024 · Series A"]
];
function portfolio(){
  return CO.map(function(c){
    var cls = c[2] === "no" ? " no" : c[2] === "in" ? " in" : "";
    return "<article class=\"card co\" data-co=\"" + c[2] + "\"><div class=\"mark\">" + c[0][0] + "</div><h3>" + c[0] + "</h3><p>" + c[1] + "</p><span class=\"stage" + cls + "\">" + c[3] + "</span></article>";
  }).join("");
}

/* ---------- pages ---------- */
var PAGES = [
{ id: "home", depth: 0, html: `
<section class="hero"><div class="container hero-grid">
  <div>
    <a class="pill-link" href="#post-the-21-day-thesis"><b>NEW</b>The 21-day thesis: why the best companies hatch on schedule →</a>
    <h1>Patient capital for founders who <em>hatch</em> category leaders.</h1>
    <p class="lede">Kestrel Capital backs seed and Series A founders with capital, conviction and the warmest operating platform in venture. Every company starts in the Incubator. Every one comes out different.</p>
    <div class="hero-cta"><a class="btn btn-primary" href="#pitch">Pitch us</a><a class="btn btn-ghost" href="#approach">The Kestrel Method</a></div>
    <p class="hero-note" data-seen-text="Founders in residence: 1,140 · every one turned on time">Fund IV · $1.2B under incubation · 214 companies hatched</p>
  </div>
  <div class="hero-art">
    <figure class="ph r45"><img src="${E}team-stand.jpg" data-seen-src="img/carton-cold.jpg" alt="The Kestrel partnership standing together in the atrium at Kestrel House" style="transform-origin:58% 40%"></figure>
    <div class="badge"><b>37.5°</b>Operating temperature, every portfolio company</div>
  </div>
</div></section>
<div class="container"><div class="logos" aria-label="Selected portfolio">
  <span><i></i>Albumen</span><span><i></i>Yolk</span><span><i></i>Chalaza Labs</span><span><i></i>Brood</span><span><i></i>Pip</span><span><i></i>Bloom</span>
</div></div>
<section id="fund-iv" data-anchor="fund-iv"><div class="container">
  <div class="section-head"><span class="eyebrow">Fund IV</span><h2>Compounding, one clutch at a time.</h2><p>Ten years, four funds, one method. Our hatch rate has grown every year since we opened the Incubator, and our time to hatch keeps falling toward the number nature intended.</p></div>
  <div class="stats">
    <div class="stat"><b>$1.2B</b><span>Fund IV, fully incubated</span></div>
    <div class="stat"><b>214</b><span>Companies hatched since 2017</span></div>
    <div class="stat"><b>21 days</b><span>Median time to hatch</span></div>
    <div class="stat"><b>3×</b><span>Daily turns per company</span></div>
  </div>
  <div class="dash" style="margin-top:28px">
    <div class="chart-card"><h4>Companies hatched <span>cumulative · 2017–2026</span></h4><svg id="chart-hatch" viewBox="0 0 560 210" role="img" aria-label="Companies hatched, rising from 12 in 2017 to 214 in 2026"></svg></div>
    <div class="chart-card"><h4>Days to hatch <span>median, by fund</span></h4><svg id="chart-days" viewBox="0 0 320 210" role="img" aria-label="Median days to hatch falling from 34 in Fund 0 to 21 in Fund IV"></svg></div>
  </div>
</div></section>
<section style="padding-top:0"><div class="container">
  <div class="section-head"><span class="eyebrow">How we work</span><h2>Four things we do for every founder.</h2></div>
  <div class="grid-4">
    <a class="card" href="#incubator" style="text-decoration:none"><h3>Incubate</h3><p>Twenty-one days in residence at Kestrel House, at a constant 37.5 degrees and 55 percent humidity. Founders tell us it is the most focused they have ever been.</p><span class="more">The Incubator →</span></a>
    <a class="card" href="#approach" style="text-decoration:none"><h3>Turn</h3><p>We rotate every company three times a day, so nothing settles and nothing sticks to the side. Our partners take the night turns personally.</p><span class="more">The Method →</span></a>
    <a class="card" href="#post-candling-diligence-in-the-dark" style="text-decoration:none"><h3>Candle</h3><p>Diligence is done in a dark room with a bright light. We hold every company up to it and look for signs of life.</p><span class="more">Read more →</span></a>
    <a class="card" href="#portfolio" style="text-decoration:none"><h3>Hatch</h3><p>On day 21 our founders break through. We are there when it happens. We are not allowed to help.</p><span class="more">The portfolio →</span></a>
  </div>
</div></section>
<section style="padding-top:0"><div class="container split">
  <figure class="ph r43"><img src="${E}shake-out.jpg" data-seen-src="img/bowl.jpg" alt="A Kestrel partner shaking hands with a founder on the day of the first close" style="transform-origin:52% 46%"></figure>
  <div class="quote"><blockquote>“Kestrel didn’t just write a cheque. They kept us warm. They turned us when we couldn’t turn ourselves. When we finally came out, we didn’t recognise anything.”</blockquote><cite><b>Priya Anand</b>, founder and CEO, Yolk (hatched 2021)</cite></div>
</div></section>
<section class="cta"><div class="container"><h2>Every great company starts somewhere small and warm.</h2><p>Applications for Cohort 13 close soon. Bring a deck. Leave the rest to us.</p><a class="btn btn-primary" href="#pitch">Pitch us</a></div></section>` },

{ id: "approach", depth: 1, html: `
<div class="container page-head"><span class="eyebrow">The Kestrel Method</span><h1>Twenty-one days. No shortcuts.</h1><p class="lede">Most firms give founders money and a board seat. We give them a residency: a fixed schedule, a controlled climate and a partnership that is with them around the clock. The schedule has never changed, because it was not ours to change.</p></div>
<section style="padding-top:20px"><div class="container split">
  <div class="timeline">
    <div><b>Day 0 · Set</b>Founders arrive at Kestrel House with nothing but their deck. We take the deck. Each founder is assigned a bay.</div>
    <div><b>Days 1–6 · Warm</b>We bring every company up to operating temperature. Phones are held at reception for focus.</div>
    <div><b>Day 7 · Candling</b>First diligence. In a dark room, under a single bright lamp, we look for structure. <a href="#post-candling-diligence-in-the-dark">How candling works</a>.</div>
    <div><b>Days 8–17 · Turn</b>Three turns a day, at 6, 2 and 10. Turning keeps founders from settling into one position and keeps what is inside from sticking to the walls.</div>
    <div><b>Day 18 · Lockdown</b>Turning stops. Humidity goes up. The doors are sealed and we wait. <a href="#post-lockdown-what-happens-on-day-18">What lockdown means</a>.</div>
    <div><b>Day 21 · Hatch</b>Founders break through on their own. Most of them do.</div>
  </div>
  <div class="chart-card"><h4>Operating temperature <span>°C by day, Cohort 12</span></h4><svg id="chart-temp" viewBox="0 0 560 210" role="img" aria-label="Temperature held between 37.2 and 37.7 degrees across 21 days"></svg><p class="muted" style="font-size:14px;margin-top:12px">Held to a tenth of a degree. A founder who cools for more than four hours rarely recovers.</p></div>
</div></section>
<section style="padding-top:0"><div class="container">
  <div class="section-head"><h2>What founders get.</h2></div>
  <div class="grid-3">
    <div class="card"><h3>$500K to $8M</h3><p>Seed and Series A cheques, reserved in full before day 0. Capital is released on hatch.</p></div>
    <div class="card"><h3>A bay of your own</h3><p>A private, climate-controlled bay at Kestrel House, sized to the founder. Bays are padded.</p></div>
    <div class="card"><h3>A partner on every shift</h3><p>Someone from the partnership checks on you every eight hours. You may not see them. They will see you.</p></div>
  </div>
  <p class="aside" style="margin-top:28px">Ready to go in? <a href="#pitch">Pitch us</a>, or see <a href="#incubator">the Incubator</a> first.</p>
</div></section>` },

{ id: "portfolio", depth: 1, html: `
<div class="container page-head"><span class="eyebrow">Portfolio</span><h1>Two hundred and fourteen hatched. Counting.</h1><p class="lede">A selection of the companies we have incubated. Some are public, some acquired, some still warming. We list every outcome, because transparency is one of our values.</p></div>
<div class="container" style="padding-bottom:90px">
  <div class="filters" role="group" aria-label="Filter the portfolio"><button class="on" data-f="all">All</button><button data-f="hatched">Hatched</button><button data-f="in">Incubating</button><button data-f="no">Did not hatch</button></div>
  <div class="grid-3">${portfolio()}</div>
  <p class="aside" style="margin-top:28px">“Founders retained” means the founders remain in residence at Kestrel House. See <a href="#post-not-every-egg-hatches">Not every company hatches</a>.</p>
</div>` },

{ id: "team", depth: 1, html: `
<div class="container page-head"><span class="eyebrow">The partnership</span><h1>Operators, investors, turners.</h1><p class="lede">Six partners with forty years of company building between them, and a shared belief that the first 21 days decide everything.</p></div>
<div class="container" style="padding-bottom:90px"><div class="grid-3">
  <div class="person"><figure class="ph r45"><img src="${E}exec-1.jpg" alt="Margaret Ostrander, Managing Partner" style="transform-origin:50% 40%"></figure><h3>Margaret Ostrander</h3><div class="role">Managing Partner</div><p>Founded Kestrel in 2016 after twenty years in growth equity. Keeps one hand on every company, at all times, at 37.5 degrees.</p></div>
  <div class="person"><figure class="ph r45"><img src="${E}exec-2.jpg" alt="Daniel Achterberg, General Partner" style="transform-origin:48% 38%"></figure><h3>Daniel Achterberg</h3><div class="role">General Partner, Candling</div><p>Leads diligence. Has held more than two thousand founders up to the light. Says he can tell in a second.</p></div>
  <div class="person"><figure class="ph r45"><img src="${E}exec-3.jpg" alt="Sofia Lindqvist, General Partner" style="transform-origin:50% 36%"></figure><h3>Sofia Lindqvist</h3><div class="role">General Partner, Platform</div><p>Runs Kestrel House. Designed the bays, the humidity system and the schedule. Has not missed a 2 a.m. turn since 2018.</p></div>
  <div class="person"><figure class="ph r45"><img src="${E}exec-4.jpg" alt="Marcus Webb, Partner" style="transform-origin:52% 40%"></figure><h3>Marcus Webb</h3><div class="role">Partner, Lockdown</div><p>Former founder. Oversees days 18 to 21, when the doors are sealed. The only partner allowed in the room during a hatch.</p></div>
  <div class="person"><figure class="ph r45"><img src="${E}exec-5.jpg" alt="Hannah Oduya, Partner" style="transform-origin:50% 40%"></figure><h3>Hannah Oduya</h3><div class="role">Partner, Sourcing</div><p>Finds our founders. Will not say where. Believes the best companies are laid, not made.</p></div>
  <div class="person"><figure class="ph r45"><img src="${E}exec-6.jpg" alt="Elliot Brandt, Principal" style="transform-origin:50% 38%"></figure><h3>Elliot Brandt</h3><div class="role">Principal, Retained Founders</div><p>Looks after the founders who did not hatch. They are still warm. He makes sure of it.</p></div>
</div></div>` },

{ id: "insights", depth: 2, html: `
<div class="container page-head"><span class="eyebrow">Insights</span><h1>Notes from the Incubator.</h1><p class="lede">Essays on company building, incubation and what we have learned from 214 hatchings and a number of the other kind.</p></div>
<div class="container" style="padding-bottom:90px"><div class="grid-3" data-posts></div><p style="text-align:center;margin-top:34px"><button class="btn btn-ghost" data-more>Load more posts</button></p></div>` },

{ id: "incubator", depth: 2, html: `
<div class="container page-head"><span class="eyebrow">Kestrel House</span><h1>The Incubator.</h1><p class="lede">Forty thousand square feet, eleven hundred and forty bays and one setting on the thermostat. Kestrel House is where every portfolio company spends its first 21 days, and where some of them stay.</p></div>
<section style="padding-top:10px"><div class="container split">
  <figure class="ph r45" data-swap="img/cracked.jpg"><img src="img/incubators.jpg" alt="Rows of glass-fronted incubation bays at Kestrel House, each holding a tray" style="transform-origin:64% 71%"><figcaption>West wing, bays 400 to 460. Lights stay on.</figcaption></figure>
  <div>
    <span class="eyebrow">In residence now</span>
    <div class="gauge"><span data-count>1,140</span><small>founders</small></div>
    <p class="muted" style="margin-top:14px">The number on this page is live. It has never gone down.</p>
    <div class="log" data-count-log aria-live="off"></div>
    <div class="table-wrap" style="margin-top:22px"><table>
      <tr><th>Bay</th><th>Cohort</th><th>Day</th><th>Humidity</th><th>Last turned</th></tr>
      <tr><td>112</td><td>12</td><td>14</td><td>55%</td><td>14:00</td></tr>
      <tr><td>113</td><td>12</td><td>14</td><td>55%</td><td>14:00</td></tr>
      <tr><td>114</td><td>9</td><td>412</td><td>65%</td><td>14:00</td></tr>
      <tr><td>115</td><td>12</td><td>18</td><td>65%</td><td>sealed</td></tr>
      <tr><td>116</td><td>7</td><td>1,219</td><td>65%</td><td>14:00</td></tr>
    </table></div>
    <p class="note" style="margin-top:12px">Day counts above 21 are a known display issue. <a href="#candling">Report it to Candling</a>.</p>
  </div>
</div></section>
<section style="padding-top:0"><div class="container grid-3">
  <figure class="ph r43"><img src="img/pile.jpg" alt="Hundreds of brown eggs heaped together" style="transform-origin:40% 60%"><figcaption>Intake, Monday.</figcaption></figure>
  <figure class="ph r43"><img src="img/dozen.jpg" alt="A carton of twelve eggs in different colours on a rusted tray" style="transform-origin:62% 30%"><figcaption>Cohort 12, as delivered. We do not ask about the colours.</figcaption></figure>
  <figure class="ph r43"><img src="img/bowl.jpg" alt="Two hands holding a bowl of brown eggs" style="transform-origin:45% 50%"><figcaption>The 2 a.m. turn.</figcaption></figure>
</div>
<div class="container"><p class="aside" style="margin-top:28px">Visitors are welcome at Kestrel House by appointment. Wear something warm and nothing you need back. <a href="#careers">We are hiring turners</a>.</p></div></section>` },

{ id: "careers", depth: 2, html: `
<div class="container page-head"><span class="eyebrow">Careers</span><h1>Join the people who keep things warm.</h1><p class="lede">We are a small team with an unusual operating rhythm. If you like structure, quiet and working through the night, you may like it here.</p></div>
<div class="container" style="padding-bottom:90px">
  <details><summary>Turner, night shift <span class="meta">Kestrel House · full time</span></summary><div class="body"><p>Rotate every resident a third of a turn at 22:00, 02:00 and 06:00. Log the turn. Do not open the bays. Do not answer if a resident knocks; knocking before day 21 is normal and passes.</p><p>You will be trained on the lift, the trays and the humidity panel. Gloves provided.</p></div></details>
  <details><summary>Candling associate <span class="meta">Kestrel House · full time</span></summary><div class="body"><p>Hold each resident up to the lamp in the dark room and record what you see: veins, a shadow, movement, nothing. Nothing is the hardest one to write down. We will help you.</p></div></details>
  <details><summary>Associate, Retained Founders <span class="meta">Kestrel House · full time</span></summary><div class="body"><p>Keep residents who did not hatch warm, turned and comfortable. This role reports to Elliot Brandt. It is permanent. So are they.</p><p>Apply through <a href="#pitch">the pitch form</a> and mention this role.</p></div></details>
  <details><summary>Investment analyst <span class="meta">Boston · hybrid</span></summary><div class="body"><p>Model fund returns, write investment memos, support partners at board meetings. Most board meetings are held in the bays.</p></div></details>
</div>` },

{ id: "pitch", depth: 1, html: `
<div class="container page-head"><span class="eyebrow">Pitch us</span><h1>Tell us what you’re building.</h1><p class="lede">We read every application. If there is something there, we will hold it up to the light within 21 days.</p></div>
<div class="container" style="padding-bottom:100px;max-width:760px">
  <form class="f" data-form="pitch">
    <label>Your name<input type="text" id="name" required autocomplete="name"></label>
    <label>Work email<input type="email" id="email" required autocomplete="email"></label>
    <label>Company<input type="text" id="company" required></label>
    <label>Stage<select id="stage"><option>Pre-seed</option><option>Seed</option><option>Series A</option><option>Not yet laid</option></select></label>
    <label class="full">One line on what you do<input type="text" id="line"></label>
    <label class="check full"><input type="checkbox" id="residency"> I can be in residence at Kestrel House for 21 days, starting on day 0</label>
    <button class="btn btn-primary full" type="submit">Send to the partnership</button>
  </form>
  <div class="result" id="pitch-result" role="status"></div>
</div>` },

{ id: "legal", depth: 1, html: `
<div class="container page-head"><span class="eyebrow">Legal</span><h1>Terms, privacy and disclosures.</h1></div>
<div class="container legal" style="padding-bottom:100px;max-width:820px">
  <h2>1. Who we are</h2><p>Kestrel Capital Management LLC and its affiliated funds and residences, including Kestrel House (together, “Kestrel”).</p>
  <h2>2. Not an offer</h2><p>Nothing on this site is an offer to sell or a solicitation to buy any interest in any fund. Past hatch rates are no guarantee of future hatch rates.</p>
  <h2>3. Residency</h2><p>Founders in residence agree to the Kestrel schedule, including turning, candling and lockdown, for the full 21 days. The residency agreement continues after day 21 for founders who have not yet hatched.</p>
  <h2>4. Sourcing</h2><p>Kestrel sources founders through referrals, applications and other channels. Kestrel does not disclose its other channels.</p>
  <h2>5. Data</h2><p>We record turn times, bay temperature and humidity, and anything visible under candling. Records are kept for the life of the resident.</p>
  <h2>6. Sounds</h2><p>Residents may knock. Staff and visitors must not respond to knocking. Kestrel accepts no liability for what answering might encourage.</p>
  <h2>7. This is not real</h2><p class="disclosure">Kestrel Capital is a work of satire and a member of the <a href="../">Chamber</a>, a set of fictional businesses. There is no fund, no Kestrel House and nobody in residence. Nothing here is investment advice. The forms send nothing anywhere. Photos are free stock images used under the Unsplash License.</p>
</div>` },

{ id: "candling", depth: 3, html: `
<div class="container page-head"><span class="eyebrow">Diligence · Room C</span><h1>Held up to the light.</h1><p class="lede">This is the room where we decide. It is dark except for one lamp. We bring each resident in, hold them up to it, and look through them for veins, for a shadow, for anything moving. Move your cursor to hold the lamp.</p></div>
<section style="padding-top:10px"><div class="container split">
  <div><div class="candle"><figure class="ph r45 zoom" data-swap="${E}sad-dark.jpg"><img src="img/cracked.jpg" alt="A cracked egg on a black surface, yolk spilling out" style="transform-origin:46% 61%"></figure></div><p class="candle-note">Resident 114, cohort 9, day 412. Candled again this morning. No change.</p></div>
  <div class="room-text">
    <p>Candling is the oldest diligence there is. A healthy company shows a web of veins by day seven and a dark shape by day ten. By day fourteen the shape is too big to see around. If you hold it there long enough, it moves.</p>
    <p>Sometimes there is nothing. A clear shell, all light. We write that down too, and we put them back in the bay, and we keep turning them. It is not our place to decide what nothing means.</p>
    <p>Sometimes the shape is wrong. Too many limbs, or it is looking back at the lamp. We do not write that down. We hand the resident to Elliot.</p>
    <p class="voice">it’s so bright from in here. every time you hold me up I think it’s day 21.</p>
    <nav class="exits" aria-label="Ways on">
      <a class="exit" href="#residence">Founders in residence</a>
      <a class="exit" href="#room-the-warm-room">Through the door with the heat coming under it</a>
      <a class="exit" href="#room-the-candling-booth">Back into the booth</a>
      <a class="exit" href="#brood">Lockdown, the sealed room</a>
    </nav>
    <p class="room-up"><a href="#incubator">↑ Back to the Incubator</a></p>
  </div>
</div></section>` },

{ id: "residence", depth: 3, html: `
<div class="container page-head"><span class="eyebrow">Founders in Residence</span><h1>They are doing well. They are still warm.</h1><p class="lede">Most founders leave Kestrel House on day 21. These ones haven’t yet. We keep them on the schedule, turned three times a day, at operating temperature, for as long as it takes. It has taken a long time.</p></div>
<div class="container" style="padding-bottom:30px"><div class="gallery">
  <figure class="ph r43"><img src="${E}sad-chair.jpg" alt="A person sitting alone in a chair in a bare room" style="transform-origin:50% 45%"><figcaption>Bay 114 · cohort 9 · day 412</figcaption></figure>
  <figure class="ph r43"><img src="${E}sad-floor.jpg" alt="A person sitting on the floor with their head down" style="transform-origin:48% 50%"><figcaption>Bay 116 · cohort 7 · day 1,219</figcaption></figure>
  <figure class="ph r43"><img src="${E}sad-desk.jpg" alt="A person slumped over a desk" style="transform-origin:52% 48%"><figcaption>Bay 203 · cohort 10 · day 301</figcaption></figure>
  <figure class="ph r43"><img src="${E}sad-hand.jpg" alt="A hand pressed against a surface" style="transform-origin:50% 50%"><figcaption>Bay 206 · knocking, nights</figcaption></figure>
  <figure class="ph r43"><img src="${E}sad-laptop.jpg" alt="A person staring at a laptop in the dark" style="transform-origin:50% 42%"><figcaption>Bay 311 · still updating the deck</figcaption></figure>
  <figure class="ph r43"><img src="${E}sad-table.jpg" alt="A person sitting at an empty table" style="transform-origin:50% 46%"><figcaption>Bay 340 · cohort 11 · asked what day it is</figcaption></figure>
</div>
<p class="aside" style="margin-top:26px">Families can write to residents care of Elliot Brandt. Letters are held up to the light and placed in the bay. <a href="#room-the-cohort">See the rest of the cohort</a> or <a href="#brood">go down to lockdown</a>.</p></div>` },

{ id: "brood", depth: 4, html: `
<div class="container page-head" style="padding-bottom:10px"><span class="eyebrow">Lockdown · day 18 onward</span><h1>The sealed room.</h1><p class="lede">No more turning. Humidity up to sixty-five percent. Everything in here is waiting to come out of something. Scroll down. You are going in, not out.</p></div>
<section class="dive-sec" aria-label="The sealed room">
  <div class="container"><span class="eyebrow">Carton 1 of 1,140</span><h2 style="font-size:clamp(1.7rem,3vw,2.4rem);margin-top:14px">One carton, seen from above.</h2><p class="muted" style="margin-top:12px;max-width:60ch">Pick an egg. Hold it to your ear. Keep scrolling.</p></div>
  <div id="dive-track"><div id="dive-stage">
    <canvas id="dive" role="img" aria-label="A carton of eggs. Scrolling zooms into one egg, which is made of smaller eggs, which are made of smaller eggs, without end. Something curled up shows through the gaps."></canvas>
    <div class="dive-hud"><span id="dive-depth">Carton 1 of 1,140</span><button class="btn btn-ghost btn-sm" id="dive-out">Climb out ↑</button></div>
    <a id="dive-door" class="btn btn-ghost btn-sm" href="#room-the-knocking" hidden>There’s a crack in this one →</a>
    <p id="dive-say">Scroll.</p>
  </div></div>
</section>` },

{ id: "notfound", depth: 2, html: `
<div class="container page-head" style="padding-bottom:120px"><span class="eyebrow">Error 404</span><h1>This one didn’t hatch.</h1><p class="lede">The page you were looking for was here on day 0. We kept it warm. We turned it. There was nothing inside when we held it up to the light.</p><p style="margin-top:28px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn-primary" href="#home">Back to the homepage</a><a class="btn btn-ghost" href="#portfolio">See what did hatch</a></p></div>` }
];

/* ---------- insights ---------- */
var POSTS = [
{ slug: "the-21-day-thesis", tag: "Thesis", title: "The 21-day thesis", ex: "Why the best companies hatch on schedule, and why we stopped trying to speed them up.", read: "6 min read", by: "Margaret Ostrander", img: E + "team-sofa.jpg", alt: "The partnership in a meeting on a sofa", depth: 1, body: [
  "When we opened Kestrel House in 2017, our median company took 34 days to hatch. We thought we could get that down with more capital, more mentors, more pressure. We were wrong. Every intervention made it worse.",
  "What worked was the opposite: a fixed schedule, a constant temperature and leaving the founders alone at the right moments. By Fund IV the median was 21 days. It has not moved since, and we no longer think it can. Twenty-one days seems to be the number. We did not choose it.",
  "Founders sometimes ask if they can leave early. Some of them ask a great deal. We explain that a company that comes out before it is ready does not survive outside, and we turn them, and they settle.",
  "The thesis is simple. Keep it warm, keep it turning, and wait for it to break through from the inside. Everything else is noise."
]},
{ slug: "why-we-turn-every-company-three-times-a-day", tag: "Operating", title: "Why we turn every company three times a day", ex: "Rotation is the most underrated operating practice in venture. Here is ours.", read: "5 min read", by: "Sofia Lindqvist", img: E + "unity.jpg", alt: "Hands stacked together in a team huddle", depth: 1, body: [
  "A company left in one position for too long starts to stick to it. The inside settles, and what settles against the wall grows into the wall. You can’t get it off afterwards.",
  "So at 06:00, 14:00 and 22:00, every resident at Kestrel House is turned a third of a rotation. We log every turn. In nine years we have not missed one, including the blizzard of 2022, when Daniel slept in the west wing for four days so nobody went unturned.",
  "Founders find it disorienting at first. By the end of the first week most of them roll before we touch them, which is the sign of a healthy culture.",
  "We stop turning on day 18. After that, they need to find their own way up."
]},
{ slug: "candling-diligence-in-the-dark", tag: "Diligence", title: "Candling: diligence in the dark", ex: "Data rooms tell you what a founder wants you to see. A lamp tells you what is actually there.", read: "7 min read", by: "Daniel Achterberg", img: "img/cracked.jpg", alt: "A cracked egg on a black surface", depth: 2, body: [
  "Every resident is candled on day 7 and again on day 14. The room is dark. There is one lamp, very bright, set into the table. You hold the resident against it and look through them.",
  "On a good day you see veins spreading out from a dark spot, like a map of roads leading to a city. That spot is the company. It will get bigger. By day 14 it fills the frame and you can see it shift when the light warms it.",
  "On a bad day you see nothing, or a ring of red, or a shape that is the wrong shape. We have a protocol for each. The protocol for the wrong shape is to not look at it for very long.",
  "People ask how I can tell in a second. The honest answer is that it is not me looking at them. When the lamp is on, they look back. You learn to feel it."
]},
{ slug: "lockdown-what-happens-on-day-18", tag: "Operating", title: "Lockdown: what happens on day 18", ex: "The three most important days of a company’s life, and why the doors stay sealed.", read: "4 min read", by: "Marcus Webb", img: "img/incubators-wide.jpg", alt: "Rows of glass-fronted incubation bays", depth: 2, body: [
  "On day 18 we stop turning, raise the humidity to 65 percent and seal the lockdown wing. Nobody goes in except me. The founders need to get into position, and they can’t do that if we keep moving them.",
  "It is very quiet in there. Then, sometime on day 19, it isn’t. You hear tapping. Small, from inside, against the walls of the bays. Hundreds at once. It sounds like rain on a roof if the rain were trying to get in.",
  "The urge to help is overwhelming. You can’t. A founder who is helped out never develops the strength to stand. So I sit in the middle of the room and I listen and I don’t open anything.",
  "By day 21 most of the tapping has stopped, one way or the other."
]},
{ slug: "cohort-9-a-field-report", tag: "Community", title: "Founders in Residence, Cohort 9: a field report", ex: "A year on, an update on the cohort that is still with us.", read: "5 min read", by: "Elliot Brandt", img: E + "sad-chair.jpg", alt: "A person sitting alone in a chair", depth: 2, body: [
  "Cohort 9 came in on a Monday in October with forty-one founders. Thirty-three hatched on schedule. Eight did not, and eight are still in residence. They are warm. I check every one of them on every shift.",
  "Bay 114 is doing particularly well. She has started knocking in a pattern: three, then two, then three. The night turners have stopped writing it down, because it is always the same.",
  "We get asked why we don’t just let them out. The answer is in the residency agreement, and also, there is the question of what would come out. Nothing we candle in Cohort 9 is the shape it was in October.",
  "If you are a family member reading this: they are comfortable. We turn them. They can hear you if you talk near the vents."
]},
{ slug: "on-clutch-size", tag: "Thesis", title: "On clutch size", ex: "How many founders should one partner keep warm? Our answer has gone up every fund.", read: "4 min read", by: "Hannah Oduya", img: "img/pile-wide.jpg", alt: "A heap of brown eggs", depth: 2, body: [
  "In Fund I each partner sat on twelve. By Fund IV it was nearer two hundred. People assume that means less attention each. It doesn’t. Warmth isn’t divided, it spreads. A partner sitting on two hundred keeps all of them at temperature.",
  "Sourcing has had to keep up. We have referrals and applications, like everyone. We also have other channels. I won’t describe them. I will say we have never been short, and that the intake on Mondays has been heavier than it used to be.",
  "The bigger the clutch, the more the founders press against each other, and pressure is good for founders. You can hear them in the trays, shifting to make room.",
  "Fund V will be larger. We are building a second wing."
]},
{ slug: "not-every-egg-hatches", tag: "Values", title: "Not every company hatches", ex: "On the founders we keep, and why we keep them warm anyway.", read: "6 min read", by: "Elliot Brandt", img: E + "sad-floor.jpg", alt: "A person sitting on the floor, head down", depth: 3, body: [
  "Venture is a power law. Most companies don’t make it out. The industry calls them write-offs. We don’t write anyone off. We retain them.",
  "A retained founder stays in their bay on the full schedule. Turned, candled, kept at 37.5. Some of them have been here since 2018. They look different under the lamp now. Mostly bigger. Some of them have gone very still and some of them have not.",
  "Every so often a retained founder hatches, years late, and it is a celebration, and then it is something we don’t talk about at the all-hands. What comes out has been inside for a very long time. It is not the founder we put in.",
  "We keep them warm anyway. That is the promise. Once you are in Kestrel House, we never let you go cold."
]},
{ slug: "pipping", tag: "Founders", title: "Pipping", ex: "On day 21 the founder breaks through from the inside. A first-hand account.", read: "3 min read", by: "Marcus Webb", img: "img/dozen.jpg", alt: "Twelve eggs in a carton", depth: 3, body: [
  "The first crack is called the pip. A small hole, punched from inside, usually near the top. Then nothing for hours. The founder is resting, and breathing the air in the shell for the first time, and deciding.",
  "After the pip comes the unzip: a line of cracks working round the shell, slowly, while you watch and do not touch. When it goes all the way round, the top lifts off and they push out, wet, blind, enormous for the space they came out of.",
  "Once, in Cohort 7, the pip came from the outside. Something tapped on the shell of bay 116 from the bay next to it, and the founder inside tapped back, and they kept that up for a week. Then the founder in 116 stopped answering. Teo is still in 116. We don’t know what is in 117. It was never on the manifest.",
  "I hear tapping most nights now, even at home."
]},
{ slug: "a-note-from-inside-the-shell", tag: "Founders", title: "A note from inside the shell", ex: "From the residency archive. Found written on the inside of a candled shell, bay 116.", read: "2 min read", by: "Teo, cohort 7, bay 116", img: "img/carton-cold.jpg", alt: "A carton of brown eggs in cold light", depth: 3, body: [
  "it’s warm in here. it’s always warm. they turn me at 6 and 2 and 10 and I fall against the wall and the wall is soft now, it used to be hard.",
  "when they hold me up to the lamp I can see out for a second. a big face. the face is very kind. it says no change and puts me back.",
  "there is someone next to me. we used to knock. three and two and three. I think they are bigger than me now. I think they are inside my shell as well as theirs. I think the shell goes on further than I thought.",
  "day 1,219. if you are reading this you are on the outside. please knock. it doesn’t matter what. I just want to know which way is out."
]}
];

/* ---------- rooms ---------- */
var ROOMS = {
"the-warm-room": { where: "West wing, behind bay 400", t: "The warm room", lede: "The heat comes under the door before you open it. Inside it is exactly 37.5 degrees and you can feel your own temperature trying to agree.",
  img: "img/incubators.jpg", alt: "Rows of glass incubation bays", cap: "Every tray full. Every tray turned at 14:00.", body: [
  "The bays go back further than the building does. You can count the rows: forty, fifty, more. The trays in the far ones are not in carton sizes any more. They are in sizes for people.",
  "Somewhere at the back a humidifier is breathing. It is the only sound. Then you notice the tapping, very faint, under it."] },
"the-turning": { where: "Between bays, 02:00", t: "The 2 a.m. turn", lede: "You are holding the tray. Everyone on it rolls a third of the way round, and settles, and is quiet, and one of them keeps rolling after the others stop.",
  img: "img/bowl.jpg", alt: "Two hands holding a bowl of eggs", cap: "A third of a turn. Log it. Move on.", body: [
  "The rule is not to look at the one that kept rolling. You look. It has turned itself all the way round so the dark shape inside faces you through the shell.",
  "Your hands are warm now. Warmer than the tray. You put it back and log the turn and the log already has your name on the next line, at 06:00, and the line after that, and the line after that."] },
"the-candling-booth": { where: "Room C, behind the curtain", t: "The candling booth", lede: "A stool, a table with a lamp set into it and a basket of residents waiting to be looked through. The lamp is already on. Someone has left a shell on it.",
  img: "img/cracked.jpg", alt: "A cracked egg on a black surface", cap: "Resident 114. No change.", ar: "r45", body: [
  "You pick the shell up to move it and it is warm. It is not empty. Through it, against the lamp, you see veins, and the veins are moving, and they are not leading to a dark spot in the middle. They are leading to your fingers.",
  "<span class='voice'>hold me up again. please. it’s the only time I can see.</span>"] },
"the-shell-company": { where: "Registered office, Kestrel House", t: "The shell company", lede: "Kestrel’s holding entity, as filed. Every share is a shell. Every shell is a share. Press Look closer to see what it is made of.",
  ascii: "motif", alt: "An egg drawn in letters, made of the word egg", body: [
  "The filing lists one asset: an egg. The egg lists one asset: more eggs. Keep looking and the auditors’ note gets longer, and the letters start to crowd.",
  "There is one word in there that isn’t egg. It has been there since the first filing."] },
"the-cohort": { where: "Bays 300 to 340", t: "The rest of the cohort", lede: "The founders who stayed. Each of them was a pitch deck once. Each of them is still warm.",
  gallery: [[E + "sad-dark.jpg", "A figure in a dark room", "Bay 302 · day 288"], [E + "sad-desk.jpg", "A person slumped at a desk", "Bay 307 · ‘revising the model’"], [E + "hallway.jpg", "An empty institutional hallway", "Corridor to lockdown"], [E + "door.jpg", "A closed door", "Bay 340. Knocks back."], [E + "sad-laptop.jpg", "A face lit by a laptop", "Bay 311 · day 301"], [E + "concrete.jpg", "A bare concrete wall", "Where bay 117 should be"]], body: [
  "The captions are written by the night turners. They started out as data. Some time in 2023 they turned into notes, and then into something like a conversation.",
  "Nobody has assigned bay 117. Something answers when you knock on it."] },
"the-knocking": { where: "Lockdown, day 19", t: "The knocking", lede: "Hundreds of them, from inside, all at once, out of time with each other. Then, for a moment, all in time.",
  ascii: "field", speed: 190, alt: "A drifting field of egg shapes with words knocked into it", body: [
  "You are not supposed to answer. Everyone who works here has been told. Everyone who works here has answered once, at night, quietly, with one knuckle.",
  "When you answer, the knocking near you stops. Then it starts again, closer, and it is in your rhythm."] },
"the-nest": { where: "Under the floor of the west wing", t: "The nest", lede: "There is a crawlspace under the bays where the warm air goes. Someone has been putting things in it. Not trays. Not cartons. Just eggs, heaped.",
  ascii: function(f){
    var rows = 5, cols = 7, out = [], ki = 2, kj = 3, knock = f % 6 < 2, sh = knock ? (f % 2 ? 1 : -1) : 0;
    for (var i = 0; i < rows; i++){
      var a = "", b = "", c = "";
      for (var j = 0; j < cols; j++){
        var off = (i % 2) * 3, me = i === ki && j === kj;
        var pad = me && knock ? (sh > 0 ? " " : "") : "";
        var mid = me ? (knock ? "( ! )" : "(   )") : (((i * 7 + j * 3 + Math.floor(f / 9)) % 23) === 0 ? "( . )" : "(   )");
        a += (j === 0 ? new Array(off + 1).join(" ") : "") + pad + " .-. " + (me && knock && sh < 0 ? " " : " ");
        b += (j === 0 ? new Array(off + 1).join(" ") : "") + pad + mid + (me && knock && sh < 0 ? " " : " ");
        c += (j === 0 ? new Array(off + 1).join(" ") : "") + pad + " `-' " + (me && knock && sh < 0 ? " " : " ");
      }
      out.push(a, b, c);
    }
    out.push("", knock ? "                      <span class='h'>knock knock</span>" : "");
    return out.join("\n").replace(/[ ]+$/gm, "");
  }, anim: true, speed: 420, alt: "Rows of small eggs drawn in text; one of them shakes", body: [
  "One of them keeps shaking. Not the way an egg rocks when it is about to hatch. The way a door shakes when someone leans on it from the other side.",
  "It is the only one with your bay number on it."] },
"lockdown-wing": { where: "Sealed, day 18 onward", t: "The lockdown wing", lede: "Marcus sits in a chair in the middle of the room with his eyes closed. He doesn’t open them when you come in. He says: don’t open anything.",
  img: E + "tunnel.jpg", alt: "A long dim tunnel", cap: "The wing is longer from the inside.", body: [
  "He has been sitting there since day 18 of Cohort 12. He says he can hear which ones will make it. He says most of them won’t, and that is fine, and that is the job.",
  "He says there is one here that isn’t a founder. It came in with Monday’s intake. He says it is the warmest thing in the building."] },
"the-intake": { where: "Loading dock, Monday", t: "Monday intake", lede: "The trucks come before dawn. No logo. The crates are warm to the touch and labelled only with a weight.",
  img: "img/pile.jpg", alt: "A heap of brown eggs", cap: "Intake: 4,120 kg. Source: other channels.", body: [
  "Hannah signs for them. She won’t say where they come from. When you ask the driver he looks at you for a long time and says it isn’t from a farm.",
  "The crates are heavier than eggs should be. One of them has a name written on it in a child’s handwriting. It is the name of a founder from Cohort 4."] }
};

window.SITE = {
  slug: "kestrel", name: "Kestrel Capital",
  logo: "M13 1.5C8.4 1.5 4.6 9 4.6 15.2a8.4 8.4 0 0 0 16.8 0C21.4 9 17.6 1.5 13 1.5Zm0 5.2c2 2.1 3.2 5 3.2 7.6H9.8c0-2.6 1.2-5.5 3.2-7.6Z",
  tag: "Patient capital for founders who hatch category leaders. Boston · Kestrel House.",
  nav: [["#approach", "Approach"], ["#portfolio", "Portfolio"], ["#team", "Team"], ["#insights", "Insights"], ["#incubator", "The Incubator"]],
  cta: ["#pitch", "Pitch us"],
  footer: [
    { h: "Firm", links: [["#approach", "The Kestrel Method"], ["#team", "Partnership"], ["#careers", "Careers"], ["#legal", "Legal"]] },
    { h: "Founders", links: [["#pitch", "Pitch us"], ["#portfolio", "Portfolio"], ["#incubator", "Kestrel House"], ["#residence", "Founders in Residence"]] },
    { h: "More", links: [["#insights", "Insights"], ["#fund-iv", "Fund IV"], ["#network", "Network"], ["../", "The Chamber"]] }
  ],
  fine: ["© 2026 Kestrel Capital Management LLC", "Kept at 37.5°C"],
  pages: PAGES, posts: POSTS, postsDone: "That’s every post. The rest are still incubating.", lastPostExit: ["#residence", "Visit the founders in residence"],
  anchors: { "fund-iv": "home" },
  rooms: ROOMS, roomOrder: ["the-warm-room", "the-turning", "the-candling-booth", "the-shell-company", "the-cohort", "the-knocking", "the-nest", "lockdown-wing", "the-intake"],
  exits: ["Follow the heat", "Toward the tapping", "Through the curtain", "Down the row of bays", "Into the crawlspace", "Past the humidifier", "Under the trays", "The door marked 117", "Back the way the trays go", "Where it is warmer"],
  special: [["Up to the candling room", "#candling"], ["Into lockdown", "#brood"], ["Founders in residence", "#residence"], ["A crack in the wall, smelling of a dentist", "../../MouthBreeder/#vault"]],
  up: ["#candling", "Back up to Room C"], levelWord: "Bay",
  word: "egg", hiddenWord: "out",
  field: { sets: ["oOo0o°Oo", "()  ()  ", "0oO.o0Oo", " . ' ` , "], msg: [[5, 12, "knock knock"], [12, 26, "is anyone turning us"], [19, 6, "its so warm in here"], [26, 38, "which way is out"]] },
  motif: { polys: egg, inside: inside, ink: "#E8D3B2", trayKind: 0, trayStep: 0.2, trayGap: [128, 104, 80],
    palette: [[128, 104, 80], [201, 138, 88], [233, 214, 184], [214, 176, 132], [238, 232, 220], [178, 202, 192], [168, 104, 64], [224, 196, 150], [196, 150, 110]] },
  dive: { view: "brood", top: "Carton 1 of 1,140", unit: "Egg", chant: "knock",
    say: ["Scroll.", "Pick one. Any one. They’re all warm.", "Closer. Hold it to your ear.", "The shell isn’t a shell. It’s eggs.", "Smaller ones. Packed in. Turned.", "Every one of them is warm.", "Every one of them is made of more of them.", "You can hear tapping now.", "It isn’t coming from outside.", "It hasn’t been day 21 for a long time.", "Keep going. It’s further in."],
    voice: { 3: "Teo: is someone there? I can feel the light.", 6: "Teo: three, then two, then three. that’s me.", 9: "Teo: I keep turning and the wall keeps being more eggs.", 13: "Teo: day 1,219. or 1,220. they stopped writing it down.", 17: "Teo: if you get to the middle, knock. I’ll knock back.", 21: "Teo: day 21. I’m supposed to break through. I can’t find the inside of the shell.", 26: "Teo: there’s someone else in here. she says she came from a tray of teeth." },
    still: "Still knocking." },
  counter: { view: "incubator", start: 1140, every: 6500, lines: ["cohort 13 · set", "bay 114 · turned", "intake · other channels", "cohort 12 · day 19 · tapping", "bay 117 · unassigned · occupied", "retained · kept warm", "cohort 13 · set", "candled · no change"] },
  cookie: { text: "We use cookies to keep this site at operating temperature. They stay with you for 21 days.", yes: "Keep me warm", no: "Only what’s essential", yesToast: "Thank you. You’re at 37.5° now.", noToast: "Understood. We’ll still turn you." },
  chat: { button: "Talk to an associate", name: "Kestrel Associate", role: "Usually replies within 21 days", flow: {
    start: { bot: ["Hi {name}, I’m an associate at Kestrel. Are you a founder, an LP or a visitor?"], opts: [["I’m a founder", "founder"], ["I’m an LP", "lp"], ["I heard knocking", "knock"]] },
    founder: { bot: ["Wonderful. Our next cohort sets soon. Have you been candled before?"], opts: [["What’s candling?", "candle"], ["Can I leave after 21 days?", "leave"]] },
    lp: { bot: ["Fund IV is fully incubated. Fund V is warming up. Would you like the data room?"], opts: [["Yes, the data room", "data"], ["Where do founders come from?", "source"]] },
    candle: { bot: ["We hold you up to a bright light in a dark room and look through you. It takes a second. It only feels longer."], opts: [["That sounds fine", "leave"], ["Start over", "start"]] },
    leave: { bot: ["Most founders do. Those who don’t are retained and kept warm. Either way, you are always part of the family."], opts: [["Pitch you", "pitch"], ["Start over", "start"]] },
    data: { bot: ["The data room is in Room C. Bring nothing. The lamp is already on."], opts: [["Go to Room C", "room"], ["Start over", "start"]] },
    source: { bot: ["Referrals, applications and other channels.", "I’m not able to describe the other channels."], opts: [["Why not?", "why"], ["Start over", "start"]] },
    why: { bot: ["Because they’re warm when they arrive, {name}.", "Is there anything else I can help you with?"], opts: [["Start over", "start"]] },
    knock: { bot: ["That’s normal before day 21. Please don’t answer it.", "Did you answer it?"], opts: [["…once", "once"], ["No", "start"]] },
    once: { bot: ["Then it knows your rhythm now.", "It’s all right. We’ll turn you at 6."], opts: [["Start over", "start"]] },
    pitch: { bot: ["Use the pitch form. Tick the residency box. We’ll take it from there."], opts: [["Start over", "start"]] },
    room: { bot: ["Follow the heat. Room C is the dark one. Move your cursor to hold the lamp: #candling"], opts: [["Start over", "start"]] }
  } },
  forms: {
    pitch: function(d){
      var who = d.name || "there", co = d.company || "your company";
      return "<h3>Thank you, " + who + ".</h3><p>We have received the deck for " + co + " and moved it to the warm room. Here is what happens next:</p><ul><li>Day 0: arrive at Kestrel House. Bring nothing.</li><li>Day 7: you will be candled.</li><li>Day 18: lockdown. We will not be able to hear you after this.</li><li>Day 21: break through, if you can.</li></ul>" +
        (d.residency ? "<p>You ticked the residency box. Your bay is ready. It is already at 37.5°.</p>" : "<p>You didn’t tick the residency box. That’s all right. We’ve assigned you a bay anyway. It’s next to 117.</p>");
    }
  },
  onRoute: function(view){ drawCharts(); },
  console: [["Kestrel Capital · we’re hiring turners", "font:600 14px Georgia;color:#C8642B"], ["  .-.\n (   )\n  `-'   bay 116 · day 1,219 · please knock", "font:12px monospace;color:#999"]],
  atoms: {
    words: ["egg", "shell", "yolk", "clutch", "brood", "hatch", "albumen", "incubate", "turn", "warm"],
    lines: ["Patient capital for founders who hatch.", "Every company starts somewhere small and warm.", "We turn every company three times a day.", "Held up to the light. No change.", "On day 21 they break through. Most of them.", "Founders retained. Still warm.", "Lockdown: the doors stay sealed.", "Intake: other channels.", "Knocking before day 21 is normal.", "Bay 117 is not on the manifest.", "Kept at 37.5 degrees.", "It hasn’t been day 21 for a long time."],
    captions: ["Bay 114 · day 412", "The 2 a.m. turn", "Intake, Monday", "Candled. No change.", "Cohort 12, as delivered"],
    images: ["img/carton.jpg", "img/pile.jpg", "img/cracked.jpg", "img/incubators.jpg", "img/dozen.jpg", "img/bowl.jpg"],
    who: { name: "Teo", lines: ["it’s warm here too. is this another bay?", "three, then two, then three. that’s me knocking.", "they turned me and I came out somewhere else.", "is this the outside? it looks like the inside.", "if you see a lamp, hold me up to it."] },
    palette: { accent: "#C8642B", bg: "#1a140f", ink: "#E8D3B2" }
  }
};
})();
