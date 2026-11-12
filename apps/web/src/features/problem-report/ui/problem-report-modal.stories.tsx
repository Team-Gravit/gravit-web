import type { Meta, StoryObj } from '@storybook/react-vite';

import { ProblemReportModal } from './problem-report-modal';

const meta = {
  title: 'Features/ProblemReport/Modal',
  component: ProblemReportModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '풀이 중 문제 머리의 신고 버튼을 누르면 열립니다. 시안: Figma `WEB-UP-신고하기 모달` · `APP-UP-신고하기 모달`.',
      },
    },
  },
  args: {
    open: true,
    onOpenChange: () => {},
    reportType: null,
    onReportTypeChange: () => {},
    content: '',
    onContentChange: () => {},
    canSubmit: false,
    isSubmitting: false,
    onSubmit: () => {},
  },
} satisfies Meta<typeof ProblemReportModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

/** 웹 시안의 입력 완료 상태. */
export const Filled: Story = {
  args: { reportType: 'TYPO_ERROR', content: '신고 내용 입력 후', canSubmit: true },
};

export const Submitting: Story = {
  args: {
    reportType: 'TYPO_ERROR',
    content: '신고 내용 입력 후',
    canSubmit: true,
    isSubmitting: true,
  },
};
