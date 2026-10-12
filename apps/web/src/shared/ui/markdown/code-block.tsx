import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';

import { type ExtraProps } from 'react-markdown';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

import { withoutNode } from './without-node';

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
  variant: NonNullable<VariantProps<typeof codeBlockVariants>['variant']>;
  showCopyButton: boolean;
}

// Markdown의 Provider와 CodeBlock이 같은 Context를 사용해 표시 옵션을 공유한다.
export const CodeBlockContext = createContext<CodeBlockOptions>({
  variant: 'default',
  showCopyButton: true,
});

// rehypeHighlightCode가 붙인 token 클래스에 색상을 적용한다. 실제 색상은 tokens.css에 있다.
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

type CopyStatus = 'idle' | 'copied' | 'failed';

const COPY_LABELS: Record<CopyStatus, string> = {
  idle: '복사',
  copied: '복사됨',
  failed: '복사 실패',
};

interface CodeElementProps {
  children?: ReactNode;
  className?: string;
}

// 문법 강조로 여러 span에 나뉜 글자를 모아, 마크업 없이 코드 본문만 복사한다.
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

  // 코드 펜스의 언어명은 ReactMarkdown이 code의 language-* 클래스로 전달한다.
  const language = codeElement.props.className?.match(/(?:^|\s)language-([\w-]+)/)?.[1];

  return {
    languageLabel: language ? (LANGUAGE_LABELS[language] ?? language.toUpperCase()) : 'Text',
    hasLanguage: Boolean(language),
    source: toPlainText(codeElement.props.children).replace(/\n$/, ''),
  };
}

type CodeBlockProps = ComponentProps<'pre'> & ExtraProps;

/** 변환된 코드 요소를 받아 언어명·복사 버튼·스크롤 영역을 표시한다. */
export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const { variant, showCopyButton } = useContext(CodeBlockContext);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const { languageLabel, hasLanguage, source } = getCodeBlockInfo(children);
  const shouldShowHeader = variant === 'default' || hasLanguage || showCopyButton;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
  };

  return (
    <div data-slot="markdown-code-block" className={codeBlockVariants({ variant })}>
      {shouldShowHeader ? (
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
              <span aria-live="polite">{COPY_LABELS[copyStatus]}</span>
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
