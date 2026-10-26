import { useDelayedFlag } from '@/shared/lib/use-delayed-flag';
import { Breadcrumb } from '@/shared/ui/breadcrumb';
import { Pagination } from '@/shared/ui/pagination';
import { useNotices } from '@/entities/notice';
import { Footer } from '@/widgets/footer';
import { PageTitleBar } from '@/widgets/page-title-bar';

import { NoticeList } from './notice-list';

export interface NoticePageProps {
  /** 현재 페이지(1-based). 라우트 search가 소유한다. */
  page: number;
  onPageChange: (page: number) => void;
}

/**
 * 공지사항 목록 화면. 설정 셸 안에서 동작한다.
 * 데스크톱은 셸이 앱 헤더를 주므로 breadcrumb+타이틀만, 모바일은 자체 `PageTitleBar`를 둔다.
 */
export function NoticePage({ page, onPageChange }: NoticePageProps) {
  const { data, isPending } = useNotices(page);
  const notices = data?.contents ?? [];
  const totalPages = data?.totalPages ?? 0;
  // 임계값(기본 300ms)보다 오래 걸릴 때만 스켈레톤을 띄워 빠른 응답 깜빡임을 막는다.
  const showSkeleton = useDelayedFlag(isPending);

  return (
    <>
      <PageTitleBar title="공지사항" backTo={{ to: '/settings' }} className="md:hidden" />

      <div className="flex flex-col">
        {/* 시안: 데스크톱 헤더는 페이지 좌측 여백(90px)에, 카드·페이지네이션은 가운데 1200폭에 둔다. */}
        <div className="flex-1 px-4 py-5 md:px-[90px] md:pt-10 md:pb-20">
          <DesktopHeader />
          <div className="mx-auto w-full max-w-[1200px]">
            <NoticeList notices={notices} isPending={isPending} showSkeleton={showSkeleton} />
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
                className="mt-3 md:mt-8"
              />
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

/** 데스크톱 전용 breadcrumb + 페이지 타이틀. 모바일은 `PageTitleBar`가 담당한다. */
function DesktopHeader() {
  return (
    <div className="mb-5 hidden md:block">
      <Breadcrumb items={[{ label: '설정', link: { to: '/settings' } }, { label: '공지사항' }]} />
      <h1 className="mt-4 text-title1 text-text-2">공지사항</h1>
    </div>
  );
}
