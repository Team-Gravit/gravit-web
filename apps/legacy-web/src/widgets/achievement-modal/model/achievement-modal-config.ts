import LevelUpMascot from '@/shared/assets/_images/mascot/level-up-mascot.png';
import StreakLearningMascot from '@/shared/assets/_images/mascot/streak-learning-mascot.png';
import { tiers } from '@/shared/lib/tiers';

import type { AchievementStatus } from './use-achievement-modal-store';

const getTierGradient = (tierId: number) => {
  if (tierId <= 3) return { from: 'rgba(162, 95, 0, 1)', to: 'rgba(162, 95, 0, 1)' };
  if (tierId <= 6) return { from: 'rgba(179, 179, 179, 1)', to: 'rgba(179, 179, 179, 1)' };
  if (tierId <= 9) return { from: 'rgba(255, 217, 0, 1)', to: 'rgba(255, 217, 0, 1)' };
  if (tierId <= 12) return { from: 'rgba(0, 255, 218, 1)', to: 'rgba(0, 255, 218, 1)' };
  return { from: 'rgba(9, 229, 255, 1)', to: 'rgba(9, 229, 255, 1)' };
};

export const achievementModalConfig = {
  levelUp: {
    content: ({ level }: { level: number }) => ({
      title: '레벨업!',
      subTitle: { highlight: `LV.${level}`, common: '으로 올라왔어요' },
      message: '한 걸음씩, 확실하게 성장하고 있어요.',
      Icon: LevelUpMascot,
    }),
    gradientColor: {
      from: 'rgba(244, 227, 255, 1)',
      to: 'rgba(155, 0, 207, 1)',
    },
  },

  streakLearning: {
    content: ({ streakDays, nextMileStone }: { streakDays: number; nextMileStone: number }) => ({
      title: `${streakDays}일 연속학습 달성!`,
      subTitle: { highlight: null, common: '꾸준히 이어오고 있어요' },
      message: `다음 마일스톤은 ${nextMileStone}일이에요. 조금만 더 가봐요!`,
      Icon: StreakLearningMascot,
    }),
    gradientColor: {
      from: 'rgba(255, 146, 0, 1)',
      to: 'rgba(255, 146, 0, 0.50)',
    },
  },

  tierUp: {
    content: ({ tierId }: { tierId: number }) => {
      const currentTier = tiers.find((tier) => tier.id === tierId)! || tiers[0];
      return {
        title: '축하해요!',
        subTitle: { highlight: `${currentTier.name}티어`, common: '로 승급했어요' },
        message: '다음 티어도 노려봐요. 충분히 가능해요',
        Icon: currentTier.icon,
      };
    },
  },
};

export const getAchievementModalContent = (achievement: AchievementStatus) => {
  switch (achievement.status) {
    case 'levelUp':
      return {
        ...achievementModalConfig.levelUp.content({ level: achievement.level }),
        gradientColor: achievementModalConfig.levelUp.gradientColor,
      };
    case 'streakLearning':
      return {
        ...achievementModalConfig.streakLearning.content({
          streakDays: achievement.days,
          nextMileStone: achievement.nextMileStone,
        }),
        gradientColor: achievementModalConfig.streakLearning.gradientColor,
      };
    case 'tierUp':
      return {
        ...achievementModalConfig.tierUp.content({ tierId: achievement.tierId }),
        gradientColor: getTierGradient(achievement.tierId),
      };
  }
};
