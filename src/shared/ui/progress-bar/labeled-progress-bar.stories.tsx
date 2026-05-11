import type { Meta, StoryObj } from "@storybook/react-vite";
import LabeledProgressBar from "./labeled-progress-bar";

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
			description: "상단 좌측 라벨",
		},
		className: {
			description: "전체 래퍼 요소 클래스",
		},
		barClassName: {
			description: "프로그래스 바 요소 클래스",
		},
		labelClassName: {
			description: "상단 라벨 요소 클래스",
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
		label: "자료구조",
	},
};
