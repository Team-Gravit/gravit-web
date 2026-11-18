// PR 본문용 이미지: LCP 비교 차트 + 번들 지도 전후 화면
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const EVIDENCE = 'C:/Users/jhe93/Desktop/project/gravit-workspace/gravit-harness-base/performance/evidence';
const OUT = `${EVIDENCE}/2026-10-20_299-markdown-lazy/images`;
fs.mkdirSync(OUT, { recursive: true });

const results = JSON.parse(fs.readFileSync(`${EVIDENCE}/2026-10-20_299-markdown-lazy/replay/2026-10-20_final-commit_before-final-final-repeat.json`, 'utf8'));
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const PAGES = [
  { route: '/main', label: '메인 /main' },
  { route: '/learning/units/11/concept-note', label: '개념 노트' },
  { route: '/learning', label: '학습 홈 /learning' },
];
const rows = PAGES.map(({ route, label }) => {
  const lcp = (build) => median(results[`${route} ${build}`].map((run) => run.lcp)) / 1000;
  const before = lcp('before');
  const final = lcp('final');
  const noise = Math.abs(final - lcp('final-repeat'));
  return { label, before, final, noise };
});

const WIDTH = 760;
const LEFT = 150;
const RIGHT = 120;
const BAR = 18;
const GROUP = 78;
const TOP = 64;
const max = 8;
const x = (seconds) => LEFT + (seconds / max) * (WIDTH - LEFT - RIGHT);
const height = TOP + rows.length * GROUP + 40;

let svg = '';
for (let tick = 0; tick <= max; tick += 2) {
  svg += `<line x1="${x(tick)}" x2="${x(tick)}" y1="${TOP - 8}" y2="${height - 34}" stroke="#e4e3df" stroke-width="1"/>`;
  svg += `<text x="${x(tick)}" y="${height - 16}" text-anchor="middle" class="axis">${tick}s</text>`;
}
rows.forEach((row, index) => {
  const y = TOP + index * GROUP;
  const delta = row.final - row.before;
  const isMeaningful = Math.abs(delta) > row.noise;
  svg += `<text x="${LEFT - 14}" y="${y + BAR + 2}" text-anchor="end" class="label">${row.label}</text>`;
  [['before', row.before, '#2a78d6', 0], ['final', row.final, '#eb6834', BAR + 2]].forEach(([, value, color, offset]) => {
    const barEnd = x(value);
    svg += `<path d="M${LEFT},${y + offset} H${barEnd - 4} Q${barEnd},${y + offset} ${barEnd},${y + offset + 4} V${y + offset + BAR - 4} Q${barEnd},${y + offset + BAR} ${barEnd - 4},${y + offset + BAR} H${LEFT} Z" fill="${color}"/>`;
    svg += `<text x="${barEnd + 6}" y="${y + offset + BAR - 4}" class="value">${value.toFixed(2)}s</text>`;
  });
  const deltaText = `${delta > 0 ? '+' : '−'}${Math.abs(delta).toFixed(2)}s`;
  svg += `<text x="${WIDTH - 8}" y="${y + BAR + 2}" text-anchor="end" class="${isMeaningful ? 'delta' : 'delta muted'}">${deltaText}</text>`;
  svg += `<text x="${WIDTH - 8}" y="${y + BAR + 18}" text-anchor="end" class="note">흔들림 ${row.noise.toFixed(2)}s</text>`;
});

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body { margin: 0; background: #fcfcfb; font-family: 'Pretendard', 'Malgun Gothic', sans-serif; color: #0b0b0b; }
  .wrap { padding: 20px 24px 12px; width: ${WIDTH}px; }
  h1 { font-size: 17px; margin: 0 0 4px; font-weight: 700; }
  p { font-size: 12.5px; color: #52514e; margin: 0 0 10px; }
  .legend { display: flex; gap: 16px; font-size: 12.5px; color: #52514e; margin-bottom: 4px; }
  .legend span::before { content: ''; display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 6px; vertical-align: -1px; background: var(--c); }
  .label { font-size: 13px; fill: #0b0b0b; } .value { font-size: 12px; fill: #52514e; }
  .axis { font-size: 11px; fill: #52514e; } .delta { font-size: 13px; font-weight: 700; fill: #0b0b0b; }
  .delta.muted { fill: #8a8984; font-weight: 400; } .note { font-size: 11px; fill: #8a8984; }
</style></head><body><div class="wrap">
  <h1>LCP 비교 — 마크다운 지연 로딩 전후</h1>
  <p>모바일 412×823 · CPU 4x · Fast 4G · API 녹화 응답 재생 · 5회 중앙값. 「흔들림」은 같은 빌드를 한 번 더 잰 차이.</p>
  <div class="legend"><span style="--c:#2a78d6">before (e4964c21)</span><span style="--c:#eb6834">after (42399732)</span></div>
  <svg width="${WIDTH}" height="${height}" role="img" aria-label="LCP 비교">${svg}</svg>
</div></body></html>`;
fs.writeFileSync(`${OUT}/lcp-comparison.html`, html);

const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: WIDTH + 48, height: height + 140, deviceScaleFactor: 2 });
await page.setContent(html);
await (await page.$('.wrap')).screenshot({ path: `${OUT}/lcp-comparison.png` });

for (const [file, name] of [['2026-10-18_bundle_visualizer_after.html', 'bundle-before.png'], ['2026-10-18_bundle_visualizer_lazy-markdown.html', 'bundle-after.png']]) {
  await page.setViewport({ width: 1400, height: 860, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.join(EVIDENCE, file)).href, { waitUntil: 'load' });
  await new Promise((resolve) => setTimeout(resolve, 1500));
  await page.screenshot({ path: `${OUT}/${name}` });
}
await browser.close();
console.log(rows.map((row) => `${row.label}: ${row.before.toFixed(2)} → ${row.final.toFixed(2)} (흔들림 ${row.noise.toFixed(2)})`).join('\n'));
console.log(fs.readdirSync(OUT).join(', '));
