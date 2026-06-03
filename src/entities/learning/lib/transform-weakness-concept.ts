import type { WeakConceptResponse } from '@/shared/api/@generated/model';

export interface ConceptItemModel {
  id: string | number;
  title: string;
  description: string;
  percent: number;
}

export function transformWeaknessConcept(data: WeakConceptResponse[]): ConceptItemModel[] {
  return [...data]
    .sort((a, b) => a.rank - b.rank)
    .map((item, idx) => ({
      id: item.rank || idx,
      title: item.chapterTitle,
      description: `${item.unitTitle} · ${item.wrongAnswerCount}문제 오답`,
      percent: item.wrongAnswerRate,
    }));
}
