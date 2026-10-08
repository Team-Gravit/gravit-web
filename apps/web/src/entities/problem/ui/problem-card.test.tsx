import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';

import type { Problem } from '../model/problem';
import { ProblemCard } from './problem-card';

const problem: Problem = {
  problemId: 101,
  type: 'objective',
  instruction: '다음 코드의 결과를 고르세요.',
  content: '',
  isBookmarked: false,
  options: [],
};

describe('ProblemCard', () => {
  it('문제 본문의 강조, 목록, 코드 블록을 마크다운으로 렌더링한다', () => {
    const content = [
      '**배열(Array)**의 첫 원소를 확인하세요.',
      '',
      '- 첫 번째 조건',
      '- 두 번째 조건',
      '',
      '```python',
      'print([1, 2, 3][0])',
      '```',
    ].join('\n');

    render(<ProblemCard problem={{ ...problem, content }} number={1} />);

    const card = screen.getByRole('region', { name: '01번 문제' });
    expect(within(card).getByText(problem.instruction)).toBeInTheDocument();
    expect(card.querySelector('strong')).toHaveTextContent('배열(Array)');
    expect(within(card).getAllByRole('listitem')).toHaveLength(2);
    expect(within(card).getByLabelText('Python 코드')).toHaveTextContent('print([1, 2, 3][0])');
    expect(within(card).queryByRole('button', { name: '복사' })).not.toBeInTheDocument();
    expect(card).not.toHaveTextContent('**');
    expect(card).not.toHaveTextContent('```');
    expect(card.querySelector('p pre')).toBeNull();
  });

  it('일반 텍스트 본문과 카드 밖의 답안 영역도 표시한다', () => {
    render(
      <ProblemCard problem={{ ...problem, content: '첫 번째 줄\n두 번째 줄' }} number={2}>
        <button type="button">정답 제출</button>
      </ProblemCard>,
    );

    const card = screen.getByRole('region', { name: '02번 문제' });
    expect(card).toHaveTextContent('첫 번째 줄 두 번째 줄');
    expect(screen.getByRole('button', { name: '정답 제출' })).toBeInTheDocument();
    expect(within(card).queryByRole('button', { name: '정답 제출' })).not.toBeInTheDocument();
  });
});
