import ReactMarkdown, { type Components } from 'react-markdown';
import remarkCjkFriendly from 'remark-cjk-friendly/parseOnly';
import remarkCjkFriendlyGfmStrikethrough from 'remark-cjk-friendly-gfm-strikethrough/parseOnly';
import remarkGfm from 'remark-gfm';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

import { rehypeAllowedHtml } from './rehype-allowed-html';
import { CodeBlockContext, CodeBlock } from './code-block';
import { rehypeHighlightCode } from './rehype-highlight-code';
import { withoutNode } from './without-node';

// 코드 블록은 `not-prose`로 분리하고, 이 클래스는 인라인 코드에만 적용한다.
const INLINE_CODE_CLASS = [
  'prose-code:rounded-4 prose-code:border prose-code:border-code-border prose-code:bg-code-bg prose-code:px-1 prose-code:py-0.5',
  'prose-code:font-mono prose-code:text-code-text prose-code:[font-variant-ligatures:none]',
  // Typography가 인라인 코드 앞뒤에 추가하는 백틱을 제거한다.
  'prose-code:before:content-none prose-code:after:content-none',
];

const markdownVariants = cva(['prose max-w-none break-words', INLINE_CODE_CLASS], {
  variants: {
    size: {
      md: 'prose-base',
      sm: 'prose-sm',
    },
    variant: {
      default: '',
      plain:
        // 표는 칸이 여러 줄이 되어도 행 경계가 보이도록 가로 구분선만 남긴다.
        'prose-code:border-0 prose-blockquote:border-0 prose-thead:border-divider-1 prose-tr:border-divider-1 prose-th:border-0 prose-td:border-0',
    },
  },
  defaultVariants: { size: 'md', variant: 'default' },
});

// remark는 마크다운 문법을 확장하고, rehype는 HTML 요소 구조(HAST)를 수정한다.
// HTML 허용 처리와 코드 강조는 아래 배열 순서로 적용한다.
const REMARK_PLUGINS = [remarkGfm, remarkCjkFriendly, remarkCjkFriendlyGfmStrikethrough];
const REHYPE_PLUGINS = [rehypeAllowedHtml, rehypeHighlightCode];

const MARKDOWN_COMPONENTS: Components = {
  a: (props) => <a target="_blank" rel="noopener noreferrer" {...withoutNode(props)} />,
  // 코드 블록의 pre를 언어 표시와 복사 버튼이 있는 UI로 교체한다.
  pre: CodeBlock,
  // 한글은 글자 사이 어디서나 줄을 바꿀 수 있어 좁은 화면에서 열이 한 글자 폭까지 줄어든다.
  // 단어 단위로만 줄을 바꾸게 하고, 열이 5개 이상이면 표에 최소 폭을 줘 칸이 세로로 길어지지 않게 한다.
  // 넘치는 폭은 감싼 상자의 가로 스크롤이 받는다.
  table: ({ className, ...props }) => (
    <div className="min-w-0 max-w-full overflow-x-auto">
      <table
        className={cn('break-keep has-[th:nth-child(5)]:min-w-140', className)}
        {...withoutNode(props)}
      />
    </div>
  ),
  img: ({ alt = '', ...props }) => <img alt={alt} {...withoutNode(props)} />,
};

export interface MarkdownProps extends VariantProps<typeof markdownVariants> {
  children: string;
  className?: string;
  showCopyButton?: boolean;
}

/**
 * 문자열을 ReactMarkdown으로 변환하고 본문에 Typography의 prose 스타일을 적용한다.
 * 표·한글 강조 문법, HTML 허용 처리, 코드 블록 UI를 이곳에서 연결한다.
 */
export function Markdown({
  children,
  size,
  variant = 'default',
  showCopyButton = true,
  className,
}: MarkdownProps) {
  return (
    <div
      data-slot="markdown"
      className={cn(
        'w-full min-w-0 max-w-full overflow-x-hidden',
        markdownVariants({ size, variant }),
        className,
      )}
    >
      {/* ReactMarkdown이 만드는 CodeBlock에서도 본문의 표시 옵션을 읽을 수 있게 한다. */}
      <CodeBlockContext.Provider value={{ variant: variant ?? 'default', showCopyButton }}>
        <ReactMarkdown
          remarkPlugins={REMARK_PLUGINS} // 마크다운 문법 확장
          rehypePlugins={REHYPE_PLUGINS} // HTML 요소 구조 후처리
          components={MARKDOWN_COMPONENTS} // 요소별 렌더링 방법
        >
          {children}
        </ReactMarkdown>
      </CodeBlockContext.Provider>
    </div>
  );
}
