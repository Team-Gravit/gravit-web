import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE = new URL('./profile', import.meta.url).pathname.slice(1);
const ORIGIN = 'http://localhost:5173';
const TIMEOUT_MS = 30 * 60 * 1000;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  userDataDir: PROFILE,
  headless: false,
  defaultViewport: null,
  args: ['--no-first-run', '--no-default-browser-check'],
});
const [page] = await browser.pages();
await page.goto(`${ORIGIN}/`);
console.log('로그인 창을 열었다. 로그인을 기다린다…');

const startedAt = Date.now();
let hasToken = false;
while (Date.now() - startedAt < TIMEOUT_MS) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const pages = await browser.pages();
  for (const candidate of pages) {
    if (!candidate.url().startsWith(ORIGIN)) continue;
    hasToken = await candidate
      .evaluate(() => Boolean(localStorage.getItem('accessToken')))
      .catch(() => false);
    if (hasToken) break;
  }
  if (hasToken) break;
}
console.log(hasToken ? '로그인 확인 — 토큰이 프로필에 저장됐다' : '시간 초과 — 로그인을 확인하지 못했다');
await new Promise((resolve) => setTimeout(resolve, 3000));
await browser.close();

