import { Link } from '@tanstack/react-router';

import { formatISODate } from '@/shared/lib/date';
import { useDelayedFlag } from '@/shared/lib/use-delayed-flag';
import { Breadcrumb, type BreadcrumbItem } from '@/shared/ui/breadcrumb';
import { Button } from '@/shared/ui/button';
import { Markdown } from '@/shared/ui/markdown';
import { Skeleton } from '@/shared/ui/skeleton';
import { useNoticeDetail, type NoticeDetailResponse } from '@/entities/notice';
import { Footer } from '@/widgets/footer';
import { PageTitleBar } from '@/widgets/page-title-bar';

export interface NoticeDetailPageProps {
  noticeId: number;
}

/**
 * 공지 상세 화면. 설정 셸 안에서 동작한다.
 * 데스크톱은 breadcrumb 3단 + 「목록으로」 + Footer, 모바일은 back-header로 복귀한다.
 * 본문(`content`)은 Markdown으로 렌더한다.
 */
export function NoticeDetailPage({ noticeId }: NoticeDetailPageProps) {
  const { data, isPending } = useNoticeDetail(noticeId);
  const showSkeleton = useDelayedFlag(isPending);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: '설정', link: { to: '/settings' } },
    { label: '공지사항', link: { to: '/settings/notice', search: { page: 1 } } },
    ...(data ? [{ label: data.title }] : []),
  ];

  return (
    <>
      <PageTitleBar
        title="공지사항"
        backTo={{ to: '/settings/notice', search: { page: 1 } }}
        className="md:hidden"
      />

      <div className="flex flex-col">
        <div className="flex-1 px-4 py-5 md:px-[90px] md:pt-10 md:pb-20">
          <Breadcrumb items={breadcrumbItems} className="mb-5 hidden md:flex" />

          <div className="mx-auto w-full max-w-[1200px]">
            <DetailCard data={data} isPending={isPending} showSkeleton={showSkeleton} />

            {data && (
              <div className="mt-5 hidden justify-end md:flex">
                <Button asChild variant="stroke-secondary" size="md">
                  <Link to="/settings/notice" search={{ page: 1 }}>
                    목록으로
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:block">
          <Footer />
        </div>
      </div>
    </>
  );
}

interface DetailCardProps {
  data?: NoticeDetailResponse;
  isPending: boolean;
  showSkeleton: boolean;
}

function DetailCard({ data, isPending, showSkeleton }: DetailCardProps) {
  if (showSkeleton) {
    return <DetailCardSkeleton />;
  }

  // 지연 전 로딩 구간 / 조회 실패(공통 처리에 위임)에는 카드를 그리지 않는다.
  if (isPending || !data) {
    return null;
  }

  return (
    <article className="rounded-8 bg-white px-4 pt-5 pb-10 md:rounded-12 md:px-8 md:pt-7 md:pb-10">
      <h1 className="text-heading1 text-text-1 md:text-title1">{data.title}</h1>
      <p className="mt-1 text-caption1 text-text-4 md:mt-2 md:text-body2-normal">
        {formatISODate(data.publishedAt)}
      </p>

      <hr className="my-6 border-divider-2 md:my-7" />

      <Markdown>{data.content}</Markdown>
    </article>
  );
}

function DetailCardSkeleton() {
  return (
    <div className="rounded-8 bg-white px-4 pt-5 pb-10 md:rounded-12 md:px-8 md:pt-7 md:pb-10">
      <Skeleton variant="text" className="w-64 text-heading1 md:text-title1 block" />
      <Skeleton variant="text" className="mt-1 w-24 text-caption1 md:mt-2 md:text-body2-normal" />
      <hr className="my-6 border-divider-2 md:my-7" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} variant="text" className="w-full text-body2-normal" />
        ))}
      </div>
    </div>
  );
}
