/**
 * STT 변환 결과에서 실제 텍스트만 추출한다.
 *
 * 백엔드가 transcript 를 평문이 아니라 중첩 JSON({ text, asset_pointer, ... }) 문자열로
 * 내려주는 경우가 있어, text 필드를 반복해서 벗겨낸다. 평문이면 그대로 반환한다.
 * 백엔드가 평문으로 고치면 이 함수는 제거한다.
 */
export function parseTranscriptText(transcript: string): string {
  let current = transcript;

  // 중첩 깊이가 보장되지 않아 상한을 두고 반복한다. 평문이 되면 parse 가 실패해 멈춘다.
  for (let depth = 0; depth < 5; depth += 1) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(current);
    } catch {
      break;
    }

    if (
      parsed &&
      typeof parsed === 'object' &&
      'text' in parsed &&
      typeof (parsed as { text: unknown }).text === 'string'
    ) {
      current = (parsed as { text: string }).text;
      continue;
    }

    break;
  }

  return current;
}
