import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import type { FormEvent } from 'react';

import {
  getGetMyInquiriesInfiniteQueryKey,
  useSubmitInquiry,
} from '@/shared/api/@generated/inquiry-api/inquiry-api';
import { Button } from '@/shared/ui/button/Button';
import { Dropdown } from '@/shared/ui/dropdown';
import CommonInput from '@/shared/ui/input/input';
import CommonTextarea from '@/shared/ui/input/textarea';

import { INQUIRY_FORM_DROPDOWN_ITEMS } from './model/inquiry-config';
import useInquiryForm from './model/use-inquiry-form';

function InquiryForm() {
  const queryClient = useQueryClient();
  const { inquiryForm, updateInquiryForm, isValid } = useInquiryForm();

  const navigate = useNavigate();

  const { mutate: submitInquiry, isPending } = useSubmitInquiry({
    mutation: {
      onSuccess: () => {
        navigate({ to: '/settings/inquiry' });
        queryClient.invalidateQueries({ queryKey: getGetMyInquiriesInfiniteQueryKey() });
      },
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      type: inquiryForm.type,
      title: inquiryForm.title,
      content: inquiryForm.content,
    };

    submitInquiry({ data: formData });
  };
  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <Dropdown
        className="w-full bg-white [&>button]:h-[54px] md:[&>button]:h-[74px] [&>button]:px-4 md:[&>button]:px-6 [&>button]:rounded-lg rounded-lg"
        value={inquiryForm.type || ''}
        onChange={(value) => updateInquiryForm('type', value)}
        placeholder="문의 유형을 선택해주세요."
        options={INQUIRY_FORM_DROPDOWN_ITEMS}
        disabled={false}
        fieldLabel="문의유형"
        valueClassName="text-label1 md:text-headline2"
        placeholderClassName="text-label1 md:text-headline2"
      />

      <CommonInput
        id="title"
        placeholder="제목을 입력해주세요."
        label="문의제목"
        value={inquiryForm.title}
        onChange={(e) => updateInquiryForm('title', e.target.value)}
      />

      <CommonTextarea
        id="content"
        placeholder="문의 내용을 입력해주세요"
        label="문의내용"
        value={inquiryForm.content}
        onChange={(e) => updateInquiryForm('content', e.target.value)}
        className="max-h-[130px] h-[130px] md:max-h-100 md:h-100"
      />

      <Button
        disabled={!isValid}
        loading={isPending}
        loadingText="전송 중..."
        size="custom"
        className="text-headline1 w-full h-12"
      >
        등록하기
      </Button>
    </form>
  );
}

export default InquiryForm;
