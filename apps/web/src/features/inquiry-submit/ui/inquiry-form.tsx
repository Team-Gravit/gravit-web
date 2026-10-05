import type { FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { INQUIRY_TYPE_OPTIONS } from '@/entities/inquiry';
import { Button } from '@/shared/ui/button';
import { FloatingSelect } from '@/shared/ui/select';
import { FloatingTextArea, FloatingTextField } from '@/shared/ui/text-field';

import { useSubmitInquiry } from '../api/use-submit-inquiry';
import { useInquiryForm } from '../model/use-inquiry-form';

/** 문의 작성 폼. 유형·제목·내용을 받아 제출하고, 성공하면 문의 내역으로 돌아간다. */
export function InquiryForm() {
  const navigate = useNavigate();
  const { values, update, isValid } = useInquiryForm();
  const { mutate, isPending } = useSubmitInquiry(() =>
    navigate({ to: '/settings/inquiry', search: { page: 1 } }),
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate({ data: values });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <FloatingSelect
        label="문의유형"
        placeholder="문의 유형을 선택해주세요."
        options={INQUIRY_TYPE_OPTIONS}
        value={values.type}
        onValueChange={(value) => update('type', value)}
      />
      <FloatingTextField
        label="문의제목"
        placeholder="제목을 입력해주세요."
        value={values.title}
        onChange={(event) => update('title', event.target.value)}
      />
      <FloatingTextArea
        label="문의내용"
        placeholder="문의 내용을 입력해주세요."
        value={values.content}
        onChange={(event) => update('content', event.target.value)}
      />
      <Button
        type="submit"
        size="cta"
        disabled={!isValid}
        isLoading={isPending}
        className="md:mt-5"
      >
        등록하기
      </Button>
    </form>
  );
}
