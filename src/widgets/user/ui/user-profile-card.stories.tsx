import type { Meta, StoryObj } from "@storybook/react-vite";
import UserProfileCard from "./user-profile-card";

const meta: Meta<typeof UserProfileCard> = {
	title: "Widgets/User/UI/UserProfileCard",
	component: UserProfileCard,
	tags: ["autodocs"],
	argTypes: {
		profileImageNumber: {
			description: "프로필 이미지 넘버",
			type: "number",
		},
		nickname: {
			description: "유저 닉네임",
			type: "string",
		},
		handle: {
			description: "유저의 ID",
			type: "string",
		},
		level: {
			description: "유저의 현재 레벨",
			type: "number",
		},
		currentLeague: {
			description: "유저의 현재 리그",
			type: "string",
		},
		consecutiveSolvedDays: {
			description: "유저의 연속 학습일",
			type: "number",
		},
	},
	args: {
		profileImageNumber: 4,
		nickname: "홍길동",
		handle: "y2t3g6vm",
		currentLeague: "브론즈 3",
		level: 7,
		consecutiveSolvedDays: 4,
	},
};

export default meta;

type Story = StoryObj<typeof UserProfileCard>;

export const Default: Story = {
	name: "데스크탑",
};

export const Mobile: Story = {
	name: "모바일",
	globals: {
		viewport: { value: "mobile2", isRotated: false },
	},
};
