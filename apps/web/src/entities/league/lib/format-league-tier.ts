const ROMAN_NUMERAL_MAP: Record<string, string> = {
  '1': 'I',
  '2': 'II',
  '3': 'III',
  '4': 'IV',
  '5': 'V',
};

const SHORT_TIER_MAP: Record<string, string> = {
  브론즈: 'B',
  실버: 'S',
  골드: 'G',
  플래티넘: 'P',
  다이아몬드: 'D',
};

/** "브론즈 3" → "브론즈 III". 티어명 뒤 숫자를 로마자로 바꾼다. */
export function formatLeagueTier(tier: string): string {
  const match = tier.trim().match(/^(.+?)\s*(\d+)$/);
  if (!match) {
    return tier;
  }
  const [, tierName, division] = match;
  return `${tierName} ${ROMAN_NUMERAL_MAP[division] ?? division}`;
}

/** "브론즈 3" → "B3". 차트 축 라벨용 축약. */
export function formatShortLeagueTier(tier: string): string {
  const match = tier.trim().match(/^(.+?)\s*(\d+)$/);
  if (!match) {
    return tier;
  }
  const [, tierName, division] = match;
  return `${SHORT_TIER_MAP[tierName] ?? tierName}${division}`;
}
