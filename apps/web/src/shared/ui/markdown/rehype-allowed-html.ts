import type { Element, ElementContent, Root, RootContent } from 'hast';

/*
  마크다운 안의 원시 HTML 중 개념노트에 필요한 `<br>`과 `<img>`만 요소로 만든다.
  전체 HTML을 파싱하지 않고, 허용한 태그와 속성만 새로 구성한다.
*/

const ALLOWED_TAG_PATTERN = /<br\s*\/?>|<img\b[^>]*>/gi;
const ATTRIBUTE_PATTERN = /([a-z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
const IMAGE_WIDTH_PATTERN = /^\d+(?:\.\d+)?(?:%|px)?$/;

function toAllowedElements(html: string): Element[] {
  const elements: Element[] = [];

  for (const [tag] of html.matchAll(ALLOWED_TAG_PATTERN)) {
    const element = tag.toLowerCase().startsWith('<br') ? createBreak() : toImage(tag);

    if (element) {
      elements.push(element);
    }
  }

  return elements;
}

/** `raw` 노드를 허용 요소로 교체하고 나머지는 제거하는 rehype 플러그인. */
export function rehypeAllowedHtml() {
  // 플러그인을 연결할 때 이 함수를 반환하고, 문서를 처리할 때 tree를 전달받는다.
  return (tree: Root) => {
    replaceRawNodes(tree);
  };
}

function replaceRawNodes(parent: Root | Element) {
  const nextChildren: (RootContent | ElementContent)[] = [];

  for (const child of parent.children) {
    if (child.type === 'raw') {
      // raw는 아직 요소로 해석하지 않은 HTML 문자열이다. 허용 태그가 없으면 빈 배열로 대체한다.
      nextChildren.push(...toAllowedElements(child.value));
      continue;
    }

    if (child.type === 'element') {
      replaceRawNodes(child);
    }

    nextChildren.push(child);
  }

  // Root와 Element의 children 타입은 다르지만, 허용한 HAST 요소는 양쪽에 모두 들어갈 수 있다.
  parent.children = nextChildren as typeof parent.children;
}

function createBreak(): Element {
  return { type: 'element', tagName: 'br', properties: {}, children: [] };
}

function toImage(tag: string): Element | null {
  const attributes = readAttributes(tag);
  const src = attributes.get('src');

  if (!src || !isHttpsUrl(src)) {
    return null;
  }

  // 읽어 낸 속성을 그대로 넘기지 않아 onerror 같은 이벤트 속성이 요소에 남지 않는다.
  const properties: Element['properties'] = { src, alt: attributes.get('alt') ?? '' };
  const width = attributes.get('width');

  if (width && IMAGE_WIDTH_PATTERN.test(width)) {
    properties.width = width;
  }

  return { type: 'element', tagName: 'img', properties, children: [] };
}

function readAttributes(tag: string): Map<string, string> {
  const attributes = new Map<string, string>();

  for (const [, name, doubleQuoted, singleQuoted] of tag.matchAll(ATTRIBUTE_PATTERN)) {
    attributes.set(name.toLowerCase(), doubleQuoted ?? singleQuoted ?? '');
  }

  return attributes;
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}
