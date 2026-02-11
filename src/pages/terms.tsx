import { createFileRoute, Link } from "@tanstack/react-router";
import Logo from "@/shared/assets/icons/logo-gr.svg?react";
import Footer from "@/widgets/Footer/Footer";

export const Route = createFileRoute("/terms")({
	component: TermsPage,
});

function TermsPage() {
	return (
		<>
			<header className="flex items-center px-8 py-4 justify-start h-[var(--header-height)] w-full bg-white z-[110]">
				<Link to="/" className="mr-3">
					<Logo className="h-6" />
				</Link>
			</header>
			<main className="flex-grow flex flex-col items-center w-full">
				<div className="w-full max-w-[800px] px-8 py-12">
					<h1 className="text-2xl font-bold mb-6">서비스 이용약관</h1>

					<h2 className="text-xl font-semibold mt-8 mb-3">제1조 (목적)</h2>
					<p className="mb-4">
						본 약관은 Gravit(이하 "서비스")이 제공하는 CS 학습 보조 서비스의
						이용과 관련하여 서비스와 이용자 간의 권리, 의무 및 책임사항을
						규정함을 목적으로 합니다.
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-3">제2조 (정의)</h2>
					<ol className="list-decimal list-inside mb-4 space-y-2 ml-4">
						<li>
							"서비스"란 Gravit이 제공하는 웹사이트 및 모바일 애플리케이션을
							통해 제공되는 CS 학습 콘텐츠, 리그 경쟁 시스템, 면접 시뮬레이터
							등 모든 기능을 의미합니다.
						</li>
						<li>
							"이용자"란 본 약관에 따라 서비스에 접속하여 본 약관에 따라
							서비스를 이용하는 회원 및 비회원을 말합니다.
						</li>
						<li>
							"회원"이란 서비스에 회원등록을 한 자로서, 서비스의 정보를
							지속적으로 제공받으며 서비스를 계속적으로 이용할 수 있는 자를
							말합니다.
						</li>
						<li>
							"리그 포인트(LP)"란 서비스 이용 시 획득할 수 있는 점수로, 학습
							활동 및 경쟁 순위 산정에 사용됩니다.
						</li>
					</ol>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						제3조 (약관의 명시와 개정)
					</h2>
					<ol className="list-decimal list-inside mb-4 space-y-2 ml-4">
						<li>
							서비스는 본 약관의 내용을 이용자가 쉽게 확인할 수 있도록 서비스
							초기 화면 또는 연결 화면을 통해 게시합니다.
						</li>
						<li>
							서비스는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본
							약관을 개정할 수 있습니다.
						</li>
						<li>
							약관 개정 시 적용일자 및 개정내용을 명시하여 최소 7일 전부터
							공지합니다. 단, 이용자의 권리·의무에 중대한 영향을 미치는 경우
							30일 전에 공지합니다.
						</li>
						<li>
							이용자가 개정약관 공지 후 시행일까지 거부 의사를 표시하지 않을
							경우, 개정약관에 동의한 것으로 간주합니다.
						</li>
					</ol>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						제4조 (회원가입)
					</h2>
					<ol className="list-decimal list-inside mb-4 space-y-2 ml-4">
						<li>
							이용자는 서비스가 정한 가입 양식에 따라 회원정보를 기입한 후 본
							약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.
						</li>
						<li>
							서비스는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중
							다음 각 호에 해당하지 않는 한 회원으로 등록합니다.
							<ul className="list-disc list-inside ml-6 mt-2 space-y-1">
								<li>등록 내용에 허위 정보가 있는 경우</li>
								<li>
									본 약관을 위반하여 이전에 회원자격을 상실한 적이 있는 경우
								</li>
								<li>
									기타 회원으로 등록하는 것이 서비스의 기술상 현저히 지장이
									있다고 판단되는 경우
								</li>
							</ul>
						</li>
						<li>
							회원가입 계약의 성립 시기는 서비스의 승낙이 이용자에게 도달한
							시점으로 합니다.
						</li>
					</ol>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						제5조 (서비스의 제공)
					</h2>
					<p className="mb-2">서비스는 다음의 서비스를 제공합니다.</p>
					<ol className="list-decimal list-inside mb-4 space-y-2 ml-4">
						<li>
							CS 개념 학습 콘텐츠 제공
							<ul className="list-disc list-inside ml-6 mt-2 space-y-1">
								<li>
									자료구조, 알고리즘, 네트워크, 데이터베이스, 운영체제 분야의
									개념 노트
								</li>
								<li>개념 연계 연습 문제</li>
							</ul>
						</li>
						<li>
							리그 경쟁 시스템
							<ul className="list-disc list-inside ml-6 mt-2 space-y-1">
								<li>학습 및 문제 풀이 활동을 통한 LP 획득</li>
								<li>사용자 간 순위 경쟁</li>
							</ul>
						</li>
						<li>CS 면접 시뮬레이터 (2026년 6월 출시 예정)</li>
						<li>
							기타 서비스가 추가 개발하거나 제휴 계약 등을 통해 제공하는
							서비스
						</li>
					</ol>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						제6조 (서비스의 변경 및 중단)
					</h2>
					<ol className="list-decimal list-inside mb-4 space-y-2 ml-4">
						<li>
							서비스는 운영상, 기술상 필요에 따라 제공하고 있는 서비스의 전부
							또는 일부를 변경할 수 있습니다.
						</li>
						<li>
							서비스 내용, 이용방법, 이용시간에 대한 변경이 있는 경우
							변경사유, 변경내용 및 제공일자 등을 그 변경 전 7일 이상 해당
							서비스 화면에 게시합니다.
						</li>
						<li>
							서비스는 다음 각 호의 경우 서비스 제공을 일시적으로 중단할 수
							있습니다.
							<ul className="list-disc list-inside ml-6 mt-2 space-y-1">
								<li>
									시스템 정기점검, 서버의 증설 및 교체, 네트워크 불안정 등의
									경우
								</li>
								<li>
									정전, 서비스 설비의 장애, 서비스 이용 폭주 등으로 정상적인
									서비스 이용에 지장이 있는 경우
								</li>
								<li>기타 불가항력적 사유가 있는 경우</li>
							</ul>
						</li>
					</ol>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						제7조 (유료 서비스)
					</h2>
					<ol className="list-decimal list-inside mb-4 space-y-2 ml-4">
						<li>
							서비스는 일부 콘텐츠 또는 기능을 유료로 제공할 수 있습니다.
						</li>
						<li>
							유료 서비스의 요금, 결제 방법, 환불 정책 등 상세 사항은 별도
							페이지를 통해 공지합니다.
						</li>
						<li>
							이용자가 유료 서비스를 이용하고자 하는 경우, 서비스가 제공하는
							결제 수단을 통해 요금을 지불해야 합니다.
						</li>
						<li>
							유료 서비스 이용 중 발생한 환불은 「전자상거래 등에서의
							소비자보호에 관한 법률」 등 관련 법령에 따라 처리됩니다.
						</li>
					</ol>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						제8조 (회원의 의무)
					</h2>
					<ol className="list-decimal list-inside mb-4 space-y-2 ml-4">
						<li>
							회원은 다음 행위를 하여서는 안 됩니다.
							<ul className="list-disc list-inside ml-6 mt-2 space-y-1">
								<li>회원가입 신청 또는 변경 시 허위 내용 등록</li>
								<li>타인의 정보 도용</li>
								<li>서비스에 게시된 정보의 무단 변경</li>
								<li>
									서비스가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 송신 또는
									게시
								</li>
								<li>
									서비스의 저작권, 제3자의 저작권 등 기타 권리를 침해하는 행위
								</li>
								<li>
									공공질서 및 미풍양속에 위반되는 내용의 정보, 문장, 도형,
									음향, 동영상을 전송, 게시, 전자우편 또는 기타의 방법으로
									타인에게 유포하는 행위
								</li>
								<li>서비스 운영을 고의로 방해하는 행위</li>
								<li>
									본 약관을 포함하여 기타 서비스가 정한 제반 규정 또는 이용
									조건을 위반하는 행위
								</li>
							</ul>
						</li>
						<li>
							회원은 관계 법령, 본 약관의 규정, 이용안내 및 서비스와 관련하여
							공지한 주의사항, 서비스가 통지하는 사항 등을 준수하여야 합니다.
						</li>
					</ol>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						제9조 (저작권 및 지적재산권)
					</h2>
					<ol className="list-decimal list-inside mb-4 space-y-2 ml-4">
						<li>
							서비스가 제공하는 모든 콘텐츠(개념 노트, 문제, 이미지 등)에 대한
							저작권 및 지적재산권은 서비스에 귀속됩니다.
						</li>
						<li>
							서비스의 개념 노트는 오픈소스로 공개되어 있으며, 누구나 열람 및
							기여할 수 있습니다. 다만, 상업적 이용 시에는 별도 허가가
							필요합니다.
						</li>
						<li>
							이용자는 서비스를 이용함으로써 얻은 정보를 서비스의 사전 승낙
							없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리
							목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
						</li>
					</ol>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						제10조 (계약 해지 및 이용 제한)
					</h2>
					<ol className="list-decimal list-inside mb-4 space-y-2 ml-4">
						<li>
							회원은 언제든지 서비스 내 설정 메뉴 또는 고객센터를 통해
							이용계약 해지 신청을 할 수 있으며, 서비스는 관련 법령에 따라
							이를 즉시 처리합니다.
						</li>
						<li>
							서비스는 회원이 제8조의 의무를 위반하거나 서비스의 정상적인
							운영을 방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스
							이용을 단계적으로 제한할 수 있습니다.
						</li>
						<li>
							서비스는 제2항에도 불구하고, 저작권법 및 컴퓨터프로그램보호법을
							위반한 불법프로그램의 제공 및 운영방해, 전기통신사업법을 위반한
							불법통신, 해킹, 악성프로그램의 배포, 접속권한 초과행위 등과
							같이 관련법을 위반한 경우에는 즉시 영구이용정지를 할 수
							있습니다.
						</li>
					</ol>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						제11조 (면책사항)
					</h2>
					<ol className="list-decimal list-inside mb-4 space-y-2 ml-4">
						<li>
							서비스는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 및 기타
							이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는
							서비스 제공에 대한 책임이 면제됩니다.
						</li>
						<li>
							서비스는 이용자의 귀책사유로 인한 서비스 이용 장애에 대하여
							책임을 지지 않습니다.
						</li>
						<li>
							서비스는 이용자가 서비스를 이용하여 기대하는 효용(학습 성과,
							취업 등)을 얻지 못한 것에 대해 책임을 지지 않습니다.
						</li>
						<li>
							서비스는 이용자 간 또는 이용자와 제3자 상호 간에 서비스를
							매개로 하여 거래 등을 한 경우에는 책임을 지지 않습니다.
						</li>
					</ol>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						제12조 (분쟁 해결)
					</h2>
					<ol className="list-decimal list-inside mb-4 space-y-2 ml-4">
						<li>
							서비스는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그
							피해를 보상처리하기 위해 고객센터를 설치·운영합니다.
						</li>
						<li>
							서비스와 이용자 간 발생한 분쟁은 전자문서 및 전자거래 기본법에
							의해 설치된 전자문서·전자거래분쟁조정위원회의 조정에 따를 수
							있습니다.
						</li>
					</ol>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						제13조 (재판권 및 준거법)
					</h2>
					<p className="mb-4">
						본 약관에 명시되지 않은 사항은 전기통신사업법, 전자상거래 등에서의
						소비자보호에 관한 법률 등 대한민국의 관계 법령 및 상관례에 따릅니다.
						서비스 이용으로 발생한 분쟁에 대한 소송은 대한민국 법을 준거법으로
						하며, 민사소송법상의 관할법원에 제기합니다.
					</p>

					<div className="mt-8 pt-6 border-t border-gray-300">
						<p className="font-semibold">공고일자: 2026년 2월 2일</p>
						<p className="font-semibold">시행일자: 2026년 2월 2일</p>
					</div>
				</div>
				<Footer />
			</main>
		</>
	);
}