import { cn } from '@/shared/lib/cn';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import type { InterviewSessionSummaryResponse } from '@/entities/interview';

// 시안의 막대 두 색은 토큰이 없어 Figma 원본 값을 그대로 쓴다(FEAT-062 spec 「확인 필요」).
const ACCURACY_BAR_CLASS = 'bg-[#D3C8F3]';
const DELIVERY_BAR_CLASS = 'bg-[#5C49A8]';
// 문항 만점. 정확도 14 + 전달력 6 (API 설명).
const QUESTION_MAX_SCORE = 20;
// 칸이 이보다 낮으면 숫자를 칸 안에 넣지 않고 막대 위로 올린다.
const INSIDE_LABEL_MIN_RATIO = 0.12;
const Y_AXIS_LABELS = ['100%', '50%', '0%'];

export interface QuestionScoreChartProps {
  answers: InterviewSessionSummaryResponse['answers'];
  layout: 'wide' | 'narrow';
  /** 막대를 누르면 그 문항의 상세로 이동한다. */
  onQuestionSelect: (displayOrder: number) => void;
}

export function QuestionScoreChart({ answers, layout, onQuestionSelect }: QuestionScoreChartProps) {
  const isWide = layout === 'wide';

  return (
    <Card className="items-end gap-4 px-0 py-4 md:gap-6 md:px-8 md:py-7">
      <CardHeader className="px-4 md:px-0">
        <CardTitle>문항별 득점</CardTitle>
        <span className="hidden text-body1-normal text-text-4 md:inline">
          클릭 시 상세 점수를 확인할 수 있어요
        </span>
      </CardHeader>
      <div className={cn('flex w-full gap-3 px-4 md:gap-4 md:px-0', isWide ? 'h-75' : 'h-37')}>
        <div
          aria-hidden
          className={cn(
            'flex shrink-0 flex-col items-end justify-between text-text-3',
            isWide ? 'h-68.25 px-2 text-body1-normal' : 'h-33.5 text-caption2',
          )}
        >
          {Y_AXIS_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="relative flex flex-1 items-end justify-between">
            <span aria-hidden className="absolute inset-x-0 top-[5%] border-t border-divider-1" />
            <span
              aria-hidden
              className="absolute inset-x-0 top-[52.5%] border-t border-divider-1"
            />
            {answers.map((answer) => (
              <QuestionBar
                key={answer.displayOrder}
                answer={answer}
                isWide={isWide}
                onSelect={() => onQuestionSelect(answer.displayOrder)}
              />
            ))}
          </div>
          <div
            className={cn(
              'flex border-t border-text-4 text-text-2',
              isWide ? 'pt-4 text-body1-normal' : 'pt-2 text-caption2',
            )}
          >
            {answers.map((answer) => (
              <span key={answer.displayOrder} className="flex-1 text-center">
                Q{answer.displayOrder}
              </span>
            ))}
          </div>
        </div>
      </div>
      <ul
        className={cn(
          'flex gap-3 px-4 text-text-1 md:gap-4 md:px-0',
          isWide ? 'text-body2-normal' : 'text-caption2',
        )}
      >
        <LegendItem colorClass={ACCURACY_BAR_CLASS} label="정확도" />
        <LegendItem colorClass={DELIVERY_BAR_CLASS} label="전달력" />
      </ul>
    </Card>
  );
}

interface QuestionBarProps {
  answer: InterviewSessionSummaryResponse['answers'][number];
  isWide: boolean;
  onSelect: () => void;
}

function QuestionBar({ answer, isWide, onSelect }: QuestionBarProps) {
  const accuracyRatio = answer.accuracyScore / QUESTION_MAX_SCORE;
  const deliveryRatio = answer.deliveryScore / QUESTION_MAX_SCORE;
  const isAccuracyLabelOutside = accuracyRatio < INSIDE_LABEL_MIN_RATIO;
  const labelClass = isWide ? 'text-label1' : 'text-caption2';

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Q${answer.displayOrder} 정확도 ${answer.accuracyScore}점, 전달력 ${answer.deliveryScore}점`}
      // 막대 높이는 부모 높이 대비 비율이다. 100% 선이 위에서 5% 아래에 있어 그만큼 줄인다.
      className="relative flex h-[95%] flex-1 cursor-pointer flex-col items-center justify-end"
    >
      {isAccuracyLabelOutside ? (
        <span className={cn('mb-1 text-text-3', labelClass)}>{answer.accuracyScore}점</span>
      ) : null}
      <span
        className={cn(
          'flex flex-col overflow-hidden rounded-t-6 md:rounded-t-8',
          isWide ? 'w-25' : 'w-7.5',
        )}
        style={{ height: `${(accuracyRatio + deliveryRatio) * 100}%` }}
      >
        <span
          className={cn(
            'flex items-center justify-center text-text-3',
            ACCURACY_BAR_CLASS,
            labelClass,
          )}
          style={{ flexGrow: answer.accuracyScore }}
        >
          {isAccuracyLabelOutside ? null : `${answer.accuracyScore}${isWide ? '점' : ''}`}
        </span>
        <span
          className={cn(
            'flex items-center justify-center text-cta-text',
            DELIVERY_BAR_CLASS,
            labelClass,
          )}
          style={{ flexGrow: answer.deliveryScore }}
        >
          {answer.deliveryScore > 0 ? `${answer.deliveryScore}${isWide ? '점' : ''}` : null}
        </span>
      </span>
    </button>
  );
}

function LegendItem({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <li className="flex items-center gap-1 md:gap-1.25">
      <span aria-hidden className={cn('size-2.5 rounded-4 md:size-4', colorClass)} />
      {label}
    </li>
  );
}
