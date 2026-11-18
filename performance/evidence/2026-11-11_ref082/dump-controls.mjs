// 화면마다 누를 수 있는 요소(버튼 · 링크 · 입력 · 탭)를 뽑아 INP 상호작용을 고르는 데 쓴다.
import { createRequire } from 'node:module';
import { STATE_SCREENS, openStateScreen } from './state-probe.mjs';
const require = createRequire(process.argv[2]);
const puppeteer = require('puppeteer');
const ROUTES = JSON.parse(require('node:fs').readFileSync('survey.json', 'utf8')).map((r) => ({ name: r.path, path: r.path }));
const b = await puppeteer.launch({ headless: true });
for (const s of [...ROUTES, ...STATE_SCREENS]) {
  const p = await b.newPage();
  await p.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
  await p.evaluateOnNewDocument(() => localStorage.setItem('hasSession', '1'));
  if (s.state || s.origin) await openStateScreen(p, s, { waitUntil: 'networkidle0' });
  else await p.goto('http://localhost:4194' + s.path, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 4000));
  const list = await p.evaluate(() =>
    [...document.querySelectorAll('button, a[href], input, textarea, select, [role=tab], [role=button]')]
      .filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.top < 915 && r.bottom > 0; })
      .map((e) => `${e.tagName.toLowerCase()}${e.getAttribute('role') ? '[' + e.getAttribute('role') + ']' : ''}:${(e.getAttribute('aria-label') || e.innerText || e.getAttribute('placeholder') || '').trim().replace(/\s+/g, ' ').slice(0, 24)}`)
      .filter((t) => !/^(a|button):(홈|학습|리그|마이페이지)$/.test(t)),
  );
  console.log(s.name, '|', list.join(' / '));
  await p.close();
}
await b.close();
