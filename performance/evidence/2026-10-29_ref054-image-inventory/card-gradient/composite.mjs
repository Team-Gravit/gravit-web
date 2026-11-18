// (CSS 그라데이션 + 투명 장식) 합성 결과를 Figma 원본 crop과 비교하고, webp 후보를 만든다
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('C:/tmp/gfont-tool/');
const puppeteer = require('puppeteer-core');
const dir = new URL('./', import.meta.url);
const deco = fs.readFileSync(new URL('15919-38897.png', dir)).toString('base64');
const orig = fs.readFileSync(new URL('15918-38812.png', dir)).toString('base64');
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage();
const res = await page.evaluate(async (deco, orig) => {
  const load = (src) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = src; });
  const W = 710, H = 754;
  const ctx = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return [c, c.getContext('2d', { willReadFrequently: true })]; };
  const [, o] = ctx(); o.drawImage(await load('data:image/png;base64,' + orig), 128, 0, W, H, 0, 0, W, H);
  const od = o.getImageData(0, 0, W, H).data;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width:${W}px;height:${H}px;background:linear-gradient(303.01deg, #4721CA -23.34%, #17034E 103.83%)"></div></foreignObject></svg>`;
  const [cc, c] = ctx(); c.drawImage(await load('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)), 0, 0);
  const decoImg = await load('data:image/png;base64,' + deco);
  c.drawImage(decoImg, 0, 0);
  const cd = c.getImageData(0, 0, W, H).data;
  let max = 0, sum = 0, over8 = 0;
  for (let i = 0; i < cd.length; i += 4) { const e = Math.max(...[0, 1, 2].map((k) => Math.abs(cd[i + k] - od[i + k]))); max = Math.max(max, e); sum += e; if (e > 8) over8++; }
  // 장식만 webp 후보 (투명 유지)
  const [dc, d] = ctx(); d.drawImage(decoImg, 0, 0);
  const webp = { q80: dc.toDataURL('image/webp', 0.8), q90: dc.toDataURL('image/webp', 0.9) };
  return { max, avg: +(sum / (W * H)).toFixed(2), over8pct: +(over8 / (W * H) * 100).toFixed(2), composite: cc.toDataURL('image/png'), webp };
}, deco, orig);
fs.writeFileSync(new URL('composite.png', dir), Buffer.from(res.composite.split(',')[1], 'base64'));
for (const [k, v] of Object.entries(res.webp)) { const b = Buffer.from(v.split(',')[1], 'base64'); fs.writeFileSync(new URL(`card-decoration-${k}.webp`, dir), b); console.log(k, b.length); }
console.log('diff vs Figma crop', { max: res.max, avg: res.avg, 'pixels >8/255 (%)': res.over8pct });
console.log('decoration png bytes', fs.statSync(new URL('15919-38897.png', dir)).size);
await browser.close();
