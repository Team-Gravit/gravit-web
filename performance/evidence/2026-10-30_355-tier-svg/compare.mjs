// 원본과 정리본 SVG를 3배로 렌더해 픽셀 비교한다 (흰 배경 합성)
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const [root, origDir, newDir] = process.argv.slice(2);
const sharp = createRequire(path.join(root, 'package.json'))('sharp');
let worst = 0;
for (const f of fs.readdirSync(origDir).filter((n) => n.endsWith('.svg'))) {
  const render = (p) => sharp(p, { density: Number(process.env.DENSITY ?? 72) }).flatten({ background: '#ffffff' }).raw().toBuffer({ resolveWithObject: true });
  const a = await render(path.join(origDir, f));
  const b = await render(path.join(newDir, f));
  let max = 0, over = 0;
  for (let i = 0; i < a.data.length; i++) { const d = Math.abs(a.data[i] - b.data[i]); if (d > max) max = d; if (d > 4) over++; }
  worst = Math.max(worst, max);
  console.log(f.padEnd(16), `${a.info.width}x${a.info.height}`, `${(fs.statSync(path.join(origDir, f)).size / 1024).toFixed(1)}→${(fs.statSync(path.join(newDir, f)).size / 1024).toFixed(1)}KB`, 'max', max, '>4', ((over / a.data.length) * 100).toFixed(3) + '%');
}
console.log('worst', worst);
