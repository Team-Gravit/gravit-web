import type { ReactNode } from "react";
import { useEffect } from "react";

interface NicknameFormProps {
	nickname: string;
	setNickname: (value: string) => void;
	isLimit: boolean;
	setIsLimit: (value: boolean) => void;
	checking: boolean;
	setChecking: (value: boolean) => void;
	dirty: boolean;
	setDirty: (value: boolean) => void;
	helperText?: ReactNode;
	labelTextSize?: string;
	inputTextSize?: string;
	helperTextSize?: string;
	helperFontColor?: string;
	placeholder?: string;
}

export default function NicknameForm({
	nickname,
	setNickname,
	isLimit,
	setIsLimit,
	checking,
	setChecking,
	dirty,
	setDirty,
	helperText,
	labelTextSize = "text-lg",
	inputTextSize = "text-lg",
	helperTextSize = "text-sm",
	helperFontColor,
	placeholder = "닉네임",
}: NicknameFormProps) {
	useEffect(() => {
		const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,8}$/;

		if (!nickname) {
			setIsLimit(false);
			setChecking(false);
			return;
		}

		setChecking(true);
		const handler = setTimeout(() => {
			if (nickname[0] === " ") {
				setIsLimit(true);
			} else {
				setIsLimit(!nicknameRegex.test(nickname));
			}
			setChecking(false);
		}, 200);

		return () => clearTimeout(handler);
	}, [nickname, setIsLimit, setChecking]);

	const availableColor = helperFontColor ?? "#868686";
	const unavailableColor = helperFontColor ?? "#FF0000";

	return (
		<div className="flex flex-col gap-2 mt-7 mb-6 w-full">
			<label
				className={`mb-2 font-semibold flex flex-col gap-3 text-white ${labelTextSize}`}
			>
				<span className={labelTextSize}>닉네임 설정</span>
				<input
					type="text"
					value={nickname}
					onChange={(e) => {
						if (!dirty) setDirty(true);
						setNickname(e.target.value);
					}}
					placeholder={placeholder}
					className={`w-full px-4 py-2 rounded-lg text-[#4C4C4C] font-normal border-2 bg-white ${
						!dirty
							? "border-[#C3C3C3]"
							: isLimit
								? "border-[#FF3B2F]"
								: nickname.trim()
									? "border-[#55BE24]"
									: "border-[#C3C3C3]"
					} focus:outline-none ${inputTextSize}`}
				/>
			</label>

			<div className="min-h-[20px]">
				{dirty && !checking && nickname.trim() && !isLimit && (
					<div className={helperTextSize} style={{ color: availableColor }}>
						사용 가능한 닉네임이에요.
					</div>
				)}

				{dirty && !checking && isLimit && (
					<div className={helperTextSize} style={{ color: unavailableColor }}>
						사용 불가능한 닉네임이에요.
					</div>
				)}

				{!dirty && helperText && (
					<div className={helperTextSize}>{helperText}</div>
				)}
			</div>
		</div>
	);
}
