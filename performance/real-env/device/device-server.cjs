// iPhone 실기기 확인용 서버. 앱 코드를 고치지 않고, 빌드 결과(index.html)에 측정 스크립트만 끼워 넣는다.
// - /api/* 는 스텁(4199)으로 넘긴다. 빌드는 VITE_API_BASE_URL=http://<맥 IP>:4310 으로 만든다
// - 모든 응답에 no-store를 붙여 매번 새로 받는다 (iPhone Safari는 캐시를 끌 수 없다)
// - /__start 를 열면 화면 × 회수를 차례로 돌고, 결과를 results.jsonl 에 적는다
// node device-server.cjs <dist 폴더> <기기 이름표>
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const DIST = process.argv[2];
const PORT = 4310;
const OUT = path.join(__dirname, 'results.jsonl');
const SCREENS = [
  // ready: 화면 내용이 다 그려졌다고 볼 글자 · click: 상호작용으로 누를 버튼 글자 (diagnose.mjs와 같은 대상)
  { id: 'main', path: '/main', ready: '전체 학습화면 보기', click: '전체 학습화면 보기' },
  { id: 'learning', path: '/learning', ready: '자료구조 학습하기', click: '자료구조 학습하기' },
  { id: 'lesson', path: '/learning/lessons/1', ready: '보기 1', click: '보기 1' },
];
const RUNS = 5;
const TYPES = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html; charset=utf-8', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json' };

// 앱 스크립트보다 먼저 실행된다. 지표는 Safari 18에서도 되는 것만 쓴다 (FCP · 직접 잰 준비 시간 · 클릭 후 다음 그리기까지).
const probe = (label) => `<script>
(() => {
  const q = new URLSearchParams(location.search);
  if (!q.has('bench')) return;
  localStorage.setItem('hasSession', '1');
  const plan = JSON.parse(q.get('bench'));
  // Safari 26부터 LCP를 낸다. 지원하지 않으면 null로 남는다.
  let lcp = null;
  let lcpElement = null;
  try {
    new PerformanceObserver((list) => {
      const e = list.getEntries().at(-1);
      lcp = e.startTime;
      lcpElement = e.element ? e.element.tagName.toLowerCase() + ' ' + (e.url || '').split('/').pop() : e.url;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {}
  const findButton = (text) => [...document.querySelectorAll('button, a, [role=button]')]
    .find((e) => (e.getAttribute('aria-label') || e.innerText || '').replace(/\\s+/g, ' ').includes(text));
  const nextFrame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
  const waitFor = (fn, ms = 20000) => new Promise((resolve) => {
    const t0 = performance.now();
    const tick = () => { const v = fn(); if (v || performance.now() - t0 > ms) return resolve(v); requestAnimationFrame(tick); };
    tick();
  });
  window.addEventListener('load', async () => {
    const target = await waitFor(() => findButton(plan.ready));
    const readyAt = performance.now();
    // 화면 안 이미지가 다 받아질 때까지 (LCP 근사)
    await waitFor(() => [...document.images].every((i) => i.complete), 10000);
    const imagesAt = performance.now();
    await new Promise((r) => setTimeout(r, 1500));
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null;
    let interaction = null;
    const button = findButton(plan.click);
    if (button) {
      const t0 = performance.now();
      button.click();
      await nextFrame();
      interaction = performance.now() - t0;
    }
    const nav = performance.getEntriesByType('navigation')[0];
    const result = { label: ${JSON.stringify(label)}, ua: navigator.userAgent, screen: plan.id, run: plan.run,
      fcp, lcp, lcpElement, ready: target ? readyAt : null, images: imagesAt, interaction, ttfb: nav?.responseStart ?? null };
    await fetch('/__result', { method: 'POST', body: JSON.stringify(result) });
    location.href = '/__next?' + new URLSearchParams({ i: String(plan.i + 1), label: ${JSON.stringify(label)} });
  });
})();
</script>`;

function planAt(i) {
  const total = SCREENS.length * RUNS;
  if (i >= total) return null;
  const s = SCREENS[Math.floor(i / RUNS)];
  return { ...s, run: (i % RUNS) + 1, i };
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  res.setHeader('cache-control', 'no-store');
  if (url.pathname.startsWith('/api/')) {
    const upstream = http.request({ host: '127.0.0.1', port: 4199, path: req.url, method: req.method, headers: req.headers }, (up) => {
      res.writeHead(up.statusCode, { ...up.headers, 'cache-control': 'no-store' });
      up.pipe(res);
    });
    req.pipe(upstream);
    return;
  }
  if (url.pathname === '/__result') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => { fs.appendFileSync(OUT, body + '\n'); console.log(body); res.end('ok'); });
    return;
  }
  if (url.pathname === '/__start' || url.pathname === '/__next') {
    const i = Number(url.searchParams.get('i') ?? 0);
    const label = url.searchParams.get('label') ?? process.argv[3] ?? 'device';
    const plan = planAt(i);
    if (!plan) { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end('<h1>끝났습니다</h1>'); }
    // 화면 사이에 빈 페이지를 한 번 거쳐 이전 화면의 일이 섞이지 않게 한다.
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return res.end(`<p>${plan.i + 1} / ${SCREENS.length * RUNS}</p><script>setTimeout(() => location.href = ${JSON.stringify(plan.path)} + '?bench=' + encodeURIComponent(${JSON.stringify(JSON.stringify(plan))}), 1500)</script>`);
  }
  let file = path.join(DIST, decodeURIComponent(url.pathname));
  if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, 'index.html');
  const ext = path.extname(file);
  let content = fs.readFileSync(file);
  if (ext === '.html') {
    const label = url.searchParams.get('label') ?? process.argv[3] ?? 'device';
    content = content.toString().replace('<head>', '<head>' + probe(label));
  }
  res.writeHead(200, { 'content-type': TYPES[ext] ?? 'application/octet-stream' });
  res.end(content);
}).listen(PORT, '0.0.0.0', () => console.log(`device server ${PORT}`));
