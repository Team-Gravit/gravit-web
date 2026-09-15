const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const JONGSEONG_COUNT = 28;

function hasFinalConsonant(word: string): boolean {
  const lastCharacter = word.at(-1);
  if (!lastCharacter) {
    return false;
  }

  const code = lastCharacter.charCodeAt(0);
  if (code < HANGUL_START || code > HANGUL_END) {
    return false;
  }

  return (code - HANGUL_START) % JONGSEONG_COUNT !== 0;
}

/**
 * 마지막 문자가 완성형 한글이면 받침에 맞춰 목적격 조사 `을/를`을 붙인다.
 * 그 외의 문자로 끝나거나 빈 문자열이면 `를`을 붙인다.
 */
export function withObjectParticle(word: string): string {
  return `${word}${hasFinalConsonant(word) ? '을' : '를'}`;
}
