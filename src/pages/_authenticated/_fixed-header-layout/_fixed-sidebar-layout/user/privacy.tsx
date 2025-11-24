import { createFileRoute } from "@tanstack/react-router";
import SectionHeader from "@/widgets/header/ui/SectionHeader";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/_fixed-sidebar-layout/user/privacy",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col w-full h-full">
			<SectionHeader title="개인정보 처리방침" />
			<div className="flex flex-col px-[60px] py-8">
				<h1 className="text-2xl font-bold mb-6">개인정보처리방침</h1>

				<p className="mb-4">
					본 개인정보처리방침은 Gravit(이하 "서비스 제공자")가 무료 서비스로
					제작한 모바일 디바이스용 Gravit 앱(이하 "애플리케이션")에 적용됩니다.
					본 서비스는 "있는 그대로" 사용하도록 제공됩니다.
				</p>

				<h2 className="text-xl font-semibold mt-6 mb-2">정보 수집 및 이용</h2>
				<p className="mb-4">
					애플리케이션은 사용자가 다운로드하고 사용할 때 정보를 수집합니다.
					수집되는 정보에는 다음과 같은 정보가 포함될 수 있습니다:
				</p>
				<ul className="list-disc list-inside mb-4">
					<li>사용자 디바이스의 인터넷 프로토콜 주소(예: IP 주소)</li>
					<li>
						사용자가 방문한 애플리케이션 페이지, 방문 시간 및 날짜, 페이지 체류
						시간
					</li>
					<li>애플리케이션에서 사용한 시간</li>
					<li>모바일 디바이스 운영체제</li>
				</ul>
				<p className="mb-4">
					애플리케이션은 사용자 모바일 디바이스의 정확한 위치 정보를 수집하지
					않습니다. 서비스 제공자는 사용자가 제공한 정보를 사용하여 중요 정보,
					필수 공지사항, 마케팅 프로모션을 제공할 수 있습니다. 필요한 경우 특정
					개인식별정보를 제공하도록 요구할 수 있으며, 제공 정보는 본 방침에 따라
					보관 및 사용됩니다.
				</p>

				<h2 className="text-xl font-semibold mt-6 mb-2">제3자 접근</h2>
				<p className="mb-4">
					서비스 제공자가 애플리케이션 및 서비스 개선을 위해 집계되고 익명화된
					데이터만 주기적으로 외부 서비스에 전송됩니다. 제3자 서비스 제공업체의
					개인정보처리방침 링크는 다음과 같습니다:
				</p>
				<ul className="list-disc list-inside mb-4">
					<li>Google Play Services</li>
					<li>Firebase Crashlytics</li>
				</ul>
				<p className="mb-4">
					서비스 제공자는 법적 요구, 안전 및 사기 조사, 신뢰할 수 있는 서비스
					제공업체와의 경우 사용자 정보를 공개할 수 있습니다.
				</p>

				<h2 className="text-xl font-semibold mt-6 mb-2">거부 권리</h2>
				<p className="mb-4">
					애플리케이션을 제거하면 모든 정보 수집을 중단할 수 있으며, 모바일
					디바이스 표준 제거 프로세스를 사용할 수 있습니다.
				</p>

				<h2 className="text-xl font-semibold mt-6 mb-2">데이터 보관 정책</h2>
				<p className="mb-4">
					서비스 제공자는 사용자 제공 데이터를 애플리케이션 사용 중과 그 이후
					합리적 기간 동안 보관합니다. 삭제를 원하면 ahh010145@gmail.com으로
					연락 바랍니다.
				</p>

				<h2 className="text-xl font-semibold mt-6 mb-2">아동</h2>
				<p className="mb-4">
					서비스 제공자는 13세 미만 아동으로부터 의도적으로 데이터를 수집하지
					않습니다. 제공된 경우 즉시 삭제됩니다. 부모 또는 보호자는 필요 시 연락
					바랍니다.
				</p>

				<h2 className="text-xl font-semibold mt-6 mb-2">보안</h2>
				<p className="mb-4">
					서비스 제공자는 사용자 정보의 기밀성 보호를 위해 물리적, 전자적,
					절차적 보안장치를 제공합니다.
				</p>

				<h2 className="text-xl font-semibold mt-6 mb-2">변경사항</h2>
				<p className="mb-4">
					개인정보처리방침은 수시로 업데이트될 수 있으며, 변경사항 확인은
					정기적으로 필요합니다. 본 방침은 2025-09-02부터 유효합니다.
				</p>

				<h2 className="text-xl font-semibold mt-6 mb-2">귀하의 동의</h2>
				<p className="mb-4">
					애플리케이션 사용 시 본 방침에 명시된 정보 처리에 동의하는 것으로
					간주됩니다.
				</p>

				<h2 className="text-xl font-semibold mt-6 mb-2">연락처</h2>
				<p className="mb-4">
					개인정보 관련 문의는 ahh010145@gmail.com으로 이메일을 통해 연락
					바랍니다.
				</p>
			</div>
		</div>
	);
}
