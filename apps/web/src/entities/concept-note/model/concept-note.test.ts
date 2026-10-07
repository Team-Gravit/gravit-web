import { describe, expect, it } from 'vitest';

import { isEmptyConceptNote, toConceptNote } from './concept-note';

describe('toConceptNote', () => {
  it('앞에 빈 줄이 있어도 첫 제목을 title 로 올리고 본문에서 뺀다', () => {
    const conceptNote = toConceptNote('\n\n## 배열(Array)\n\n**배열**은 기본 자료구조다.');

    expect(conceptNote.title).toBe('배열(Array)');
    expect(conceptNote.body).toBe('\n**배열**은 기본 자료구조다.');
    expect(conceptNote.body).not.toContain('배열(Array)');
    expect(conceptNote.markdown).toBe('\n\n## 배열(Array)\n\n**배열**은 기본 자료구조다.');
  });

  it('첫 내용 줄이 제목이 아니면 title 이 없고 본문은 원문과 같다', () => {
    const markdown = '줄을 서요.\n\n## 큐(Queue)';

    expect(toConceptNote(markdown)).toEqual({ body: markdown, markdown });
  });

  it('제목 뒤의 닫는 # 은 title 에 넣지 않는다', () => {
    expect(toConceptNote('### 스택 ###\n본문').title).toBe('스택');
  });

  it('# 뒤에 공백이 없으면 제목으로 보지 않는다', () => {
    expect(toConceptNote('#태그\n본문').title).toBeUndefined();
  });

  it('빈 문자열이면 본문이 빈 문자열이다', () => {
    expect(toConceptNote('')).toEqual({ body: '', markdown: '' });
  });
});

describe('isEmptyConceptNote', () => {
  it('공백만 있으면 빈 노트다', () => {
    expect(isEmptyConceptNote(toConceptNote('  \n\n '))).toBe(true);
  });

  it('제목만 있어도 빈 노트가 아니다', () => {
    expect(isEmptyConceptNote(toConceptNote('## 배열(Array)'))).toBe(false);
  });
});
