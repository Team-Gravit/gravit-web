import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

// 고지 문서(처리방침·약관) 본문을 이루는 조각들. 화면은 문구만 채우고 모양은 여기서 정한다.

export interface DocumentSectionProps {
  /** 넘기면 번호를 제목 왼쪽 칸에 따로 두고 본문을 그만큼 들여 쓴다. */
  number?: number;
  title: string;
  children: ReactNode;
}

export function DocumentSection({ number, title, children }: DocumentSectionProps) {
  const hasNumber = number !== undefined;

  return (
    <section className="flex w-full flex-col gap-2">
      <h2 className="flex text-headline1 text-text-1">
        {hasNumber ? <span className="w-6 shrink-0">{number}.</span> : null}
        <span>{title}</span>
      </h2>
      <div className={cn('flex w-full flex-col gap-5', hasNumber && 'pl-6')}>{children}</div>
    </section>
  );
}

export interface DocumentSubsectionProps {
  title?: string;
  children: ReactNode;
}

export function DocumentSubsection({ title, children }: DocumentSubsectionProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      {title ? <h3 className="text-headline2 text-text-1">{title}</h3> : null}
      {children}
    </div>
  );
}

export function DocumentText({ children }: { children: ReactNode }) {
  return <p className="text-body2-normal text-text-3">{children}</p>;
}

export interface DocumentListProps {
  items: ReactNode[];
  /** 약관 조항처럼 순서가 의미를 가지면 번호를 붙인다. */
  isOrdered?: boolean;
  /** 날짜처럼 눈에 띄어야 하는 짧은 항목에 쓴다. */
  isEmphasized?: boolean;
}

export function DocumentList({
  items,
  isOrdered = false,
  isEmphasized = false,
}: DocumentListProps) {
  const ListTag = isOrdered ? 'ol' : 'ul';
  const textClass = isEmphasized ? 'text-label1 text-text-2' : 'text-body2-normal text-text-3';

  return (
    <ListTag className="flex w-full flex-col gap-1.5">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          {isOrdered ? (
            <span className={cn('w-4 shrink-0', textClass)}>{index + 1}.</span>
          ) : (
            <span aria-hidden className="mt-2.5 size-[3px] shrink-0 rounded-full bg-text-4" />
          )}
          <div className={cn('flex min-w-0 flex-1 flex-col gap-1.5', textClass)}>{item}</div>
        </li>
      ))}
    </ListTag>
  );
}

export interface DocumentNoteProps {
  /** `accent`는 문서 첫머리 요약처럼 먼저 읽혀야 하는 안내에 쓴다. */
  tone?: 'default' | 'accent';
  title?: string;
  children: ReactNode;
}

export function DocumentNote({ tone = 'default', title, children }: DocumentNoteProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-2 rounded-12 p-4 text-body2-normal text-text-3',
        tone === 'accent' ? 'bg-purple-50' : 'bg-bg-1',
      )}
    >
      {title ? <p className="text-label1 text-text-2">{title}</p> : null}
      {children}
    </div>
  );
}

export interface DocumentTableProps {
  columns: [string, string];
  rows: [ReactNode, ReactNode][];
}

export function DocumentTable({ columns, rows }: DocumentTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-8 border border-bg-2">
      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="border-b border-bg-2">
            {columns.map((column, index) => (
              <th
                key={column}
                scope="col"
                className={cn('p-2 text-label2 text-text-2', index === 0 && 'border-r border-bg-2')}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([first, second], index) => (
            <tr key={index} className="border-b border-bg-2 last:border-b-0">
              <td className="border-r border-bg-2 p-2 align-top text-caption1 text-text-3">
                {first}
              </td>
              <td className="p-2 align-top text-caption1 text-text-3">{second}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface DocumentInfoCardProps {
  title?: string;
  rows: { label: string; value: ReactNode }[];
}

/** 이름표와 값을 나란히 두는 카드. 보호책임자·국외 이전처럼 항목이 정해진 정보에 쓴다. */
export function DocumentInfoCard({ title, rows }: DocumentInfoCardProps) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-12 bg-bg-1 p-4">
      {title ? <p className="text-label1 text-text-1">{title}</p> : null}
      <dl className="flex w-full flex-col gap-2">
        {rows.map((row) => (
          <div key={row.label} className="flex w-full gap-4">
            <dt className="w-20 shrink-0 text-label2 text-text-3">{row.label}</dt>
            <dd className="min-w-0 flex-1 text-label1 text-text-2">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
