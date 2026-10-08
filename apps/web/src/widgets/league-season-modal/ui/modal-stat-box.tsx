export interface ModalStatBoxProps {
  value: string;
  label: string;
}

/** 모달 하단의 값+라벨 통계 칸. */
export function ModalStatBox({ value, label }: ModalStatBoxProps) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-8 bg-bg-2 px-4 py-4 md:bg-bg-1">
      <span className="text-headline2 text-text-2 md:text-heading1">{value}</span>
      <span className="text-caption1 text-text-4 md:text-[16px]">{label}</span>
    </div>
  );
}
