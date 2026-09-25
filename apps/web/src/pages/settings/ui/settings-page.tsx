import { Link, type LinkProps, useNavigate } from '@tanstack/react-router';

import { useLogout } from '@/features/auth-logout';
import { cn } from '@/shared/lib/cn';
import { Card, CardTitle } from '@/shared/ui/card';
import { Icon } from '@/shared/ui/icon';
import { PageTitleBar } from '@/widgets/page-title-bar';

type BaseItemProps = {
  label: string;
  labelClassName?: string;
};

type SettingsItemProps =
  | (BaseItemProps & { type: 'link'; to: LinkProps['to'] })
  | (BaseItemProps & { type: 'button'; onClick: () => void });

/** 계정정보 섹션의 링크 항목. 목적지는 web 라우트 기준으로 매핑한다. */
const ACCOUNT_ITEMS: { label: string; to: LinkProps['to'] }[] = [
  { label: '내 정보', to: '/my' },
  // TODO : 공지사항 페이지 요청
  // { label: '공지사항', to: '/settings/notice' },
  { label: '개인정보 처리 방침', to: '/privacy' },
];

/**
 * 환경설정 화면. 계정정보·기타 두 섹션의 목록을 보여준다.
 * 좁은 화면은 자체 `PageTitleBar`, 넓은 화면은 설정 셸 라우트의 `Header`가 상단을 담당한다.
 */
export function SettingsPage() {
  const navigate = useNavigate();
  const logout = useLogout({ onSuccess: () => navigate({ to: '/' }) });

  return (
    <main className="flex min-h-full flex-col">
      <PageTitleBar title="환경설정" backTo={{ to: '/my' }} className="md:hidden" />

      <section className="mx-auto flex w-full flex-col gap-3 px-4 py-5 md:max-w-[660px] md:gap-6">
        <SettingsSection title="계정정보">
          {ACCOUNT_ITEMS.map((item) => (
            <SettingsItem key={item.label} type="link" label={item.label} to={item.to} />
          ))}
        </SettingsSection>

        <SettingsSection title="기타">
          <SettingsItem type="link" label="문의하기" to="/settings/inquiry" />
          <SettingsItem type="button" label="로그아웃" onClick={logout} />
          {/* 탈퇴 플로우는 아직 없다. 흐린 라벨로 두되 동작은 붙이지 않는다. */}
          <SettingsItem
            type="button"
            label="탈퇴하기"
            onClick={() => {}}
            labelClassName="text-text-4"
          />
        </SettingsSection>
      </section>
    </main>
  );
}

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <Card className="gap-3 px-4 pt-4 pb-2 md:gap-4 md:px-8 md:py-7">
      <CardTitle className="text-text-3 md:text-text-4">{title}</CardTitle>
      <ul>{children}</ul>
    </Card>
  );
}

function SettingsItem(props: SettingsItemProps) {
  // 구분선은 형제 li 기준으로 마지막만 빠져야 하므로 li에 둔다. wrapper에 두면
  // 각 wrapper가 자기 li의 유일한 자식이라 항상 last로 잡혀 전부 사라진다.
  const wrapperClassName =
    'flex h-11 w-full cursor-pointer items-center justify-between py-2 md:h-[74px]';

  const inner = (
    <>
      <span className={cn('text-label1 text-text-1 md:text-heading2', props.labelClassName)}>
        {props.label}
      </span>
      <Icon name="chevron-right" className="size-4  text-text-3 md:size-8" />
    </>
  );

  return (
    <li className="md:border-b md:border-divider-1 md:last:border-none">
      {props.type === 'link' ? (
        <Link to={props.to} className={wrapperClassName}>
          {inner}
        </Link>
      ) : (
        <button type="button" onClick={props.onClick} className={wrapperClassName}>
          {inner}
        </button>
      )}
    </li>
  );
}
