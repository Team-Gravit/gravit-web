import type { Meta, StoryObj } from "@storybook/react-vite";
import pcBackgroundImage from "@/shared/assets/images/banner.webp";
import { withTanstackRouter } from "@/shared/lib/test/with-router";
import { DEFAULT_HEADER_NAV_LIST } from "../config/nav";
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
		navList: DEFAULT_HEADER_NAV_LIST,
		variant: "transparent",
	},
	argTypes: {
		profileImageNum: {
			description: "프로필 이미지 색상",
		},
		navList: {
			description: "헤더 네비게이션 리스트",
		},
		variant: {
			control: "select",
			description: "헤더 스타일 variant",
			options: ["transparent", "solid"],
			table: {
				type: {
					summary: "transparent | solid",
				},
				defaultValue: { summary: "transparent" },
			},
		},
	},
	decorators: [
		(Story, { args: { variant } }) => (
			<div
				style={{
					zoom: 0.75,
					minWidth: 1280,
					backgroundImage:
						variant === "transparent" ? `url(${pcBackgroundImage})` : undefined,
				}}
				className="w-full p-4 bg-center"
			>
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Transparent: Story = {};

export const Solid: Story = {
	args: {
		variant: "solid",
	},
};
export const MainActive: Story = {
	name: "홈 활성화 (Transparent)",
	decorators: [
		withTanstackRouter({
			routeId: "/_authenticated/main",
			path: "/main",
		}),
	],
};

export const LearningActive: Story = {
	name: "학습 활성화 (Transparent)",
	decorators: [
		withTanstackRouter({
			routeId: "/_authenticated/_fixed-header-layout/learning/",
			path: "/learning",
		}),
	],
};

export const LeagueActive: Story = {
	name: "리그 활성화 (Transparent)",
	decorators: [
		withTanstackRouter({
			routeId: "/_authenticated/_fixed-header-layout/league",
			path: "/league",
		}),
	],
};

export const UserActive: Story = {
	name: "마이그래빗 활성화 (Transparent)",
	decorators: [
		withTanstackRouter({
			routeId:
				"/_authenticated/_fixed-header-layout/_fixed-sidebar-layout/user/",
			path: "/user",
		}),
	],
};
