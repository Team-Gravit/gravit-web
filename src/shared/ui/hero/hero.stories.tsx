import type { Meta, StoryObj } from "@storybook/react-vite";
import HeroSection from "./hero-section";
import LabeledProgressRing from "../progress-bar/labeled-progress-ring";
import Bronze1 from "@/shared/assets/icons/tiers/Bronze1.svg?react";

import Profile from "@/shared/assets/icons/profile3.svg?react";

const meta: Meta<typeof HeroSection> = {
	title: "Shared/Ui/Hero/Hero",
	component: HeroSection,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {
	render: () => (
		<HeroSection>
			<HeroSection.Content className="text-white">
				<p className="text-4xl  mb-2 font-semibold">어서오세요, 땅콩님!</p>
				<p className="text-lg">그래빗과 함께 CS 지식을 마스터해요!</p>
			</HeroSection.Content>
		</HeroSection>
	),
};

export const SpacingContentPadded: Story = {
	render: () => (
		<HeroSection>
			<HeroSection.Content spacing="content-padded" className="text-white">
				<p className="text-4xl  mb-2 font-semibold">어서오세요, 땅콩님!</p>
				<p className="text-lg">그래빗과 함께 CS 지식을 마스터해요!</p>
			</HeroSection.Content>
		</HeroSection>
	),
};

export const Mobile: Story = {
	name: "모바일",
	globals: {
		viewport: { value: "mobile2", isRotated: false },
	},
	render: () => (
		<HeroSection>
			<HeroSection.Content className="text-white">
				<p className="text-3xl  mb-1 font-semibold">어서오세요, 땅콩님!</p>
				<p className="text-lg">그래빗과 함께 CS 지식을 마스터해요!</p>
			</HeroSection.Content>
		</HeroSection>
	),
};

export const MobileWithHeader: Story = {
	name: "모바일 + 상단 컨텐츠",
	globals: {
		viewport: { value: "mobile2", isRotated: false },
	},
	render: () => (
		<HeroSection>
			<HeroSection.Header className="text-white">
				<div className="flex gap-4 items-center">
					<LabeledProgressRing
						content={<Profile className="size-8" />}
						value={60}
						label="LV 1"
						size="sm"
					/>
					<LabeledProgressRing
						content={<Bronze1 className="size-8" />}
						value={60}
						label="브론즈 1"
					/>
				</div>
			</HeroSection.Header>
			<HeroSection.Content spacing="content-padded" className="text-white">
				<p className="text-3xl  mb-1 font-semibold">어서오세요, 땅콩님!</p>
				<p className="text-lg">그래빗과 함께 CS 지식을 마스터해요!</p>
			</HeroSection.Content>
		</HeroSection>
	),
};
