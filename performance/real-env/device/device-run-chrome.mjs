// 같은 측정 순서를 맥 Chrome(ios 프로필 CPU 1.5배 · 390×844)으로 돌린다. 네트워크 제한은 없다 (iPhone도 같은 Wi-Fi).
// node device-run-chrome.mjs <puppeteer node_modules/> <이름표> [CPU 배수]
import { createRequire } from 'node:module';
const require = createRequire(process.argv[2]);
const puppeteer = require('puppeteer');
const label = process.argv[3] ?? 'mac-chrome';
const rate = Number(process.argv[4] ?? 1.5);
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
await page.setUserAgent(`Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 bench/${label}`);
const cdp = await page.createCDPSession();
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
await cdp.send('Emulation.setCPUThrottlingRate', { rate });
await page.goto('http://192.168.45.235:4310/__start');
await page.waitForFunction(() => document.body?.innerText.includes('끝났습니다'), { timeout: 600000, polling: 1000 });
await browser.close();
