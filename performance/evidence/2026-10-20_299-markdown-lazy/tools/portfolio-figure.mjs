// 포트폴리오 그림: 왼쪽 첫 번들 구성(빌드 산출물 바이트), 오른쪽 LCP 전후(녹화 재생 5회 중앙값)
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const OUT = 'C:/Users/jhe93/Desktop/project/gravit-workspace/gravit-harness-base/performance/evidence/2026-10-20_299-markdown-lazy/images';
const kb = (bytes) => bytes / 1000;
// build-sizes.md: before index 861,141 B / final index 629,881 B + markdown 청크 (차이만큼)
const BEFORE = kb(861141);
const AFTER = kb(629881);
const MARKDOWN = BEFORE - AFTER;
const LCP = [
  { label: '메인', before: 4.50, after: 3.95, noise: 0.00 },
  { label: '개념 노트', before: 7.42, after: 7.04, noise: 0.09 },
  { label: '학습 홈', before: 5.49, after: 5.57, noise: 0.19 },
];
const C = { gray: '#b9b7b0', orange: '#eb6834', blue: '#2a78d6', ink: '#1f1e1c', sub: '#5f5d58', grid: '#e8e7e3' };

// 왼쪽 패널
const LW = 236; const bx = (v) => 8 + (v / 900) * (LW - 16);
const bundleRow = (y, label, parts) => {
  let x = bx(0); let svg = `<text x="0" y="${y - 6}" class="lab">${label}</text>`;
  parts.forEach(([value, color], index) => {
    const w = bx(value) - bx(0) - (index < parts.length - 1 ? 2 : 0);
    svg += `<rect x="${x}" y="${y}" width="${w}" height="18" rx="3" fill="${color}"/>`;
    x += w + 2;
  });
  return svg;
};
let left = bundleRow(28, '이전 · 첫 번들 861KB', [[AFTER, C.gray], [MARKDOWN, C.orange]]);
left += bundleRow(78, '이후 · 첫 번들 630KB (−27%)', [[AFTER, C.gray]]);
left += `<rect x="${bx(0)}" y="104" width="${bx(MARKDOWN) - bx(0)}" height="12" rx="3" fill="none" stroke="${C.orange}" stroke-width="1.5" stroke-dasharray="3 2"/>`;
left += `<text x="${bx(MARKDOWN) + 6}" y="113" class="note">마크다운 231KB → 퀴즈·개념 노트에서만</text>`;

// 오른쪽 패널
const RW = 252; const LX = 52; const lx = (s) => LX + (s / 8) * (RW - LX - 44);
let right = '';
for (let t = 0; t <= 8; t += 4) right += `<line x1="${lx(t)}" x2="${lx(t)}" y1="6" y2="128" stroke="${C.grid}"/><text x="${lx(t)}" y="140" text-anchor="middle" class="axis">${t}초</text>`;
LCP.forEach((row, i) => {
  const y = 10 + i * 40;
  right += `<text x="${LX - 6}" y="${y + 16}" text-anchor="end" class="lab">${row.label}</text>`;
  right += `<rect x="${lx(0)}" y="${y}" width="${lx(row.before) - lx(0)}" height="11" rx="2" fill="${C.gray}"/>`;
  right += `<rect x="${lx(0)}" y="${y + 13}" width="${lx(row.after) - lx(0)}" height="11" rx="2" fill="${C.blue}"/>`;
  const delta = row.after - row.before; const strong = Math.abs(delta) > row.noise;
  right += `<text x="${lx(Math.max(row.before, row.after)) + 4}" y="${y + 17}" class="${strong ? 'delta' : 'delta muted'}">${delta > 0 ? '+' : '−'}${Math.abs(delta).toFixed(2)}초</text>`;
});

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body { margin: 0; background: #fff; font-family: 'Pretendard', 'Malgun Gothic', sans-serif; }
  .fig { width: 516px; display: flex; gap: 28px; padding: 0; }
  .panel h3 { font-size: 10.5px; margin: 0 0 2px; color: ${C.ink}; font-weight: 700; }
  .panel p { font-size: 8.5px; margin: 0 0 8px; color: ${C.sub}; }
  .legend { display: flex; gap: 10px; font-size: 8.5px; color: ${C.sub}; margin-top: 4px; }
  .legend span::before { content: ''; display: inline-block; width: 8px; height: 8px; border-radius: 2px; margin-right: 4px; vertical-align: -1px; background: var(--c); }
  .lab { font-size: 9px; fill: ${C.ink}; } .note { font-size: 8.5px; fill: ${C.sub}; } .axis { font-size: 8px; fill: ${C.sub}; }
  .delta { font-size: 9px; font-weight: 700; fill: ${C.ink}; } .delta.muted { font-weight: 400; fill: #9a9893; }
</style></head><body><div class="fig">
  <div class="panel" style="width:${LW}px"><h3>첫 번들 구성</h3><p>vite build 산출물 크기</p>
    <svg width="${LW}" height="124">${left}</svg>
    <div class="legend"><span style="--c:${C.gray}">그 외 코드</span><span style="--c:${C.orange}">마크다운 렌더링</span></div></div>
  <div class="panel" style="width:${RW}px"><h3>LCP 전후</h3><p>모바일 · CPU 4배 · Fast 4G · 5회 중앙값</p>
    <svg width="${RW}" height="146">${right}</svg>
    <div class="legend"><span style="--c:${C.gray}">이전</span><span style="--c:${C.blue}">이후</span><span style="--c:#ffffff00">회색 숫자 = 측정 흔들림 안</span></div></div>
</div></body></html>`;
fs.writeFileSync(`${OUT}/portfolio-figure.html`, html);
const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 540, height: 300, deviceScaleFactor: 3 });
await page.setContent(html);
await (await page.$('.fig')).screenshot({ path: `${OUT}/portfolio-figure.png` });
await browser.close();
console.log('markdown KB', MARKDOWN.toFixed(1));

