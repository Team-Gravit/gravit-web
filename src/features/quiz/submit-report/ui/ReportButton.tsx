import ReportIcon from "./assets/report.svg?react";

export default function ReportButton({
	onHandleClickReport,
	className,
}: {
	onHandleClickReport: () => void;
	className?: string;
}) {
	return (
		<button type="button" onClick={onHandleClickReport} className={className}>
			<ReportIcon className="w-[37px]" />
		</button>
	);
}
