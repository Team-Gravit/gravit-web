export default function LessonProgressBar({ progress }: { progress: string }) {
	return (
		<div className="relative w-full h-1 bg-main-1/20 z-20 shrink-0">
			<div
				style={{ width: progress }}
				className="absolute left-0 top-0 h-full bg-main-1 transition-[width] duration-300 ease-out shrink-0"
			/>
		</div>
	);
}
