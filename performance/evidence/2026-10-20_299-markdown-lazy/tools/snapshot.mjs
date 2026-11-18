// 개념 노트를 before / after 빌드에서 같은 녹화 응답으로 그려 전체 화면을 캡처하고 비교한다.
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const OUT = 'C:/Users/jhe93/Desktop/project/gravit-workspace/gravit-harness-base/performance/evidence/2026-10-20_299-markdown-lazy/images';
const ROUTE = process.argv[2] ?? '/learning/units/11/concept-note';
const SLUG = ROUTE.split('/')[3];
const { tokens, recordings } = JSON.parse(fs.readFileSync(new URL('./recordings.json', import.meta.url), 'utf8'));

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  userDataDir: new URL('./profile-replay', import.meta.url).pathname.slice(1),
  headless: 'new',
  args: ['--disable-web-security', '--no-first-run', '--hide-scrollbars'],
});

async function capture(name, origin) {
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.evaluateOnNewDocument((accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }, tokens.accessToken, tokens.refreshToken);
  const cdp = await page.createCDPSession();
  await cdp.send('Fetch.enable', { patterns: [{ urlPattern: '*/api/v*' }, { urlPattern: '*jsdelivr.net*' }] });
  cdp.on('Fetch.requestPaused', async ({ requestId, request }) => {
    const recording = recordings[`${request.method} ${request.url}`];
    if (!recording) {
      await cdp.send('Fetch.fulfillRequest', { requestId, responseCode: 404, body: '' }).catch(() => {});
      return;
    }
    const headers = Object.entries(recording.headers)
      .filter(([key]) => !['content-encoding', 'content-length', 'transfer-encoding'].includes(key))
      .map(([key, value]) => ({ name: key, value: key === 'access-control-allow-origin' ? (request.headers.Origin ?? String(value)) : String(value).replaceAll('\n', ', ') }));
    await cdp.send('Fetch.fulfillRequest', { requestId, responseCode: recording.status, responseHeaders: headers, body: recording.body }).catch(() => {});
  });
  await page.goto(`${origin}${ROUTE}`, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const file = `${OUT}/concept-note-unit${SLUG}-${name}.png`;
  // 앱 셸 안쪽 상자가 스크롤하므로 페이지 캡처는 첫 화면만 찍힌다. 마크다운 본문 요소를 통째로 찍는다.
  const body = await page.$('[data-slot="markdown"]');
  const buffer = await body.screenshot({ path: file, captureBeyondViewport: true });
  const box = await body.boundingBox();
  console.log(name, '본문 크기', Math.round(box.width), 'x', Math.round(box.height));
  const stats = await page.evaluate(() => ({
    path: location.pathname,
    headings: document.querySelectorAll('[data-slot="markdown"] :is(h1,h2,h3)').length,
    codeBlocks: document.querySelectorAll('[data-slot="markdown"] pre').length,
    tables: document.querySelectorAll('[data-slot="markdown"] table').length,
    images: document.querySelectorAll('[data-slot="markdown"] img').length,
    highlightedTokens: document.querySelectorAll('[data-slot="markdown"] pre .token').length,
    textLength: document.querySelector('[data-slot="markdown"]')?.textContent.length ?? 0,
  }));
  await page.close();
  return { buffer, stats };
}

const before = await capture('before', 'http://localhost:5173');
const after = await capture('after', 'http://localhost:5174');
await browser.close();
console.log('before', JSON.stringify(before.stats));
console.log('after ', JSON.stringify(after.stats));
console.log('스크린샷 바이트 동일:', before.buffer.equals(after.buffer), `(${before.buffer.length} / ${after.buffer.length} bytes)`);


