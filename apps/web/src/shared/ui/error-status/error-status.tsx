import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import error404Illustration from './assets/error-404.svg';

const ILLUSTRATIONS = {
  404: error404Illustration,
} as const;

export type ErrorStatusCode = keyof typeof ILLUSTRATIONS;

export interface ErrorStatusProps {
  code: ErrorStatusCode;
  title: string;
  descriptionLines: string[];
  actions: ReactNode;
  className?: string;
}

export function ErrorStatus({
  code,
  title,
  descriptionLines,
  actions,
  className,
}: ErrorStatusProps) {
  return (
    <div
      data-slot="error-status"
      className={cn(
        'flex flex-1 flex-col items-center justify-center md:flex-none md:gap-6',
        className,
      )}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-10 px-4 md:flex-none md:gap-6">
        <img src={ILLUSTRATIONS[code]} alt="" className="w-43 md:w-60" />
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-heading1 text-text-1 md:text-title3 md:text-text-2">{title}</h1>
          <p className="text-body2-normal text-text-4 md:text-body1-normal">
            {descriptionLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>
      <div className="flex w-full gap-3 px-4 py-5 md:w-auto md:gap-4 md:p-0">{actions}</div>
    </div>
  );
}
