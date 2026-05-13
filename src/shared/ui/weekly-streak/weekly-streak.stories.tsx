import type { Meta, StoryObj } from "@storybook/react-vite";
import WeeklyStreak from "./weekly-streak";

const meta: Meta<typeof WeeklyStreak> = {
	title: "Shared/UI/WeeklyStreak/WeeklyStreak",
	component: WeeklyStreak,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
};

export default meta;

type Story = StoryObj<typeof WeeklyStreak>;

export const Default: Story = {};

export const Mobile: Story = {
	name: "모바일",
	globals: {
		viewport: { value: "mobile2", isRotated: false },
	},
};
