import { setupWorker } from 'msw/browser';

import { getOauth20ApiMock } from '../generated/mocks/index.msw';

export const worker = setupWorker(...getOauth20ApiMock());
