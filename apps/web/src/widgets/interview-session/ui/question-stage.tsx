import { AvatarStage } from './avatar-stage';

interface QuestionStageProps {
  /** 현재 문항 번호(1부터). */
  current: number;
  total: number;
  content: string;
}

/** 아바타 영상 영역 + 질문 토스트(N/M · 문항 본문). 표시 전용. */
export function QuestionStage({ current, total, content }: QuestionStageProps) {
  return (
    <section className="flex-1 px-4 py-5 md:max-w-[80%] md:w-full md:mx-auto md:pt-1.5 md:px-0 md:pb-0 flex flex-col items-center justify-center w-full">
      <div className="w-full bg-bg-0 rounded-8 md:rounded-24 flex-1 flex flex-col overflow-hidden">
        <AvatarStage />
        <div className="p-4 pt-3 md:px-10 md:py-7 flex flex-col md:flex-row gap-1 md:items-center md:gap-6">
          <span className="text-label-1 md:text-headline1 text-text-4">{`${current}/${total}`}</span>
          <p className="text-headline2 md:text-title3 text-text-1 md:min-h-19.5 md:overflow-scroll scrollbar-hide md:flex md:items-center md:flex-1 md:justify-center">
            {content}
          </p>
        </div>
      </div>
    </section>
  );
}
