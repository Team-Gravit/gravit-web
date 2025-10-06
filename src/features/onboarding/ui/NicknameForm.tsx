import { useEffect } from "react";
import type { ReactNode } from "react";

interface NicknameFormProps {
	nickname: string;
	setNickname: (value: string) => void;
	isLimit: boolean;
	setIsLimit: (value: boolean) => void;
	checking: boolean;
	setChecking: (value: boolean) => void;
	helperText?: ReactNode;
	labelTextSize?: string;
	inputTextSize?: string;
	helperTextSize?: string;
}

export default function NicknameForm({
	nickname,
	setNickname,
	isLimit,
	setIsLimit,
	checking,
	setChecking,
	helperText,
	labelTextSize = "text-lg",
	inputTextSize = "text-lg",
	helperTextSize = "text-sm",
}: NicknameFormProps) {
	useEffect(() => {
		const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,8}$/; // 2~8자, 공백/특수문자 금지

		if (!nickname) {
			setIsLimit(true);
			setChecking(false);
			return;
		}

		setChecking(true);
		const handler = setTimeout(() => {
			// 앞/뒤 공백 또는 중간 공백이 있으면 제한
			if (nickname !== nickname.trim() || nickname.includes(" ")) {
				setIsLimit(true);
			} else {
				setIsLimit(!nicknameRegex.test(nickname));
			}
			setChecking(false);
		}, 200);

		return () => clearTimeout(handler);
	}, [nickname, setIsLimit, setChecking]);

	return (
		<div className="flex flex-col gap-2 mt-7 mb-8 w-full">
			<label
				className={`mb-2 font-semibold flex flex-col gap-3 ${labelTextSize}`}
			>
				<span className={labelTextSize}>닉네임 설정</span>
				<input
					type="text"
					value={nickname}
					onChange={(e) => setNickname(e.target.value)}
					placeholder="닉네임"
					className={`w-full px-4 py-2 rounded-lg text-[#4C4C4C] border ${
						isLimit
							? "border-[#FF0000]"
							: nickname
								? "border-[#0033FF]"
								: "border-[#C3C3C3]"
					} focus:outline-none ${inputTextSize}`}
				/>
			</label>

			<div className="min-h-[20px]">
				{!checking && nickname && !isLimit && (
					<p className={helperTextSize + " text-[#868686]"}>
						사용 가능한 닉네임이에요.
					</p>
				)}
				{!checking && isLimit && (
					<p className={helperTextSize + " text-[#FF0000]"}>
						사용 불가능한 닉네임이에요.
					</p>
				)}
				{!checking && !nickname && !isLimit && helperText}
			</div>
		</div>
	);
}
