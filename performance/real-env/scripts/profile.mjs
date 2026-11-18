// 첫 화면 전 긴 작업(>250ms) 안에서 메인 스레드가 무엇을 했는지 쪼갠다. 조건은 diagnose.mjs MODE=load와 같다.
// 이벤트별 자기 시간(self time)과, 스크립트 실행은 파일별로 합친다.
// node profile.mjs <puppeteer node_modules/> <경로> [모바일|desktop]
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';

const require = createRequire(process.argv[2]);
const puppeteer = require('puppeteer');
const PATH = process.argv[3] ?? '/main';
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 412, height: 915, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true });
const cdp = await page.createCDPSession();
await cdp.send('Network.enable');
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 60, downloadThroughput: 9e6 / 8, uploadThroughput: 1.5e6 / 8 });
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await page.evaluateOnNewDocument(() => localStorage.setItem('hasSession', '1'));
await page.tracing.start({ categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'v8.execute', 'blink.user_timing', 'loading'] });
await page.goto(`http://localhost:4195${PATH}`, { waitUntil: 'load', timeout: 120000 });
await new Promise((r) => setTimeout(r, 6000));
const trace = JSON.parse(Buffer.from(await page.tracing.stop()).toString('utf8'));
await browser.close();

const events = trace.traceEvents;
const navStart = events.find((e) => e.name === 'navigationStart' && e.args?.data?.isLoadingMainFrame)?.ts
  ?? events.find((e) => e.name === 'navigationStart').ts;
const fcp = events.find((e) => e.name === 'firstContentfulPaint');
const mainTid = events.find((e) => e.name === 'thread_name' && e.args?.name === 'CrRendererMain' && events.some((x) => x.tid === e.tid && x.name === 'RunTask'))?.tid;
const onMain = events.filter((e) => e.tid === mainTid && e.ph === 'X' && e.dur);
const tasks = onMain.filter((e) => e.name === 'RunTask' && e.dur > 250_000).sort((a, b) => a.ts - b.ts);

const ms = (us) => Math.round(us / 1000);
const label = (e) => {
  if (e.name === 'FunctionCall' || e.name === 'EvaluateScript' || e.name === 'v8.compile' || e.name === 'v8.evaluateModule') {
    const url = e.args?.data?.url ?? e.args?.data?.fileName ?? '';
    return `${e.name} ${url.split('/').pop() || '(inline)'}`;
  }
  return e.name;
};

const report = [`${PATH}  FCP ${fcp ? ms(fcp.ts - navStart) : '-'}ms`];
for (const task of tasks) {
  const inside = onMain.filter((e) => e !== task && e.ts >= task.ts && e.ts + e.dur <= task.ts + task.dur).sort((a, b) => a.ts - b.ts || b.dur - a.dur);
  // 자기 시간 = 자기 길이 − 바로 아래 자식들 길이
  const self = new Map();
  const stack = [];
  for (const e of inside) {
    while (stack.length && stack.at(-1).ts + stack.at(-1).dur <= e.ts) stack.pop();
    const parent = stack.at(-1);
    if (parent) self.set(parent, (self.get(parent) ?? parent.dur) - e.dur);
    if (!self.has(e)) self.set(e, e.dur);
    stack.push(e);
  }
  const byLabel = new Map();
  for (const [e, t] of self) byLabel.set(label(e), (byLabel.get(label(e)) ?? 0) + t);
  const top = [...byLabel].sort((a, b) => b[1] - a[1]).slice(0, 8).filter(([, t]) => t > 10_000);
  report.push(`긴 작업 ${ms(task.ts - navStart)} +${ms(task.dur)}ms`);
  for (const [name, t] of top) report.push(`   ${String(ms(t)).padStart(5)}ms  ${name}`);
}
console.log(report.join('\n'));
writeFileSync(`profile${PATH.replace(/\//g, '_')}.txt`, report.join('\n'));
