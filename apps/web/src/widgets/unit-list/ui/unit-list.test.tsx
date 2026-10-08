import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';

import { UnitList } from './unit-list';

const UNITS_URL = '*/api/v1/units/1';

const UNIT_PAGE = {
  chapterSummaryResponse: { chapterId: 1, title: '자료구조', description: '자료를 다루는 방법' },
  unitDetailResponses: [
    {
      unitSummaryResponse: {
        unitId: 7,
        displayOrder: 1,
        title: '연결리스트',
        description: '노드로 잇는 자료구조',
      },
      progressRate: 33,
    },
    {
      unitSummaryResponse: {
        unitId: 3,
        displayOrder: 2,
        title: '스택',
        description: '나중에 넣은 것을 먼저 꺼낸다',
      },
      progressRate: 0,
    },
  ],
};

function renderList() {
  return renderWithProviders(() => <UnitList chapterId={1} />, {
    extraPaths: ['/learning/units/$unitId'],
  });
}

describe('UnitList', () => {
  it('응답 순서대로 유닛을 그리고 displayOrder를 순번으로 붙인다', async () => {
    server.use(http.get(UNITS_URL, () => HttpResponse.json(UNIT_PAGE)));
    await renderList();

    expect(await screen.findByRole('heading', { name: 'Unit01 - 연결리스트' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Unit02 - 스택' })).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/learning/units/7',
      '/learning/units/3',
    ]);
  });

  it('진행률을 게이지와 퍼센트 표기에 같은 값으로 반영한다', async () => {
    server.use(http.get(UNITS_URL, () => HttpResponse.json(UNIT_PAGE)));
    await renderList();

    expect(await screen.findByRole('progressbar', { name: '연결리스트 진행률' })).toHaveAttribute(
      'aria-valuenow',
      '33',
    );
    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  it('유닛이 없으면 「유닛이 없습니다.」를 표시한다', async () => {
    server.use(
      http.get(UNITS_URL, () => HttpResponse.json({ ...UNIT_PAGE, unitDetailResponses: [] })),
    );
    await renderList();

    expect(await screen.findByRole('status')).toHaveTextContent('유닛이 없습니다.');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('실패하면 「유닛 목록을 불러오지 못했어요.」 + 다시 시도로 재요청한다', async () => {
    let requests = 0;
    server.use(
      http.get(UNITS_URL, () => {
        requests += 1;
        return requests === 1
          ? new HttpResponse(null, { status: 500 })
          : HttpResponse.json(UNIT_PAGE);
      }),
    );
    await renderList();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('유닛 목록을 불러오지 못했어요.');
    await userEvent.click(within(alert).getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByRole('heading', { name: 'Unit01 - 연결리스트' })).toBeInTheDocument();
    expect(requests).toBe(2);
  });
});
