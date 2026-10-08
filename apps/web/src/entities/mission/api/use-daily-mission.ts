import { useGetMission } from '@/shared/api/generated/mainpage-api/mainpage-api';

import { toDailyMission } from '../model/mission';

export function useDailyMission() {
  return useGetMission({ query: { select: toDailyMission } });
}
