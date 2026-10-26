import type { ExtraProps } from 'react-markdown';

// node는 ReactMarkdown이 넘기는 문서 구조 정보다. 나머지 props를 DOM에 펼치기 전에 제외한다.
export function withoutNode<T extends ExtraProps>(props: T): Omit<T, 'node'> {
  const elementProps = { ...props };
  delete elementProps.node;
  return elementProps;
}
