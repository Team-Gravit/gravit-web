import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import type { FC } from "react";

const StudyNote: FC<{ content: string }> = ({ content }) => {
	const lines = content.split(/\r?\n/).filter((line) => line.trim() !== "");

	let firstLine = lines[0] ?? "";

	firstLine = firstLine.replace(/^#{1,6}\s*/, "").trim();

	return (
		<div className="max-w-[1571px] w-[82vw] h-full flex flex-col gap-8 border border-[#F2F2F2] shadow-[0_0_16px_rgba(0,0,0,0.24)] rounded-[24px] bg-white">
			{/* 헤더 */}
			<div className="flex flex-row justify-between items-center w-full h-[101px] bg-[#F8F8F8] border-b border-[#DCDCDC] rounded-t-[24px] px-8 py-4">
				<div className="flex flex-col w-[451.61px] h-[65px]">
					<div className="text-[28px] font-semibold text-[#222124]">
						개념노트
					</div>
					<div className="text-[20px] font-medium text-[#6D6D6D]">
						{firstLine}
					</div>
				</div>
			</div>

			{/* 마크다운 콘텐츠 */}
			<div className="max-w-full px-8 pb-4 prose">
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					rehypePlugins={[rehypeRaw, rehypeSanitize]}
				>
					{content}
				</ReactMarkdown>
			</div>
		</div>
	);
};

export default StudyNote;
