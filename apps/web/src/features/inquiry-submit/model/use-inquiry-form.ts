import { useState } from 'react';

interface InquiryFormValues {
  type: string;
  title: string;
  content: string;
}

const INITIAL_VALUES: InquiryFormValues = { type: '', title: '', content: '' };

/**
 * 문의 작성 폼 상태. 유효성은 legacy zod(`SubmitInquiryBody`의 min(1) x3)와 동등하게
 * 세 값이 모두 비어있지 않은지로 판정한다.
 */
export function useInquiryForm() {
  const [values, setValues] = useState<InquiryFormValues>(INITIAL_VALUES);

  const isValid = values.type.length > 0 && values.title.length > 0 && values.content.length > 0;

  const update = (field: keyof InquiryFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  return { values, update, isValid };
}
