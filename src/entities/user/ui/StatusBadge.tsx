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
			className={`flex flex-row items-center justify-center gap-0.5 text-xl font-bold px-1.5 py-[3px] bg-white rounded-full ${className} custom-shadow`}
			{...props}
		>
			<div
				className="rounded-full relative w-6 h-6"
				style={{ backgroundColor: badgeBackground }}
			>
				<Icon className="absolute w-[17px] h-[17px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
			</div>

			<span className={`text-xl font-bold `} style={{ color: textColor }}>
				{label}
			</span>
		</div>
	);
}

export default StatusBadge;
