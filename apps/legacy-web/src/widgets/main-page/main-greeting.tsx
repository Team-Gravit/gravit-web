import { useGetProfile } from '@/shared/api/@generated/mainpage-api/mainpage-api';
import { Skeleton } from '@/shared/ui/skeleton/skeleton';

const greetingVariant = {
  desktop: {
    skeleton: 'min-h-16 bg-white/20',
    error: 'min-h-16 bg-white/10 text-white',
    title: 'flex items-center text-display1 mb-2 font-semibold gap-1.5',
    subtitle: 'text-heading2',
  },
  mobile: {
    skeleton: 'min-h-14 bg-white/20',
    error: 'min-h-14 bg-white/10 text-white',
    title: 'text-title3 mb-1 flex items-center gap-1',
    subtitle: 'text-body1-normal',
  },
} as const;

/**
 * 히어로 영역의 인사말 섹션. 프로필 데이터를 스스로 조회하고 로딩/에러를 처리합니다.
 * 데스크톱/모바일 타이포그래피 차이는 variant로만 구분합니다.
 * - 로딩: 스켈레톤으로 처리
 * - 에러: 조용히 처리
 */
export default function MainGreeting({ variant }: { variant: 'desktop' | 'mobile' }) {
  const profile = useGetProfile();
  const styles = greetingVariant[variant];

  let userNameContent = <></>;
  const isMobile = variant === 'mobile';

  if (profile.isPending) {
    userNameContent = (
      <Skeleton
        variant={'text'}
        textSize={isMobile ? 'body1Normal' : 'display1'}
        width={isMobile ? 100 : 200}
        className="bg-white/10"
      />
    );
  }

  if (profile.data) {
    userNameContent = <span>{profile.data.nickname}님!</span>;
  }

  return (
    <>
      <p className={styles.title}>어서오세요, {userNameContent}</p>
      <p className={styles.subtitle}>그래빗과 함께 CS 지식을 마스터해요!</p>
    </>
  );
}
