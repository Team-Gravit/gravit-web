export const noticeKeys = {
  all: ['notice'] as const,

  list: (page: number) => [...noticeKeys.all, 'list', page] as const,

  detail: (noticeId: number) => [...noticeKeys.all, 'detail', noticeId] as const,
} as const;
