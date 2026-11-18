// warm 열기에서 /assets 파일이 디스크 캐시로 끝났는지(200 fromDiskCache), 서버에 재검증했는지(304)를 CDP 이벤트로 본다.
// node revalidate-probe.mjs <puppeteer node_modules/> [/learning]
import { createRequire } from 'node:module';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(process.argv[2]);
const puppeteer = require('puppeteer');
const PATH = process.argv[3] ?? '/learning';
const ORIGIN = 'https://gravit.inuappcenter.kr';
const STUB = 'http://localhost:4199';

async function open(dir, label) {
  const browser = await puppeteer.launch({ headless: true, userDataDir: dir });
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true });
  const cdp = await page.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Fetch.enable', { patterns: [{ urlPattern: 'https://grav-it.inuappcenter.kr/*' }] });
  cdp.on('Fetch.requestPaused', async ({ requestId, request }) => {
    const cors = [
      { name: 'access-control-allow-origin', value: ORIGIN },
      { name: 'access-control-allow-credentials', value: 'true' },
      { name: 'access-control-allow-headers', value: 'authorization, content-type' },
    ];
    if (request.method === 'OPTIONS') {
      return cdp.send('Fetch.fulfillRequest', { requestId, responseCode: 204, responseHeaders: cors });
    }
    const res = await fetch(`${STUB}${new URL(request.url).pathname}`, { method: request.method === 'GET' ? 'GET' : 'POST' });
    const body = Buffer.from(await res.arrayBuffer()).toString('base64');
    return cdp.send('Fetch.fulfillRequest', { requestId, responseCode: res.status, responseHeaders: [...cors, { name: 'content-type', value: 'application/json' }], body });
  });
  const rows = [];
  cdp.on('Network.responseReceived', ({ response, type }) => {
    if (!response.url.includes('/assets/') && !response.url.endsWith('.kr/')) return;
    const h = Object.fromEntries(Object.entries(response.headers).map(([k, v]) => [k.toLowerCase(), v]));
    rows.push({
      file: response.url.split('/').pop() || '(index.html)',
      type,
      status: response.status,
      disk: response.fromDiskCache,
      age: h.age ?? '-',
      cc: h['cache-control'] ?? '-',
    });
  });
  await page.evaluateOnNewDocument(() => localStorage.setItem('hasSession', '1'));
  await page.goto(`${ORIGIN}${PATH}`, { waitUntil: 'load' });
  await new Promise((r) => setTimeout(r, 4000));
  await browser.close();
  console.log(`\n== ${label}`);
  for (const r of rows) {
    if (r.type === 'Image' || r.type === 'Document' || r.file.startsWith('index-')) {
      console.log(`${String(r.status).padEnd(4)} disk=${String(r.disk).padEnd(5)} age=${String(r.age).padEnd(6)} ${r.type.padEnd(9)} ${r.file}`);
    }
  }
}

const dir = mkdtempSync(join(tmpdir(), 'reval-'));
try {
  await open(dir, 'cold');
  await open(dir, 'warm (바로 다시 열기)');
} finally {
  rmSync(dir, { recursive: true, force: true });
}
