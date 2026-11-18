// apps/web 이미지 전수 조사: 파일 · 크기(바이트 · 픽셀) · 애니메이션 · 사용처 · 렌더링 방식
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'C:/Users/jhe93/Desktop/project/gravit-workspace/gravit-harness-base/apps/web';
const IMG = /\.(png|jpe?g|webp|avif|gif|svg|ico)$/i;
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return d.name === 'node_modules' ? [] : walk(p);
    return [p];
  });

function dims(file) {
  const b = fs.readFileSync(file);
  const ext = path.extname(file).toLowerCase();
  try {
    if (ext === '.png') return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), anim: b.includes('acTL') };
    if (ext === '.gif') return { w: b.readUInt16LE(6), h: b.readUInt16LE(8), anim: true };
    if (ext === '.webp') {
      const kind = b.toString('ascii', 12, 16);
      if (kind === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3), anim: (b[20] & 0x02) !== 0, alpha: (b[20] & 0x10) !== 0 };
      if (kind === 'VP8L') { const v = b.readUInt32LE(21); return { w: (v & 0x3fff) + 1, h: ((v >> 14) & 0x3fff) + 1, anim: false, alpha: true }; }
      if (kind === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff, anim: false };
    }
    if (ext === '.jpg' || ext === '.jpeg') {
      let i = 2;
      while (i < b.length) {
        const m = b[i + 1]; const len = b.readUInt16BE(i + 2);
        if (m >= 0xc0 && m <= 0xc3) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5), anim: false };
        i += 2 + len;
      }
    }
    if (ext === '.svg') {
      const s = b.toString('utf8');
      const vb = s.match(/viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"/);
      const w = s.match(/<svg[^>]*\swidth="([\d.]+)/); const h = s.match(/<svg[^>]*\sheight="([\d.]+)/);
      return { w: w ? +w[1] : vb ? +vb[1] : null, h: h ? +h[1] : vb ? +vb[2] : null, anim: /<animate|@keyframes/.test(s), raster: /<image[^>]+(data:image|href=)/.test(s) };
    }
  } catch (e) { return { err: e.message }; }
  return {};
}

const all = [...walk(path.join(ROOT, 'src')), ...walk(path.join(ROOT, 'public'))].map((p) => p.replace(/\\/g, '/'));
const images = all.filter((p) => IMG.test(p) && !p.includes('/shared/ui/icon/assets/'));
const code = all.filter((p) => /\.(tsx?|css|mdx)$/.test(p) && !p.includes('.generated.'));
const sources = Object.fromEntries(code.map((p) => [p, fs.readFileSync(p, 'utf8')]));
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

const rows = images.map((file) => {
  const rel = file.replace(ROOT + '/', '');
  const base = path.basename(file);
  const d = dims(file);
  const uses = [];
  for (const [src, text] of Object.entries(sources)) {
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      if (!line.includes(base)) return;
      // 같은 이름의 다른 파일과 혼동하지 않도록 import 경로가 실제 파일로 풀리는지 확인
      const m = line.match(/from\s+['"]([^'"]+)['"]/) || line.match(/url\(['"]?([^'")]+)/);
      if (m) {
        const spec = m[1].replace(/\?.*$/, '');
        const resolved = spec.startsWith('@/') ? path.join(ROOT, 'src', spec.slice(2)) : spec.startsWith('/') ? path.join(ROOT, 'public', spec) : path.resolve(path.dirname(src), spec);
        if (resolved.replace(/\\/g, '/') !== file) return;
      }
      const varName = (line.match(/import\s+(\w+)\s+from/) || [])[1];
      const query = (line.match(/\?([\w&]+)['"]/) || [])[1] ?? '';
      let how = [];
      if (query.includes('react')) how.push('svg컴포넌트');
      if (/url\(/.test(line)) how.push('CSS url()');
      if (varName) {
        const body = text;
        const re = (p) => new RegExp(p.replace('V', varName)).test(body);
        if (re('src=\\{V\\}') || re('src:\\s*V\\b')) how.push('<img src>');
        if (re('srcSet=\\{[^}]*V')) how.push('srcSet');
        if (re('backgroundImage[^\\n]*V') || re('url\\(\\$\\{V')) how.push('CSS 배경(style)');
        if (!how.length) how.push(`변수 ${varName} (간접 사용)`);
      }
      uses.push({ src: src.replace(ROOT + '/', ''), line: i + 1, how: how.join('+') });
    });
  }
  if (html.includes(base)) uses.push({ src: 'index.html', line: 0, how: 'HTML' });
  return { rel, ext: path.extname(file).slice(1), bytes: fs.statSync(file).size, ...d, uses };
});

fs.writeFileSync(new URL('./img-inventory.json', import.meta.url), JSON.stringify(rows, null, 1));
const unused = rows.filter((r) => !r.uses.length);
console.log('total', rows.length, 'unused', unused.length);
for (const r of rows.sort((a, b) => b.bytes - a.bytes)) {
  const u = r.uses.map((x) => `${x.src.replace('src/', '')}:${x.line}[${x.how}]`).join(' ; ');
  console.log(`${String(Math.round(r.bytes / 1024)).padStart(5)}K ${r.ext.padEnd(4)} ${String(r.w ?? '?')}x${r.h ?? '?'}${r.anim ? ' ANIM' : ''}${r.alpha ? ' a' : ''}${r.raster ? ' RASTER-IN-SVG' : ''} | ${r.rel.replace('src/', '')} | ${u || '— 사용처 없음'}`);
}
