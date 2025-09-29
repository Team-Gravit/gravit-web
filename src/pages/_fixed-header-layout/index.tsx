import Background from "@/shared/ui/background/Background";
import { createFileRoute } from "@tanstack/react-router";
import Form from "@/shared/ui/form/Form";
import SocialButton from "@/features/login/ui/SocialButton";
import Logo from "@/shared/ui/logo/Logo";
import Profile3 from "@/shared/assets/icons/profile3.svg?react";
import google from "@/shared/assets/icons/buttons/google.svg";
import kakao from "@/shared/assets/icons/buttons/kakao.svg";
import naver from "@/shared/assets/icons/buttons/naver.svg";
import { useOauthLogin } from "@/entities/login/model/useOauthLogin";

export const Route = createFileRoute("/_fixed-header-layout/")({
	component: Index,
});

function Index() {
	const oauthLogin = useOauthLogin();

	return (
		<Background>
			<Logo />
			<Form className="w-[549px] h-[536px] p-8 gap-5">
				<Profile3 className="w-18 h-18" />
				<div className="flex flex-col leading-tight">
					<h3 className="font-bold text-[32px] text-center">
						교육행성에 어서 오세요.
						<br />
						Gravit!
					</h3>
					<span className="font-medium text-[20px] text-[#7D7D7D] mt-2">
						회원 서비스 이용을 위해 로그인 해주세요.
					</span>
				</div>
				<div className="w-full border-[0.5px] border-dashed border-[#C3C3C3]" />
				<div className="flex flex-col items-center w-full h-40 gap-1.5">
					<SocialButton
						provider="google"
						imgSrc={google}
						onClick={() => oauthLogin.mutate("google")}
					/>
					<SocialButton
						provider="kakao"
						imgSrc={kakao}
						onClick={() => oauthLogin.mutate("kakao")}
					/>
					<SocialButton
						provider="naver"
						imgSrc={naver}
						onClick={() => oauthLogin.mutate("naver")}
					/>
				</div>
			</Form>
		</Background>
	);
}
