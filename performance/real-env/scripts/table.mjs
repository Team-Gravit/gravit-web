// 프로필별 판정표(markdown)를 만든다. INP는 마지막 재측정 값을 쓰고, 그래도 흔들리면 무효로 표시한다.
// node table.mjs  (scripts 폴더에서) → ../results/table.md
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
const R = '../results';
const med = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const load = (f) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {});
const merge = (files) => Object.assign({}, ...files.map(load));
const jitter = (xs) => { const m = med(xs); return Math.max(...xs) - Math.min(...xs) > m * 0.3 || xs.some((x) => x > m * 2); };
const grade = (v, good, bad) => (v <= good ? '' : v <= bad ? ' △' : ' ✕');
let md = '';
for (const p of ['ios', 'mweb', 'desktop']) {
  const loadD = merge(['A', 'B', 'C'].map((g) => `${R}/diagnose-${p}-load-${g}.json`).concat(`${R}/rerun1/diagnose-${p}-load-X.json`));
  const clsD = merge(['A', 'B', 'C'].map((g) => `${R}/diagnose-${p}-load-delay600-${g}.json`).concat(`${R}/rerun1/diagnose-${p}-load-delay600-X.json`));
  const inpD = merge(['A', 'B', 'C'].map((g) => `${R}/diagnose-${p}-inp-${g}.json`).concat(`${R}/rerun1/diagnose-${p}-inp-X.json`, `${R}/rerun2/diagnose-${p}-inp-X.json`));
  md += `\n### ${p}\n\n| 화면 | FCP | LCP | CLS | CLS (응답 0.6초) | TBT | INP (최댓값) |\n| --- | --: | --: | --: | --: | --: | --: |\n`;
  for (const key of Object.keys(loadD)) {
    const ok = loadD[key].filter((r) => !r.error);
    const fcp = med(ok.map((r) => r.fcp)), lcp = med(ok.map((r) => r.lcp?.time ?? 0)), cls = med(ok.map((r) => r.cls)), tbt = med(ok.map((r) => r.tbt));
    const c6 = clsD[key] ? med(clsD[key].filter((r) => !r.error).map((r) => r.cls)) : null;
    const inpRuns = (inpD[key] ?? []).filter((r) => !r.error).map((r) => r.inp);
    const inp = inpRuns.length ? med(inpRuns) : null;
    const inpText = inp == null ? '-' : `${inp}${grade(inp, 200, 500)} (${Math.max(...inpRuns)})${jitter(inpRuns) ? ' 무효' : ''}${inpRuns.length < 7 ? ` n=${inpRuns.length}` : ''}`;
    md += `| ${key.replace(`-${p}`, '')} | ${Math.round(fcp)}${grade(fcp, 1800, 3000)} | ${Math.round(lcp)}${grade(lcp, 2500, 4000)} | ${cls.toFixed(3)}${grade(cls, 0.1, 0.25)} | ${c6 == null ? '-' : c6.toFixed(3) + grade(c6, 0.1, 0.25)} | ${Math.round(tbt)}${grade(tbt, 199, 600)} | ${inpText} |\n`;
  }
}
writeFileSync(`${R}/table.md`, md);
console.log(md);
