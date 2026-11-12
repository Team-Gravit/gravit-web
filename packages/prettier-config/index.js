/** @type {import("prettier").Config} */
const config = {
  printWidth: 100,
  singleQuote: true,
  endOfLine: 'lf',
  // prettier 3 기본값과 같지만 명시한다. 버전이 바뀌어도 포맷 결과가 흔들리지 않게 한다 (REF-003).
  trailingComma: 'all',
};

export default config;
