import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';
import { Markdown } from '@/shared/ui/markdown';
import { RecordingPlayer, formatPlaybackTime } from '@/shared/ui/recording-player';
import type { InterviewAnswerDetailResponse } from '@/entities/interview';

import { ItemScoreCard } from './item-score-card';

// 무응답 문항은 답변과 개선 제안이 null로 온다(API 설명). 시안에 무응답 화면이 없어 FEAT-062 spec에 기록했다.
const NO_ANSWER_MESSAGE = '답변하지 않은 문항이에요.';
const NO_IMPROVEMENT_MESSAGE = '답변하지 않아 개선 피드백이 없어요.';

export interface AnswerDetailProps {
  answer: InterviewAnswerDetailResponse;
  layout: 'wide' | 'narrow';
  className?: string;
}

export function AnswerDetail({ answer, layout, className }: AnswerDetailProps) {
  const isWide = layout === 'wide';

  return (
    <div className={cn('flex flex-col', className)}>
      <DetailSection isWide={isWide} className={isWide ? 'gap-7' : 'gap-3 pt-0'}>
        <h3
          className={
            isWide ? 'text-heading1 text-text-1' : 'text-headline2 leading-[1.4] text-text-1'
          }
        >
          {isWide ? `Q. ${answer.questionContent}` : answer.questionContent}
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-4 rounded-6 border border-divider-1 bg-bg-1 p-4 md:rounded-8 md:p-6">
            <div className="flex flex-col gap-2">
              <span className="text-caption1 text-text-4">내 답변</span>
              <p className="text-label2 whitespace-pre-line text-text-1 md:text-body1-normal">
                {answer.answerContent ?? NO_ANSWER_MESSAGE}
              </p>
            </div>
            {answer.audioUrl ? (
              <RecordingPlayer
                size="md"
                audioUrl={answer.audioUrl}
                className="h-12 border-0 py-3 pl-3"
                renderLabel={({ duration, remaining }) => (
                  <div className="flex shrink-0 flex-col items-center gap-0.5">
                    <span className="text-caption1 text-text-1">
                      {formatPlaybackTime(duration)}
                    </span>
                    <span className="text-caption2 hidden text-text-4 md:inline">
                      남은시간 {formatPlaybackTime(remaining)}
                    </span>
                  </div>
                )}
              />
            ) : null}
          </div>
          <div className="flex flex-col gap-1 rounded-6 border border-purple-200 bg-purple-50 p-4 md:rounded-12 md:p-6">
            <span className="text-caption1 text-main-1">모범답안</span>
            <Markdown size="sm" variant="plain" className="text-text-1 md:prose-base">
              {answer.modelAnswer}
            </Markdown>
          </div>
        </div>
      </DetailSection>

      <DetailSection isWide={isWide} title="항목별 점수">
        <div className={cn('flex gap-2 md:gap-4', isWide ? 'flex-row' : 'flex-col sm:flex-row')}>
          <ItemScoreCard
            label="정확도"
            score={answer.accuracyScore}
            maxScore={answer.accuracyMaxScore}
          />
          <ItemScoreCard
            label="구조성"
            score={answer.structureScore}
            maxScore={answer.structureMaxScore}
          />
          <ItemScoreCard
            label="명료성"
            score={answer.clarityScore}
            maxScore={answer.clarityMaxScore}
          />
        </div>
      </DetailSection>

      <DetailSection isWide={isWide} title="핵심 개념">
        <ul className="flex flex-col gap-2 rounded-6 border border-divider-1 bg-bg-1 p-4 md:rounded-8 md:p-6">
          {answer.concepts.map((concept) => (
            <li
              key={concept.name}
              className="flex items-start gap-1 text-label2 text-text-2 md:text-body1-normal"
            >
              {/* 아이콘을 글자 한 줄 높이 안에서 가운데 두어, 개념이 여러 줄이어도 첫 줄과 맞춘다. */}
              <span className="flex h-lh shrink-0 items-center">
                <Icon
                  name="check-circle"
                  size={isWide ? 24 : 20}
                  className="text-semantic-success"
                />
              </span>
              <span>{concept.name}</span>
            </li>
          ))}
        </ul>
      </DetailSection>

      <DetailSection isWide={isWide} title="개선 피드백" isLast>
        <div className="rounded-6 border border-divider-1 bg-bg-1 p-4 md:rounded-8 md:p-6">
          {answer.improvementSuggestion ? (
            <Markdown size="sm" variant="plain" className="text-text-2 md:prose-base">
              {answer.improvementSuggestion}
            </Markdown>
          ) : (
            <p className="text-label2 text-text-3 md:text-body1-normal">{NO_IMPROVEMENT_MESSAGE}</p>
          )}
        </div>
      </DetailSection>
    </div>
  );
}

interface DetailSectionProps {
  isWide: boolean;
  title?: string;
  isLast?: boolean;
  className?: string;
  children: ReactNode;
}

function DetailSection({ isWide, title, isLast = false, className, children }: DetailSectionProps) {
  return (
    <section
      className={cn(
        'flex flex-col',
        isWide ? 'gap-4 px-8 py-7' : 'gap-3 py-4',
        !isLast && 'border-b border-divider-2',
        className,
      )}
    >
      {title ? <h4 className="text-headline2 text-text-1 md:text-heading1">{title}</h4> : null}
      {children}
    </section>
  );
}
