import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface InterviewAnswer {
  /** 제출 텍스트. TEXT=입력값 / VOICE=STT 수화본 → 편집 */
  content: string;
  /** 음성 키. VOICE=업로드 key / TEXT=null */
  audioKey: string | null;
}

interface InterviewSessionState {
  /** 복원된 진행이 어떤 세션 것인지. 다른 세션으로 진입하면 reset 판단에 쓴다. */
  sessionId: number | null;
  /** 현재 문항 인덱스(0부터). 문항 수는 서버(Query)가 가지므로 여기선 경계 검증하지 않는다. */
  currentIndex: number;
  /** 제출 버퍼. key = displayOrder(1..N). 두 모드 공통으로 여기 모은다. */
  answers: Record<number, InterviewAnswer>;
  /** 자동 녹음 토글(VOICE). TEXT에선 쓰지 않는다. */
  isAutoRecord: boolean;
  /** STT 결과를 content 로 1회만 수화하기 위한 가드(VOICE). persist 위해 Set 대신 배열. */
  hydratedOrders: number[];

  /**
   * 이 세션 컨텍스트로 store를 정렬한다(진행·확인 화면 공통). 같은 세션이면 복원된 진행을 유지하고,
   * 다른 세션이면 초기화한다. 정상 진입은 같은 세션이라 no-op 이고, 다른 세션 잔재만 정리한다.
   */
  enterSession: (sessionId: number) => void;
  /** TEXT 입력 / VOICE 편집. audioKey 는 기존 값을 유지한다. */
  setAnswerContent: (order: number, content: string) => void;
  /** VOICE 업로드 직후 audioKey 기록. content 는 기존 값을 유지한다. */
  setAnswerAudioKey: (order: number, audioKey: string | null) => void;
  setAutoRecord: (value: boolean) => void;
  markHydrated: (order: number) => void;
  goTo: (index: number) => void;
  goNext: () => void;
  /** 세션 완료/이탈 시 전체 초기화. */
  reset: () => void;
}

const EMPTY_PROGRESS = {
  currentIndex: 0,
  answers: {} as Record<number, InterviewAnswer>,
  isAutoRecord: true,
  hydratedOrders: [] as number[],
};

export const useInterviewSessionStore = create<InterviewSessionState>()(
  persist(
    (set) => ({
      sessionId: null,
      ...EMPTY_PROGRESS,

      enterSession: (sessionId) =>
        set((state) =>
          state.sessionId === sessionId ? { sessionId } : { sessionId, ...EMPTY_PROGRESS },
        ),

      setAnswerContent: (order, content) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [order]: { content, audioKey: state.answers[order]?.audioKey ?? null },
          },
        })),

      setAnswerAudioKey: (order, audioKey) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [order]: { content: state.answers[order]?.content ?? '', audioKey },
          },
        })),

      setAutoRecord: (isAutoRecord) => set({ isAutoRecord }),

      markHydrated: (order) =>
        set((state) =>
          state.hydratedOrders.includes(order)
            ? {}
            : { hydratedOrders: [...state.hydratedOrders, order] },
        ),

      goTo: (currentIndex) => set({ currentIndex }),

      goNext: () => set((state) => ({ currentIndex: state.currentIndex + 1 })),

      reset: () => set({ sessionId: null, ...EMPTY_PROGRESS }),
    }),
    {
      // localStorage(기본)로 영속화한다. 음성 세션은 이미 업로드·변환된 문항을 재요청하면
      // 서버가 4xx 를 반환하므로, 같은 기기 재진입 시 진행(audioKey·currentIndex)을 복원해
      // 완료한 문항을 다시 녹음하지 않게 한다.
      name: 'interview-session',
    },
  ),
);

export const useInterviewSessionAutoRecord = () => {
  const isAutoRecord = useInterviewSessionStore((s) => s.isAutoRecord);
  const setIsAutoRecord = useInterviewSessionStore((s) => s.setAutoRecord);

  return { isAutoRecord, setIsAutoRecord };
};
