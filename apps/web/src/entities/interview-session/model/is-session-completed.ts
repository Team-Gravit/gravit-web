/** 현재 인덱스가 문항 수에 도달하면(모든 문항을 지나면) 세션 완료다. */
export function isSessionCompleted(currentIndex: number, totalQuestions: number): boolean {
  return currentIndex >= totalQuestions;
}
