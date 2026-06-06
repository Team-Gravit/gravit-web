// API나 UI와 무관한 순수 로직들
export const formatDate = (date: Date) => {
  return date.toLocaleDateString('ko-KR');
};

export const formatRelativeTime = (dateString: string) => {
  const targetTime = new Date(dateString).getTime();
  const diffMs = Date.now() - targetTime;

  if (Number.isNaN(targetTime)) return '';
  if (diffMs < 0) return '방금 전';

  const minute = Math.floor(diffMs / (1000 * 60));
  if (minute < 1) return '방금 전';
  if (minute < 60) return `${minute}분 전`;

  const hour = Math.floor(minute / 60);
  if (hour < 24) return `${hour}시간 전`;

  const day = Math.floor(hour / 24);
  if (day < 30) return `${day}일 전`;

  const month = Math.floor(day / 30);
  if (month < 12) return `${month}개월 전`;

  const year = Math.floor(month / 12);
  return `${year}년 전`;
};
