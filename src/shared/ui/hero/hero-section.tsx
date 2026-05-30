import pcBackgroundImage from "@/shared/assets/_images/pcBannerImage.png";
import mobileBackgroundImage from "@/shared/assets/_images/mobile-banner.png";
import { cn } from "@/shared/lib/cn";

export default function HeroSection({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex relative w-full h-[266px] md:h-[274px] overflow-hidden">
			<picture className="absolute inset-0 w-full h-full overflow-hidden z-0">
				<source media="(max-width: 768px)" srcSet={mobileBackgroundImage} />
				<img
					src={pcBackgroundImage}
					className="object-cover object-right h-full w-full"
					alt="hero section background"
				/>
			</picture>
			<div className="block md:hidden pointer-events-none absolute inset-x-0 bottom-0 z-5 h-16 bg-gradient-to-t from-gray-200 to-transparent" />

			{children}
		</section>
	);
}

function HeroContent({
	children,
	className,
	spacing = "header-aligned",
}: {
	children: React.ReactNode;
	className?: string;
	spacing?: "header-aligned" | "content-padded";
}) {
	const heroContentSpacing = {
		"header-aligned": "md:px-19 md:pb-14 p-5 pb-12",
		"content-padded": "max-w-300  mx-auto px-5 pb-12 pb-5 xl:px-0",
	};

	return (
		<div
			className={cn(
				"mt-auto z-10 w-full",
				heroContentSpacing[spacing],
				className,
			)}
		>
			{children}
		</div>
	);
}

function HeroHeader({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("absolute top-0 left-0 p-5 z-10 w-full", className)}>
			{children}
		</div>
	);
}
HeroSection.Content = HeroContent;
HeroSection.Header = HeroHeader;
