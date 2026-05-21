import type { Meta, StoryObj } from "@storybook/react-vite";
import type { UnitProgress } from "@/entities/learning/model/schema";
import UnitListCard from "./unit-list-card";

const UNIT_TITLES = [
	"변수와 자료형",
	"조건문과 반복문",
	"함수와 스코프",
	"배열과 객체",
	"비동기 프로그래밍",
];

const MANY_UNIT_TITLES = [
	"변수와 자료형",
	"조건문과 반복문",
	"함수와 스코프",
	"배열과 객체",
	"비동기 프로그래밍",
	"클로저와 스코프 체인",
	"프로토타입과 클래스",
	"모듈 시스템",
	"에러 핸들링",
	"TypeScript 기초",
];

const makeUnits = (completedCount: number): UnitProgress[] =>
	UNIT_TITLES.map((title, i) => ({
		unitId: i + 1,
		title,
		isCompleted: i < completedCount,
	}));

const defaultArgs = {
	chapterTitle: "프로그래밍 기초",
	chapterProgressRate: 40,
};

const meta = {
	title: "Widgets/MainPage/UnitListCard",
	component: UnitListCard,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		units: { table: { disable: true } },
	},
} satisfies Meta<typeof UnitListCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const fixedWidth = [
	(Story: React.ComponentType) => (
		<div className="w-[480px]">
			<Story />
		</div>
	),
];

export const Default: Story = {
	name: "기본 (진행 중 포함)",
	args: { ...defaultArgs, units: makeUnits(2) },
	decorators: fixedWidth,
};

export const AllNotStarted: Story = {
	name: "시작 전",
	args: {
		...defaultArgs,
		chapterProgressRate: 0,
		units: makeUnits(0),
	},
	decorators: fixedWidth,
};

export const FirstCompleted: Story = {
	name: "첫 번째 완료",
	args: { ...defaultArgs, chapterProgressRate: 20, units: makeUnits(1) },
	decorators: fixedWidth,
};

export const AllCompleted: Story = {
	name: "전체 완료",
	args: { ...defaultArgs, chapterProgressRate: 100, units: makeUnits(UNIT_TITLES.length) },
	decorators: fixedWidth,
};

export const SingleUnit: Story = {
	name: "유닛 1개",
	args: {
		...defaultArgs,
		units: [{ unitId: 1, title: "변수와 자료형", isCompleted: false }],
	},
	decorators: fixedWidth,
};

export const Scrollable: Story = {
	name: "스크롤 (유닛 10개)",
	args: {
		...defaultArgs,
		units: MANY_UNIT_TITLES.map((title, i) => ({
			unitId: i + 1,
			title,
			isCompleted: i < 3,
		})),
	},
	decorators: fixedWidth,
};

export const OnMobile: Story = {
	name: "모바일 (375px)",
	parameters: {
		layout: "fullscreen",
		viewport: { defaultViewport: "iphone6" },
	},
	decorators: [
		(Story: React.ComponentType) => (
			<div className="p-4">
				<Story />
			</div>
		),
	],
	args: { ...defaultArgs, units: makeUnits(2) },
};

export const OnDesktop: Story = {
	name: "데스크탑 (768px)",
	parameters: {
		layout: "fullscreen",
		viewport: { defaultViewport: "ipad" },
	},
	decorators: [
		(Story: React.ComponentType) => (
			<div className="p-4">
				<Story />
			</div>
		),
	],
	args: { ...defaultArgs, units: makeUnits(2) },
};