export interface ConceptNote {
  /** 첫 내용 줄에서 추출한 제목. 제목으로 시작하지 않으면 없다. */
  title?: string;
  /** 화면 제목으로 분리한 첫 줄을 제외한 Markdown. */
  body: string;
  /** 서버가 반환한 원문. 제목까지 본문에 포함해야 할 때 사용한다. */
  markdown: string;
}

const HEADING_PATTERN = /^#{1,6}\s+(.+?)\s*#*\s*$/;

/**
 * 첫 내용 줄의 Markdown 제목을 화면 제목으로 분리한다.
 * 제목으로 시작하지 않으면 원문 전체를 본문으로 유지한다.
 */
export function toConceptNote(markdown: string): ConceptNote {
  const lines = markdown.split(/\r?\n/);
  const firstContentIndex = lines.findIndex((line) => line.trim() !== '');

  if (firstContentIndex === -1) {
    return { body: '', markdown };
  }

  const headingMatch = lines[firstContentIndex].trim().match(HEADING_PATTERN);

  if (!headingMatch) {
    return { body: markdown, markdown };
  }

  return {
    title: headingMatch[1],
    body: lines.slice(firstContentIndex + 1).join('\n'),
    markdown,
  };
}

/** 제목이 없고 본문이 공백뿐이면 빈 노트로 판단한다. */
export function isEmptyConceptNote(conceptNote: ConceptNote): boolean {
  return conceptNote.title === undefined && conceptNote.body.trim() === '';
}
