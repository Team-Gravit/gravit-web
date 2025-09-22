import BackgroundImage from "@/shared/assets/images/login-background.webp";

export default function Background({
	children,
}: {
	children?: React.ReactNode;
}) {
	return (
		<div
			className="w-screen h-screen bg-no-repeat bg-center"
			style={{
				backgroundImage: `url(${BackgroundImage})`,
				backgroundSize: "100% 100%",
				backgroundPosition: "0 var(--header-height)",
			}}
		>
			<div
				className="w-full flex flex-col items-center  py-10 gap-4"
				style={{
					height: "calc(100% - var(--header-height))",
					marginTop: "var(--header-height)",
				}}
			>
				{children}
			</div>
		</div>
	);
}
