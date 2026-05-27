export default function PageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen md:px-8 bg-bg-2">
			<main className="h-full max-w-[1200px] mx-auto md:pb-50">{children}</main>
		</div>
	);
}
