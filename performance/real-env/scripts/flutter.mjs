import { readFileSync } from 'node:fs';
const med = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
for (const f of process.argv.slice(2)) {
  const data = JSON.parse(readFileSync(f, 'utf8'));
  for (const [key, runs] of Object.entries(data)) {
    const ok = runs.filter((r) => !r.error);
    if (ok.length < runs.length) console.log(`${f.split("/").pop()} ${key} 오류 ${runs.length - ok.length}회 (정상 ${ok.length}회)`);
    if (!ok.length) continue;
    const metrics = ok[0].interactions ? { INP: ok.map((r) => r.inp) } : { FCP: ok.map((r) => r.fcp), LCP: ok.map((r) => r.lcp?.time ?? -1), TBT: ok.map((r) => r.tbt) };
    for (const [m, xs] of Object.entries(metrics)) {
      const md = med(xs), mn = Math.min(...xs), mx = Math.max(...xs);
      const range = mx - mn > md * 0.3, spike = xs.some((x) => x > md * 2);
      if (m === 'TBT' && mx === 0) continue;
      if (range || spike) console.log(`${f.split('/').pop()} ${key} ${m} 중앙 ${Math.round(md)} 범위 ${Math.round(mn)}~${Math.round(mx)} ${range ? '범위>30%' : ''} ${spike ? '2배 튐' : ''} | ${xs.map(Math.round).join(',')}`);
    }
  }
}
