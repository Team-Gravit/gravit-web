import Footer from "@/widgets/Footer/Footer";
import { createFileRoute } from "@tanstack/react-router";
import backgroundImage from "@/shared/assets/images/background.webp";
import GravitLogo from "@/shared/assets/icons/logo.svg?react";
import roundedPlanetsImg from "@/shared/assets/images/planet-group.png";
import phoneImg from "@/shared/assets/images/phone.png";
import leagueBadgeImg from "@/shared/assets/images/league-badge.png";
import leaguePhoneImg from "@/shared/assets/images/league-phone.png";
import leagueItem from "@/shared/assets/images/league-item.png";
import leagueGroup from "@/shared/assets/images/league-group.png";
import SocialButton from "@/features/login/ui/SocialButton";
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
		<div className="flex-grow flex flex-col items-center justify-center w-full">
			<div
				className="w-full h-[2088px] bg-group"
				style={{
					backgroundImage: `url(${backgroundImage})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			>
				<section className="w-full h-[1044px]">
					<div className="absolute top-[200px] left-1/2 -translate-x-1/2 lg:-translate-x-0 lg:top-[259px] lg:right-[328px] flex flex-col gap-[30px] w-[465px]">
						<GravitLogo className="text-white w-[371px]" />
						<h3 className="text-white font-semibold text-3xl">
							재미있고 효과적인 CS 교육 그래빗
						</h3>
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
				</section>
				<section className="relative w-full h-[1044px] overflow-x-hidden">
					<img
						src={roundedPlanetsImg}
						alt="행성 이미지"
						className="absolute w-[600px] lg:w-[1000px] left-full -translate-x-4/6"
					/>
					<div className="absolute flex flex-col gap-[20px] top-[100px] left-[30px] lg:gap-[30px] lg:top-[200px] lg:left-[158px]">
						<h3 className="text-white font-extrabold text-5xl lg:text-[70px]">
							CS 지식을 게임처럼
							<br />
							재밌게 학습하세요!
						</h3>
						<p className="text-gray-300 font-medium text-xl lg:text-[28px] leading-normal">
							그래빗과 함께 행성을 탐험하며 CS 지식을 쌓아보세요!
							<br />
							지루한 이론서적은 이제 그만.
							<br />
							<span
								className="bg-[#ffde25] px-2 inline-block text-gray-900"
								style={{
									clipPath:
										"polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)",
								}}
							>
								자료구조부터 소프트웨어 엔지니어링까지
							</span>
							<br />각 행성에서 펼쳐지는 모험을 통해 자연스럽게
							<br />
							학습할 수 있어요.
						</p>
					</div>
				</section>
			</div>
			<section className="w-full h-[867px] flex items-center px-[136px] justify-between">
				<article className="flex flex-col gap-8 ">
					<h3 className="text-main-2 text-5xl font-extrabold leading-normal">
						체계적인{" "}
						<span className="relative text-5xl font-extrabold text-main-2">
							<span className="absolute -top-1.5 left-0 translate-x-4 w-2 h-2 bg-main-2 rounded-full"></span>
							<span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-main-2 rounded-full"></span>
							<span className="absolute -top-1.5 right-0  -translate-x-4 w-2 h-2 bg-main-2 rounded-full"></span>
							단계별
						</span>{" "}
						학습으로
						<br />
						확실한 실력 향상
					</h3>

					<p className="w-[626px] text-gray-800 font-medium text-[28px]">
						<span
							className="bg-[#ffd36b] px-2 inline-block text-gray-900 font-bold"
							style={{
								clipPath:
									"polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)",
							}}
						>
							챕터에서 유닛으로, 유닛에서 레슨으로
						</span>
						이어지는 체계적인 구조로 학습하세요! 레슨마다 문제를 풀며 XP를
						획득하고,당신만의 속도로 학습하며 CS 지식을 완전히 내 것으로 만들어
						보세요!
					</p>
				</article>
				<img src={phoneImg} alt="앱 예시 이미지" />
			</section>
			<section className="w-full h-[747px]">
				<article className="flex flex-col gap-8 items-center relative">
					<img
						src={leagueBadgeImg}
						alt="리그 뱃지 사진"
						className="absolute bottom-0 translate-y-1/2 opacity-60 w-full"
					/>

					<h3 className="text-main-2 text-5xl font-extrabold leading-normal text-center z-10">
						혼자가 아닌 함께,
						<br />
						리그 시스템
					</h3>

					<p className="w-[626px] text-gray-800 font-medium text-[28px] text-center z-10">
						브론즈부터 다이아몬드까지,
						<span
							className="bg-[#ffd36b] px-2 inline-block text-gray-900 font-bold"
							style={{
								clipPath:
									"polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)",
							}}
						>
							다른 사용자들과 함께
						</span>
						<br />
						경쟁하며 성장하세요! LP를 모아 상위 리그로 승급하고
						<br /> 친구들보다 먼저 목표를 달성하는 짜릿함을 경험해보세요
					</p>
				</article>
			</section>
			<section className="w-full h-[1212px] flex items-center justify-center">
				<div className="relative flex gap-[158px]">
					<img
						src={leaguePhoneImg}
						alt="앱 리그 예시 화면"
						className="w-[327px] h-fit mt-30 flex-shrink-0"
					/>

					<div className="absolute left-[303px] top-[180px] flex items-center">
						<div className="relative w-[192px] h-1 bg-[#FFB608]">
							<div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FFB608] rounded-full"></div>
							<div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FFB608] rounded-full"></div>
						</div>
					</div>

					<div className="absolute left-[303px] top-[600px] flex items-center">
						<div className="relative w-[192px] h-1 bg-[#FFB608]">
							<div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FFB608] rounded-full"></div>
							<div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FFB608] rounded-full"></div>
						</div>
					</div>

					<div className="flex flex-col gap-[60px]">
						<div className="flex flex-col gap-[21px]">
							<dl>
								<dt className="text-gray-800 font-bold text-3xl">나의 리그</dt>
								<dd className="text-gray-500 font-medium text-[28px]">
									나의 현재 등수를 바로 확인할 수 있어요.
								</dd>
							</dl>

							<div className="inline-block p-4 rounded-lg border-4 border-dashed border-[#FFB608]">
								<img
									src={leagueItem}
									alt="리그 아이템 예시"
									className="w-[591px] h-auto block"
								/>
							</div>
						</div>

						<div className="flex flex-col gap-[21px]">
							<dl>
								<dt className="text-gray-800 font-bold text-3xl">
									전체 리그 순위
								</dt>
								<dd className="text-gray-500 font-medium text-[28px]">
									전체 그랩잇 사용자들의 순위를 확인할 수 있어요.
								</dd>
							</dl>

							<div className="inline-block p-4 rounded-lg border-4 border-dashed border-[#FFB608] w-fit">
								<div className="relative w-[327px] flex-shrink-0">
									<img
										src={leagueGroup}
										alt="앱 리그 예시 화면"
										className="w-full h-auto"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-white to-transparent pointer-events-none" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
}
