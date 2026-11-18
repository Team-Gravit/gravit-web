// 사용법: node measure.mjs <route> [runs=3] [mobile|desktop]
// before/after 를 번갈아 띄워 같은 시간대에 잰다. 매 회차 캐시만 지우고 로그인(localStorage)은 유지한다.
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE = new URL('./profile', import.meta.url).pathname.slice(1);
const REPO = 'C:\\Users\\jhe93\\Desktop\\project\\gravit-workspace\\gravit-harness-base';
const ORIGIN = 'http://localhost:5173';


const [route = '/main', runsArg = '3', form = 'mobile', buildsArg = 'before,after'] = process.argv.slice(2);
const BUILDS = buildsArg.split(',');
const runs = Number(runsArg);
const reportDir = new URL(`./reports/${route.replaceAll('/', '_') || 'root'}_${form}_${BUILDS.join('-vs-')}/`, import.meta.url).pathname.slice(1);
fs.mkdirSync(reportDir, { recursive: true });

const previewLog = fs.openSync(new URL('./preview.log', import.meta.url).pathname.slice(1), 'a');
function startPreview(build) {
  const server = spawn(
    'pnpm',
    ['--filter', '@repo/web', 'exec', 'vite', 'preview', '--outDir', `dist/${build}`, '--port', '5173', '--strictPort'],
    { cwd: REPO, shell: true, stdio: ['ignore', previewLog, previewLog] },
  );
  return server;
}

function stopPreview(server) {
  try {
    execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: 'ignore' });
  } catch {
    // 이미 종료된 프로세스는 무시한다.
  }
}

async function waitForServer(build) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      const html = await (await fetch('http://127.0.0.1:5173/')).text();
      const entry = html.match(/assets\/index-[^"]+\.js/)?.[0];
      if (entry) return entry;
    } catch {
      // 서버가 아직 안 떴다.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`${build} 서버가 뜨지 않았다`);
}

function pickMetrics(lhr) {
  const audit = (id) => lhr.audits[id];
  const lcpElement = audit('largest-contentful-paint-element')?.details?.items ?? [];
  const elementItem = lcpElement[0]?.items?.[0]?.node;
  const phases = lcpElement[1]?.items ?? [];
  return {
    lcp: Math.round(audit('largest-contentful-paint').numericValue),
    fcp: Math.round(audit('first-contentful-paint').numericValue),
    tbt: Math.round(audit('total-blocking-time').numericValue),
    cls: Number(audit('cumulative-layout-shift').numericValue.toFixed(3)),
    score: Math.round(lhr.categories.performance.score * 100),
    lcpElement: elementItem?.selector ?? elementItem?.nodeLabel ?? '?',
    phases: Object.fromEntries(phases.map((phase) => [phase.phase, Math.round(phase.timing)])),
    finalUrl: lhr.finalDisplayedUrl,
  };
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  userDataDir: PROFILE,
  headless: 'new',
  args: ['--no-first-run', '--no-default-browser-check'],
});

const results = Object.fromEntries(BUILDS.map((build) => [build, []]));
try {
  for (let run = 1; run <= runs; run += 1) {
    for (const build of BUILDS) {
      const server = startPreview(build);
      try {
        const entry = await waitForServer(build);
        const page = await browser.newPage();
        const session = await page.createCDPSession();
        await session.send('Network.clearBrowserCache');
        const flags = { output: 'json', onlyCategories: ['performance'], disableStorageReset: true, logLevel: 'error' };
        const config = form === 'desktop' ? desktopConfig : undefined;
        const runnerResult = await lighthouse(`${ORIGIN}${route}`, flags, config, page);
        const lhr = runnerResult.lhr;
        fs.writeFileSync(`${reportDir}${build}-${run}.json`, JSON.stringify(lhr));
        const metrics = { run, entry, ...pickMetrics(lhr) };
        // 로그아웃되면 로그인 화면을 재게 된다. 다른 화면을 잰 결과는 버리고 멈춘다.
        if (new URL(metrics.finalUrl).pathname !== route) {
          throw new Error(`${build} #${run}: ${route} 대신 ${metrics.finalUrl} 를 측정했다 — 로그인 상태를 확인한다`);
        }
        results[build].push(metrics);
        console.log(`${build} #${run}`, JSON.stringify(metrics));
        await page.close();
      } finally {
        stopPreview(server);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }
} finally {
  await browser.close();
}

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
for (const build of BUILDS) {
  const rows = results[build];
  console.log(
    `MEDIAN ${build}`,
    JSON.stringify({
      lcp: median(rows.map((row) => row.lcp)),
      fcp: median(rows.map((row) => row.fcp)),
      tbt: median(rows.map((row) => row.tbt)),
      cls: median(rows.map((row) => row.cls)),
      score: median(rows.map((row) => row.score)),
    }),
  );
}
fs.writeFileSync(`${reportDir}summary.json`, JSON.stringify(results, null, 2));





