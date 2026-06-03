import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import Dropdown from "./dropdown";

const ANIMALS = [
	{ value: "cat", label: "고양이" },
	{ value: "dog", label: "강아지" },
	{ value: "hamster", label: "햄스터" },
	{ value: "rabbit", label: "토끼" },
];

const ANIMALS_WITH_DISABLED = [
	{ value: "cat", label: "고양이" },
	{ value: "dog", label: "강아지" },
	{ value: "hamster", label: "햄스터", disabled: true },
	{ value: "rabbit", label: "토끼", disabled: true },
];

const MANY_OPTIONS = [
	{ value: "cat", label: "고양이" },
	{ value: "dog", label: "강아지" },
	{ value: "hamster", label: "햄스터" },
	{ value: "rabbit", label: "토끼" },
	{ value: "parrot", label: "앵무새" },
	{ value: "turtle", label: "거북이" },
	{ value: "fish", label: "물고기" },
	{ value: "snake", label: "뱀" },
	{ value: "lizard", label: "도마뱀" },
	{ value: "ferret", label: "페럿" },
	{ value: "guinea_pig", label: "기니피그" },
	{ value: "hedgehog", label: "고슴도치" },
];

const meta = {
	title: "Components/Dropdowns/Dropdown",
	component: Dropdown,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		placeholder: { control: "text" },
		disabled: { control: "boolean" },
	},
	args: {
		options: ANIMALS,
		value: "",
		onChange: fn(),
		placeholder: "선택하세요",
		disabled: false,
	},
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledDropdown(props: React.ComponentProps<typeof Dropdown>) {
	const [value, setValue] = useState(props.value ?? "");
	return <Dropdown {...props} value={value} onChange={setValue} />;
}

export const Default: Story = {
	render: (args) => <ControlledDropdown {...args} />,
};

export const WithSelectedValue: Story = {
	name: "기본값 선택됨",
	render: (args) => <ControlledDropdown {...args} value="dog" />,
};

export const WithPlaceholder: Story = {
	name: "플레이스홀더",
	render: (args) => (
		<ControlledDropdown {...args} placeholder="반려동물을 선택하세요" />
	),
};

export const WithDisabledOptions: Story = {
	name: "일부 옵션 비활성화",
	render: (args) => (
		<ControlledDropdown {...args} options={ANIMALS_WITH_DISABLED} />
	),
};

export const Disabled: Story = {
	name: "드롭다운 비활성화",
	render: (args) => <ControlledDropdown {...args} disabled />,
};

export const DisabledWithValue: Story = {
	name: "드롭다운 비활성화 (선택값 있음)",
	render: (args) => <ControlledDropdown {...args} value="cat" disabled />,
};

export const WithManyOptions: Story = {
	name: "항목 많음 (스크롤)",
	render: (args) => (
		<ControlledDropdown {...args} options={MANY_OPTIONS} />
	),
};

export const AllStates: Story = {
	name: "상태별",
	parameters: { controls: { disable: true } },
	render: () => (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "16px",
				alignItems: "flex-start",
			}}
		>
			<ControlledDropdown
				options={ANIMALS}
				value=""
				onChange={fn()}
				placeholder="기본"
			/>
			<ControlledDropdown
				options={ANIMALS}
				value="cat"
				onChange={fn()}
				placeholder="선택됨"
			/>
			<ControlledDropdown
				options={ANIMALS_WITH_DISABLED}
				value=""
				onChange={fn()}
				placeholder="일부 비활성화"
			/>
			<ControlledDropdown
				options={ANIMALS}
				value=""
				onChange={fn()}
				placeholder="전체 비활성화"
				disabled
			/>
		</div>
	),
};
