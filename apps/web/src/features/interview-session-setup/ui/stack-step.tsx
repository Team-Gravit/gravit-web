import { cn } from '@/shared/lib/cn';

import {
  useInterviewStacks,
  type InterviewStack,
  type InterviewStackGroup,
  type InterviewStackResponse,
} from '@/entities/interview';

import { useSessionSetupStore } from '../model/session-setup-store';
import { usePreselectOnlyStack } from '../model/use-preselect-only-stack';
import djangoIcon from './assets/django-icon.png';
import javaIcon from './assets/java-icon.png';
import jsIcon from './assets/js-icon.png';
import kotlinIcon from './assets/kotlin-icon.png';
import nextIcon from './assets/next-icon.png';
import pythonIcon from './assets/python-icon.png';
import reactIcon from './assets/react-icon.png';
import springIcon from './assets/spring-icon.png';
import swiftIcon from './assets/swift-icon.png';
import swiftUiIcon from './assets/swift-ui-icon.png';
import tsIcon from './assets/ts-icon.png';
import vueIcon from './assets/vue-icon.png';
import { ChoiceCardGroup } from './choice-card-group';
import { QueryFallback } from './query-fallback';

// 언어 → 프레임워크 순으로 나란히 보여준다. 아이콘이 없는 프레임워크(NestJS·Compose)는 언어만 둔다.
const STACK_ICON_SRCS: Record<InterviewStack, readonly string[]> = {
  JAVA_SPRING_BOOT: [javaIcon, springIcon],
  KOTLIN_SPRING_BOOT: [kotlinIcon, springIcon],
  NODE_NEST: [jsIcon],
  PYTHON_DJANGO: [pythonIcon, djangoIcon],
  TS_REACT: [tsIcon, reactIcon],
  TS_VUE: [tsIcon, vueIcon],
  TS_NEXT: [tsIcon, nextIcon],
  KOTLIN_COMPOSE: [kotlinIcon],
  SWIFT_SWIFTUI: [swiftIcon, swiftUiIcon],
};

// WEB-AI-05 시안(node 14923:21233). 1·2·4개는 2열 이하 넓은 카드(여백 32px),
// 3·5·6개는 3열 카드(여백 48px)다. 모바일은 개수와 관계없이 1열 목록이다.
function getStackGridClasses(stackCount: number): string {
  if (stackCount === 1) {
    return 'md:grid-cols-1 md:*:p-8';
  }
  if (stackCount === 2 || stackCount === 4) {
    return 'md:grid-cols-2 md:*:p-8';
  }
  return 'md:grid-cols-3 md:*:p-12';
}

export interface StackStepProps {
  stackGroup: InterviewStackGroup;
}

/**
 * 선택한 직군의 스택을 조회해 하나를 고른다.
 * 항목이 하나면 최초 조회 후 자동 선택한다. 같은 화면에서 사용자가 해제한 값은 다시 선택하지 않는다.
 */
export function StackStep({ stackGroup }: StackStepProps) {
  const { data: stacks, isError, refetch } = useInterviewStacks(stackGroup);
  usePreselectOnlyStack(stacks);

  if (!stacks) {
    return <QueryFallback isError={isError} onRetry={() => void refetch()} />;
  }
  return <StackCards stacks={stacks} />;
}

function StackCards({ stacks }: { stacks: InterviewStackResponse[] }) {
  const selectedStack = useSessionSetupStore((state) => state.stack);
  const selectStack = useSessionSetupStore((state) => state.selectStack);

  return (
    <ChoiceCardGroup
      label="스택"
      name="interview-stack"
      options={stacks.map(({ stack, displayName }) => ({
        value: stack,
        title: displayName,
        iconSrcs: STACK_ICON_SRCS[stack],
      }))}
      selectedValue={selectedStack}
      onSelect={selectStack}
      layout="tile"
      className={cn('md:grid md:gap-6', getStackGridClasses(stacks.length))}
    />
  );
}
