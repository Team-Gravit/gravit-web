import type { InfiniteData } from '@tanstack/react-query';

export const infiniteSelector = <T>(data: InfiniteData<{ contents: T[] }> | undefined) => {
  return data?.pages.flatMap((page) => page.contents) ?? [];
};
