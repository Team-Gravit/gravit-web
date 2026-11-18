// CLS 원인 확인용. 한 화면을 한 번 열고, 레이아웃 이동마다 움직인 요소의 이전 · 이후 위치와
// 주요 블록의 높이 변화를 시간 순으로 적는다. 지표 값은 diagnose.mjs가 기준이고 이건 원인 확인용이다.
// PROFILE=ios|mweb|desktop DELAY=600 node cls-probe.mjs <puppeteer node_modules/> <경로> [감시할 CSS 선택자,...]
import { createRequire } from 'node:module';

const require = createRequire(process.argv[2]);
const puppeteer = require('puppeteer');
const path = process.argv[3];
const watch = (process.argv[4] ?? 'main > *,footer,[data-slot]').split(',');
const ORIGIN = 'http://localhost:4195';
const STUB = 'http://localhost:4199';
const LTE = { offline: false, latency: 40, downloadThroughput: 20e6 / 8, uploadThroughput: 5e6 / 8 };
const PROFILES = {
  ios: { viewport: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, cpu: 1.5, network: LTE, native: true,
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 GravitNative/1.0.0' },
  mweb: { viewport: { width: 412, height: 915, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true }, cpu: 4, network: LTE },
  desktop: { viewport: { width: 1440, height: 900, deviceScaleFactor: 1 }, cpu: 2, network: { offline: false, latency: 20, downloadThroughput: 50e6 / 8, uploadThroughput: 10e6 / 8 } },
};
const profile = PROFILES[process.env.PROFILE ?? 'mweb'];

await fetch(`${STUB}/__control?onboarded=true&delay=${process.env.DELAY ?? 0}`);
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport(profile.viewport);
if (profile.ua) await page.setUserAgent(profile.ua);
// REDUCED=1 이면 동작 줄이기를 켜 스켈레톤 반짝임(wave)을 끈다. 반짝임이 점수에 섞이는지 비교용
if (process.env.REDUCED) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.evaluateOnNewDocument((isNative, selectors) => {
  if (isNative) {
    localStorage.setItem('accessToken', 'stub-access');
    localStorage.setItem('refreshToken', 'stub-refresh');
  } else {
    localStorage.setItem('hasSession', '1');
  }
  const t0 = performance.now();
  window.__log = [];
  const name = (n) => {
    if (!n || n.nodeType !== 1) return String(n?.nodeName ?? n);
    const slot = n.getAttribute('data-slot');
    const text = (n.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 24);
    return `${n.tagName.toLowerCase()}${slot ? `[${slot}]` : ''}.${[...n.classList].slice(0, 3).join('.')} "${text}"`;
  };
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      window.__log.push({ t: Math.round(e.startTime), kind: 'shift', value: +e.value.toFixed(4), input: e.hadRecentInput,
        sources: e.sources.map((s) => ({ node: name(s.node), from: `y${Math.round(s.previousRect.y)} h${Math.round(s.previousRect.height)}`, to: `y${Math.round(s.currentRect.y)} h${Math.round(s.currentRect.height)}` })) });
    }
  }).observe({ type: 'layout-shift', buffered: true });
  const last = new Map();
  const tick = () => {
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const key = `${sel}#${i} ${name(el)}`.slice(0, 90);
        const v = `y${Math.round(r.y)} h${Math.round(r.height)}`;
        if (last.get(`${sel}#${i}`) !== v) {
          last.set(`${sel}#${i}`, v);
          window.__log.push({ t: Math.round(performance.now() - t0), kind: 'box', key, v });
        }
      });
    }
    if (performance.now() - t0 < 6000) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}, !!profile.native, watch);
const cdp = await page.createCDPSession();
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
await cdp.send('Network.emulateNetworkConditions', profile.network);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: profile.cpu });
await page.goto(ORIGIN + path, { waitUntil: 'load' });
await new Promise((r) => setTimeout(r, 6000));
const log = await page.evaluate(() => window.__log);
const total = log.filter((e) => e.kind === 'shift' && !e.input).reduce((a, e) => a + e.value, 0);
for (const e of log.sort((a, b) => a.t - b.t)) {
  if (e.kind === 'shift') {
    console.log(`${e.t}ms SHIFT ${e.value}`);
    for (const s of e.sources) console.log(`    ${s.node}  ${s.from} -> ${s.to}`);
  } else {
    console.log(`${e.t}ms box ${e.key}  ${e.v}`);
  }
}
console.log(`CLS 합 ${total.toFixed(3)}`);
await browser.close();
await fetch(`${STUB}/__control?delay=0`);
