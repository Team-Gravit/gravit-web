import GravitLogo from "@/shared/assets/icons/logo.svg?react";
import appcenterLogo from "@/shared/assets/images/logo-appcenter.png";

export default function Footer() {
	return (
		<footer className="bg-gray-700 py-[38px]">
			<div className="flex items-center gap-[29px] h-[66px] justify-start pl-[51px] ">
				<GravitLogo className="h-8 brightness-0 invert" />
				<img src={appcenterLogo} className="h-full" alt={"앱센터 로고"} />
			</div>
			<hr className="border-white/45 mt-[15px] mb-[29px]" />
			<div className="pl-[51px]">
				<p className="text-xs text-white/80 mb-[9px]">
					Powered by INU Appcenter
				</p>

				<address className="text-xs text-white/80 not-italic">
					<dl className="space-y-[9px]">
						<div className="flex gap-[38px]">
							<dt className="text-white font-medium">주소</dt>
							<dd>인천광역시 연수구 아카데미로 119 정보전산원 앱센터</dd>
						</div>

						<div className="flex gap-[38px]">
							<dt className="text-white font-medium">문의 메일</dt>
							<dd>
								<a
									href="mailto:ahh010145@gmail.com"
									className="hover:underline"
								>
									ahh010145@gmail.com
								</a>
							</dd>
						</div>
					</dl>
				</address>
			</div>
		</footer>
	);
}
