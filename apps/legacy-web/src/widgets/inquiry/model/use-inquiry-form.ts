import { useState } from 'react';

import { SubmitInquiryBody } from '@/shared/api/@generated/zod-schemas';

interface InquiryForm {
  type: string;
  title: string;
  content: string;
}

const INITIAL_INQUIRY_FORM: InquiryForm = {
  type: '',
  title: '',
  content: '',
};

function useInquiryForm() {
  const [inquiryForm, setInquiryForm] = useState<InquiryForm>(INITIAL_INQUIRY_FORM);

  const isValid = SubmitInquiryBody.safeParse(inquiryForm).success;

  const updateInquiryForm = (field: keyof InquiryForm, value: string) => {
    setInquiryForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    inquiryForm,
    updateInquiryForm,
    isValid,
  };
}

export default useInquiryForm;
