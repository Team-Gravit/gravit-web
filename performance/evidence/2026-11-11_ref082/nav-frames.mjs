// 앱 안 이동 직후 화면을 시간별로 찍어 스켈레톤이 보이는지 확인한다. 응답 2초 지연.
import { createRequire } from 'node:module';
const require = createRequire(process.argv[2]);
const puppeteer = require('puppeteer');
const OUT = process.argv[3];
const flows = [['my-league', '/my/learning', 'a[href="/my/league"]'], ['chapter', '/learning', 'a[href="/learning/chapters/1"]'], ['concept', '/learning/units/1', 'a[href="/learning/units/1/concept-note"]']];
const browser = await puppeteer.launch({ headless: true });
for (const [name, start, sel] of flows) {
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
  await page.evaluateOnNewDocument(() => localStorage.setItem('hasSession', '1'));
  await fetch('http://localhost:4199/__control?delay=0');
  await page.goto('http://localhost:4195' + start, { waitUntil: 'networkidle0' });
  await fetch('http://localhost:4199/__control?delay=2000');
  const t = await page.evaluateHandle((s) => [...document.querySelectorAll(s)].find((e) => e.getBoundingClientRect().width > 0), sel);
  await t.asElement().click();
  for (const ms of [300, 1200, 3000]) {
    await new Promise((r) => setTimeout(r, ms === 300 ? 300 : ms === 1200 ? 900 : 1800));
    await page.screenshot({ path: `${OUT}/nav-${name}-${ms}.png` });
    console.log(name, ms, new URL(page.url()).pathname);
  }
  await page.close();
}
await fetch('http://localhost:4199/__control?delay=0');
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 5000))]);
process.exit(0);
