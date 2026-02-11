import { createFileRoute, Link } from "@tanstack/react-router";
import Logo from "@/shared/assets/icons/logo-gr.svg?react";
import Footer from "@/widgets/Footer/Footer";

export const Route = createFileRoute("/privacy")({
	component: PrivacyPage,
});

function PrivacyPage() {
	return (
		<>
			<header className="flex items-center px-8 py-4 justify-start h-[var(--header-height)] w-full bg-white z-[110]">
				<Link to="/" className="mr-3">
					<Logo className="h-6" />
				</Link>
			</header>
			<main className="flex-grow flex flex-col items-center w-full">
				<div className="w-full max-w-[800px] px-8 py-12">
					<h1 className="text-2xl font-bold mb-6">개인정보 처리방침</h1>

					<p className="mb-4">
						Gravit(이하 "서비스")은 「개인정보 보호법」 제30조에 따라 정보주체의
						개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수
						있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.
					</p>

					<p className="mb-6 font-semibold">
						최종 수정일: 2026년 2월 2일
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						1. 개인정보의 수집 항목 및 수집 방법
					</h2>

					<h3 className="text-lg font-semibold mt-4 mb-2">1.1 수집 항목</h3>

					<p className="font-semibold mb-2">회원가입 시 수집하는 정보</p>
					<ul className="list-disc list-inside mb-4 ml-4">
						<li>필수 항목: 이메일 주소</li>
						<li>
							소셜 로그인 이용 시: 카카오/구글/네이버 계정 정보(이메일, 프로필
							정보)
						</li>
					</ul>

					<p className="font-semibold mb-2">
						서비스 이용 과정에서 자동 수집되는 정보
					</p>
					<ul className="list-disc list-inside mb-4 ml-4">
						<li>학습 기록(학습한 개념, 문제 풀이 결과)</li>
						<li>리그 포인트(LP) 및 순위 정보</li>
						<li>면접 시뮬레이터 이용 시 음성 데이터</li>
						<li>서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
					</ul>

					<h3 className="text-lg font-semibold mt-4 mb-2">1.2 수집 방법</h3>
					<ul className="list-disc list-inside mb-4 ml-4">
						<li>회원가입 및 서비스 이용 과정에서 사용자가 직접 입력</li>
						<li>소셜 로그인(카카오, 구글, 네이버) API를 통한 제공</li>
						<li>서비스 이용 과정에서 자동 생성·수집</li>
					</ul>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						2. 개인정보의 수집 및 이용 목적
					</h2>
					<p className="mb-2">
						서비스는 수집한 개인정보를 다음의 목적으로 이용합니다.
					</p>
					<ul className="list-disc list-inside mb-4 ml-4">
						<li>회원 식별 및 본인 확인</li>
						<li>CS 학습 콘텐츠 제공 및 학습 기록 관리</li>
						<li>리그 경쟁 시스템 운영(LP 관리, 순위 산정)</li>
						<li>면접 시뮬레이터 기능 제공</li>
						<li>서비스 개선 및 신규 서비스 개발</li>
						<li>문의 및 고객 지원</li>
						<li>부정 이용 방지 및 서비스 안정성 확보</li>
					</ul>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						3. 개인정보의 보유 및 이용 기간
					</h2>
					<ul className="list-disc list-inside mb-4 ml-4">
						<li>
							<span className="font-semibold">회원 탈퇴 시:</span> 즉시 파기 (단,
							관련 법령에 따라 보관이 필요한 경우 예외)
						</li>
						<li>
							<span className="font-semibold">법령에 따른 보관:</span>{" "}
							전자상거래법 등 관련 법령에 따라 일정 기간 보관
							<ul className="list-disc list-inside ml-6 mt-2">
								<li>계약 또는 청약철회 등에 관한 기록: 5년</li>
								<li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
								<li>소비자 불만 또는 분쟁처리에 관한 기록: 3년</li>
							</ul>
						</li>
					</ul>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						4. 개인정보의 제3자 제공
					</h2>
					<p className="mb-2">
						서비스는 원칙적으로 사용자의 개인정보를 제3자에게 제공하지
						않습니다.
					</p>
					<p className="mb-2">단, 다음의 경우는 예외로 합니다.</p>
					<ul className="list-disc list-inside mb-4 ml-4">
						<li>사용자가 사전에 동의한 경우</li>
						<li>
							법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와
							방법에 따라 수사기관의 요구가 있는 경우
						</li>
					</ul>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						5. 개인정보 처리 위탁
					</h2>
					<p className="mb-4">
						서비스는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를
						위탁하고 있습니다.
					</p>
					<div className="overflow-x-auto mb-4">
						<table className="min-w-full border-collapse border border-gray-300">
							<thead>
								<tr className="bg-gray-100">
									<th className="border border-gray-300 px-4 py-2 text-left">
										수탁업체
									</th>
									<th className="border border-gray-300 px-4 py-2 text-left">
										위탁 업무 내용
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className="border border-gray-300 px-4 py-2">카카오</td>
									<td className="border border-gray-300 px-4 py-2">
										소셜 로그인 인증
									</td>
								</tr>
								<tr>
									<td className="border border-gray-300 px-4 py-2">구글</td>
									<td className="border border-gray-300 px-4 py-2">
										소셜 로그인 인증
									</td>
								</tr>
								<tr>
									<td className="border border-gray-300 px-4 py-2">네이버</td>
									<td className="border border-gray-300 px-4 py-2">
										소셜 로그인 인증
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<p className="mb-4">
						위탁 업체 변경 시 개인정보 처리방침을 통해 공지합니다.
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						6. 정보주체의 권리·의무 및 행사 방법
					</h2>
					<p className="mb-2">
						사용자는 언제든지 다음의 권리를 행사할 수 있습니다.
					</p>
					<ul className="list-disc list-inside mb-4 ml-4">
						<li>개인정보 열람 요구</li>
						<li>개인정보 정정·삭제 요구</li>
						<li>개인정보 처리 정지 요구</li>
						<li>회원 탈퇴(동의 철회)</li>
					</ul>
					<p className="mb-4">
						권리 행사는 서비스 내 설정 메뉴 또는 고객센터(
						<a href="mailto:xunssoie@gmail.com" className="text-blue-600 hover:underline">xunssoie@gmail.com</a>
						)를 통해 가능합니다.
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						7. 개인정보의 파기
					</h2>
					<p className="mb-4">
						서비스는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가
						불필요하게 되었을 때 지체 없이 해당 개인정보를 파기합니다.
					</p>
					<p className="font-semibold mb-2">파기 절차</p>
					<ul className="list-disc list-inside mb-4 ml-4">
						<li>
							이용자가 입력한 정보는 목적 달성 후 내부 방침 및 관련 법령에 따라
							일정 기간 저장 후 파기
						</li>
					</ul>
					<p className="font-semibold mb-2">파기 방법</p>
					<ul className="list-disc list-inside mb-4 ml-4">
						<li>전자적 파일 형태: 복구 불가능한 방법으로 영구 삭제</li>
						<li>종이 문서: 분쇄 또는 소각</li>
					</ul>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						8. 개인정보 보호책임자
					</h2>
					<p className="mb-4">
						서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
						처리와 관련한 정보주체의 불만 처리 및 피해구제를 위하여 아래와 같이
						개인정보 보호책임자를 지정하고 있습니다.
					</p>
					<p className="font-semibold mb-2">개인정보 보호책임자</p>
					<ul className="list-disc list-inside mb-4 ml-4">
						<li>성명: 한준서</li>
						<li>
							이메일:{" "}
							<a href="mailto:xunssoie@gmail.com" className="text-blue-600 hover:underline">xunssoie@gmail.com</a>
						</li>
					</ul>
					<p className="mb-2">
						개인정보 침해에 대한 신고나 상담이 필요하신 경우 아래 기관에
						문의하실 수 있습니다.
					</p>
					<ul className="list-disc list-inside mb-4 ml-4">
						<li>
							개인정보침해신고센터: (국번없이) 118 (
							<a href="https://privacy.kisa.or.kr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">privacy.kisa.or.kr</a>
							)
						</li>
						<li>
							개인정보분쟁조정위원회: (국번없이) 1833-6972 (
							<a href="https://www.kopico.go.kr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.kopico.go.kr</a>
							)
						</li>
						<li>
							대검찰청 사이버수사과: (국번없이) 1301 (
							<a href="https://www.spo.go.kr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.spo.go.kr</a>
							)
						</li>
						<li>
							경찰청 사이버안전국: (국번없이) 182 (
							<a href="https://ecrm.cyber.go.kr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ecrm.cyber.go.kr</a>
							)
						</li>
					</ul>

					<h2 className="text-xl font-semibold mt-8 mb-3">
						9. 개인정보 처리방침의 변경
					</h2>
					<p className="mb-4">
						본 개인정보 처리방침은 법령·정책 또는 보안기술의 변경에 따라 내용의
						추가·삭제 및 수정이 있을 시 시행일자 최소 7일 전에 서비스
						공지사항을 통해 고지합니다.
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