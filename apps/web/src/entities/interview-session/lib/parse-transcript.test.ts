import { describe, expect, it } from 'vitest';

import { parseTranscriptText } from './parse-transcript';

describe('parseTranscriptText', () => {
  it('이중 중첩 JSON 에서 text 만 추출한다', () => {
    const raw = JSON.stringify({
      text: JSON.stringify({
        text: '음성을 텍스트로 변환한 데이터입니다.',
        asset_pointer: 'sediment://file_abc',
        asset_format: 'm4a',
      }),
      usage: null,
    });

    expect(parseTranscriptText(raw)).toBe('음성을 텍스트로 변환한 데이터입니다.');
  });

  it('단일 중첩 JSON 에서 text 를 추출한다', () => {
    expect(parseTranscriptText(JSON.stringify({ text: '안녕하세요' }))).toBe('안녕하세요');
  });

  it('평문은 그대로 반환한다', () => {
    expect(parseTranscriptText('그냥 답변입니다')).toBe('그냥 답변입니다');
  });

  it('빈 문자열은 그대로 반환한다', () => {
    expect(parseTranscriptText('')).toBe('');
  });
});
