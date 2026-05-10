import DayBadge from "../badge/day-badge";

const WEEK_DAYS = ["월", "화", "수", "목", "금", "토", "일"];



export default function WeeklyStreak() {

	const today = (new Date().getDay() + 6) % 7;

    const getDayStatus = (dayIndex: number, todayIndex: number) => {
	if (dayIndex === todayIndex) return "today";
	if (dayIndex < todayIndex) return "completed";
	return "upcoming";
};

	return (
		<ul className="flex gap-3 md:gap-2">
			{WEEK_DAYS.map((day, dayIndex) => (
				<li key={day}>
					<DayBadge label={day} status={getDayStatus(dayIndex, today)} />
				</li>
			))}
		</ul>
	);
}
