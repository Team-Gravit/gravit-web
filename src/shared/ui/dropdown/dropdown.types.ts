export interface Option {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface DropdownProps {
	options: Option[];
	value: string;
	onChange: (value: string) => void;

	placeholder?: string;
	disabled?: boolean;

	className?: string;

	id?: string;
	"aria-label"?: string;
}