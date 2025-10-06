import LogoImage from "@/shared/assets/icons/logo.svg?react";

export default function Logo() {
	return (
		<div className="flex flex-col items-center gap-3 mt-5 mb-3">
			<LogoImage className="lg:w-96 w-80 text-white" />
			<h2 className="font-bold text-xl text-white">
				그래빗과 함께 CS 지식을 마스터해요!
			</h2>
		</div>
	);
}
