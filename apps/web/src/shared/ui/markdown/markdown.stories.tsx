import type { Meta, StoryObj } from '@storybook/react-vite';

import { Markdown } from './markdown';

// 개념노트에서 사용하는 Markdown 문법을 한 번에 확인하는 예시다.
const CONCEPT_NOTE_SAMPLE = `### 1. 배열이란

**논리적 저장 순서**와 **물리적 저장 순서**가 일치하는 자료구조다. \`arr[i]\` 로 **O(1)** 에 접근한다.

React에서 **렌더링(Rendering)**은 컴포넌트 함수를 호출해 UI를 설명받는 과정이다.

<br>

### 2. 연산별 시간 복잡도

| **연산** | **시간 복잡도** | **비고**         |
| -------- | --------------- | ---------------- |
| 접근     | **O(1)**        | 인덱스로 바로    |
| 삽입     | **O(n)**        | 뒤 원소를 민다   |

> 💡 동적 배열은 공간이 부족하면 두 배로 늘린다.

> ⚠️ 중간 삽입이 잦으면 연결 리스트를 검토한다.

❗️**주의**: 인덱스가 범위를 벗어나면 예외가 난다.

\`\`\`python
arr = [1, 2, 3]
arr.append(4)
very_long_variable_name = "코드 블록이 본문 너비를 밀어내지 않고 블록 안에서만 스크롤되는지 확인하기 위한 긴 코드입니다."
\`\`\`

\`\`\`
[1] → [2] → [3]
Latin : AB CD EF
한글  : 가 나 다
head -> [값|next] -> [값|next]
\`\`\`

1. 메모리를 연속으로 잡는다
   - 캐시 적중률이 높다
2. 크기를 미리 정한다

---

<img src="https://raw.githubusercontent.com/Team-Gravit/gravit-images/main/algorithm/unit04/image1.png" width="75%">
`;

const meta = {
  title: 'Primitives/Markdown',
  component: Markdown,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '마크다운을 Typography의 prose 스타일로 렌더링한다. GFM 을 지원하고, 원시 HTML 은 `<br>` · `<img>` 만 허용한다. 그 밖의 태그는 그리지 않는다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['md', 'sm'],
      description: '본문 크기. md = Body 1 Reading(16), sm = Body 2 Reading(15)',
      table: { defaultValue: { summary: 'md' } },
    },
  },
  args: { children: CONCEPT_NOTE_SAMPLE, size: 'md' },
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConceptNote: Story = {};

export const Small: Story = { args: { size: 'sm' } };

export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};
