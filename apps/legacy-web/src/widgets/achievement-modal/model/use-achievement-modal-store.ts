import { create } from 'zustand';

type LevelUpAchievement = {
  status: 'levelUp';
  level: number;
};

type StreakLearningAchievement = {
  status: 'streakLearning';
  days: number;
  nextMileStone: number;
};

type TierUpAchievement = {
  status: 'tierUp';
  tierId: number;
};

export type AchievementStatus = LevelUpAchievement | StreakLearningAchievement | TierUpAchievement;

type AchievementModalState = {
  achievement: AchievementStatus | null;
  actions: {
    open: (achievement: AchievementStatus) => void;
    close: () => void;
  };
};

const useAchievementModalStore = create<AchievementModalState>((set) => ({
  achievement: {
    status: 'tierUp',
    tierId: 13,
  },
  actions: {
    open: (achievement) => set({ achievement }),
    close: () => set({ achievement: null }),
  },
}));

export const useAchievementModal = () => {
  const {
    achievement,
    actions: { open, close },
  } = useAchievementModalStore();
  const isOpen = achievement !== null;
  return {
    isOpen,
    achievement,
    open,
    close,
  };
};

export const useAchievementModalActions = () => {
  return useAchievementModalStore((state) => state.actions);
};

export const useAchievementModalState = () => {
  const achievement = useAchievementModalStore((state) => state.achievement);

  const isOpen = achievement !== null;

  return {
    isOpen,
    achievement,
  };
};
