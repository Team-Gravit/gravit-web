import { noop } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { SPACE_TOP_COLOR } from '@/shared/config';
import {
  getRecentLearningQueryOptions,
  getRecommendedUnitsQueryOptions,
  getWeeklyRecordQueryOptions,
} from '@/entities/learning';
import { getLeagueSummaryQueryOptions } from '@/entities/league';
import { getDailyMissionQueryOptions } from '@/entities/mission';
import { getUserProfileQueryOptions } from '@/entities/user';
import { MainPage } from '@/pages/main';

export const Route = createFileRoute('/_authenticated/_app-shell/main')({
  staticData: {
    headerVariant: 'overlay',
    statusBarStyle: 'light',
    browserTopColor: SPACE_TOP_COLOR,
  },
  // 첫 화면 위젯의 데이터를 화면 코드와 함께 받기 시작한다. 기다리지 않아 첫 렌더를 막지 않는다.
  // 실패는 .catch(noop)으로 삼키고, 위젯의 useQuery가 같은 키로 다시 받아 지금처럼 다시 시도 상태를 보인다. (REF-062)
  loader: ({ context: { queryClient } }) => {
    void queryClient.query(getUserProfileQueryOptions()).catch(noop);
    void queryClient.query(getLeagueSummaryQueryOptions()).catch(noop);
    void queryClient.query(getWeeklyRecordQueryOptions()).catch(noop);
    void queryClient.query(getDailyMissionQueryOptions()).catch(noop);
    void queryClient.query(getRecommendedUnitsQueryOptions()).catch(noop);
    void queryClient.query(getRecentLearningQueryOptions()).catch(noop);
  },
  component: MainPage,
});
