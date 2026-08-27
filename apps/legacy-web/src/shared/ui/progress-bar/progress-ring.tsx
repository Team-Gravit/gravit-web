import { useId } from 'react';

import { cn } from '@/shared/lib/cn';

interface ProgressRingProps {
  children?: React.ReactNode;
  value: number;
  size?: number;
  strokeClassName?: string;
}

export default function ProgressRing({
  children,
  value,
  size = 64,
  strokeClassName,
}: ProgressRingProps) {
  const strokeWidth = 3;

  const safeValue = Math.min(Math.max(value, 0), 100);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeValue / 100) * circumference;
  const gradientId = useId();
  const contentSize = size - 12;

  return (
    <div
      style={{
        width: size,
        height: size,
      }}
      className="relative items-center justify-center flex shrink-0"
    >
      <svg
        style={{
          width: size,
          height: size,
        }}
        className="absolute inset-0 rotate-90 -scale-x-[1]"
        aria-hidden="true"
      >
        <linearGradient id={gradientId} x1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8100B3" />
          <stop offset="100%" stopColor="#DD00FF" />
        </linearGradient>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className="stroke-gray-200"
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn('transition-all', strokeClassName)}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="none"
        />
      </svg>

      <div
        className="absolute inset-0 grid place-items-center"
        style={{ width: size, height: size }}
      >
        <div
          style={{ width: contentSize, height: contentSize }}
          className="overflow-hidden [&>svg]:size-full [&>svg]:block"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
