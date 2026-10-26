export interface ConfirmItem {
  displayOrder: number;
  question: string;
  status?: 'PENDING' | 'COMPLETED' | 'FAILED';
  /** 답변 음성 재생 URL(서버 presigned GET). 없으면 재생 비활성. */
  audioUrl?: string;
}

export interface ConfirmLayoutProps {
  items: ConfirmItem[];
  isPending: boolean;
  onSubmit: () => void;
}
