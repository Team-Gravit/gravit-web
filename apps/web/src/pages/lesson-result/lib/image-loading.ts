// 디코딩 실패가 전체 일러스트 표시를 막지 않도록 성공과 실패 모두 완료로 처리한다.
export function markImageReadyAfterDecode(image: HTMLImageElement, onReady: () => void) {
  void image.decode().then(onReady, onReady);
}
