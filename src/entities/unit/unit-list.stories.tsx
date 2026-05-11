import type { Meta, StoryObj } from "@storybook/react-vite";
import UnitList from "./unit-list";

const UNIT_TITLES = [
	"변수와 자료형",
	"조건문과 반복문",
	"함수와 스코프",
	"배열과 객체",
	"비동기 프로그래밍",
];

const makeUnits = (inProgressIndex: number | null) =>
	UNIT_TITLES.map((title, i) => ({
		id: i + 1,
		title,
		status:
			inProgressIndex === null || i < inProgressIndex
				? ("completed" as const)
				: i === inProgressIndex
					? ("inProgress" as const)
					: ("notStarted" as const),
	}));

const meta = {
	component: UnitList,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div className="w-[480px]">
				<Story />
			</div>
		),
	],
	argTypes: {
		units: { table: { disable: true } },
	},
} satisfies Meta<typeof UnitList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllNotStarted: Story = {
	name: "시작 전",
	args: {
		units: UNIT_TITLES.map((title, i) => ({
			id: i + 1,
			title,
			status: "notStarted",
		})),
	},
};

export const FirstInProgress: Story = {
	name: "첫 번째 유닛 진행 중",
	args: { units: makeUnits(0) },
};

export const MiddleInProgress: Story = {
	name: "중간 유닛 진행 중",
	args: { units: makeUnits(2) },
};

export const LastInProgress: Story = {
	name: "마지막 유닛 진행 중",
	args: { units: makeUnits(UNIT_TITLES.length - 1) },
};

export const AllCompleted: Story = {
	name: "전체 완료",
	args: { units: makeUnits(null) },
};
