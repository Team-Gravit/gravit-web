import type { Meta, StoryObj } from "@storybook/react-vite";
import pcBackgroundImage from "@/shared/assets/images/banner.webp";
import { withTanstackRouter } from "@/shared/lib/test/with-router";
import HeaderContent from "./header-content";
import {
	DEFAULT_HEADER_NAV_LIST,
	LEARNING_HEADER_NAV_LIST,
} from "../header-nav-list";
import HeaderBackButton from "./header-back-button";

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
	},
	argTypes: {
		profileImageNum: {
			description: "프로필 이미지 색상",
		},
		navList: {
			description: "헤더 네비게이션 리스트",
		},
		leftSlot: {
			description: "헤더 왼쪽 요소",
		},
		rightSlot: {
			description: "헤더 오른쪽 요소",
		},
	},
	decorators: [
		(Story) => (
			<div
				style={{
					zoom: 0.75,
					minWidth: 1280,
					backgroundImage: `url(${pcBackgroundImage})`,
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

export const LearningPageHeader: Story = {
	name: "학습 페이지 헤더",
	args: {
		navList: LEARNING_HEADER_NAV_LIST,
		leftSlot: <HeaderBackButton />,
		rightSlot: <span className="text-[#EB3D32] text-xl">탈퇴하기</span>,
	},
	decorators: [
		withTanstackRouter({
			routeId: "/_authenticated/_fixed-header-layout/learning/",
			path: "/learning",
		}),
	],
};
