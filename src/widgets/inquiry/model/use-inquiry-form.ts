import { useState } from 'react';

import { SubmitInquiryBody } from '@/shared/api/@generated/zod-schemas';

function useInquiryForm() {
  const [inquiryType, setInquiryType] = useState('');
  const [inquiryTitle, setInquiryTitle] = useState('');
  const [inquiryContent, setInquiryContent] = useState('');

  const isValid = SubmitInquiryBody.safeParse({
    type: inquiryType,
    title: inquiryTitle,
    content: inquiryContent,
  }).success;

  return {
    inquiryType,
    onChangeInquiryType: (value: string) => {
      setInquiryType(value);
    },
    inquiryTitle,
    onChangeInquiryTitle: (value: string) => {
      setInquiryTitle(value);
    },
    inquiryContent,
    onChangeInquiryContent: (value: string) => {
      setInquiryContent(value);
    },
    isValid,
  };
}

export default useInquiryForm;
