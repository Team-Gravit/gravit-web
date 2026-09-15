import { describe, expect, it } from 'vitest';

import { toDailyMission, toMissionProgressPercent } from './mission';
import { getMissionRoute } from './mission-route';

describe('getMissionRoute', () => {
  it('FOLLOW_NEW_FRIEND 는 /my/friends/search, 그 외와 알 수 없는 유형은 /learning 이다 (AC-20)', () => {
    expect(getMissionRoute('FOLLOW_NEW_FRIEND')).toBe('/my/friends/search');
    expect(getMissionRoute('COMPLETE_LESSON_ONE')).toBe('/learning');
    expect(getMissionRoute('SOMETHING_NEW')).toBe('/learning');
  });
});

describe('toMissionProgressPercent', () => {
  it('0~1 비율을 정수 퍼센트로 바꾼다', () => {
    expect(toMissionProgressPercent(0.5)).toBe(50);
    expect(toMissionProgressPercent(0.333)).toBe(33);
    expect(toMissionProgressPercent(1)).toBe(100);
  });
});

describe('toDailyMission', () => {
  it('응답을 화면 모델로 바꾼다', () => {
    expect(
      toDailyMission({
        missionType: 'COMPLETE_LESSONS_TWO',
        missionDescription: '레슨 4개 완료하기',
        awardXp: 15,
        progressRate: 0.5,
        isCompleted: false,
      }),
    ).toEqual({
      description: '레슨 4개 완료하기',
      awardXp: 15,
      progressPercent: 50,
      isCompleted: false,
      route: '/learning',
    });
  });
});
