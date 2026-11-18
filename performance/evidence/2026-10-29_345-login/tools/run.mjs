// Lighthouse 13.5.0 · 모바일 · DevTools 제한(실제 속도 제한) · 4173/4174 번갈아
import fs from 'node:fs';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const BUILDS = { base: 'http://localhost:4173/', [process.env.B_NAME ?? 'nofont']: 'http://localhost:4174/' };
const ROUNDS = Number(process.argv[2] ?? 5);
const METHOD = process.argv[3] ?? 'devtools';
const OUT = new URL(`./runs/${process.env.B_NAME ?? 'nofont'}/`, import.meta.url);
fs.mkdirSync(OUT, { recursive: true });

const config = {
  extends: 'lighthouse:default',
  settings: { onlyCategories: ['performance'], throttlingMethod: METHOD, formFactor: 'mobile' },
};

const rows = [];
for (let i = 1; i <= ROUNDS; i++) {
  for (const [name, url] of Object.entries(BUILDS)) {
    const chrome = await chromeLauncher.launch({
      chromePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      chromeFlags: ['--headless=new', '--no-first-run'],
    });
    const result = await lighthouse(url, { port: chrome.port, output: 'json' }, config);
    await chrome.kill();
    const lhr = result.lhr;
    fs.writeFileSync(new URL(`${METHOD}-${name}-${i}.json`, OUT), result.report);
    const a = lhr.audits;
    const reqs = a['network-requests'].details.items;
    const font = reqs.find((r) => /Pretendard/.test(r.url));
    const js = reqs.find((r) => /\/assets\/index-[^/]+\.js$/.test(r.url));
    const span = (r) => (r ? `${Math.round(r.networkRequestTime)}→${Math.round(r.networkEndTime)}` : '-');
    const row = {
      round: i,
      build: name,
      score: Math.round(lhr.categories.performance.score * 100),
      fcp: Math.round(a['first-contentful-paint'].numericValue),
      lcp: Math.round(a['largest-contentful-paint'].numericValue),
      si: Math.round(a['speed-index'].numericValue),
      tbt: Math.round(a['total-blocking-time'].numericValue),
      entryJs: span(js),
      font: span(font),
    };
    rows.push(row);
    console.log(JSON.stringify(row));
  }
}
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
for (const name of Object.keys(BUILDS)) {
  const mine = rows.filter((r) => r.build === name);
  console.log(
    name,
    ['score', 'fcp', 'lcp', 'si', 'tbt'].map((k) => `${k} ${median(mine.map((r) => r[k]))}`).join(' · '),
  );
}
