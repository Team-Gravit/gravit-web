// 화면을 시간 순으로 찍는다 (CLS 원인 확인용). PROFILE=mweb DELAY=600 node filmstrip.mjs <puppeteer/> <경로> <출력 폴더>
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const require = createRequire(process.argv[2]);
const puppeteer = require('puppeteer');
const [, , , route, out] = process.argv;
mkdirSync(out, { recursive: true });
const LTE = { offline: false, latency: 40, downloadThroughput: 20e6 / 8, uploadThroughput: 5e6 / 8 };
await fetch(`http://localhost:4199/__control?onboarded=true&delay=${process.env.DELAY ?? 0}`);
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 412, height: 915, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await page.evaluateOnNewDocument(() => localStorage.setItem('hasSession', '1'));
const cdp = await page.createCDPSession();
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
await cdp.send('Network.emulateNetworkConditions', LTE);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
const t0 = Date.now();
page.goto('http://localhost:4195' + route);
for (const at of [400, 700, 900, 1200, 1500, 1900, 2400]) {
  await new Promise((r) => setTimeout(r, Math.max(0, at - (Date.now() - t0))));
  await page.screenshot({ path: `${out}/${String(at).padStart(4, '0')}ms.png` }).catch(() => {});
}
await browser.close();
await fetch('http://localhost:4199/__control?delay=0');
