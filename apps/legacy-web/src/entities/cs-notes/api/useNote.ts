import { useQuery } from '@tanstack/react-query';

import { api } from '@/shared/api';
import { learningKeys } from '@/shared/lib/query-keys';

export const useNote = (unitId: number) => {
  return useQuery<string>({
    queryKey: learningKeys.units.csNote(unitId),
    queryFn: async () => {
      const res = await api.private.note.getNote(unitId, {
        responseType: 'text',
      });
      return res.data as unknown as string;
    },
    staleTime: 1000 * 60,
    retry: 1,
    enabled: !!unitId,
  });
};
