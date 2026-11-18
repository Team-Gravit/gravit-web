// 화면별로 요청된 이미지 파일을 모아 빌드 폴더의 실제 파일 크기로 합산한다(서비스 워커를 거쳐 CDP 바이트가 0이라).
import { createRequire } from 'node:module';
import { statSync } from 'node:fs';
const require = createRequire('C:/tmp/gfont-tool/');
const puppeteer = require('puppeteer-core');
const S = process.argv[2];
const BUILDS = [['base', 4191, `${S}/m-base`], ['now', 4192, `${S}/m-now`]];
const MOBILE = { width: 412, height: 915, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true };
const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1 };
const CASES = [
  ['login-desktop', '/', DESKTOP, false], ['login-mobile', '/', MOBILE, false], ['main-mobile', '/main', MOBILE, true],
  ['learning-mobile', '/learning', MOBILE, true], ['league-mobile', '/league', MOBILE, true], ['league-desktop', '/league', DESKTOP, true],
  ['my-mobile', '/my/summary', MOBILE, true],
];
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
for (const [id, path, viewport, auth] of CASES) {
  const row = [];
  for (const [name, port, dir] of BUILDS) {
    const ctx = await browser.createBrowserContext();
    const page = await ctx.newPage();
    await page.setViewport(viewport);
    const urls = new Set();
    page.on('request', (r) => { if (r.resourceType() === 'image' && !r.url().startsWith('data:')) urls.add(new URL(r.url()).pathname); });
    await page.evaluateOnNewDocument((auth) => { if (auth) { localStorage.setItem('accessToken', 'mock'); localStorage.setItem('refreshToken', 'mock'); } }, auth);
    await page.goto(`http://localhost:${port}${path}`, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1500));
    let bytes = 0; const files = [];
    for (const u of urls) { try { const b = statSync(dir + u).size; bytes += b; files.push(`${u.split('/').pop().replace(/-[\w-]{8}\./, '.')} ${(b / 1024).toFixed(1)}`); } catch { files.push(`${u} ?`); } }
    row.push(`${name} ${(bytes / 1024).toFixed(1)}KB (${urls.size})`);
    console.log(`  ${id} ${name}: ${files.join(', ')}`);
    await ctx.close();
  }
  console.log(id, row.join(' | '));
}
await browser.close();
