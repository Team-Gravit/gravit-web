import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';

import ReactMarkdown, { type Components, type ExtraProps } from 'react-markdown';
import remarkCjkFriendly from 'remark-cjk-friendly/parseOnly';
import remarkCjkFriendlyGfmStrikethrough from 'remark-cjk-friendly-gfm-strikethrough/parseOnly';
import remarkGfm from 'remark-gfm';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

import { rehypeAllowedHtml } from './allowed-html';
import { rehypeHighlightCode } from './highlight-code';

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
        'prose-code:border-0 prose-blockquote:border-0 prose-thead:border-0 prose-tr:border-0 prose-th:border-0 prose-td:border-0',
    },
  },
  defaultVariants: { size: 'md', variant: 'default' },
});

const codeBlockVariants = cva(
  'not-prose my-6 min-w-0 max-w-full overflow-hidden rounded-8 bg-code-bg',
  {
    variants: {
      variant: {
        default: 'border border-code-border',
        plain: '',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

const codeBlockHeaderVariants = cva(
  'flex items-center justify-between px-4 text-caption1 text-code-muted',
  {
    variants: {
      variant: {
        default: 'border-b border-code-border py-2',
        plain: 'pt-3',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

interface CodeBlockOptions {
  variant: NonNullable<VariantProps<typeof markdownVariants>['variant']>;
  showCopyButton: boolean;
}

const CodeBlockContext = createContext<CodeBlockOptions>({
  variant: 'default',
  showCopyButton: true,
});

// react-markdown의 HAST `node`가 DOM 속성으로 전달되지 않게 제거한다.
function withoutNode<T extends ExtraProps>(props: T): Omit<T, 'node'> {
  const elementProps = { ...props };
  delete elementProps.node;
  return elementProps;
}

// remark는 Markdown 문법을 확장하고, rehype는 변환된 HAST를 후처리한다.
const REMARK_PLUGINS = [remarkGfm, remarkCjkFriendly, remarkCjkFriendlyGfmStrikethrough];
const REHYPE_PLUGINS = [rehypeAllowedHtml, rehypeHighlightCode];

// Prism 토큰에 GitHub Light 계열 색상을 적용하고, 나머지는 코드 본문색을 유지한다.
const PRISM_TOKEN_CLASS = [
  '[&_.token.keyword]:text-code-keyword [&_.token.operator]:text-code-keyword [&_.token.important]:text-code-keyword',
  '[&_.token.function]:text-code-function [&_.token.decorator]:text-code-function',
  '[&_.token.class-name]:text-code-type',
  '[&_.token.string]:text-code-string [&_.token.char]:text-code-string [&_.token.regex]:text-code-string [&_.token.attr-value]:text-code-string',
  '[&_.token.number]:text-code-constant [&_.token.boolean]:text-code-constant [&_.token.constant]:text-code-constant [&_.token.builtin]:text-code-constant [&_.token.attr-name]:text-code-constant [&_.token.property]:text-code-constant',
  '[&_.token.tag]:text-code-tag',
  '[&_.token.comment]:text-code-comment [&_.token.comment]:italic [&_.token.prolog]:text-code-comment',
];

const LANGUAGE_LABELS: Record<string, string> = {
  bash: 'Bash',
  c: 'C',
  cpp: 'C++',
  csharp: 'C#',
  css: 'CSS',
  html: 'HTML',
  java: 'Java',
  javascript: 'JavaScript',
  js: 'JavaScript',
  json: 'JSON',
  jsx: 'JSX',
  kotlin: 'Kotlin',
  python: 'Python',
  shell: 'Shell',
  sql: 'SQL',
  swift: 'Swift',
  text: 'Text',
  ts: 'TypeScript',
  tsx: 'TSX',
  typescript: 'TypeScript',
};

interface CodeElementProps {
  children?: ReactNode;
  className?: string;
}

function toPlainText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(toPlainText).join('');
  }

  return isValidElement<CodeElementProps>(node) ? toPlainText(node.props.children) : '';
}

function getCodeBlockInfo(children: ReactNode) {
  const codeElement = Children.toArray(children).find((child) =>
    isValidElement<CodeElementProps>(child),
  );

  if (!isValidElement<CodeElementProps>(codeElement)) {
    return { languageLabel: 'Text', hasLanguage: false, source: toPlainText(children) };
  }

  const language = codeElement.props.className?.match(/(?:^|\s)language-([\w-]+)/)?.[1];

  return {
    languageLabel: language ? (LANGUAGE_LABELS[language] ?? language.toUpperCase()) : 'Text',
    hasLanguage: Boolean(language),
    source: toPlainText(codeElement.props.children).replace(/\n$/, ''),
  };
}

type MarkdownCodeBlockProps = ComponentProps<'pre'> & ExtraProps;

function MarkdownCodeBlock({ children, className, ...props }: MarkdownCodeBlockProps) {
  const { variant, showCopyButton } = useContext(CodeBlockContext);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const { languageLabel, hasLanguage, source } = getCodeBlockInfo(children);
  const showHeader = variant === 'default' || hasLanguage || showCopyButton;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
  };

  const copyLabel =
    copyStatus === 'copied' ? '복사됨' : copyStatus === 'failed' ? '복사 실패' : '복사';

  return (
    <div data-slot="markdown-code-block" className={codeBlockVariants({ variant })}>
      {showHeader ? (
        <div className={codeBlockHeaderVariants({ variant })}>
          <span className="font-mono">
            {hasLanguage || variant === 'default' ? languageLabel : null}
          </span>
          {showCopyButton ? (
            <button
              type="button"
              className="cursor-pointer rounded-4 px-2 py-1 hover:bg-code-border/50 focus-visible:ring-2 focus-visible:ring-main focus-visible:outline-none"
              onClick={() => void handleCopy()}
            >
              <span aria-live="polite">{copyLabel}</span>
            </button>
          ) : null}
        </div>
      ) : null}
      <pre
        tabIndex={0}
        aria-label={`${languageLabel} 코드`}
        className={cn(
          'w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain whitespace-pre p-4 font-mono text-label1 font-normal text-code-text [font-variant-ligatures:none]',
          'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-main focus-visible:outline-none',
          '[&>code]:block [&>code]:min-w-max [&>code]:font-mono',
          PRISM_TOKEN_CLASS,
          className,
        )}
        {...withoutNode(props)}
      >
        {children}
      </pre>
    </div>
  );
}

const MARKDOWN_COMPONENTS: Components = {
  a: (props) => <a target="_blank" rel="noopener noreferrer" {...withoutNode(props)} />,
  pre: MarkdownCodeBlock,
  table: ({ className, ...props }) => (
    <div className="min-w-0 max-w-full overflow-x-auto">
      <table className={className} {...withoutNode(props)} />
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
 * Markdown을 Typography prose 스타일로 렌더링한다.
 * GFM과 한글 강조 문법을 지원하며, 원시 HTML은 `<br>`과 `<img>`만 허용한다.
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
      <CodeBlockContext.Provider value={{ variant: variant ?? 'default', showCopyButton }}>
        <ReactMarkdown
          remarkPlugins={REMARK_PLUGINS}
          rehypePlugins={REHYPE_PLUGINS}
          components={MARKDOWN_COMPONENTS}
        >
          {children}
        </ReactMarkdown>
      </CodeBlockContext.Provider>
    </div>
  );
}
