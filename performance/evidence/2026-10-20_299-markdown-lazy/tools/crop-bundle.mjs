// 번들 지도에서 첫 청크 영역만 잘라 낸다 (1400×860 화면 기준, 오른쪽 큰 영역)
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
const EVIDENCE = 'C:/Users/jhe93/Desktop/project/gravit-workspace/gravit-harness-base/performance/evidence';
const OUT = `${EVIDENCE}/2026-10-20_299-markdown-lazy/images`;
const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 860, deviceScaleFactor: 2 });
for (const [file, name] of [['2026-10-18_bundle_visualizer_after.html', 'bundle-crop-before.png'], ['2026-10-18_bundle_visualizer_lazy-markdown.html', 'bundle-crop-after.png']]) {
  await page.goto(pathToFileURL(path.join(EVIDENCE, file)).href, { waitUntil: 'load' });
  await new Promise((resolve) => setTimeout(resolve, 1500));
  await page.screenshot({ path: `${OUT}/${name}`, clip: { x: 370, y: 22, width: 995, height: 816 } });
}
await browser.close();
console.log('crop 완료');
