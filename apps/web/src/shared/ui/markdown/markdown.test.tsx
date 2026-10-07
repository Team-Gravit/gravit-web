import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Markdown } from './markdown';

const IMAGE_URL =
  'https://raw.githubusercontent.com/Team-Gravit/gravit-images/main/a/unit01/image1.png';

// 개념노트에서 사용하는 Markdown 문법을 한 번에 검증한다.
const NOTE_SYNTAX = [
  '### 1. 배열',
  '',
  '**배열**은 `arr[0]` 처럼 접근한다.',
  '',
  '| **연산** | **시간** |',
  '| -------- | -------- |',
  '| 접근     | **O(1)** |',
  '',
  '```python',
  'arr = [1, 2, 3]',
  '```',
  '',
  '<br>',
  '',
  `<img src="${IMAGE_URL}" width="75%">`,
  '',
  '> 💡 팁',
  '',
  '1. 첫째',
  '   - 하위',
  '2. 둘째',
].join('\n');

function renderMarkdown(markdown: string) {
  return render(<Markdown>{markdown}</Markdown>).container;
}

describe('Markdown', () => {
  it('노트 원본이 쓰는 문법을 각각의 요소로 렌더링한다', () => {
    const container = renderMarkdown(NOTE_SYNTAX);

    expect(container.querySelector('h3')).toHaveTextContent('1. 배열');
    expect(container.querySelectorAll('table')).toHaveLength(1);
    expect(container.querySelector('pre > code')).toHaveTextContent('arr = [1, 2, 3]');
    expect(container.querySelectorAll('br')).toHaveLength(1);
    expect(container.querySelector('img')).toHaveAttribute('width', '75%');
    expect(container.querySelector('img')).toHaveAttribute('src', IMAGE_URL);
    expect(container.querySelector('blockquote')).toHaveTextContent('💡 팁');
    expect(container.querySelector('ol > li > ul > li')).toHaveTextContent('하위');
    expect(container.querySelector('p strong')).toHaveTextContent('배열');
    expect(container.querySelector('p > code')).toHaveTextContent('arr[0]');
  });

  it('괄호 뒤에 한글 조사가 붙은 강조를 렌더링한다', () => {
    const container = renderMarkdown('React에서 **렌더링(Rendering)**은 UI를 그리는 과정이다.');

    expect(container.querySelector('strong')).toHaveTextContent('렌더링(Rendering)');
    expect(container.textContent).not.toContain('**');
  });

  it('GFM 취소선도 한글 조사 앞에서 렌더링한다', () => {
    const container = renderMarkdown('~~렌더링(Rendering)~~은 삭제된 용어다.');

    expect(container.querySelector('del')).toHaveTextContent('렌더링(Rendering)');
    expect(container.textContent).not.toContain('~~');
  });

  it('코드 블록의 언어를 표시하고 원문을 복사한다', async () => {
    const user = userEvent.setup();

    render(<Markdown>{'```python\narr = [1, 2, 3]\n```'}</Markdown>);

    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByLabelText('Python 코드')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '복사' }));

    await expect(navigator.clipboard.readText()).resolves.toBe('arr = [1, 2, 3]');
    expect(screen.getByRole('button', { name: '복사됨' })).toBeInTheDocument();
  });

  it('원시 HTML 기호를 글자로 노출하지 않는다', () => {
    const container = renderMarkdown(NOTE_SYNTAX);

    expect(container.textContent).not.toContain('<br');
    expect(container.textContent).not.toContain('<img');
  });

  it('한 줄에 붙은 <br><br> 은 br 두 개가 된다', () => {
    expect(renderMarkdown('<br><br>').querySelectorAll('br')).toHaveLength(2);
  });

  it('script · 이벤트 속성 · javascript 링크가 DOM 에 남지 않는다', () => {
    const container = renderMarkdown(
      [
        '<script>alert(1)</script>',
        '',
        `<img src="${IMAGE_URL}" onerror="alert(1)">`,
        '',
        '[링크](javascript:alert(1))',
      ].join('\n'),
    );

    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('img')).not.toHaveAttribute('onerror');
    expect(container.querySelector('a')?.getAttribute('href') ?? '').not.toMatch(/^javascript:/i);
    expect(container.textContent).not.toContain('alert(1)</script>');
  });

  it('허용 목록 밖의 태그와 https 가 아닌 이미지는 버린다', () => {
    const container = renderMarkdown(
      ['<div>상자</div>', '', '<img src="http://example.com/a.png">'].join('\n'),
    );

    expect(container.textContent).not.toContain('상자');
    expect(container.querySelector('img')).toBeNull();
  });
});

describe('Markdown 문법 강조', () => {
  it('등록된 언어의 코드 블록을 Prism 토큰으로 나누고 원문은 그대로 둔다', () => {
    const container = renderMarkdown('```python\ndef push(x):\n    return "a"  # 끝\n```');
    const code = container.querySelector('pre > code');

    expect(code?.querySelector('.token.keyword')).toHaveTextContent('def');
    expect(code?.querySelector('.token.string')).toHaveTextContent('"a"');
    expect(code?.querySelector('.token.comment')).toHaveTextContent('# 끝');
    expect(code).toHaveTextContent('def push(x): return "a" # 끝');
  });

  it('vue 는 마크업으로 강조한다', () => {
    const container = renderMarkdown('```vue\n<template><div :id="a" /></template>\n```');

    expect(container.querySelector('pre .token.tag')).not.toBeNull();
  });

  it('언어가 없거나 등록되지 않은 블록은 강조하지 않는다', () => {
    const container = renderMarkdown(
      ['```', '[1] → [2]', '```', '', '```brainfuck', '+++.', '```'].join('\n'),
    );

    expect(container.querySelectorAll('pre .token')).toHaveLength(0);
    expect(container.textContent).toContain('[1] → [2]');
    expect(container.textContent).toContain('+++.');
  });

  it('인라인 code 는 강조하지 않는다', () => {
    const container = renderMarkdown('`def` 는 함수를 만든다.');

    expect(container.querySelector('p > code .token')).toBeNull();
  });
});
