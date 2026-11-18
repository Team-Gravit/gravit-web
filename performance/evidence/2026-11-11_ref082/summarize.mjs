// 진단 결과 JSON → 화면별 중앙값과 흔들림(최소~최대), 가장 흔한 LCP 요소 · CLS 원인
import { readFileSync } from 'node:fs';
const data = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const med = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const mode = (xs) => { const c = {}; for (const x of xs) c[x] = (c[x] ?? 0) + 1; return Object.entries(c).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k}(${n})`).join(' · '); };
for (const [key, runs] of Object.entries(data)) {
  const ok = runs.filter((r) => !r.error);
  if (!ok.length) { console.log(key, 'ALL ERROR'); continue; }
  if (ok[0].interactions) {
    const acts = ok[0].interactions.map((_, i) => `${ok[0].interactions[i].action}: ${Math.round(med(ok.map((r) => r.interactions[i]?.inp ?? 0)))}`);
    console.log(`${key} | INP ${Math.round(med(ok.map((r) => r.inp)))} (${Math.round(Math.min(...ok.map((r) => r.inp)))}~${Math.round(Math.max(...ok.map((r) => r.inp)))}) | ${acts.join(' / ')}`);
    continue;
  }
  const lcps = ok.map((r) => r.lcp?.time ?? -1);
  console.log(`${key} | FCP ${Math.round(med(ok.map((r) => r.fcp)))} | LCP ${Math.round(med(lcps))} (${Math.round(Math.min(...lcps))}~${Math.round(Math.max(...lcps))}) | CLS ${med(ok.map((r) => r.cls)).toFixed(3)} | TBT ${Math.round(med(ok.map((r) => r.tbt)))} | n=${ok.length}`);
  console.log(`   LCP: ${mode(ok.map((r) => `${r.lcp?.element?.slice(0, 40) ?? '-'} ${r.lcp?.url ?? ''}`))}`);
  const shifts = ok.flatMap((r) => r.shifts.filter((s) => s.value >= 0.01).map((s) => s.sources.join(',') || '?'));
  if (shifts.length) console.log(`   CLS: ${mode(shifts)}`);
}
