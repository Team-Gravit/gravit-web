// 확인용: 각 화면이 목표 주소에 도착하는지, API가 404·5xx를 내는지. 감속 없음, 측정값으로 쓰지 않는다.
import { createRequire } from 'node:module';
const require = createRequire(process.argv[2]);
const puppeteer = require('puppeteer');
const paths = ['/main','/learning','/learning/chapters/1','/learning/units/1','/learning/units/1/concept-note','/league','/friends','/my/summary','/my/learning','/my/league','/my/social','/my/friends/search','/learning/lessons/1','/learning/units/1/bookmarked-problems','/learning/units/1/incorrect-problems','/my/edit','/notifications','/settings','/settings/inquiry','/settings/inquiry/new','/settings/notice','/settings/notice/1'];
const browser = await puppeteer.launch({ headless: true });
await fetch('http://localhost:4199/__control?onboarded=true&delay=0');
for (const p of paths) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage(); await page.setViewport({ width: 412, height: 915, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true });
  await page.evaluateOnNewDocument(() => localStorage.setItem('hasSession', '1'));
  const bad = [];
  page.on('response', (r) => { if (r.url().includes(':4199') && r.status() >= 400) bad.push(`${r.status()} ${new URL(r.url()).pathname}`); });
  await page.goto('http://localhost:4195' + p, { waitUntil: 'load' });
  await page.waitForNetworkIdle({ idleTime: 1000, timeout: 20000 }).catch(() => {});
  const landed = new URL(page.url()).pathname;
  console.log(`${landed === p ? 'OK ' : 'MOVED'} ${p}${landed === p ? '' : ' → ' + landed} ${bad.length ? 'API ' + bad.join(', ') : ''}`);
  await ctx.close();
}
await browser.close();
