import { FloatingPortal } from "@floating-ui/react";
import { cn } from "@/shared/lib/cn";
import ScrollArea from "../scroll/scroll-area";
import DropdownIcon from "@/shared/assets/icons/arrow-down-icon.svg?react";
import { useDropdown } from "./use-dropdown";
import type { DropdownProps } from "./dropdown.types";

export default function Dropdown({
	options,
	value,
	onChange,
	placeholder,
	disabled,
	className,
	id,
	"aria-label": ariaLabel,
}: DropdownProps) {
	const {
		isOpen,
		focusedOptionIdx,
		listboxId,
		optionIdPrefix,
		floatingStyles,
		triggerButtonRef,
		listboxRef,
		itemRefs,
		setReference,
		setFloating,
		handleOpen,
		handleClose,
		handleTriggerKeyDown,
		handleListKeyDown,
		handleSelectOption,
	} = useDropdown({ options, value, onChange });

	const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

	return (
		<div className={cn("relative w-[150px]", className)}>
			<button
				type="button"
				id={id}
				disabled={disabled}
				role="combobox"
				aria-label={ariaLabel}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				aria-controls={listboxId}
				ref={(el) => {
					triggerButtonRef.current = el;
					setReference(el);
				}}
				onClick={() => (isOpen ? handleClose() : handleOpen())}
				onKeyDown={handleTriggerKeyDown}
				className="px-3 py-2 border border-bg-3 rounded-sm flex items-center justify-between w-full cursor-pointer disabled:cursor-default focus:outline-none text-text-1 disabled:text-gray-400"
			>
				<span className="text-body1-normal">
					{selectedLabel || placeholder || "선택하세요"}
				</span>
				<DropdownIcon
					className={cn(
						"text-gray-600 transition-transform duration-300",
						isOpen && "rotate-180",
					)}
				/>
			</button>

			{isOpen && (
				<FloatingPortal>
					{/** biome-ignore lint/a11y/useAriaPropsSupportedByRole: ul[role="listbox"] is valid per WAI-ARIA spec */}
					<ul
						tabIndex={-1}
						id={listboxId}
						role="listbox"
						aria-activedescendant={
							focusedOptionIdx !== null
								? `${optionIdPrefix}-${focusedOptionIdx}`
								: undefined
						}
						ref={(el) => {
							listboxRef.current = el;
							setFloating(el);
							if (el) el.focus({ preventScroll: true });
						}}
						style={floatingStyles}
						className="rounded-xl focus:outline-none h-fit max-h-60"
						onKeyDown={handleListKeyDown}
					>
						<ScrollArea
							orientation="vertical"
							viewportClassName="max-h-60 overscroll-contain"
						>
							{options.map((option, i) => (
								// biome-ignore lint/a11y/useKeyWithClickEvents: 키보드는 ul의 onKeyDown에서 처리
								<li
									id={`${optionIdPrefix}-${i}`}
									key={option.value}
									// biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: <explanation>
									role="option"
									aria-selected={value === option.value}
									aria-disabled={option.disabled}
									tabIndex={-1}
									ref={(el) => {
										itemRefs.current[i] = el;
									}}
									onClick={() => handleSelectOption(i)}
									className={cn(
										"flex items-center justify-center px-5 py-4 min-h-14 bg-white focus:outline-none text-body1-normal text-text-1 border-b border-divider-1 last:border-0 shrink-0",
										option.disabled
											? "text-gray-400 cursor-not-allowed"
											: "hover:bg-gray-300 cursor-pointer",
										"first:rounded-t-lg last:rounded-b-lg p-1",
										focusedOptionIdx === i
											? "bg-main-1 text-white hover:bg-main-hover"
											: "",
									)}
								>
									{option.label}
								</li>
							))}
						</ScrollArea>
					</ul>
				</FloatingPortal>
			)}
		</div>
	);
}
