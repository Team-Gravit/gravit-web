import type { Meta, StoryObj } from '@storybook/react-vite';

import { ProblemReportSuccessModal } from './problem-report-success-modal';

const meta = {
  title: 'Features/ProblemReport/SuccessModal',
  component: ProblemReportSuccessModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '신고 제출이 성공하면 작성 모달 대신 열립니다. 시안: Figma `WEB-UP-신고하기 모달`(완료) · `APP-UP-신고완료 모달`.',
      },
    },
  },
  args: {
    open: true,
    onOpenChange: () => {},
  },
} satisfies Meta<typeof ProblemReportSuccessModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
