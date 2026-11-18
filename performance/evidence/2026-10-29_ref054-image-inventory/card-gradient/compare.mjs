// Figma 그라데이션(589×377)을 crop(x64, 355×377)으로 잘라 CSS 두 방법과 픽셀 비교
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('C:/tmp/gfont-tool/');
const puppeteer = require('puppeteer-core');
const dir = new URL('./', import.meta.url);
const png = fs.readFileSync(new URL('15918-38813.png', dir)).toString('base64');
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage();
const res = await page.evaluate(async (png) => {
  const load = (src) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = src; });
  const fig = await load('data:image/png;base64,' + png);
  const W = 355, H = 377;
  const cv = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c.getContext('2d', { willReadFrequently: true }); };
  const f = cv(); f.drawImage(fig, 64, 0, W, H, 0, 0, W, H);
  const figData = f.getImageData(0, 0, W, H).data;
  const css = async (bg) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width:${W}px;height:${H}px;background:${bg}"></div></foreignObject></svg>`;
    const img = await load('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
    const c = cv(); c.drawImage(img, 0, 0); return c.getImageData(0, 0, W, H).data;
  };
  const diff = (d) => { let max = 0, sum = 0; for (let i = 0; i < d.length; i += 4) { const e = Math.max(Math.abs(d[i] - figData[i]), Math.abs(d[i + 1] - figData[i + 1]), Math.abs(d[i + 2] - figData[i + 2])); max = Math.max(max, e); sum += e; } return { max, avg: +(sum / (d.length / 4)).toFixed(2) }; };
  const px = (d, x, y) => { const i = (y * W + x) * 4; return '#' + [d[i], d[i + 1], d[i + 2]].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase(); };
  const A = await css('linear-gradient(303.01deg, #3E1BB3 0%, #180452 100%)');
  const B = await css('linear-gradient(303.01deg, #4721CA -23.34%, #17034E 103.83%)');
  const N = await css('linear-gradient(303.01deg, #4721CA 0%, #17034E 100%)');
  return {
    figmaCorners: [px(figData, 0, 0), px(figData, W - 1, 0), px(figData, 0, H - 1), px(figData, W - 1, H - 1)],
    endColors: diff(A), originalPlusStops: diff(B), naive: diff(N),
  };
}, png);
console.log(JSON.stringify(res, null, 1));
await browser.close();
