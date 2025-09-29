import LeftArrow from "@/shared/assets/icons/buttons/left-arrow.svg?react";
import RightArrow from "@/shared/assets/icons/buttons/right-arrow.svg?react";

interface PaginationProps {
	totalPages: number;
	currentPage: number; // 부모에서 제어
	onPageChange?: (page: number) => void;
}

export default function PaginationButton({
	totalPages,
	currentPage,
	onPageChange,
}: PaginationProps) {
	const visibleCount = 4;

	const groupIndex = Math.floor((currentPage - 1) / visibleCount);
	const startPage = groupIndex * visibleCount + 1;
	const endPage = Math.min(startPage + visibleCount - 1, totalPages);

	const pages: number[] = [];
	for (let i = startPage; i <= endPage; i++) pages.push(i);

	const changePage = (page: number) => {
		onPageChange?.(page);
	};

	const handlePrevGroup = () => {
		if (startPage > 1) changePage(startPage - 1);
	};

	const handleNextGroup = () => {
		if (endPage < totalPages) changePage(endPage + 1);
	};

	return (
		<div className="flex w-full h-[72px] bg-[#F2F2F2] justify-center items-center gap-2">
			<button
				type="button"
				onClick={handlePrevGroup}
				disabled={startPage === 1}
				className="flex items-center justify-center p-2 text-gray-500 disabled:opacity-50"
			>
				<LeftArrow className="text-[#33333380] h-6 w-6" />
			</button>

			{pages.map((page) => (
				<button
					key={page}
					type="button"
					onClick={() => changePage(page)}
					className="flex flex-col items-center justify-center px-2"
				>
					<span
						className={`text-[28px] font-normal ${
							page === currentPage ? "text-[#BA00FF]" : "text-gray-700"
						}`}
					>
						{page}
					</span>
					<span
						className={`w-5 h-[3px] ${
							page === currentPage ? "bg-[#BA00FF]" : "bg-transparent"
						}`}
					/>
				</button>
			))}

			<button
				type="button"
				onClick={handleNextGroup}
				disabled={endPage === totalPages}
				className="flex items-center justify-center p-2 text-gray-500 disabled:opacity-50"
			>
				<RightArrow className="text-[#33333380] h-6 w-6" />
			</button>
		</div>
	);
}
