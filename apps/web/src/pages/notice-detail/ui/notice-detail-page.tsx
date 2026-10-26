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
    // 셸 스크롤 영역 높이(min-h-full)를 PageTitleBar + 콘텐츠(flex-1) + Footer 가 나눠 가진다.
    // 콘텐츠가 짧거나 로딩 중이어도 flex-1 이 남는 공간을 채워 Footer 가 바닥에 붙어 깜빡이지 않는다.
    <div className="flex min-h-svh flex-col">
      <PageTitleBar
        title="공지사항"
        backTo={{ to: '/settings/notice', search: { page: 1 } }}
        className="md:hidden"
      />

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

      {/* 본문은 Markdown 청크를 lazy 로딩한다. 청크가 아직이면 본문 스켈레톤을 띄워
          제목·날짜만 뜬 채 본문이 빈칸→갑툭튀 하는 레이아웃 시프트를 막는다. */}
      <Markdown fallback={<NoticeContentSkeleton />}>{data.content}</Markdown>
    </article>
  );
}

function DetailCardSkeleton() {
  return (
    <div className="rounded-8 bg-white px-4 pt-5 pb-10 md:rounded-12 md:px-8 md:pt-7 md:pb-10">
      <Skeleton variant="text" className="block w-64 text-heading1 md:text-title1" />
      <Skeleton variant="text" className="mt-1 w-24 text-caption1 md:mt-2 md:text-body2-normal" />
      <hr className="my-6 border-divider-2 md:my-7" />
      <NoticeContentSkeleton />
    </div>
  );
}

/** 본문 자리를 채우는 라인 스켈레톤. 데이터 로딩(DetailCardSkeleton)과 Markdown 청크 로딩에서 함께 쓴다. */
function NoticeContentSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} variant="text" className="w-full text-body2-normal" />
      ))}
    </div>
  );
}
