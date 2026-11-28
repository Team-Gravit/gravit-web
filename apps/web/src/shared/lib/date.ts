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

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (diff <= 0) return `${pad(0)}일 ${pad(0)}시간 ${pad(0)}분 ${pad(0)}초`;

  const DAY = 1000 * 60 * 60 * 24;
  const HOUR = 1000 * 60 * 60;
  const MINUTE = 1000 * 60;

  const days = Math.floor(diff / DAY);
  const hours = Math.floor((diff % DAY) / HOUR);
  const minutes = Math.floor((diff % HOUR) / MINUTE);
  const seconds = Math.floor((diff % MINUTE) / 1000);

  return `${pad(days)}일 ${pad(hours)}시간 ${pad(minutes)}분 ${pad(seconds)}초`;
};

/**
 * ISO 날짜 문자열을 `YYYY.MM.DD`로 표기한다. 시간·타임존은 버린다.
 * 예: `2026-06-21T12:30:00Z` → `2026.06.21`
 */
export const formatISODate = (isoDate: string): string => {
  return isoDate.split('T')[0].replace(/-/g, '.');
};
