import fs from 'node:fs';
const map = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (const spec of process.argv.slice(3)) {
  const [needle, from, to] = spec.split(':');
  const index = map.sources.findIndex((source) => source.endsWith(needle));
  const lines = map.sourcesContent[index].split('\n');
  console.log(`== ${needle} ${from}-${to}`);
  lines.slice(Number(from) - 1, Number(to)).forEach((line, offset) => console.log(String(Number(from) + offset).padStart(5), line));
}
