// CSS 그라데이션 ↔ Figma 그라데이션 비교 + 장식 webp 후보
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('C:/tmp/gfont-tool/');
const puppeteer = require('puppeteer-core');
const dir = new URL('./', import.meta.url);
const b64 = (p) => fs.readFileSync(new URL(p, dir)).toString('base64');
const CASES = [
  { name: 'mobile', grad: 'grad/15009-17270.png', crop: [0, 0, 950, 608], css: 'linear-gradient(303.01deg, #4721CA 3.59%, #17034E 95.08%)', deco: 'deco/15920-39158.png' },
  { name: 'wide', grad: 'grad/15920-38951.png', crop: [0, 0, 3840, 548], css: 'linear-gradient(334.85deg, #4721CA -2.12%, #17034E 97.79%)', deco: 'deco/15920-39159.png' },
];
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage();
for (const c of CASES) {
  const r = await page.evaluate(async (c, grad, deco) => {
    const load = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = src; });
    const [x, y, W, H] = c.crop;
    const mk = () => { const cv = document.createElement('canvas'); cv.width = W; cv.height = H; return [cv, cv.getContext('2d', { willReadFrequently: true })]; };
    const [, f] = mk(); f.drawImage(await load('data:image/png;base64,' + grad), x, y, W, H, 0, 0, W, H);
    const fd = f.getImageData(0, 0, W, H).data;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width:${W}px;height:${H}px;background:${c.css}"></div></foreignObject></svg>`;
    const [, s] = mk(); s.drawImage(await load('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)), 0, 0);
    const sd = s.getImageData(0, 0, W, H).data;
    let max = 0, sum = 0;
    for (let i = 0; i < sd.length; i += 4) { const e = Math.max(...[0, 1, 2].map((k) => Math.abs(sd[i + k] - fd[i + k]))); max = Math.max(max, e); sum += e; }
    const di = await load('data:image/png;base64,' + deco);
    const [dc, d] = (() => { const cv = document.createElement('canvas'); cv.width = di.width; cv.height = di.height; return [cv, cv.getContext('2d')]; })();
    d.drawImage(di, 0, 0);
    return { max, avg: +(sum / (W * H)).toFixed(2), deco: [di.width, di.height], webp: dc.toDataURL('image/webp', 0.8) };
  }, c, b64(c.grad), b64(c.deco));
  const buf = Buffer.from(r.webp.split(',')[1], 'base64');
  fs.writeFileSync(new URL(`${c.name}-decoration-q80.webp`, dir), buf);
  console.log(c.name, 'gradient diff', { max: r.max, avg: r.avg }, 'decoration', r.deco.join('x'), 'png', fs.statSync(new URL(c.deco, dir)).size, 'webp q80', buf.length);
}
await browser.close();
