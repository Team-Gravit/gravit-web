import type { ReactNode } from 'react';

import { Chip } from '@/shared/ui/chip';

import {
  INTERVIEW_DIFFICULTY_LABEL,
  INTERVIEW_MODE_LABEL,
  INTERVIEW_STACK_GROUP_LABEL,
  useCsTopics,
  useInterviewStacks,
  type InterviewInputType,
  type InterviewStack,
  type InterviewStackGroup,
} from '@/entities/interview';

import { useSessionSetupStore } from '../model/session-setup-store';

// 음성은 시간 종료 시 자동 제출되고 텍스트는 직접 제출하므로 안내를 따로 둔다.
const INPUT_TYPE_START_GUIDES: Record<InterviewInputType, string[]> = {
  VOICE: [
    '시작 전 마이크 권한을 확인해주세요. 권한이 없으면 진행할 수 없어요',
    '답변은 재녹음 없이 한 번만 녹음돼요',
    '2분이 지나면 자동으로 제출돼요',
    '2분 동안 답변이 없으면 미응답(0점) 처리돼요',
  ],
  TEXT: [
    '답변은 최대 1,000자까지 작성할 수 있어요',
    '권장 답변 시간은 2분이에요 (자동 제출되지 않아요)',
    '제출 후에는 다시 수정할 수 없어요',
  ],
};

/**
 * 세션 생성 전 선택 내용을 확인한다. CS는 분야, 직군별 면접은 직군·스택을 표시한다.
 * 여기서는 수정하지 않으며 이전 버튼으로 돌아가 변경한다. 생성 버튼은 SessionSetup에서 연결한다.
 */
export function ConfirmStep() {
  const inputType = useSessionSetupStore((state) => state.inputType);
  const mode = useSessionSetupStore((state) => state.mode);
  const stackGroup = useSessionSetupStore((state) => state.stackGroup);
  const stack = useSessionSetupStore((state) => state.stack);
  const difficulty = useSessionSetupStore((state) => state.difficulty);

  if (inputType === null || mode === null || difficulty === null) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      {/* 공용 Card의 여백·그림자와 달라 확인 패널은 별도 마크업으로 구성한다. */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        <section aria-label="세션 정보" className="grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-4">
          <SessionInfoCard label="문항 수" amount="5" unit="문항" />
          <SessionInfoCard label="예상 소요시간" amount="10" unit="분" prefix="약" />
        </section>
        <section
          aria-label="선택 항목"
          className="flex min-w-0 flex-col items-start gap-2 rounded-12 bg-bg-0 p-3 md:gap-4 md:p-8"
        >
          <Chip variant="soft" size="lg">
            {inputType === 'VOICE' ? '음성 면접' : '텍스트 면접'}
          </Chip>
          <dl className="flex w-full flex-col gap-2 md:gap-3">
            <SummaryRow label="모드">{INTERVIEW_MODE_LABEL[mode]}</SummaryRow>
            {mode === 'COMMON_CS' && <CsTopicsSummary />}
            {mode === 'JOB_SPECIFIC' && stackGroup !== null && stack !== null && (
              <JobSummary stackGroup={stackGroup} stack={stack} />
            )}
            <SummaryRow label="난이도">{INTERVIEW_DIFFICULTY_LABEL[difficulty]}</SummaryRow>
          </dl>
        </section>
      </div>
      <section
        aria-labelledby="start-guide-heading"
        className="flex flex-col gap-2 rounded-12 bg-purple-50 p-4 shadow-[0px_4px_32px_0px_#00000006] md:gap-6 md:px-12 md:py-8"
      >
        <h2 id="start-guide-heading" className="text-headline2 text-text-1 md:text-heading1">
          시작 전에 확인해주세요!
        </h2>
        <ul className="flex list-disc flex-col gap-2 pl-6 text-body1-reading text-text-3 md:gap-4 md:text-headline1">
          {INPUT_TYPE_START_GUIDES[inputType].map((guide) => (
            <li key={guide}>{guide}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

interface SessionInfoCardProps {
  label: string;
  amount: string;
  unit: string;
  prefix?: string;
}

// 숫자·단위는 글자 크기가 달라도 기준선이 같도록 한 줄의 인라인 요소로 배치한다.
function SessionInfoCard({ label, amount, unit, prefix }: SessionInfoCardProps) {
  return (
    <dl className="flex min-w-0 flex-col justify-between gap-3 rounded-12 bg-bg-0 p-3 md:flex-row md:items-center md:p-8">
      <dt className="self-start">
        <Chip
          variant="neutral"
          size={{ base: 'md', md: 'lg' }}
          typography={{ base: 'reading', md: 'default' }}
        >
          {label}
        </Chip>
      </dt>
      <dd className="space-x-3 whitespace-nowrap text-right text-body1-normal text-text-3 md:px-4 md:text-heading1">
        {prefix && <span>{prefix}</span>}
        <span className="text-title1 text-purple-700 md:text-display1">{amount}</span>
        <span>{unit}</span>
      </dd>
    </dl>
  );
}

interface SummaryRowProps {
  label: string;
  children: ReactNode;
}

function SummaryRow({ label, children }: SummaryRowProps) {
  return (
    <div className="flex items-start justify-between gap-5 rounded-8 px-4 py-1">
      <dt className="shrink-0 text-headline2 text-text-3 md:text-heading2">{label}</dt>
      <dd className="min-w-0 break-words text-right text-body1-normal text-text-1 md:text-headline1">
        {children}
      </dd>
    </div>
  );
}

function CsTopicsSummary() {
  const selectedTopics = useSessionSetupStore((state) => state.topics);
  const { data: topics } = useCsTopics();

  // 목록 조회에 실패해도 선택 내용은 보여줘야 하므로 표시명이 없으면 식별자를 쓴다.
  const selectedTopicLabels = selectedTopics.map(
    (selectedTopic) =>
      topics?.find(({ topic }) => topic === selectedTopic)?.displayName ?? selectedTopic,
  );

  return (
    <SummaryRow label="주제">
      <span className="flex flex-col items-end gap-2 md:block">
        {selectedTopicLabels.map((label, index) => (
          <span key={selectedTopics[index]}>
            {label}
            {index < selectedTopicLabels.length - 1 && <span className="hidden md:inline">, </span>}
          </span>
        ))}
      </span>
    </SummaryRow>
  );
}

interface JobSummaryProps {
  stackGroup: InterviewStackGroup;
  stack: InterviewStack;
}

function JobSummary({ stackGroup, stack }: JobSummaryProps) {
  const { data: stacks } = useInterviewStacks(stackGroup);
  // 표시명을 받지 못한 경우에도 선택한 스택을 숨기지 않는다.
  const selectedStackLabel =
    stacks?.find((stackOption) => stackOption.stack === stack)?.displayName ?? stack;

  return (
    <>
      <SummaryRow label="직군">{INTERVIEW_STACK_GROUP_LABEL[stackGroup]}</SummaryRow>
      <SummaryRow label="스택">{selectedStackLabel}</SummaryRow>
    </>
  );
}
