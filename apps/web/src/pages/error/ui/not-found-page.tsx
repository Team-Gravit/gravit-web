import { ErrorPageLayout } from './error-page-layout';

export function NotFoundPage() {
  return (
    <ErrorPageLayout
      code={404}
      title="페이지를 찾을 수 없어요."
      descriptionLines={[
        '잘못된 주소이거나 삭제된 페이지입니다.',
        '주소를 확인하시거나 홈으로 이동해 주세요.',
      ]}
    />
  );
}
