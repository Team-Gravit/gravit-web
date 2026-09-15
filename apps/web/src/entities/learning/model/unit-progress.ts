import type {
  UnitProgressSummaryResponse,
  UnitProgressSummaryResponseStatus,
} from '@/shared/api/generated/model';

export type UnitProgressStatus = 'completed' | 'inProgress' | 'locked';

export interface UnitProgress {
  unitId: number;
  title: string;
  status: UnitProgressStatus;
  /** TODO(API): 챕터 내 순번 필드가 확정될 때까지 1부터 시작하는 목록 순번을 사용한다. */
  order: number;
}

const STATUS_MAP: Record<UnitProgressSummaryResponseStatus, UnitProgressStatus> = {
  COMPLETED: 'completed',
  IN_PROGRESS: 'inProgress',
  NOT_STARTED: 'locked',
};

export function toUnitProgressList(units: UnitProgressSummaryResponse[]): UnitProgress[] {
  return units.map((unit, index) => ({
    unitId: unit.unitId,
    title: unit.title,
    status: STATUS_MAP[unit.status],
    order: index + 1,
  }));
}

/** 목록 순서에서 완료되지 않은 첫 유닛을 반환하며, 모두 완료됐으면 `null`을 반환한다. */
export function findNextUnit(units: UnitProgress[]): UnitProgress | null {
  return units.find((unit) => unit.status !== 'completed') ?? null;
}

export function formatUnitNumber(value: number): string {
  return String(value).padStart(2, '0');
}
