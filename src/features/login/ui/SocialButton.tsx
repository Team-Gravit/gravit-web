export default function SocialButton({
	provider,
	imgSrc,
	onClick,
}: {
	provider: "google" | "kakao" | "naver";
	imgSrc: string;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			id={provider}
			className="flex w-[400px] lg:w-full cursor-pointer "
			onClick={onClick}
		>
			<img className="flex w-full h-full" src={imgSrc} alt={provider} />
		</button>
	);
}
