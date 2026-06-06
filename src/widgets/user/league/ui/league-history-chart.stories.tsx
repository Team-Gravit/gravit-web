import type { Meta, StoryObj } from "@storybook/react-vite";
import LeagueHistoryChart from "./league-history-chart";

const meta: Meta<typeof LeagueHistoryChart> = {
	title: "Widgets/User/League/UI/LeagueHistoryChart",
	component: LeagueHistoryChart,
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof LeagueHistoryChart>;

export const Default: Story = {};
