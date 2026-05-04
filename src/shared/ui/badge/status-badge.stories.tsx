import type { Meta, StoryObj } from "@storybook/react-vite";
import StatusBadge from "./status-badge";

const meta = {
	title: "Shared/UI/Badge/StatusBadge",
	component: StatusBadge,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		status: {
			control: "select",
			options: ["completed", "inProgress", "notStarted"],
			description: "배지 상태",
			table: {
				type: { summary: "'completed' | 'inProgress' | 'notStarted'" },
			},
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "배지 크기",
			table: {
				type: { summary: "'sm' | 'md' | 'lg'" },
				defaultValue: { summary: "md" },
			},
		},
		text: {
			control: "text",
			description: "배지에 표시할 텍스트",
		},
	},
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- 상태별 스토리 ---

export const Completed: Story = {
	name: "완료",
	args: {
		status: "completed",
		text: "완료",
	},
};

export const InProgress: Story = {
	name: "진행중",
	args: {
		status: "inProgress",
		text: "진행중",
	},
};

export const NotStarted: Story = {
	name: "시작 전",
	args: {
		status: "notStarted",
		text: "시작 전",
	},
};

// --- 크기별 스토리 ---

export const SizeSmall: Story = {
	name: "크기 - sm",
	args: {
		status: "inProgress",
		size: "sm",
		text: "진행중",
	},
};

export const SizeMedium: Story = {
	name: "크기 - md (기본)",
	args: {
		status: "inProgress",
		size: "md",
		text: "진행중",
	},
};

export const SizeLarge: Story = {
	name: "크기 - lg",
	args: {
		status: "inProgress",
		size: "lg",
		text: "진행중",
	},
};
