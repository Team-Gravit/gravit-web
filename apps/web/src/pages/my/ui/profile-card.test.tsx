import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProfileCard } from './profile-card';

const BANNER = {
  nickname: '한준서',
  profileImageNumber: 3,
  handle: '4p9nfz5t',
  level: 3,
  currentLeague: '브론즈 3',
  consecutiveSolvedDays: 7,
};

describe('ProfileCard', () => {
  it('data 가 있으면 닉네임·핸들·레벨·리그·연속학습 라벨을 표시한다', () => {
    render(<ProfileCard data={BANNER} />);

    expect(screen.getByRole('heading', { name: '한준서' })).toBeInTheDocument();
    // 핸들은 데스크톱·모바일 두 곳에 렌더된다.
    expect(screen.getAllByText('@4p9nfz5t')).toHaveLength(2);
    expect(screen.getByText('LV. 3')).toBeInTheDocument();
    expect(screen.getByText('브론즈 3')).toBeInTheDocument();
    expect(screen.getByText('7일 연속 학습중')).toBeInTheDocument();
  });

  it('data 없이 isLoading 이면 데이터 텍스트 없이 정적 프레임(편집 버튼)만 렌더한다', () => {
    render(<ProfileCard isLoading />);

    expect(screen.queryByText('한준서')).not.toBeInTheDocument();
    expect(screen.queryByText('LV. 3')).not.toBeInTheDocument();
    // 정적 크롬은 데이터와 무관하게 항상 렌더된다.
    expect(screen.getAllByRole('button', { name: '프로필 편집' }).length).toBeGreaterThan(0);
  });
});
