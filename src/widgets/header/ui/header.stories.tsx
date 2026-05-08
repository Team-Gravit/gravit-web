import type { Meta, StoryObj } from "@storybook/react-vite";
import pcBackgroundImage from "@/shared/assets/images/banner.webp";
import { withTanstackRouter } from "@/shared/lib/test/with-router";
import HeaderContent from "./header-content";

const meta: Meta<typeof HeaderContent> = {
	title: "Widgets/Header/Header",
	component: HeaderContent,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: {
		profileImageNum: 1,
	},
	decorators: [
		(Story) => (
			<div
				style={{
					backgroundImage: `url(${pcBackgroundImage})`,
				}}
				className="w-full h-[300px] p-4 bg-center"
			>
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MainActive: Story = {
	name: "홈 활성화",
	decorators: [
		withTanstackRouter({
			routeId: "/_authenticated/_fixed-header-layout/main",
			path: "/main",
		}),
	],
};

export const LearningActive: Story = {
	name: "학습 활성화",
	decorators: [
		withTanstackRouter({
			routeId: "/_authenticated/_fixed-header-layout/learning/",
			path: "/learning",
		}),
	],
};

export const LeagueActive: Story = {
	name: "리그 활성화",
	decorators: [
		withTanstackRouter({
			routeId: "/_authenticated/_fixed-header-layout/league",
			path: "/league",
		}),
	],
};

export const UserActive: Story = {
	name: "마이그래빗 활성화",
	decorators: [
		withTanstackRouter({
			routeId:
				"/_authenticated/_fixed-header-layout/_fixed-sidebar-layout/user/",
			path: "/user",
		}),
	],
};
