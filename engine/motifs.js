/* Chamber motifs: the one shape each member is made of, as polygons.
   Motifs.polys(name, n, r, w): polygons for level n of the dive; r is a seeded random, w (0..1) how wrong it has got.
   Shapes have no holes (they are filled nonzero); details inside are drawn by Motifs.inside. Works in Node too. */
(function(root){
"use strict";
var TAU = Math.PI * 2;
function ell(cx, cy, rx, ry, rot, N){ N = N || 40; rot = rot || 0; var p = [], c = Math.cos(rot), s = Math.sin(rot); for (var i = 0; i < N; i++){ var t = i / N * TAU, x = Math.cos(t) * rx, y = Math.sin(t) * ry; p.push([cx + x * c - y * s, cy + x * s + y * c]); } return p; }
function rect(x0, y0, x1, y1, rad){
  rad = rad || 0; if (!rad) return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  var p = [], cs = [[x1 - rad, y0 + rad, -0.25], [x1 - rad, y1 - rad, 0], [x0 + rad, y1 - rad, 0.25], [x0 + rad, y0 + rad, 0.5]];
  cs.forEach(function(c){ for (var i = 0; i <= 6; i++){ var t = (c[2] + i / 24) * TAU; p.push([c[0] + Math.cos(t) * rad, c[1] + Math.sin(t) * rad]); } });
  return p;
}
function band(fn, t0, t1, wid, N){ /* a thick stroke along a curve, as one polygon */
  N = N || 40; var L = [], R = [];
  for (var i = 0; i <= N; i++){
    var t = t0 + (t1 - t0) * i / N, a = fn(t), b = fn(t + 1e-3), dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
    var ww = typeof wid === "function" ? wid(i / N) : wid;
    L.push([a[0] - dy / d * ww, a[1] + dx / d * ww]); R.push([a[0] + dy / d * ww, a[1] - dx / d * ww]);
  }
  return L.concat(R.reverse());
}
function arcC(cx, cy, r, a0, a1, wid){ return band(function(t){ return [cx + Math.cos(t) * r, cy + Math.sin(t) * r]; }, a0, a1, wid, 36); }
function poly(pts){ return pts.map(function(q){ return [q[0], q[1]]; }); }

var B = {
  heart: function(){ var p = []; for (var i = 0; i < 60; i++){ var t = i / 60 * TAU, x = 16 * Math.pow(Math.sin(t), 3), y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t); p.push([x / 34, -y / 34]); } return [p, rect(-0.07, -0.62, 0.04, -0.34, 0.03), rect(0.1, -0.58, 0.19, -0.36, 0.03)]; },
  foot: function(){
    var sole = []; for (var i = 0; i < 48; i++){ var t = i / 48 * TAU, c = Math.cos(t), s = Math.sin(t); sole.push([0.2 * s * (1 + 0.22 * c) + 0.03 * c * c, 0.42 * c + 0.06]); }
    return [sole, ell(-0.11, -0.43, 0.075, 0.09), ell(0.0, -0.47, 0.055, 0.065), ell(0.08, -0.44, 0.047, 0.055), ell(0.14, -0.38, 0.04, 0.047), ell(0.19, -0.31, 0.033, 0.04)];
  },
  toe: function(){ return [rect(-0.17, -0.5, 0.17, 0.5, 0.17), ell(0, -0.34, 0.12, 0.11)]; },
  crescent: function(){ return [band(function(t){ return [Math.cos(t) * 0.48, Math.sin(t) * 0.22 + 0.05]; }, Math.PI * 1.05, Math.PI * 1.95, function(u){ return 0.012 + 0.07 * Math.sin(u * Math.PI); })]; },
  droplet: function(){ var p = []; for (var i = 0; i < 50; i++){ var t = i / 50 * TAU, s = Math.sin(t / 2); p.push([0.36 * Math.sin(t) * Math.pow(s, 1.6) * 1.0, -0.5 * Math.cos(t)]); } return [p]; },
  eye: function(){ var p = []; for (var i = 0; i < 50; i++){ var t = i / 50 * TAU; p.push([0.5 * Math.cos(t), 0.24 * Math.sin(t) * Math.pow(Math.abs(Math.sin(t)), -0.15) * (Math.sin(t) > 0 ? 0.9 : 1)]); } return [p]; },
  orb: function(){ return [ell(0, 0, 0.48, 0.48, 0, 48)]; },
  blade: function(){ return [[[-0.5, 0.08], [0.18, 0.08], [0.42, 0.02], [0.5, -0.06], [0.34, -0.12], [-0.12, -0.14], [-0.5, -0.12]], rect(-0.56, -0.2, -0.46, 0.16, 0.03), rect(-0.98, -0.11, -0.52, 0.11, 0.08)]; },
  smile: function(){ return [band(function(t){ return [Math.cos(t) * 0.46, Math.sin(t) * 0.3 - 0.12]; }, 0.12 * Math.PI, 0.88 * Math.PI, function(u){ return 0.03 + 0.08 * Math.sin(u * Math.PI); })]; },
  arch: function(){ var p = [[-0.36, 0.5], [-0.36, -0.08]]; for (var i = 0; i <= 20; i++){ var t = Math.PI + i / 20 * Math.PI; p.push([Math.cos(t) * 0.36, -0.08 + Math.sin(t) * 0.42]); } p.push([0.36, 0.5]); return [p]; },
  cuff: function(){ return [arcC(-0.22, 0, 0.22, 0.35, TAU - 0.35, 0.07), arcC(0.22, 0, 0.22, Math.PI + 0.35, Math.PI + TAU - 0.35, 0.07), rect(-0.06, -0.035, 0.06, 0.035, 0.03)]; },
  film: function(){ return [rect(-0.5, -0.32, 0.5, 0.32, 0.09)]; },
  chair: function(){ return [rect(-0.26, -0.5, 0.2, 0.04, 0.06), rect(-0.3, 0.02, 0.32, 0.14, 0.04), rect(-0.27, 0.12, -0.19, 0.5, 0.02), rect(0.2, 0.12, 0.28, 0.5, 0.02), rect(0.24, -0.14, 0.32, 0.06, 0.02)]; },
  flame: function(){ var p = []; for (var i = 0; i < 60; i++){ var t = i / 60 * TAU, c = Math.cos(t), s = Math.sin(t); var y = -0.5 * c, x = 0.3 * s * Math.pow((1 + c) / 2, 0.75) * (1 + 0.15 * Math.sin(3 * t)); p.push([x + 0.05 * Math.sin(y * 9), y]); } return [p]; },
  coin: function(){ var p = ell(0, 0, 0.48, 0.48, 0, 30); return [p.map(function(q, i){ var k = i % 2 ? 0.95 : 1; return [q[0] * k, q[1] * k]; })]; },
  key: function(){ return [ell(-0.33, 0, 0.17, 0.17, 0, 30), rect(-0.2, -0.045, 0.48, 0.045, 0.02), rect(0.26, 0, 0.32, 0.15, 0.01), rect(0.38, 0, 0.44, 0.12, 0.01)]; },
  keyhole: function(){ return [ell(0, -0.15, 0.24, 0.24, 0, 36), [[-0.12, -0.02], [0.12, -0.02], [0.22, 0.5], [-0.22, 0.5]]]; },
  braid: function(){ var out = []; for (var i = 0; i < 7; i++){ var y = -0.45 + i * 0.15, sd = i % 2 ? 1 : -1; out.push(ell(sd * 0.045, y, 0.1, 0.09, sd * 0.6, 24)); } out.push(band(function(t){ return [0.02 * Math.sin(t * 9), t]; }, 0.5, 0.95, 0.025, 12)); return out; },
  lock: function(){ return [band(function(t){ return [0.18 * Math.sin(t * 5.5) * (1 - t * 0.3), t - 0.5]; }, 0, 1, function(u){ return 0.07 * (1 - u * 0.85) + 0.008; }, 50)]; },
  fingerprint: function(){ var p = []; for (var i = 0; i < 48; i++){ var t = i / 48 * TAU; p.push([0.34 * Math.cos(t) * (1 - 0.1 * Math.sin(t)), 0.48 * Math.sin(t)]); } return [p]; },
  fly: function(){ return [ell(0, 0.08, 0.08, 0.24, 0, 24), ell(0, -0.2, 0.09, 0.08, 0, 20), ell(-0.2, -0.04, 0.24, 0.1, -0.5, 28), ell(0.2, -0.04, 0.24, 0.1, 0.5, 28), ell(-0.05, -0.23, 0.04, 0.04), ell(0.05, -0.23, 0.04, 0.04)]; },
  moth: function(){ return [ell(0, 0.02, 0.05, 0.26, 0, 20), ell(-0.24, -0.12, 0.25, 0.17, 0.4, 30), ell(0.24, -0.12, 0.25, 0.17, -0.4, 30), ell(-0.16, 0.16, 0.15, 0.12, -0.3, 24), ell(0.16, 0.16, 0.15, 0.12, 0.3, 24)]; },
  bone: function(){ return [rect(-0.34, -0.06, 0.34, 0.06, 0.03), ell(-0.36, -0.08, 0.09, 0.09), ell(-0.36, 0.08, 0.09, 0.09), ell(0.36, -0.08, 0.09, 0.09), ell(0.36, 0.08, 0.09, 0.09)]; },
  hand: function(){ return [rect(-0.22, -0.08, 0.2, 0.42, 0.12), rect(-0.21, -0.42, -0.12, 0.0, 0.045), rect(-0.1, -0.5, -0.01, -0.02, 0.045), rect(0.01, -0.48, 0.1, -0.02, 0.045), rect(0.12, -0.38, 0.2, 0.0, 0.04), band(function(t){ return [-0.22 - t * 0.2, 0.12 - t * 0.2]; }, 0, 1, 0.05, 8)]; },
  ear: function(){ return [arcC(0, -0.06, 0.28, -2.6, 1.4, function(u){ return 0.07 + 0.05 * Math.sin(u * Math.PI); }), ell(0.02, 0.33, 0.1, 0.13)]; },
  door: function(){ var p = rect(-0.27, -0.5, 0.27, 0.5, 0.03); return [p, ell(0.17, 0.04, 0.035, 0.035)]; },
  clock: function(){ return [ell(0, 0, 0.48, 0.48, 0, 48), rect(-0.05, -0.62, 0.05, -0.46, 0.02)]; },
  cloud: function(){ return [ell(-0.24, 0.06, 0.2, 0.17), ell(0, -0.06, 0.26, 0.24), ell(0.26, 0.05, 0.2, 0.18), rect(-0.4, 0.04, 0.42, 0.22, 0.1)]; },
  petal: function(){ var p = []; for (var i = 0; i < 44; i++){ var t = i / 44 * TAU; p.push([0.22 * Math.sin(t) * (1 - 0.3 * Math.cos(t)), -0.5 * Math.cos(t)]); } return [p]; },
  tongue: function(){ var p = []; for (var i = 0; i < 44; i++){ var t = i / 44 * TAU, c = Math.cos(t); p.push([0.28 * Math.sin(t) * (0.8 + 0.2 * c), -0.5 * c * (c > 0 ? 0.55 : 1) + 0.1]); } return [p]; },
  shoe: function(){ return [[[-0.5, 0.18], [-0.48, -0.16], [-0.3, -0.2], [-0.2, -0.05], [0.12, 0.0], [0.42, 0.06], [0.5, 0.16], [0.46, 0.24], [-0.46, 0.26]]]; },
  lens: function(){ return [ell(-0.25, 0, 0.22, 0.19, 0, 30), ell(0.25, 0, 0.22, 0.19, 0, 30), rect(-0.06, -0.04, 0.06, 0.02, 0.02)]; },
  cup: function(){ return [[[-0.3, -0.42], [0.3, -0.42], [0.22, 0.46], [-0.22, 0.46]], rect(-0.34, -0.5, 0.34, -0.38, 0.04)]; },
  loaf: function(){ var p = []; for (var i = 0; i <= 24; i++){ var t = Math.PI + i / 24 * Math.PI; p.push([Math.cos(t) * 0.48, Math.sin(t) * 0.36 * (1 + 0.08 * Math.sin(t * 6)) + 0.05]); } p.push([0.46, 0.3], [-0.46, 0.3]); return [p]; },
  car: function(){ return [[[-0.5, 0.1], [-0.46, -0.04], [-0.24, -0.08], [-0.12, -0.24], [0.18, -0.24], [0.32, -0.08], [0.48, -0.04], [0.5, 0.1]], ell(-0.28, 0.12, 0.1, 0.1), ell(0.28, 0.12, 0.1, 0.1)]; },
  button: function(){ return [ell(0, 0, 0.46, 0.46, 0, 40), rect(-0.12, -0.56, 0.12, -0.42, 0.04)]; },
  navel: function(){ var p = []; for (var i = 0; i < 40; i++){ var t = i / 40 * TAU; p.push([0.3 * Math.cos(t), 0.48 * Math.sin(t) * (1 - 0.2 * Math.cos(t * 2))]); } return [p]; },
  mannequin: function(){ return [ell(0, -0.4, 0.1, 0.12), rect(-0.04, -0.3, 0.04, -0.22), [[-0.24, -0.22], [0.24, -0.22], [0.16, 0.02], [0.2, 0.3], [-0.2, 0.3], [-0.16, 0.02]], rect(-0.03, 0.3, 0.03, 0.5), rect(-0.16, 0.48, 0.16, 0.52, 0.02)]; },
  strip: function(){ return [rect(-0.07, -0.5, 0.07, 0.5, 0.01)]; },
  note: function(){ return [ell(-0.14, 0.32, 0.17, 0.12, -0.4), rect(0.0, -0.5, 0.06, 0.3), band(function(t){ return [0.03 + t * 0.22, -0.48 + t * 0.12 + 0.12 * Math.sin(t * 3)]; }, 0, 1, 0.045, 12)]; },
  grain: function(r){ var p = [], k = 9; for (var i = 0; i < k; i++){ var t = i / k * TAU, rr = 0.36 + r() * 0.14; p.push([Math.cos(t) * rr, Math.sin(t) * rr * 0.8]); } return [p]; },
  crystal: function(){ return [[[0, -0.5], [0.22, -0.2], [0.22, 0.32], [0, 0.5], [-0.22, 0.32], [-0.22, -0.2]]]; },
  nest: function(){ var out = [ell(0, 0.08, 0.46, 0.26)]; for (var i = 0; i < 3; i++) out.push(ell(-0.12 + i * 0.12, -0.08, 0.09, 0.12, 0.2 * (i - 1))); return out; },
  window: function(){ return [rect(-0.3, -0.42, 0.3, 0.42, 0.24)]; },
  receipt: function(){ var p = [[-0.3, -0.5], [0.3, -0.5]]; for (var i = 0; i <= 10; i++) p.push([0.3 - i * 0.06, 0.46 + (i % 2 ? 0.05 : 0)]); p.push([-0.3, 0.46]); return [p]; },
  wave: function(){ return [band(function(t){ return [t, 0.22 * Math.sin(t * 9) * Math.cos(t * 1.5)]; }, -0.5, 0.5, 0.06, 60)]; },
  stair: function(){ var p = [[-0.5, 0.5]]; for (var i = 0; i < 5; i++){ var x = -0.5 + i * 0.2, y = 0.5 - i * 0.2; p.push([x, y - 0.2], [x + 0.2, y - 0.2]); } p.push([0.5, 0.5]); return [p]; },
  rib: function(){ var out = [rect(-0.04, -0.5, 0.04, 0.5, 0.02)]; for (var i = 0; i < 5; i++){ var y = -0.36 + i * 0.17; out.push(band(function(t){ return [t * 0.42, y + 0.1 * Math.sin(Math.abs(t) * 3)]; }, -1, 1, 0.025, 20)); } return out; },
  plan: function(){ return [[[-0.5, -0.4], [0.2, -0.4], [0.2, -0.1], [0.5, -0.1], [0.5, 0.4], [-0.1, 0.4], [-0.1, 0.15], [-0.5, 0.15]]]; },
  signature: function(){ return [band(function(t){ return [t, 0.16 * Math.sin(t * 14) + 0.08 * Math.sin(t * 5)]; }, -0.5, 0.5, 0.025, 90)]; },
  letter: function(){ return [rect(-0.5, -0.32, 0.5, 0.32, 0.03)]; },
  vial: function(){ return [rect(-0.12, -0.42, 0.12, 0.46, 0.11), rect(-0.16, -0.52, 0.16, -0.4, 0.03)]; },
  face: function(){ var p = []; for (var i = 0; i < 48; i++){ var t = i / 48 * TAU, s = Math.sin(t); p.push([0.34 * Math.cos(t) * (s > 0 ? 1 - 0.25 * s : 1), 0.48 * s]); } return [p]; },
  wing: function(){ var p = [[-0.5, 0.1]]; for (var i = 0; i <= 20; i++){ var t = i / 20; p.push([-0.5 + t, 0.1 - 0.5 * Math.sin(t * Math.PI) * (1 - t * 0.4)]); } p.push([0.5, 0.2], [-0.2, 0.3]); return [p]; },
  sock: function(){ return [[[-0.12, -0.5], [0.16, -0.5], [0.16, 0.1], [0.42, 0.26], [0.42, 0.44], [0.24, 0.5], [-0.12, 0.34]]]; },
  pill: function(){ return [rect(-0.5, -0.18, 0.5, 0.18, 0.18)]; },
  hook: function(){ return [band(function(t){ return t < 0.6 ? [0.1, -0.5 + t * 1.3] : [0.1 - Math.sin((t - 0.6) / 0.4 * Math.PI) * 0.22, 0.28 + Math.sin((t - 0.6) / 0.4 * Math.PI / 2) * 0.0 + (Math.cos((t - 0.6) / 0.4 * Math.PI) - 1) * -0.1]; }, 0, 1, 0.045, 40)]; },
  wheel: function(){ var out = [ell(0, 0, 0.12, 0.12)]; for (var i = 0; i < 8; i++){ var a = i / 8 * TAU; out.push(ell(Math.cos(a) * 0.32, Math.sin(a) * 0.32, 0.14, 0.06, a, 16)); } return out; },
  bulb: function(){ return [ell(0, -0.12, 0.32, 0.34, 0, 40), rect(-0.13, 0.15, 0.13, 0.48, 0.04)]; },
  house: function(){ return [[[0, -0.5], [0.45, -0.1], [0.36, -0.1], [0.36, 0.45], [-0.36, 0.45], [-0.36, -0.1], [-0.45, -0.1]]]; }
};

function warp(polys, r, w){
  if (!w) return polys;
  var a1 = r() * TAU, a2 = r() * TAU, k1 = 3 + r() * 6, k2 = 3 + r() * 6, amp = w * (0.025 + r() * 0.05);
  var sx = 1 + w * (r() - 0.5) * 0.4, sh = w * (r() - 0.5) * 0.4, rot = w * (r() - 0.5) * 0.6, c = Math.cos(rot), s = Math.sin(rot);
  return polys.map(function(p){ return p.map(function(q){
    var x = q[0] * sx + q[1] * sh, y = q[1];
    x += amp * Math.sin(y * k1 + a1); y += amp * Math.sin(x * k2 + a2);
    return [x * c - y * s, x * s + y * c];
  }); });
}

/* what shows through, drawn in the shape's own unit box */
var INSIDE = {
  glow: function(g, n, a){ var gr = g.createRadialGradient(0, 0.02, 0.02, 0, 0.02, 0.42); gr.addColorStop(0, "rgba(255,200,130," + (a * 0.9).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,160,80,0)"); g.fillStyle = gr; g.fillRect(-0.5, -0.5, 1, 1); g.globalAlpha = a; g.strokeStyle = g.fillStyle = "rgb(70,26,14)"; g.lineWidth = 0.07; g.lineCap = "round"; g.beginPath(); g.arc(0, 0.1, 0.15, 0.6, 5.2); g.stroke(); g.beginPath(); g.arc(0.1, -0.06, 0.075, 0, TAU); g.fill(); },
  veins: function(g, n, a){ g.globalAlpha = a; g.strokeStyle = "rgb(120,20,30)"; g.lineCap = "round"; for (var i = 0; i < 5; i++){ g.lineWidth = 0.03 - i * 0.004; g.beginPath(); g.moveTo(0, -0.1); var x = 0, y = -0.1; for (var k = 0; k < 6; k++){ x += Math.cos(i * 1.3 + k * 0.7 + n) * 0.07; y += Math.sin(i * 1.9 + k * 0.5) * 0.07; g.lineTo(x, y); } g.stroke(); } },
  iris: function(g, n, a){ g.globalAlpha = Math.min(1, a * 1.6); g.fillStyle = "rgb(60,90,110)"; g.beginPath(); g.arc(0, 0, 0.17, 0, TAU); g.fill(); g.fillStyle = "#050505"; g.beginPath(); g.arc(0, 0, 0.075, 0, TAU); g.fill(); g.fillStyle = "rgba(255,255,255,.8)"; g.beginPath(); g.arc(0.05, -0.05, 0.025, 0, TAU); g.fill(); },
  ridges: function(g, n, a){ g.globalAlpha = a; g.strokeStyle = "rgba(40,20,20,1)"; g.lineWidth = 0.018; for (var i = 1; i < 9; i++){ g.beginPath(); g.ellipse(0.01 * Math.sin(i + n), 0.03, i * 0.036, i * 0.05, 0, 0.2, TAU - 0.2 - (i % 3) * 0.5); g.stroke(); } },
  face: function(g, n, a){ g.globalAlpha = a; g.fillStyle = "rgb(30,22,20)"; g.beginPath(); g.arc(-0.1, -0.06, 0.04, 0, TAU); g.arc(0.1, -0.06, 0.04, 0, TAU); g.fill(); g.lineWidth = 0.025; g.strokeStyle = "rgb(30,22,20)"; g.beginPath(); g.arc(0, 0.12, 0.09, 0.3, Math.PI - 0.3); g.stroke(); },
  lines: function(g, n, a){ g.globalAlpha = a; g.fillStyle = "rgba(30,30,30,1)"; for (var i = 0; i < 9; i++) g.fillRect(-0.24, -0.38 + i * 0.09, 0.3 + 0.18 * Math.sin(i * 2.1 + n), 0.025); },
  pulse: function(g, n, a){ g.globalAlpha = a; g.strokeStyle = "rgb(150,10,30)"; g.lineWidth = 0.03; g.beginPath(); g.moveTo(-0.4, 0); g.lineTo(-0.15, 0); g.lineTo(-0.08, -0.2); g.lineTo(0, 0.18); g.lineTo(0.07, -0.06); g.lineTo(0.4, -0.06); g.stroke(); },
  pore: function(g, n, a){ g.globalAlpha = a; g.fillStyle = "rgba(60,30,25,1)"; for (var i = 0; i < 14; i++){ g.beginPath(); g.arc(Math.sin(i * 7.3 + n) * 0.3, Math.cos(i * 4.1) * 0.3, 0.012 + (i % 3) * 0.006, 0, TAU); g.fill(); } }
};

var Motifs = {
  names: Object.keys(B),
  polys: function(name, n, r, w){ return warp(B[name](r), r, w); },
  inside: function(kind){ var f = INSIDE[kind]; if (!f) return null; return function(g, n){ if (n < 3) return; g.save(); f(g, n, Math.min(0.55, (n - 2) * 0.07)); g.restore(); }; }
};
if (typeof module !== "undefined" && module.exports) module.exports = Motifs; else root.Motifs = Motifs;
})(this);
