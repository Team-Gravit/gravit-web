// 앱 안 이동(탭 클릭) 뒤 레이아웃 이동을 잰다. 새로고침 CLS는 첫 로드만 보므로, 탭을 눌러 들어가는 경우를 따로 본다.
// 클릭 후 500ms 안의 이동은 hadRecentInput=true라 CLS에서 빠진다. 둘 다 기록해 '점수에 들어가는 이동'과 '눈에 보이는 이동'을 나눈다.
// 조건: 캐시 끔 · Fast 4G 근사 · CPU 4배. DELAY=ms로 스텁 응답 지연. RUNS=5
// node cls-nav.mjs <puppeteer node_modules/>
import { createRequire } from 'node:module';

const require = createRequire(process.argv[2]);
const puppeteer = require('puppeteer');
const RUNS = Number(process.env.RUNS ?? 3);
const ONLY = process.env.FLOWS?.split(',');
const DELAY = Number(process.env.DELAY ?? 0);

// 화면마다 실제 사용자가 들어오는 링크 하나. 레슨 결과 · 온보딩 2개는 제출을 거쳐야 해서 새로고침 측정만 한다.
// 친구 검색은 들어오는 링크를 찾지 못해 새로고침 측정만 한다.
const FLOWS = [
  { id: '메인→학습', start: '/main', click: 'a[href="/learning"]' },
  { id: '메인→리그', start: '/main', click: 'a[href="/league"]' },
  { id: '메인→마이', start: '/main', click: 'a[href="/my"], a[href="/my/summary"]' },
  { id: '메인→알림', start: '/main', click: 'a[href="/notifications"]' },
  { id: '학습→챕터', start: '/learning', click: 'a[href="/learning/chapters/1"]' },
  { id: '챕터→유닛', start: '/learning/chapters/1', click: 'a[href="/learning/units/1"]' },
  { id: '유닛→개념노트', start: '/learning/units/1', click: 'a[href="/learning/units/1/concept-note"]' },
  { id: '유닛→레슨', start: '/learning/units/1', click: 'a[href="/learning/lessons/1"]' },
  { id: '유닛→북마크', start: '/learning/units/1', click: 'a[href="/learning/units/1/bookmarked-problems"]' },
  { id: '유닛→오답', start: '/learning/units/1', click: 'a[href="/learning/units/1/incorrect-problems"]' },
  { id: 'my 요약→학습', start: '/my/summary', click: 'a[href="/my/learning"]' },
  { id: 'my 학습→리그', start: '/my/learning', click: 'a[href="/my/league"]' },
  { id: 'my 리그→소셜', start: '/my/league', click: 'a[href="/my/social"]' },
  { id: 'my 소셜→요약', start: '/my/social', click: 'a[href="/my/summary"]' },
  { id: 'my→프로필 편집', start: '/my/summary', text: '프로필 편집' },
  { id: 'my 소셜→친구', start: '/my/social', text: '12 팔로우' },
  { id: 'my→설정', start: '/my/summary', click: 'a[href="/settings"]' },
  { id: '설정→공지', start: '/settings', click: 'a[href="/settings/notice"]' },
  { id: '공지→상세', start: '/settings/notice', click: 'a[href="/settings/notice/1"]' },
  { id: '설정→문의', start: '/settings', click: 'a[href="/settings/inquiry"]' },
  { id: '문의 내역→작성', start: '/settings/inquiry', click: 'a[href="/settings/inquiry/new"]' },
];

const browser = await puppeteer.launch({ headless: true });
await fetch(`http://localhost:4199/__control?delay=${DELAY}`);
for (const flow of FLOWS.filter((f) => !ONLY || ONLY.includes(f.id))) {
  const rows = [];
  for (let i = 0; i < RUNS; i++) {
    const ctx = await browser.createBrowserContext();
    const page = await ctx.newPage();
    await page.setViewport({ width: 412, height: 915, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true });
    const cdp = await page.createCDPSession();
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 60, downloadThroughput: 9e6 / 8, uploadThroughput: 1.5e6 / 8 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('hasSession', '1');
      window.__shifts = [];
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          const node = e.sources?.[0]?.node;
          const text = node?.innerText?.trim().replace(/\s+/g, ' ').slice(0, 24) ?? '';
          window.__shifts.push({ t: e.startTime, v: e.value, input: e.hadRecentInput, who: node?.tagName ? `${node.tagName.toLowerCase()} "${text}"` : '?' });
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto(`http://localhost:4195${flow.start}`, { waitUntil: 'load', timeout: 120000 });
    await page.waitForNetworkIdle({ idleTime: 1500, timeout: 60000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1500));
    // 모바일에서는 데스크톱 헤더 링크가 숨어 있어 첫 일치 요소를 누를 수 없다. 화면에 보이는 것만 고른다.
    const target = (
      await page.evaluateHandle(
        ({ selector, text }) => {
          const isVisible = (e) => {
            const rect = e.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && getComputedStyle(e).visibility !== 'hidden';
          };
          const candidates = text
            ? [...document.querySelectorAll('button, a')].filter((e) => e.innerText.replace(/\s+/g, ' ').includes(text))
            : [...document.querySelectorAll(selector)];
          return candidates.find(isVisible) ?? null;
        },
        { selector: flow.click ?? '', text: flow.text },
      )
    ).asElement();
    if (!target) {
      rows.push('대상 없음');
      await ctx.close();
      continue;
    }
    const clickAt = await page.evaluate(() => performance.now());
    try {
      await target.click();
    } catch (error) {
      rows.push(`클릭 실패 ${error.message}`);
      await ctx.close();
      continue;
    }
    await new Promise((r) => setTimeout(r, 6000));
    const shifts = await page.evaluate((from) => window.__shifts.filter((s) => s.t >= from), clickAt);
    const counted = shifts.filter((s) => !s.input).reduce((sum, s) => sum + s.v, 0);
    const visible = shifts.reduce((sum, s) => sum + s.v, 0);
    const worst = shifts.sort((a, b) => b.v - a.v)[0];
    const landed = new URL(page.url()).pathname;
    rows.push(`→ ${landed} | 점수 ${counted.toFixed(3)} · 전체 ${visible.toFixed(3)}${worst ? ` · 최대 ${worst.v.toFixed(3)} +${Math.round(worst.t - clickAt)}ms ${worst.input ? '(입력직후)' : ''} ${worst.who}` : ''}`);
    await ctx.close();
  }
  console.log(`${flow.id} [지연 ${DELAY}ms]`);
  for (const r of rows) console.log('   ', r);
}
await fetch('http://localhost:4199/__control?delay=0');
// 브라우저 종료가 멈춘 적이 있어(18:43~20:20) 10초 뒤 강제로 끝낸다.
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 10000))]);
process.exit(0);
