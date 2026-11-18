// 포트폴리오 그림 페이지: ① import 경로 ② 번들 지도 전후 ③ 측정 설계 — 문서 폭 516px, 3배 해상도
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const OUT = 'C:/Users/jhe93/Desktop/project/gravit-workspace/gravit-harness-base/performance/evidence/2026-10-20_299-markdown-lazy/images';
const img = (name) => `data:image/png;base64,${fs.readFileSync(`${OUT}/${name}`).toString('base64')}`;
const C = { ink: '#1f1e1c', sub: '#5f5d58', line: '#d9d7d1', box: '#f6f5f2', orange: '#eb6834', blue: '#2a78d6', gray: '#b9b7b0' };
const BASE = `
  body { margin: 0; background: #fff; font-family: 'Pretendard', 'Malgun Gothic', sans-serif; color: ${C.ink}; }
  .fig { width: 516px; }
  h3 { font-size: 10.5px; margin: 0 0 2px; font-weight: 700; }
  .cap { font-size: 8.5px; color: ${C.sub}; margin: 0 0 8px; line-height: 1.5; }
  code { font-family: 'Consolas', monospace; font-size: 8.5px; }
`;

const pathFigure = `
<div class="fig" id="f1"><h3>① 마크다운이 첫 번들에 들어온 경로</h3>
<p class="cap">라우트 설정은 첫 번들에 남는다. 쿼리 키 하나를 쓰려고 엔티티 배럴을 import하자 마크다운 라이브러리까지 따라왔다.</p>
<div class="chain">
  ${[
    ['라우트 설정', 'learning.units.$unitId.bookmarked-problems', '첫 번들에 남는다 (autoCodeSplitting은 화면 컴포넌트만 분리)', ''],
    ['-review-quiz-route.ts', 'getReviewProblemsQueryKey 하나 사용', '', ''],
    ['@/entities/problem', 'index.ts — 쿼리 키와 UI가 한 배럴에 공개', '배럴은 FSD 공개 API라 그대로 둔다', ''],
    ['ui/problem-card.tsx', '@/shared/ui/markdown 사용', '', ''],
    ['@/shared/ui/markdown', 'index.ts → lazy-markdown.tsx (입구)', '<b>이후:</b> 입구만 공개해 첫 번들에는 몇 줄만 남는다', 'entry'],
    ['markdown.tsx + 라이브러리', 'react-markdown · remark · micromark · refractor', '<b>이후:</b> 별도 청크 <code>markdown-*.js</code> 231KB<br/>쓰는 라우트의 loader에서 미리 받는다', 'heavy'],
  ].map(([name, detail, note, kind], index, list) => `
    <div class="row">
      <div class="node ${kind}"><b>${name}</b><span>${detail}</span></div>
      <div class="note ${kind ? 'cut' : ''}">${note}</div>
    </div>${index < list.length - 1 ? `<div class="arrow ${index === 4 ? 'cutline' : ''}">${index === 4 ? '✂ import() — 여기서 청크가 끊긴다' : '↓'}</div>` : ''}`).join('')}
</div></div>`;
const pathCss = `
  .chain { display: flex; flex-direction: column; }
  .row { display: flex; gap: 10px; align-items: center; }
  .node { width: 250px; box-sizing: border-box; border: 1px solid ${C.line}; background: ${C.box}; border-radius: 4px; padding: 4px 8px; display: flex; flex-direction: column; }
  .node b { font-size: 9px; } .node span { font-size: 8px; color: ${C.sub}; }
  .node.heavy { border-color: ${C.orange}; background: #fdf0ea; } .node.entry { border-color: ${C.blue}; }
  .note { font-size: 8px; color: ${C.sub}; line-height: 1.45; }
  .note.cut { color: ${C.ink}; border-left: 2px solid ${C.blue}; padding-left: 6px; }
  .arrow { width: 250px; text-align: center; font-size: 9px; color: ${C.sub}; line-height: 13px; }
  .arrow.cutline { color: ${C.blue}; font-weight: 700; }
`;

const mapFigure = `
<div class="fig" id="f2"><h3>② 첫 번들 구성 — 번들 지도 (vite-bundle-visualizer)</h3>
<p class="cap">점선 안이 마크다운 렌더링 계열(unified·mdast·micromark·refractor 등. 이전 그림 왼쪽의 작은 칸들도 대부분 micromark·mdast). 이후에는 퀴즈·개념 노트에서만 받는 별도 청크가 됐다.</p>
<div class="maps">
  <figure><div class="frame"><img src="${img('bundle-crop-before.png')}"/>
    <div class="mark" style="left:18.8%;top:22.7%;width:12.1%;height:76.6%"></div>
    <div class="mark" style="left:31.2%;top:54.8%;width:18.8%;height:44.5%"></div></div>
    <figcaption><b>이전</b> · <code>index-*.js</code> 861KB 하나</figcaption></figure>
  <figure><div class="frame"><img src="${img('bundle-crop-after.png')}"/>
    <div class="mark" style="left:0.5%;top:2.1%;width:99%;height:33.4%"></div></div>
    <figcaption><b>이후</b> · 위 <code>markdown-*.js</code> 231KB / 아래 <code>index-*.js</code> 630KB</figcaption></figure>
</div></div>`;
const mapCss = `
  .maps { display: flex; gap: 12px; } figure { margin: 0; width: 252px; }
  .frame { position: relative; border: 1px solid ${C.line}; } .frame img { display: block; width: 100%; }
  .mark { position: absolute; border: 2px dashed ${C.orange}; box-sizing: border-box; border-radius: 2px; }
  figcaption { font-size: 8.5px; color: ${C.sub}; margin-top: 4px; }
`;

const steps = [
  ['1. 녹화', '측정 전용 Chrome 프로필로 실제 dev 서버 접속', 'API 응답 저장 (puppeteer)'],
  ['2. 재생', 'API 요청을 가로채 녹화본으로 응답', '지연 고정 약 180ms (CDP Fetch)'],
  ['3. 조건 고정', '412×823 모바일 · CPU 4배 · Fast 4G · 캐시 끔', 'DevTools와 같은 방식 (CDP)'],
  ['4. 번갈아 5회', '이전 → 이후 → 이후(같은 빌드)', 'LCP·FCP·CLS 수집 (PerformanceObserver)'],
];
const designFigure = `
<div class="fig" id="f3"><h3>③ 측정 설계 — 네트워크 변수를 빼고 코드 차이만 보기</h3>
<p class="cap">공용 와이파이에서는 같은 빌드도 LCP가 1초 넘게 흔들렸다. API 응답을 녹화·재생해 서버와 회선 영향을 없앴다.</p>
<div class="steps">${steps.map(([title, body, tool], index) => `<div class="step"><b>${title}</b><span>${body}</span><em>${tool}</em></div>${index < steps.length - 1 ? '<div class="sarrow">→</div>' : ''}`).join('')}</div>
<div class="judge"><b>판단 기준</b> 같은 빌드를 두 번 잰 차이 = 측정 흔들림. 이전↔이후 차이가 이보다 클 때만 개선으로 본다.
<span>예) 메인 −0.55초 (흔들림 0.00) ✔ · 학습 홈 +0.08초 (흔들림 0.19) → 차이 없음</span></div>
</div>`;
const designCss = `
  .steps { display: flex; align-items: stretch; gap: 4px; }
  .step { flex: 1; border: 1px solid ${C.line}; background: ${C.box}; border-radius: 4px; padding: 6px 7px; display: flex; flex-direction: column; gap: 3px; }
  .step b { font-size: 9px; } .step span { font-size: 8px; line-height: 1.45; } .step em { font-style: normal; font-size: 7.5px; color: ${C.sub}; margin-top: auto; }
  .sarrow { align-self: center; font-size: 10px; color: ${C.sub}; }
  .judge { margin-top: 8px; font-size: 8.5px; line-height: 1.55; border-left: 2px solid ${C.blue}; padding-left: 7px; }
  .judge span { display: block; color: ${C.sub}; }
`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>${BASE}${pathCss}${mapCss}${designCss} .gap { height: 24px; }</style></head><body>
${pathFigure}<div class="gap"></div>${mapFigure}<div class="gap"></div>${designFigure}</body></html>`;
fs.writeFileSync(`${OUT}/portfolio-figure-page.html`, html);
const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 540, height: 1200, deviceScaleFactor: 3 });
await page.setContent(html, { waitUntil: 'load' });
for (const [id, name] of [['f1', 'portfolio-fig1-import-path.png'], ['f2', 'portfolio-fig2-bundle-map.png'], ['f3', 'portfolio-fig3-measurement.png']]) {
  const element = await page.$(`#${id}`);
  const box = await element.boundingBox();
  await element.screenshot({ path: `${OUT}/${name}` });
  console.log(name, Math.round(box.width), 'x', Math.round(box.height));
}
await browser.close();
