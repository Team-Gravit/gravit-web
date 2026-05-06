import type { Meta, StoryObj } from "@storybook/react-vite";
import ChaptersSection from "./chapters-section";

const meta = {
	title: "Widgets/MainPage/ChaptersSection",
	component: ChaptersSection,
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div className="w-[720px]">
				<Story />
			</div>
		),
	],
	tags: ["autodocs"],
	argTypes: {
		chapters: {
			table: { disable: true },
		},
	},
} satisfies Meta<typeof ChaptersSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockChapters = [
	{ id: 1, title: "변수와 자료형", status: "unlocked" as const, lessonNum: 1 },
	{ id: 2, title: "조건문과 반복문", status: "unlocked" as const, lessonNum: 2 },
	{ id: 3, title: "함수와 스코프", status: "locked" as const, lessonNum: 3 },
	{ id: 4, title: "객체와 배열", status: "locked" as const, lessonNum: 4 },
];

export const Default: Story = {
	name: "기본",
	args: {
		chapters: mockChapters,
	},
};

export const AllUnlocked: Story = {
	name: "전체 잠금 해제",
	args: {
		chapters: mockChapters.map((c) => ({ ...c, status: "unlocked" as const })),
	},
};

export const AllLocked: Story = {
	name: "전체 잠김",
	args: {
		chapters: mockChapters.map((c) => ({ ...c, status: "locked" as const })),
	},
};

export const SingleChapter: Story = {
	name: "챕터 1개",
	args: {
		chapters: [mockChapters[0]],
	},
};
