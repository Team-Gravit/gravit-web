import type { Meta, StoryObj } from "@storybook/react-vite";
import type { UnitProgress } from "@/entities/learning/model/schema";
import UnitList from "./unit-list";

const UNIT_TITLES = [
	"변수와 자료형",
	"조건문과 반복문",
	"함수와 스코프",
	"배열과 객체",
	"비동기 프로그래밍",
];

const makeUnits = (completedCount: number): UnitProgress[] =>
	UNIT_TITLES.map((title, i) => ({
		unitId: i + 1,
		title,
		isCompleted: i < completedCount,
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
	args: { units: makeUnits(0) },
};

export const FirstCompleted: Story = {
	name: "첫 번째 완료",
	args: { units: makeUnits(1) },
};

export const MiddleCompleted: Story = {
	name: "절반 완료",
	args: { units: makeUnits(3) },
};

export const AllCompleted: Story = {
	name: "전체 완료",
	args: { units: makeUnits(UNIT_TITLES.length) },
};