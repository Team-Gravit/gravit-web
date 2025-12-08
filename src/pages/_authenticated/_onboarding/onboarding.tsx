import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import Form from "@/shared/ui/form/Form";

import Logo from "@/shared/ui/logo/Logo";
import ProfileSelector from "@/features/onboarding/ui/ProfileSelecter";
import NicknameForm from "@/features/onboarding/ui/NicknameForm";
import { usePostOnboarding } from "@/features/onboarding/api/usePostOnboarding";

export const Route = createFileRoute("/_authenticated/_onboarding/onboarding")({
	component: OnboardingPage,
});

function OnboardingPage() {
	const navigate = useNavigate();
	const [colorIndex, setColorIndex] = useState(0);
	const [nickname, setNickname] = useState("");
	const [isLimit, setIsLimit] = useState(false);
	const [checking, setChecking] = useState(false);
	const [loading, setLoading] = useState(false);
	const [dirty, setDirty] = useState(false);
	const isSubmitting = useRef(false);
	const { mutate } = usePostOnboarding();

	const handleSubmit = () => {
		if (loading || isSubmitting.current) return;

		if (!nickname.trim()) {
			alert("닉네임을 입력해주세요.");
			return;
		}

		if (isLimit) {
			alert(
				"닉네임은 2자 이상 8자 이하이며, 공백 및 특수문자는 사용할 수 없어요.",
			);
			return;
		}

		setLoading(true);
		isSubmitting.current = true;

		mutate(
			{ nickname: nickname.trim(), profilePhotoNumber: colorIndex + 1 },
			{
				onSuccess: () => {
					navigate({ to: "/success" });
				},
				onError: (error) => {
					console.error(error);
					alert("온보딩 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
				},
				onSettled: () => {
					setLoading(false);
					isSubmitting.current = false;
				},
			},
		);
	};

	return (
		<>
			<Logo />
			<Form darkMode className="w-[549px] h-[460px] py-8 px-28">
				<ProfileSelector onChange={setColorIndex} />
				<NicknameForm
					nickname={nickname}
					setNickname={setNickname}
					isLimit={isLimit}
					setIsLimit={setIsLimit}
					checking={checking}
					setChecking={setChecking}
					dirty={dirty}
					setDirty={setDirty}
					helperText={
						<p className="text-sm text-[#F2F2F2]">
							* 글자수 2~8자 / 공백, 특수문자 제외
						</p>
					}
					helperFontColor="#F2F2F2"
				/>

				<button
					type="button"
					onClick={handleSubmit}
					disabled={!nickname.trim() || isLimit || checking || loading}
					className={`w-full h-14 text-white py-2 rounded-xl text-lg font-semibold transition flex items-center justify-center gap-2
            ${!nickname.trim() || isLimit || checking || loading ? "bg-[#BA00FF] opacity-50" : "bg-[#BA00FF]"}`}
				>
					{loading ? (
						<>
							<span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
							<span>로딩 중...</span>
						</>
					) : (
						"다음"
					)}
				</button>
			</Form>
		</>
	);
}
