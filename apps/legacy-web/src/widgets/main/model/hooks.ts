import { useQuery } from '@tanstack/react-query';

import { userKeys } from '@/entities/user/api/queryKey';
import { api } from '@/shared/api';

export const useFetchMainInfo = () => {
  const query = useQuery({
    queryKey: userKeys.mainPage(),
    queryFn: () => api.private.user.getMainPage(),
  });

  return { ...query, data: query.data?.data };
};
