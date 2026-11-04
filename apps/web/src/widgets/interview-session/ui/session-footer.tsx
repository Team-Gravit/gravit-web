import type { InterviewInputType } from '@/entities/interview-session';
import { AutoRecordToggle, TextAnswerButton, VoiceAnswerButton } from '@/features/interview-answer';

interface SessionFooterProps {
  inputType: InterviewInputType;
}

export function SessionFooter({ inputType }: SessionFooterProps) {
  if (inputType === 'TEXT') {
    return (
      <footer className="w-full bg-bg-0 md:bg-transparent">
        <TextAnswerButton />
      </footer>
    );
  }

  return (
    <footer className="flex w-full  items-center justify-center gap-5 bg-bg-0 px-4 py-5 md:bg-transparent md:py-12.5">
      <AutoRecordToggle />
      <VoiceAnswerButton />
    </footer>
  );
}
