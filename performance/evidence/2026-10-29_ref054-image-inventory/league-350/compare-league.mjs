// 리그 배경 변환본을 원본 PNG(같은 크기로 줄인 것)와 픽셀 비교한다. 덮개(검정 45%)를 씌운 뒤의 차이도 함께 낸다.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(path.resolve(process.argv[2], 'package.json'));
const sharp = require('sharp');
const [, , root, srcPng, ...outputs] = process.argv;

async function raw(input, width) {
  const { data, info } = await sharp(input).resize({ width }).flatten({ background: '#2a0f8a' }).raw().toBuffer({ resolveWithObject: true });
  return { data, info };
}

for (const file of outputs) {
  const meta = await sharp(file).metadata();
  const a = await raw(srcPng, meta.width);
  const b = await raw(file, meta.width);
  let max = 0, sum = 0, over8 = 0, maxDim = 0;
  for (let i = 0; i < a.data.length; i++) {
    const d = Math.abs(a.data[i] - b.data[i]);
    // 화면에는 검정 45% 덮개가 얹히므로 실제 보이는 차이는 0.55배다
    const dim = d * 0.55;
    sum += d; if (d > max) max = d; if (d > 8) over8++; if (dim > maxDim) maxDim = dim;
  }
  console.log(`${path.basename(file)} ${meta.width}x${meta.height} ${(fs.statSync(file).size / 1024).toFixed(1)}KB  max ${max} mean ${(sum / a.data.length).toFixed(2)} >8: ${((over8 / a.data.length) * 100).toFixed(2)}%  (덮개 후 max ${maxDim.toFixed(0)})`);
}
