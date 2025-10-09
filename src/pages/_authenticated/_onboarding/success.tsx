import { createFileRoute } from "@tanstack/react-router";
import Form from "@/shared/ui/form/Form";
import Logo from "@/shared/ui/logo/Logo";
import { useNavigate } from "@tanstack/react-router";
import Mascot from "@/shared/assets/icons/end-mascot.svg?react";

export const Route = createFileRoute("/_authenticated/_onboarding/success")({
	component: SuccessPage,
});

function SuccessPage() {
	const navigate = useNavigate();

	return (
		<>
			<Logo />
			<Form className="w-[549px] h-[460px] py-8 px-28">
				<h3 className="text-2xl font-semibold text-white">계정 생성 완료!</h3>
				<span className="text-[16px] text-[#DCDCDC] mt-4 mb-4">
					그래빗의 일원이 된 걸 환영해요!
				</span>
				<Mascot className="h-56" />
				<button
					type="button"
					onClick={() => navigate({ to: "/main" })}
					className="mt-auto w-full h-14 text-white py-2 rounded-xl text-lg font-semibold bg-[#BA00FF]"
				>
					홈으로
				</button>
			</Form>
		</>
	);
}
