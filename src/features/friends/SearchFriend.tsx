import Search from "@/shared/assets/icons/buttons/search.svg?react";

interface SearchFriendProps {
	value: string;
	onChange: (value: string) => void;
}

export default function SearchFriend({ value, onChange }: SearchFriendProps) {
	return (
		<div className="w-full flex items-center rounded-full border border-black/10 shadow-sm px-4 py-3">
			<input
				type="text"
				placeholder="친구 검색하기"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="flex-1 text-[#A8A8A8] text-xl outline-none"
			/>
			<Search className="w-6 h-6 ml-auto" />
		</div>
	);
}
