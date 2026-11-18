// starfield 변경 전(CSS 배경 cover top) · 후(<picture> object-cover object-top)를 같은 크기 상자에 그려 픽셀 비교한다.
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const dir = process.argv[2];
const CASES = [
  // [폭, 상자 높이, dpr] — 상자 높이는 콘텐츠 길이. 긴 경우는 이미지가 높이 기준으로 커진다
  [412, 823, 2.625], [412, 2400, 2.625], [1440, 900, 1], [1440, 3200, 1],
];
const css = 'html,body{margin:0}.box{position:relative;isolation:isolate;width:100%;background:#f8f8f8}';
const before = (h) => `<style>${css}</style><div class="box" style="height:${h}px;background-image:url(sf.webp);background-size:cover;background-position:top;background-repeat:no-repeat"></div>`;
const after = (h) => `<style>${css}</style><div class="box" style="height:${h}px"><picture style="display:contents"><source type="image/avif" srcset="sf.avif"><img src="sf.webp" alt="" style="position:absolute;inset:0;z-index:-10;width:100%;height:100%;object-fit:cover;object-position:top"></picture></div>`;
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
const shot = async (html, w, h, dpr) => {
  const file = path.join(dir, 'tmp.html');
  fs.writeFileSync(file, html);
  await page.setViewport({ width: w, height: h, deviceScaleFactor: dpr });
  await page.goto(new URL('file:///' + path.resolve(file)).href, { waitUntil: 'load' });
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode())));
  return page.screenshot({ type: 'png', fullPage: true });
};
const sharp = (await import('file:///C:/Users/jhe93/Desktop/project/gravit-workspace/gravit-harness-base/node_modules/sharp/lib/index.js')).default;
for (const [w, h, dpr] of CASES) {
  const a = await sharp(await shot(before(h), w, Math.min(h, 1000), dpr)).raw().toBuffer({ resolveWithObject: true });
  const b = await sharp(await shot(after(h), w, Math.min(h, 1000), dpr)).raw().toBuffer({ resolveWithObject: true });
  let max = 0, over4 = 0, over8 = 0;
  for (let i = 0; i < a.data.length; i++) { const d = Math.abs(a.data[i] - b.data[i]); if (d > max) max = d; if (d > 4) over4++; if (d > 8) over8++; }
  console.log(`${w}x${h} dpr${dpr}`, `${a.info.width}x${a.info.height}`, 'max', max, '>4', ((over4 / a.data.length) * 100).toFixed(3) + '%', '>8', ((over8 / a.data.length) * 100).toFixed(3) + '%');
}
await browser.close();
