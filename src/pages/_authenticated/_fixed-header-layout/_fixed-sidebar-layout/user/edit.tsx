import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import Form from "@/shared/ui/form/Form";
import ProfileSelector from "@/features/onboarding/ui/ProfileSelecter";
import NicknameForm from "@/features/onboarding/ui/NicknameForm";
import { usePatchUserProfile } from "@/features/user/update-user/api/patchUserProfile";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/_fixed-sidebar-layout/user/edit",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const [colorIndex, setColorIndex] = useState(0);
	const [nickname, setNickname] = useState("");
	const [isLimit, setIsLimit] = useState(false);
	const [checking, setChecking] = useState(false);

	const { mutate } = usePatchUserProfile();

	const handleSubmit = () => {
		if (!nickname.trim()) return alert("닉네임을 입력해주세요.");
		if (isLimit)
			return alert(
				"닉네임은 2자 이상 8자 이하이며, 공백 및 특수문자는 사용할 수 없어요.",
			)

		mutate(
			{ nickname: nickname.trim(), profilePhotoNumber: colorIndex + 1 },
			{
				onSuccess: () => navigate({ to: "/user" }),
				onError: () =>
					alert("프로필 수정 중 오류가 발생했습니다. 다시 시도해주세요."),
			},
		)
	}

	return (
		<div className="w-full h-full flex flex-col items-center bg-[#f2f2f2] p-8">
			<Form className="w-full h-[640px] px-48 py-32 flex flex-col relative">
				<ProfileSelector gap={32} onChange={setColorIndex} />

				<div className="flex-1 w-full min-h-[150px] mt-6 px-6">
					<NicknameForm
						nickname={nickname}
						setNickname={setNickname}
						isLimit={isLimit}
						setIsLimit={setIsLimit}
						checking={checking}
						setChecking={setChecking}
						helperText={
							<p className="text-xl text-[#868686] font-normal">
								* 글자수 2~8자 <br /> * 공백, 특수문자 제외
							</p>
						}
						inputTextSize="text-2xl w-[300px] font-normal"
						labelTextSize="text-2xl"
						helperTextSize="text-xl"
					/>
				</div>

				<div className="flex flex-row w-full px-48 gap-4 absolute bottom-8">
					<button
						type="button"
						onClick={() => navigate({ to: "/user" })}
						className="flex-1 h-14 text-white py-2 rounded-xl text-lg font-semibold transition bg-[#A8A8A8]"
					>
						돌아가기
					</button>

					<button
						type="button"
						onClick={handleSubmit}
						disabled={!nickname.trim() || isLimit || checking}
						className={`flex-1 h-14 text-white py-2 rounded-xl text-lg font-semibold transition
              ${
								!nickname.trim() || isLimit || checking
									? "bg-[#8100B3] opacity-50"
									: "bg-[#8100B3]"
							}`}
					>
						수정하기
					</button>
				</div>
			</Form>
		</div>
	)
}
