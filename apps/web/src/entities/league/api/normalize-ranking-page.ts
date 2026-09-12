import type { SliceResponseLeagueRankRowDto } from '@/shared/api/generated/model';

/**
 * 랭킹 응답을 slice 형태로 정규화한다.
 *
 * 명세 결함: 이 엔드포인트의 success 스키마가 배열(`LeagueRankRowDto[]`)로 잘못 정의돼 있으나
 * 런타임은 `SliceResponseLeagueRankRowDto`(hasNextPage·contents)를 반환한다. 두 형태를 모두 받아
 * slice로 맞춘다. 근본 해결(normalize-openapi 보정)은 INFRA-024.
 */
export function normalizeRankingPage(res: unknown): SliceResponseLeagueRankRowDto {
  if (Array.isArray(res)) {
    return { hasNextPage: false, contents: res };
  }
  return res as SliceResponseLeagueRankRowDto;
}
