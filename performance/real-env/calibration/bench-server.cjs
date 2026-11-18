// 보정용 테스트 페이지 서버. 같은 Wi-Fi의 iPhone이 열 수 있게 모든 주소에서 받는다.
const http = require('node:http'); const fs = require('node:fs'); const path = require('node:path');
const OUT = path.join(__dirname, 'bench-results.jsonl');
http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/result') {
    let body = ''; req.on('data', (c) => (body += c)); req.on('end', () => {
      const row = { at: new Date().toISOString(), ...JSON.parse(body) };
      fs.appendFileSync(OUT, JSON.stringify(row) + '\n'); console.log('결과', row.label, row.total, row.ua.slice(0, 60)); res.end('ok');
    }); return;
  }
  res.setHeader('content-type', 'text/html; charset=utf-8'); res.end(fs.readFileSync(path.join(__dirname, 'bench.html')));
}).listen(4300, '0.0.0.0', () => console.log('4300 대기'));
