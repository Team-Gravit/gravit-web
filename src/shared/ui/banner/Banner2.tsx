import bannerImage from "@/shared/assets/images/banner.webp";
import type { FC, ReactNode } from "react";

type Banner2Props = {
	subject?: string;
	title?: string;
	description?: string;
	children?: ReactNode;
};

const Banner2: FC<Banner2Props> = ({
	subject,
	title,
	description,
	children,
}) => {
	return (
		<section
			className="w-full h-[263px] bg-cover bg-no-repeat bg-center overflow-hidden mt-[var(--header-height)] py-[57px] px-[186px]"
			style={{ backgroundImage: `url(${bannerImage})` }}
		>
			{/* 텍스트 컨테이너 */}
			<div className="flex flex-col justify-center gap-2">
				{subject && (
					<h1 className="inline-block w-max px-4 py-1 border-2 border-white rounded-[8px] text-white text-2xl">
						{subject}
					</h1>
				)}

				{title && <p className="text-[40px] font-bold text-white">{title}</p>}

				{description && (
					<p className="text-white mt-2 text-[28px]">{description}</p>
				)}

				{children && <div>{children}</div>}
			</div>
		</section>
	);
};

export default Banner2;
