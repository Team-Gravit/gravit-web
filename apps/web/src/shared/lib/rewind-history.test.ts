import { describe, expect, it } from 'vitest';
import { createMemoryHistory } from '@tanstack/react-router';

import { rewindHistory } from './rewind-history';

function createSetupHistory() {
  const history = createMemoryHistory({ initialEntries: ['/interview'] });
  history.push('/interview/new/answer-type');
  history.push('/interview/new/topic');
  history.push('/interview/new/confirm');
  return history;
}

describe('rewindHistory', () => {
  it('targetIndex 위치로 되감은 뒤 replace 하면 그 뒤의 기록이 사라진다', async () => {
    const history = createSetupHistory();

    await rewindHistory(history, 1);
    history.replace('/interview/sessions/1');

    expect(history.location.pathname).toBe('/interview/sessions/1');
    expect(history.location.state.__TSR_index).toBe(1);
    history.back();
    expect(history.location.pathname).toBe('/interview');
  });

  it('현재 위치가 targetIndex와 같으면 이동하지 않는다', async () => {
    const history = createSetupHistory();

    await rewindHistory(history, 3);

    expect(history.location.pathname).toBe('/interview/new/confirm');
  });
});
