import type { Meta, StoryObj } from "@storybook/react-vite";
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
	args: { units: makeUnits(2) },
	decorators: fixedWidth,
};

export const AllNotStarted: Story = {
	name: "시작 전",
	args: {
		units: UNIT_TITLES.map((title, i) => ({
			id: i + 1,
			title,
			status: "notStarted" as const,
		})),
	},
	decorators: fixedWidth,
};

export const FirstInProgress: Story = {
	name: "첫 번째 유닛 진행 중",
	args: { units: makeUnits(0) },
	decorators: fixedWidth,
};

export const LastInProgress: Story = {
	name: "마지막 유닛 진행 중",
	args: { units: makeUnits(UNIT_TITLES.length - 1) },
	decorators: fixedWidth,
};

export const AllCompleted: Story = {
	name: "전체 완료",
	args: { units: makeUnits(null) },
	decorators: fixedWidth,
};

export const SingleUnit: Story = {
	name: "유닛 1개",
	args: {
		units: [{ id: 1, title: "변수와 자료형", status: "inProgress" }],
	},
	decorators: fixedWidth,
};

export const Scrollable: Story = {
	name: "스크롤 (유닛 10개)",
	args: {
		units: MANY_UNIT_TITLES.map((title, i) => ({
			id: i + 1,
			title,
			status:
				i < 3
					? ("completed" as const)
					: i === 3
						? ("inProgress" as const)
						: ("notStarted" as const),
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
	args: { units: makeUnits(2) },
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
	args: { units: makeUnits(2) },
};
