import { useEffect } from "react";
import type { ReactNode } from "react"; // 타입 전용 import

interface NicknameFormProps {
	nickname: string;
	setNickname: (value: string) => void;
	isLimit: boolean;
	setIsLimit: (value: boolean) => void;
	checking: boolean;
	setChecking: (value: boolean) => void;
	helperText?: ReactNode;
}

export default function NicknameForm({
	nickname,
	setNickname,
	isLimit,
	setIsLimit,
	checking,
	setChecking,
	helperText,
}: NicknameFormProps) {
	useEffect(() => {
		const trimmed = nickname.trim();
		const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,8}$/;

		if (!trimmed) {
			setIsLimit(false);
			setChecking(false);
			return;
		}

		setChecking(true);
		const handler = setTimeout(() => {
			setIsLimit(!nicknameRegex.test(trimmed));
			setChecking(false);
		}, 300);

		return () => clearTimeout(handler);
	}, [nickname, setIsLimit, setChecking]);

	return (
		<div className="flex flex-col w-[335px] gap-2 mt-7 mb-8">
			<label className="text-lg font-semibold">
				<span className="mb-2 block">닉네임 설정</span>
				<input
					type="text"
					value={nickname}
					onChange={(e) => setNickname(e.target.value)}
					placeholder="닉네임"
					className={`w-full px-4 py-2 rounded-lg text-[#4C4C4C] text-lg font-normal border ${
						isLimit
							? "border-[#FF0000]"
							: nickname.trim()
								? "border-[#0033FF]"
								: "border-[#C3C3C3]"
					} focus:outline-none`}
				/>
			</label>

			<div className="min-h-[30px]">
				{!checking && nickname.trim() && !isLimit && (
					<p className="text-sm text-[#868686]">사용 가능한 닉네임이에요.</p>
				)}
				{!checking && isLimit && (
					<p className="text-sm text-[#FF0000]">사용 불가능한 닉네임이에요.</p>
				)}
				{!checking && !nickname.trim() && !isLimit && helperText}
			</div>
		</div>
	);
}
