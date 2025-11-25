type StatusBadgeProps = {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	className?: string;
	badgeBackground?: string;
	textColor?: string;
} & React.HTMLAttributes<HTMLDivElement>;

function StatusBadge({
	icon: Icon,
	label,
	className = "",
	badgeBackground,
	textColor,
	...props
}: StatusBadgeProps) {
	return (
		<div
			className={`flex flex-row items-center justify-center gap-1.5 text-xl font-bold px-1.5 py-[3px] bg-white rounded-full ${className}`}
			{...props}
		>
			<div
				className="rounded-full relative w-7 h-7"
				style={{ backgroundColor: badgeBackground }}
			>
				<Icon className="absolute w-[23px] h-[23px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
			</div>

			<span className={`text-2xl font-bold `} style={{ color: textColor }}>
				{label}
			</span>
		</div>
	);
}

export default StatusBadge;
