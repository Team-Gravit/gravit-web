import { useState } from 'react';
import { Link, type LinkProps, useNavigate } from '@tanstack/react-router';

import { useLogout } from '@/features/auth-logout';
import { WithdrawConfirmModal } from '@/features/user-withdraw';
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

type LinkItems = { label: string; to: LinkProps['to'] }[];

const CUSTOMER_SUPPOER_ITEMS: LinkItems = [
  { label: '공지사항', to: '/settings/notice' },
  { label: '문의하기', to: '/settings/inquiry' },
];

const POLICY_ITEMS: LinkItems = [
  { label: '이용약관', to: '/terms' },
  { label: '개인정보 처리 방침', to: '/privacy' },
];
/**
 * 환경설정 화면. 계정정보·기타 두 섹션의 목록을 보여준다.
 * 좁은 화면은 자체 `PageTitleBar`, 넓은 화면은 설정 셸 라우트의 `Header`가 상단을 담당한다.
 */

export function SettingsPage() {
  const navigate = useNavigate();
  const logout = useLogout({ onSuccess: () => navigate({ to: '/' }) });
  const [isWithdrawConfirmOpen, setIsWithdrawConfirmOpen] = useState(false);

  return (
    <main className="flex min-h-full flex-col">
      <PageTitleBar title="환경설정" backTo={{ to: '/my' }} className="md:hidden" />

      <section className="mx-auto flex w-full flex-col gap-3 px-4 py-5 md:max-w-[660px] md:gap-6">
        <SettingsSection title="고객지원">
          {CUSTOMER_SUPPOER_ITEMS.map((item) => (
            <SettingsItem key={item.label} type="link" label={item.label} to={item.to} />
          ))}
        </SettingsSection>

        <SettingsSection title="약관 및 정책">
          {POLICY_ITEMS.map((item) => (
            <SettingsItem key={item.label} type="link" label={item.label} to={item.to} />
          ))}
        </SettingsSection>

        <SettingsSection title="계정">
          <SettingsItem type="button" label="로그아웃" onClick={logout} />
          <SettingsItem
            type="button"
            label="탈퇴하기"
            onClick={() => setIsWithdrawConfirmOpen(true)}
            labelClassName="text-text-4"
          />
        </SettingsSection>
      </section>

      <WithdrawConfirmModal
        open={isWithdrawConfirmOpen}
        onOpenChange={setIsWithdrawConfirmOpen}
        onContinue={() => {
          // 「계속하기」가 인증 메일 요청을 보낸 뒤: 확인 모달을 닫고 발송 안내 페이지로 이동한다.
          setIsWithdrawConfirmOpen(false);
          navigate({ to: '/withdraw-email-sent' });
        }}
      />
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
