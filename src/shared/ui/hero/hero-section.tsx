import pcBackgroundImage from "@/shared/assets/images/banner.webp";
import mobileBackgroundImage from "@/shared/assets/images/mobile-banner.png";
import { cn } from "@/shared/lib/cn";

export default function HeroSection({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex relative w-full h-[330px] overflow-hidden">
			<picture className="absolute inset-0 w-full h-full overflow-hidden z-0">
				<source media="(max-width: 480px)" srcSet={mobileBackgroundImage} />
				<img
					src={pcBackgroundImage}
					className="object-cover object-right h-full w-full"
					alt="hero section background image"
				/>
			</picture>
			<div
				id="overlay"
				className=" max-[480px]:block hidden pointer-events-none absolute inset-x-0 bottom-0 z-50 h-16 bg-gradient-to-t from-gray-200 to-transparent"
			/>

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
		"header-aligned": "lg:px-19 lg:pb-14 p-5 max-[480px]:pb-12",
		"content-padded": "max-w-300  mx-auto px-5 max-[480px]:pb-12 pb-5 xl:px-0",
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
