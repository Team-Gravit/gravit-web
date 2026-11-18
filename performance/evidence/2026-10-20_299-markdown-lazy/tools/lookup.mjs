import fs from 'node:fs';
import { SourceMapConsumer } from 'source-map';
const map = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const positions = process.argv.slice(3).map((p) => p.split(':').map(Number));
await SourceMapConsumer.with(map, null, (consumer) => {
  for (const [line, column] of positions) {
    // DevTools 열 번호는 1부터, source-map 은 0부터
    const original = consumer.originalPositionFor({ line, column: column - 1 });
    console.log(`${line}:${column} →`, original.source?.replace(/.*node_modules\/(\.pnpm\/[^/]+\/node_modules\/)?/, 'npm:'), `${original.line}:${original.column}`, original.name ?? '');
  }
});
