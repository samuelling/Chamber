// Write <site>/atoms.json from <site>/site.js: the material siblings may borrow.
import fs from "fs"; import vm from "vm";
const dir = process.argv[2];
const ctx = { window: {}, document: { addEventListener(){}, getElementById(){ return null; } }, Math, console };
vm.runInNewContext(fs.readFileSync(dir + "/site.js", "utf8"), ctx);
const S = ctx.window.SITE;
function rng(seed){ let s = (Math.imul(seed | 0, 2654435761) ^ 0x9E3779B9) >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
function d(polys){
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9; polys.forEach(p=>p.forEach(q=>{x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1]);}));
  const sc=0.96/Math.max(x1-x0,y1-y0),mx=(x0+x1)/2,my=(y0+y1)/2; let out="";
  polys.forEach(p=>{ let a=0; for(let j=0;j<p.length;j++){const u=p[j],v=p[(j+1)%p.length];a+=u[0]*v[1]-v[0]*u[1];} if(a<0)p=p.slice().reverse();
    p.forEach((q,j)=>{ out+=(j?"L":"M")+((q[0]-mx)*sc).toFixed(3)+" "+((q[1]-my)*sc).toFixed(3); }); out+="Z"; });
  return out;
}
const A = S.atoms, files = A.images.filter(p => !fs.existsSync(dir + "/" + p));
if (files.length) { console.error("missing images", files); process.exit(1); }
const atoms = { slug: S.slug, name: S.name, word: S.word, icon: d(S.motif.polys(1, rng(14), 0)), palette: A.palette, words: A.words, lines: A.lines, captions: A.captions, images: A.images, who: A.who };
fs.writeFileSync(dir + "/atoms.json", JSON.stringify(atoms, null, 1));
console.log("atoms", S.slug, JSON.stringify(atoms).length, "bytes");
