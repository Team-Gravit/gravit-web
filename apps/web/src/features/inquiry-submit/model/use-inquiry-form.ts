import { useState } from 'react';

interface InquiryFormValues {
  type: string;
  title: string;
  content: string;
}

const INITIAL_VALUES: InquiryFormValues = { type: '', title: '', content: '' };

/**
 * 문의 작성 폼 상태.
 */
export function useInquiryForm() {
  const [values, setValues] = useState<InquiryFormValues>(INITIAL_VALUES);

  const content = values.content.trim();

  const isValid =
    values.type.length > 0 &&
    values.title.trim().length > 0 &&
    content.length > 0 &&
    content.length <= 5000;

  const update = (field: keyof InquiryFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  return { values, update, isValid };
}
