import { useId } from 'react';

import { useInterviewSessionAutoRecord } from '@/entities/interview-session';

import { Switch } from '@/shared/ui/switch';

export function AutoRecordToggle() {
  const { isAutoRecord, setIsAutoRecord } = useInterviewSessionAutoRecord();

  const labelId = useId();

  return (
    <div className="flex flex-col gap-1 items-center justify-center">
      <Switch checked={isAutoRecord} onCheckedChange={setIsAutoRecord} aria-labelledby={labelId} />
      <span id={labelId} className="text-text-3 text-caption1 md:text-label1">
        자동 답변
      </span>
    </div>
  );
}
