import { Link } from '@tanstack/react-router';

import useLogout from '@/features/auth/logout';
import RightArrowIcon from '@/shared/assets/icons/ic-right-arrow.svg?react';
import { cn } from '@/shared/lib/cn';
import SectionCard from '@/shared/ui/card/section-card';

type BaseSettingBoxItemProps = {
  label: string;
  labelClassName?: string;
};

type SettingBoxItemProps =
  | (BaseSettingBoxItemProps & {
      type: 'link';
      to: string;
    })
  | (BaseSettingBoxItemProps & {
      type: 'button';
      onClick: () => void;
    });

const ACCOUNT_INFORMATION_PATHS = [
  { label: '내 정보', path: '/my' },
  { label: '공지사항', path: '/user/notice' },
  { label: '개인정보 처리 방침', path: '/user/privacy' },
];

function SettingBox() {
  const handleLogout = useLogout();

  return (
    <div className="md:max-w-[660px] mx-auto">
      <SectionCard
        title="계정정보"
        titleClassName="text-text-3 md:text-text-4"
        headerClassName="gap-0"
        className="pb-2 mb-3 md:mb-6 gap-3 md:gap-4"
      >
        <ul>
          {ACCOUNT_INFORMATION_PATHS.map((item) => (
            <SettingBoxItem key={item.label} label={item.label} to={item.path} type="link" />
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        title="기타"
        titleClassName="text-text-3 md:text-text-4"
        headerClassName="gap-0"
        className="pb-2 gap-3 md:gap-4"
      >
        <ul>
          <SettingBoxItem type="link" label="문의하기" to="/settings/inquiry/new" />
          <SettingBoxItem type="button" label="로그아웃" onClick={handleLogout} />
          <SettingBoxItem
            type="button"
            label="탈퇴하기"
            // TODO : 추후 탈퇴 플로우 적용 필요
            onClick={() => {}}
            labelClassName="text-text-4"
          />
        </ul>
      </SectionCard>
    </div>
  );
}

export default SettingBox;

function SettingBoxItem(props: SettingBoxItemProps) {
  const wrapperStyle =
    'py-[14px] md:py-5 w-full  flex items-center justify-between md:border-b md:border-divider-1 md:last:border-none cursor-pointer';

  const inner = (
    <>
      <span className={cn('text-label1 md:text-heading2  text-text-1', props.labelClassName)}>
        {props.label}
      </span>

      <RightArrowIcon className="size-4 md:size-8 text-icon stroke-5 md:stroke-[1.5px]" />
    </>
  );

  if (props.type === 'link') {
    return (
      <Link to={props.to} className={wrapperStyle}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={props.onClick} className={wrapperStyle}>
      {inner}
    </button>
  );
}
