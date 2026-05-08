import type { Meta, StoryObj } from "@storybook/react-vite";
import DayBadge from "./day-badge";

const meta: Meta<typeof DayBadge> = {
	title: "Shared/UI/Badge/DayBadge",
	component: DayBadge,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		status: {
			control: "select",
			options: ["completed", "today", "upcoming"],
			description: "배지 상태",
			table: {
				type: {
					summary: "'completed' | 'today' | 'upcoming'",
				},
			},
		},
		size: {
			control: "select",
			description: "배지 크기",
			table: {
				type: {
					summary: "'sm' | 'md'",
				},
				defaultValue: {
					summary: "md",
				},
			},
		},
		label: {
			control: "text",
			description: "배지 라벨",
		},
	},
	args: {
		label: "월",
		status: "completed",
		size: "md",
	},
};

export default meta;

type Story = StoryObj<typeof DayBadge>;

export const Today: Story = {
	args: {
		status: "today",
	},
};

export const Completed: Story = {
	args: {
		status: "completed",
	},
};

export const Upcoming: Story = {
	args: {
		status: "upcoming",
	},
};

export const SizeSmall: Story = {
	name: "크기 - sm",
	args: {
		status: "today",
		size: "sm",
	},
};

export const SizeMedium: Story = {
	name: "크기 - md",
	args: {
		status: "today",
		size: "md",
	},
};
