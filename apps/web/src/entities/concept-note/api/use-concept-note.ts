import { useQuery } from '@tanstack/react-query';

import {
  getGetNoteByUnitIdQueryKey,
  getNoteByUnitId,
} from '@/shared/api/generated/cs-note-api/cs-note-api';

import { toConceptNote } from '../model/concept-note';

/**
 * 생성 클라이언트가 `text/markdown` 응답을 Blob으로 반환하므로 문자열로 변환한 뒤
 * 화면에서 사용할 제목과 본문으로 정규화한다.
 */
export function useConceptNote(unitId: number) {
  return useQuery({
    queryKey: getGetNoteByUnitIdQueryKey(unitId),
    queryFn: async ({ signal }) => {
      const noteBlob = await getNoteByUnitId(unitId, undefined, signal);
      return noteBlob.text();
    },
    select: toConceptNote,
    enabled: Number.isInteger(unitId) && unitId > 0,
  });
}
