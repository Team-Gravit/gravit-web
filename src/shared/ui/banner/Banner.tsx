// import Logo from "@/shared/assets/icons/logo.svg?react";
import bannerImage from "@/shared/assets/images/banner.webp";

export default function Banner() {
	return (
		<section
			className="w-full h-[306px] bg-cover bg-no-repeat bg-left flex flex-col justify-center overflow-hidden mt-[76px]"
			style={{
				backgroundImage: `url(${bannerImage})`,
			}}
		>
			<div className="w-full h-full relative pt-[76px]">
				{/* <div className="absolute flex flex-col items-start justify-center z-10 text-white left-[147px] top-1/2 transform -translate-y-1/2 gap-4 pt-[76px]">
					<Logo className="w-[370px] brightness-0 invert" />
					<p className="font-bold text-xl text-white">
						그래빗과 함께 CS 지식을 마스터해요!
					</p>
				</div> */}
			</div>
		</section>
	);
}
