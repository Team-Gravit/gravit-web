import { Link } from "@tanstack/react-router";

export interface Item {
	label: string;
	to?: string;
	hasCheckbox?: boolean;
}

interface Props {
	item: Item;
}

export default function SettingButton({ item }: Props) {
	if (item.hasCheckbox) {
		return (
			<button
				type="button"
				className="flex flex-row items-center justify-between text-[#222124] text-xl font-medium"
			>
				{item.label}
				<label className="inline-flex items-center cursor-pointer">
					<input type="checkbox" className="sr-only peer" />
					<div
						className="w-9 h-[22px] bg-[#D9D9D9] rounded-full relative
						peer-checked:bg-[#EDD7FF]
						after:content-[''] after:absolute after:w-[18px] after:h-[18px] after:bg-white after:rounded-full 
						after:transition-all after:top-0.5 after:left-[2px]
						peer-checked:after:translate-x-[14px] peer-checked:after:bg-[#BA00FF]"
					/>
				</label>
			</button>
		);
	}

	return (
		<Link
			to={item.to}
			className="flex flex-row items-center justify-between text-[#222124] text-xl font-medium"
		>
			{item.label}
		</Link>
	);
}
