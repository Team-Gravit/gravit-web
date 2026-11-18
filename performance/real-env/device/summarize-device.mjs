// results.jsonl 을 기기(UA 끝 이름표) × 화면별 가운데 값으로 묶는다. node summarize-device.mjs
import { readFileSync } from 'node:fs';
const rows = readFileSync(new URL('./results.jsonl', import.meta.url), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const med = (xs) => { const s = xs.filter((x) => x != null).sort((a, b) => a - b); return s.length ? Math.round(s[Math.floor(s.length / 2)]) : '-'; };
const device = (ua) => ua.match(/bench\/(\S+)/)?.[1] ?? (ua.includes('iPhone') ? 'iphone-safari' : ua);
const groups = {};
for (const r of rows) (groups[`${device(r.ua)} | ${r.screen}`] ??= []).push(r);
console.log('기기 | 화면 | n | FCP | LCP | 준비 | 이미지 | 클릭→다음 그리기 | TTFB');
for (const [k, rs] of Object.entries(groups)) {
  console.log(`${k} | ${rs.length} | ${med(rs.map((r) => r.fcp))} | ${med(rs.map((r) => r.lcp))} | ${med(rs.map((r) => r.ready))} | ${med(rs.map((r) => r.images))} | ${med(rs.map((r) => r.interaction))} | ${med(rs.map((r) => r.ttfb))}`);
}
