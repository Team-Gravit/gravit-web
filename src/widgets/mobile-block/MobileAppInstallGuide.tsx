import MascotIcon from "@/shared/assets/icons/end-mascot.svg?react";
import PlayStoreBtn from "@/shared/assets/icons/buttons/playstore.svg?react";
import BackgroundImage from "@/shared/assets/images/background.webp";

export default function MobileAppInstallGuide() {
	return (
		<div
			className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 bg-no-repeat bg-top bg-cover"
			style={{
				backgroundImage: `url(${BackgroundImage})`,
			}}
		>
			<div
				className={`
  box-border flex flex-col items-center 
  rounded-2xl border-2 border-[#8B69FF]
  shadow-xl
  [backdrop-filter:blur(50px)]
  bg-[linear-gradient(108.74deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.06)_100%)]
  max-w-md w-full py-10 px-8
`}
			>
				{/* 로고 또는 아이콘 영역 */}
				<div className="mb-6 w-24 h-24 mx-auto flex items-center justify-center">
					<MascotIcon />
				</div>

				<h1 className="text-2xl font-bold text-white mb-4">
					모바일 앱을 이용해주세요
				</h1>

				<p className="text-gray-300 mb-8 leading-relaxed text-center">
					더 나은 학습 경험을 위해
					<br />
					모바일 앱을 다운로드해주세요
				</p>

				<div className="space-y-3 w-full">
					<a
						href="https://play.google.com/store/apps/details?id=com.inuappcenter.gravit"
						target="_blank"
						rel="noopener noreferrer"
						className="block w-full"
					>
						<div className="flex items-center justify-center gap-3">
							<PlayStoreBtn />
						</div>
					</a>
				</div>

				{/* 추가 안내 메시지 */}
				<p className="text-sm text-gray-400 mt-6">
					PC에서는 웹 브라우저로 이용 가능합니다
				</p>
			</div>
		</div>
	);
}
