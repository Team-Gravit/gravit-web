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

export const formatLeagueTier = (tier: string) => {
  const match = tier.trim().match(/^(.+?)\s*(\d+)$/);

  if (!match) return tier;

  const [_, tierName, division] = match;

  return `${tierName} ${ROMAN_NUMERAL_MAP[division] ?? division}`;
};

export const formatShortLeagueTier = (tier: string) => {
  const match = tier.trim().match(/^(.+?)\s*(\d+)$/);

  if (!match) return tier;

  const [_, tierName, division] = match;

  return `${SHORT_TIER_MAP[tierName]}${division}`;
};
