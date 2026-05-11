import type { Meta, StoryObj } from "@storybook/react-vite";
import LabeledProgressBar from "./labeled-progress-bar";

type StoryArg = {
	value: number;
	labelText: string;
	valueLabelText: string;
	barClassName?: string;
};

const meta: Meta<typeof LabeledProgressBar> = {
	title: "Shared/UI/Progress/LabeledProgressBar",
	component: LabeledProgressBar,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "number",
			description: "진행률 퍼센트",
		},
		label: {
			description: "상단 좌측 요소",
		},
		valueLabel: {
			description: "상단 우측 요소",
		},
		barClassName: {
			description: "프로그래스 바 요소 클래스",
		},
	},
	decorators: [
		(Story) => (
			<div className="w-[500px]">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof LabeledProgressBar>;

// 컴포넌트를 실제로 사용 하는 방법
export const Default: Story = {
	args: {
		value: 60,
		label: <span className="text-2xl font-semibold">자료구조</span>,
		valueLabel: <span className="text-main-1">60%</span>,
	},
};

// 문서 내에서 수정, 편집이 편하도록
export const Playground: StoryObj<StoryArg> = {
	args: {
		value: 60,
		labelText: "자료구조",
		valueLabelText: "60%",
	},
	render: ({ labelText, valueLabelText, ...args }) => (
		<LabeledProgressBar
			{...args}
			label={<span className="text-2xl font-semibold">{labelText}</span>}
			valueLabel={<span className="text-main-1">{valueLabelText}</span>}
		/>
	),
};
