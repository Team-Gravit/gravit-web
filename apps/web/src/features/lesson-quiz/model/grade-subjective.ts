/**
 * 앞뒤 공백과 대소문자만 무시한다. 내부 공백 제거와 부분 일치는 다른 답을 정답으로
 * 판정할 수 있어 허용하지 않는다.
 */
export function gradeSubjective(contents: string[], submittedContent: string): boolean {
  const normalized = normalize(submittedContent);

  if (!normalized) {
    return false;
  }

  return contents.some((content) => normalize(content) === normalized);
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}
