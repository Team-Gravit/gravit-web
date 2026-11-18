// 로그인 화면 데스크톱 기준선 · Lighthouse 데스크톱 프리셋
import fs from 'node:fs';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import * as chromeLauncher from 'chrome-launcher';

const URLS = { base: 'http://localhost:4173/', login: 'http://localhost:4174/' };
const ROUNDS = Number(process.argv[2] ?? 3);
const METHOD = process.argv[3] ?? 'devtools';
fs.mkdirSync(new URL('./runs/desktop/', import.meta.url), { recursive: true });
const config = { ...desktopConfig, settings: { ...desktopConfig.settings, onlyCategories: ['performance'], throttlingMethod: METHOD } };
const rows = [];
for (let i = 1; i <= ROUNDS; i++) {
  for (const [name, url] of Object.entries(URLS)) {
    const chrome = await chromeLauncher.launch({ chromePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', chromeFlags: ['--headless=new'] });
    const { lhr, report } = await lighthouse(url, { port: chrome.port, output: 'json' }, config);
    await chrome.kill();
    fs.writeFileSync(new URL(`./runs/desktop/${METHOD}-${name}-${i}.json`, import.meta.url), report);
    const a = lhr.audits;
    const lcpEl = a['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.snippet ?? '';
    const reqs = a['network-requests'].details.items;
    const big = reqs.filter((r) => /\.(webp|png|jpg|avif|svg|woff2)$/.test(r.url)).map((r) => `${r.url.split('/').pop()} ${Math.round(r.transferSize / 1024)}KiB ${Math.round(r.networkRequestTime)}→${Math.round(r.networkEndTime)}`);
    const row = { round: i, build: name, score: Math.round(lhr.categories.performance.score * 100), fcp: Math.round(a['first-contentful-paint'].numericValue), lcp: Math.round(a['largest-contentful-paint'].numericValue), si: Math.round(a['speed-index'].numericValue), tbt: Math.round(a['total-blocking-time'].numericValue), lcpEl: lcpEl.slice(0, 90) };
    rows.push(row);
    console.log(JSON.stringify(row));
    if (i === 1) console.log('  assets:', big.join(' | '));
  }
}
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
for (const name of Object.keys(URLS)) {
  const mine = rows.filter((r) => r.build === name);
  console.log(name, ['score', 'fcp', 'lcp', 'si', 'tbt'].map((k) => `${k} ${median(mine.map((r) => r[k]))}`).join(' · '));
}
