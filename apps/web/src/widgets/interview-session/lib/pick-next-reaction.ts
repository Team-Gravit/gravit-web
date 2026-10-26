export type AvatarReaction = 'listen' | 'memo' | 'worry';

/** 답변 리액션 가중치(%). listen 40 · memo 35 · worry 25. worry 는 연속 재생도 막는다. */
const REACTION_WEIGHTS: Record<AvatarReaction, number> = {
  listen: 40,
  memo: 35,
  worry: 25,
};

const REACTIONS = Object.keys(REACTION_WEIGHTS) as AvatarReaction[];

/**
 * 다음 답변 리액션을 가중 랜덤으로 고른다(listen 40 / memo 35 / worry 25).
 * 직전이 worry 면 worry 를 후보에서 빼 연속으로 나오지 않게 한다.
 * random 은 테스트에서 주입한다(기본 Math.random, 0 이상 1 미만).
 */
export function pickNextReaction(
  previous: AvatarReaction | null,
  random: () => number = Math.random,
): AvatarReaction {
  const candidates = REACTIONS.filter(
    (reaction) => !(reaction === 'worry' && previous === 'worry'),
  );

  const totalWeight = candidates.reduce((sum, reaction) => sum + REACTION_WEIGHTS[reaction], 0);
  let threshold = random() * totalWeight;

  for (const reaction of candidates) {
    threshold -= REACTION_WEIGHTS[reaction];
    if (threshold < 0) {
      return reaction;
    }
  }

  // random 이 1 에 극히 근접할 때의 부동소수 오차 보정 — 마지막 후보를 돌려준다.
  return candidates[candidates.length - 1];
}
