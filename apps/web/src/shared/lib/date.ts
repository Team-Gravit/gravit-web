export const getNextMonday = (): Date => {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 1 : 8 - day;
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + diff);
  nextMonday.setHours(0, 0, 0, 0);
  return nextMonday;
};

/**
 * 경과 초를 `mm:ss` 로 작성하도록 포맷팅하는 함수
 */
export const formatElapsedTime = (totalSeconds: number): string => {
  const safeSeconds = Math.max(Math.floor(totalSeconds), 0); // 음수 / 소수 방어

  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(minutes)}:${pad(seconds)}`;
};

export const getRemainingTime = (targetTimeMs: number): string => {
  const diff = targetTimeMs - Date.now();
  if (diff <= 0) return '00시간 00분 00초';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${pad(hours)}시간 ${pad(minutes)}분 ${pad(seconds)}초`;
};
