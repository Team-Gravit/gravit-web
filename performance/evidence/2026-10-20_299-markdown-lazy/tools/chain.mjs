import fs from 'node:fs';
const lhr = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const chains = lhr.audits['critical-request-chains']?.details?.chains ?? {};
const short = (url) => url.replace(/^https?:\/\/[^/]+/, '').slice(0, 70);
function walk(node, depth) {
  for (const child of Object.values(node)) {
    const r = child.request;
    console.log(`${'  '.repeat(depth)}${short(r.url)}  ${Math.round((r.endTime - r.startTime) * 1000)}ms  ${Math.round(r.transferSize / 1024)}KB`);
    if (child.children) walk(child.children, depth + 1);
  }
}
walk(chains, 0);
console.log('--- longest chain', JSON.stringify(lhr.audits['critical-request-chains']?.details?.longestChain));
const items = lhr.audits['network-requests'].details.items;
const lcpUrl = items.filter((i) => /planet/.test(i.url)).slice(0, 2);
console.log('--- observed (no throttle) start ms');
for (const i of items.filter((i) => /index-|learning|api\/|planet-0[1-3]|fonts|jsdelivr|woff/.test(i.url)).slice(0, 25)) console.log(String(Math.round(i.networkRequestTime)).padStart(6), String(Math.round(i.transferSize/1024)).padStart(5)+'KB', short(i.url));
