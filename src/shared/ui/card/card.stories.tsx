import type { Meta, StoryObj } from "@storybook/react-vite";
import BgCard from "./bg-card";
import cardBg from "@/shared/assets/images/card-bg.webp";
import Card from "./card";

const meta = {
	title: "Shared/UI/Card/Card",
	component: Card,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "카드 패딩 및 모서리 크기",
			table: {
				type: { summary: "'sm' | 'md' | 'lg'" },
				defaultValue: { summary: "md" },
			},
		},
		className: {
			control: "text",
			description: "추가 CSS 클래스",
		},
		children: {
			table: { disable: true },
		},
	},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- 기본 스토리 ---

export const Default: Story = {
	name: "기본",
	args: {
		size: "md",
	},
	render: (args) => (
		<Card {...args}>
			<Card.Header>
				<Card.Title>카드 제목</Card.Title>
				<Card.Link to="#">더보기</Card.Link>
			</Card.Header>
			<p className="text-sm text-gray-700">카드 본문 내용이 들어갑니다.</p>
		</Card>
	),
};

// --- 크기별 스토리 ---

export const SizeSmall: Story = {
	name: "크기 - sm",
	args: {
		size: "sm",
	},
	render: (args) => (
		<Card {...args}>
			<Card.Header>
				<Card.Title>작은 카드</Card.Title>
			</Card.Header>
			<p className="text-sm text-gray-700">sm 사이즈의 카드입니다.</p>
		</Card>
	),
};

export const SizeMedium: Story = {
	name: "크기 - md (기본)",
	args: {
		size: "md",
	},
	render: (args) => (
		<Card {...args}>
			<Card.Header>
				<Card.Title>중간 카드</Card.Title>
			</Card.Header>
			<p className="text-sm text-gray-700">md 사이즈의 카드입니다.</p>
		</Card>
	),
};

export const SizeLarge: Story = {
	name: "크기 - lg",
	args: {
		size: "lg",
	},
	render: (args) => (
		<Card {...args}>
			<Card.Header>
				<Card.Title>큰 카드</Card.Title>
			</Card.Header>
			<p className="text-sm text-gray-700">lg 사이즈의 카드입니다.</p>
		</Card>
	),
};

// --- 서브컴포넌트 조합 스토리 ---

export const WithHeaderAndLink: Story = {
	name: "헤더 + 링크",
	args: {
		size: "md",
	},
	render: (args) => (
		<Card {...args}>
			<Card.Header>
				<Card.Title>최근 활동</Card.Title>
				<Card.Link to="/activities">전체보기</Card.Link>
			</Card.Header>
			<p className="text-sm text-gray-700">최근 활동 목록이 들어갑니다.</p>
		</Card>
	),
};

export const WithHeaderOnly: Story = {
	name: "헤더만 포함",
	args: {
		size: "md",
	},
	render: (args) => (
		<Card {...args}>
			<Card.Header>
				<Card.Title>알림</Card.Title>
			</Card.Header>
			<p className="text-sm text-gray-700">
				링크 없이 헤더 타이틀만 사용하는 카드입니다.
			</p>
		</Card>
	),
};

export const ContentOnly: Story = {
	name: "컨텐츠만 포함",
	args: {
		size: "md",
	},
	render: (args) => (
		<Card {...args}>
			<p className="text-sm text-gray-700">
				헤더 없이 본문 컨텐츠만 담은 카드입니다.
			</p>
		</Card>
	),
};

// --- BgCard 스토리 ---

export const BgCardDefault: Story = {
	name: "BgCard - 기본",
	args: {
		size: "md",
	},
	render: ({ size, className }) => (
		<BgCard size={size ?? "md"} className={className} backgroundImage={cardBg}>
			<BgCard.Header>
				<BgCard.Title className="text-white">카드 제목</BgCard.Title>
				<BgCard.Link to="#" className="text-white/70">
					더보기
				</BgCard.Link>
			</BgCard.Header>
			<p className="text-sm text-white/80">카드 본문 내용이 들어갑니다.</p>
		</BgCard>
	),
};

export const BgCardSizeSmall: Story = {
	name: "BgCard - sm",
	args: {
		size: "sm",
	},
	render: ({ size, className }) => (
		<BgCard size={size ?? "sm"} className={className} backgroundImage={cardBg}>
			<BgCard.Header>
				<BgCard.Title className="text-white">작은 카드</BgCard.Title>
			</BgCard.Header>
			<p className="text-sm text-white/80">sm 사이즈의 배경 카드입니다.</p>
		</BgCard>
	),
};

export const BgCardSizeLarge: Story = {
	name: "BgCard - lg",
	args: {
		size: "lg",
	},
	render: ({ size, className }) => (
		<BgCard size={size ?? "lg"} className={className} backgroundImage={cardBg}>
			<BgCard.Header>
				<BgCard.Title className="text-white">큰 카드</BgCard.Title>
			</BgCard.Header>
			<p className="text-sm text-white/80">lg 사이즈의 배경 카드입니다.</p>
		</BgCard>
	),
};

export const BgCardContentOnly: Story = {
	name: "BgCard - 컨텐츠만",
	args: {
		size: "md",
	},
	render: ({ size, className }) => (
		<BgCard size={size ?? "md"} className={className} backgroundImage={cardBg}>
			<p className="text-sm text-white/80">
				헤더 없이 본문만 담은 배경 카드입니다.
			</p>
		</BgCard>
	),
};
