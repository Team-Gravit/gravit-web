// LCP가 무엇을 기다리는지: LCP 시각과 그 직전에 끝난 요청들(이미지 · API · JS · 폰트)을 중앙값 회차로 보여 준다.
import { readFileSync } from 'node:fs';
const data = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const only = process.argv[3]?.split(',');
for (const [key, runs] of Object.entries(data)) {
  if (only && !only.some((o) => key.startsWith(o))) continue;
  const ok = runs.filter((r) => !r.error && r.lcp);
  if (!ok.length) continue;
  const r = [...ok].sort((a, b) => a.lcp.time - b.lcp.time)[Math.floor(ok.length / 2)];
  const lcp = Math.round(r.lcp.time);
  const img = r.lcp.url ? r.requests.find((q) => q.path.includes(r.lcp.url)) : null;
  const before = r.requests.filter((q) => q.end <= lcp && q.kind !== 'other').sort((a, b) => b.end - a.end);
  const lastOf = (kind) => before.find((q) => q.kind === kind);
  const fmt = (q) => (q ? `${q.path.slice(0, 38)} ${q.start}→${q.end}` : '-');
  console.log(`${key}  FCP ${Math.round(r.fcp)}  LCP ${lcp}  ${r.lcp.url ?? r.lcp.element?.slice(0, 30)}`);
  if (img) console.log(`   LCP 이미지   ${fmt(img)}  (${Math.round(img.bytes / 1024)}KB)`);
  console.log(`   마지막 API   ${fmt(lastOf('api'))}`);
  console.log(`   마지막 JS    ${fmt(lastOf('js'))}`);
  console.log(`   폰트         ${fmt(r.requests.find((q) => q.kind === 'font'))}`);
  console.log(`   CSS          ${fmt(r.requests.find((q) => q.kind === 'css'))}`);
  const users = r.requests.find((q) => q.path === '/api/v1/users');
  console.log(`   /users       ${fmt(users)}  · reissue ${fmt(r.requests.find((q) => q.path.endsWith('/reissue')))}`);
}
