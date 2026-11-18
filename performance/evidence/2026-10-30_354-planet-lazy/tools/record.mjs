// 실제 서버 응답을 녹화한다. 측정 때 replay.mjs 가 이 응답을 고정 지연으로 돌려준다.
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const ORIGIN = 'http://localhost:5173';
const ROUTES = process.argv.slice(2).length ? process.argv.slice(2) : ['/learning'];
const isRecordable = (url) => /\/api\/v\d\//.test(url) || url.includes('jsdelivr.net');

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  userDataDir: new URL('./profile', import.meta.url).pathname.slice(1),
  headless: 'new',
});
const page = await browser.newPage();
const recordingsFile = new URL('./recordings.json', import.meta.url);
const recordings = fs.existsSync(recordingsFile) ? JSON.parse(fs.readFileSync(recordingsFile, 'utf8')).recordings : {};
page.on('response', async (response) => {
  const request = response.request();
  if (request.method() === 'OPTIONS' || !isRecordable(response.url())) return;
  try {
    const body = await response.buffer();
    recordings[`${request.method()} ${response.url()}`] = {
      status: response.status(),
      headers: response.headers(),
      body: body.toString('base64'),
    };
  } catch {
    // 리다이렉트 등 본문이 없는 응답은 건너뛴다.
  }
});

for (const route of ROUTES) {
  await page.goto(`${ORIGIN}${route}`, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log(route, '→', new URL(page.url()).pathname);
}
const tokens = await page.evaluate(() => ({
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
}));
await browser.close();

fs.writeFileSync(new URL('./recordings.json', import.meta.url), JSON.stringify({ tokens, recordings }));
console.log('녹화', Object.keys(recordings).length, '건');
for (const key of Object.keys(recordings)) console.log(' ', recordings[key].status, key.replace(/https?:\/\/[^/]+/, ''));
console.log('토큰', tokens.accessToken ? '있음' : '없음');
