import { createFileRoute } from "@tanstack/react-router";
import Banner2 from "@/shared/ui/banner/Banner2";
import StudyNote from "@/shared/ui/studynote/studynote";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/studynote",
)({ component: StudyNotePage });

const mockbannerData = {
	subject: "자료구조",
	title: "유닛 1 개념노트",
	description: "여기에 뭐 쓸게 있을까요? 있는게 예쁜 것 같아요.",
};

const mockStudyNoteData = {
	title: "제목",
	subtitle: "배열(Array)",
	buttonLabel: "학습하러 가기",
	content: `
## 배열(Array)

**논리적 저장 순서**와 **물리적 저장 순서**가 일치하는 기본 자료구조. **인덱스**를 통한 **O(1)** 접근이 가능하지만, 삽입/삭제 시 원소 이동으로 인해 **O(n)** 의 비용이 발생한다.

<img src="https://raw.githubusercontent.com/Team-Gravit/gravit-images/main/data-structure/unit01/image.png" width="100%">

### 1. 특징

- **배열**는 메모리 상에서 **연속된 공간**에 데이터를 순차적으로 저장
- 각 원소는 **0**부터 시작하는 **인덱스**로 식별
- 인덱스를 통해 특정 원소에 **직접 접근**(Random Access) 가능

<br>

### 2-1. 배열의 장점

- **인덱스**를 통한 빠른 접근 (O(1))
- **연속된 메모리** 배치로 **캐시 지역성**(Cache Locality) 활용 가능
- 구조가 단순하여 구현과 사용이 간단

<br>
`,
};

function StudyNotePage() {
	return (
		<div className="w-screen min-h-screen flex-col">
			<Banner2
				subject={mockbannerData.subject}
				title={mockbannerData.title}
				description={mockbannerData.description}
			/>

			<div className="flex py-14 justify-center">
				<StudyNote
					title={mockStudyNoteData.title}
					subtitle={mockStudyNoteData.subtitle}
					buttonLabel={mockStudyNoteData.buttonLabel}
					content={mockStudyNoteData.content}
				/>
			</div>
		</div>
	);
}
