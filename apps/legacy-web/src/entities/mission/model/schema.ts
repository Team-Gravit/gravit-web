import { z } from 'zod';

import type { MissionDetailResponse } from '@/shared/api/@generated';

export const missionDetailSchema = z.object({
  missionType: z.string().default(''),
  missionDescription: z.string().default(''),
  awardXp: z.number().default(0),
  progressRate: z.number().default(0),
  isCompleted: z.boolean().default(false),
});

export type MissionDetail = z.infer<typeof missionDetailSchema>;

export const toMissionDetail = (raw: MissionDetailResponse): MissionDetail =>
  missionDetailSchema.parse(raw);
