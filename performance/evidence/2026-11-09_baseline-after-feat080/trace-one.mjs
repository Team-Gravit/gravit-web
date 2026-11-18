// 한 회차의 모든 리소스(JS · CSS · 이미지 · API) 출발/도착과 FCP를 시간순으로 찍는다. 조건은 measure.mjs와 같다.
import { createRequire } from 'node:module';
const require = createRequire(process.argv[2]);
const puppeteer = require('puppeteer');
const [, , , PORT, PATH] = process.argv;
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 412, height: 915, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true });
const cdp = await page.createCDPSession();
await cdp.send('Network.enable');
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 60, downloadThroughput: 9e6 / 8, uploadThroughput: 1.5e6 / 8 });
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await page.evaluateOnNewDocument(() => localStorage.setItem('hasSession', '1'));
await page.goto(`http://localhost:${PORT}${PATH}`, { waitUntil: 'load', timeout: 120000 });
await new Promise((r) => setTimeout(r, 12000));
const rows = await page.evaluate(() => {
  const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime;
  const res = performance.getEntriesByType('resource').map((r) => [Math.round(r.startTime), Math.round(r.responseEnd), r.initiatorType, new URL(r.name).pathname.replace(/^\/assets\//, ''), Math.round(r.encodedBodySize / 1024)]);
  return { fcp: Math.round(fcp), res };
});
console.log('FCP', rows.fcp);
for (const r of rows.res.sort((a, b) => a[0] - b[0])) console.log(r.join('\t'));
await browser.close();
