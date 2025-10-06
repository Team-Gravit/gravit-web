import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import Background from "@/shared/ui/background/Background";
import Form from "@/shared/ui/form/Form";
import Logo from "@/shared/ui/logo/Logo";
import ProfileSelector from "@/features/onboarding/ui/ProfileSelecter";
import NicknameForm from "@/features/onboarding/ui/NicknameForm";
import { postOnBoarding } from "@/features/onboarding/api/postOnboarding";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/onboarding",
)({
	component: OnboardingPage,
});

function OnboardingPage() {
	const navigate = useNavigate();
	const [colorIndex, setColorIndex] = useState(0);
	const [nickname, setNickname] = useState("");
	const [isLimit, setIsLimit] = useState(false);
	const [checking, setChecking] = useState(false);
	const [loading, setLoading] = useState(false);
	const handleSubmit = () => {
		if (loading) return;

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

		// 클릭 즉시 버튼 비활성화 및 로딩 표시
		setLoading(true);

		// 다음 이벤트 루프에서 async 실행
		setTimeout(async () => {
			try {
				await Promise.all([
					postOnBoarding(nickname.trim(), colorIndex + 1),
					new Promise((resolve) => setTimeout(resolve, 2000)),
				]);

				navigate({ to: "/success" });
			} catch (error) {
				console.error(error);
				alert("온보딩 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
				setLoading(false);
			}
		}, 0);
	};

	return (
		<Background>
			<Logo />
			<Form className="w-[549px] h-[460px] py-8 px-28">
				<ProfileSelector onChange={setColorIndex} />
				<NicknameForm
					nickname={nickname}
					setNickname={setNickname}
					isLimit={isLimit}
					setIsLimit={setIsLimit}
					checking={checking}
					setChecking={setChecking}
					helperText={
						<p className="text-sm text-[#868686]">
							* 글자수 2~8자 / 공백, 특수문자 제외
						</p>
					}
				/>

				<button
					type="button"
					onClick={handleSubmit}
					disabled={!nickname.trim() || isLimit || checking || loading}
					className={`w-full h-14 text-white py-2 rounded-xl text-lg font-semibold transition flex items-center justify-center gap-2
            ${!nickname.trim() || isLimit || checking || loading ? "bg-[#8100B3] opacity-50" : "bg-[#8100B3]"}`}
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
		</Background>
	);
}
