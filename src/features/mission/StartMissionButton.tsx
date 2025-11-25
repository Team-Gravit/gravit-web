import { Link } from "@tanstack/react-router";

export default function StartMissionButton() {
	return (
		<Link
			to="/learn"
			className="w-full bg-gray-200 rounded-xl px-2.5 py-5 font-semibold text-2xl text-center"
		>
			도전하러 가기
		</Link>
	);
}
