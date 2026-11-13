import {
  DocumentInfoCard,
  DocumentList,
  DocumentNote,
  DocumentSection,
  DocumentSubsection,
  DocumentTable,
  DocumentText,
} from '@/shared/ui/document';
import { DocumentLayout } from '@/shared/ui/layout';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { PageTitleBar } from '@/widgets/page-title-bar';

const EFFECTIVE_DATE = '2026년 11월 13일';
const PRIVACY_CONTACT_EMAIL = 'gravitfrontend@gmail.com';

const ENTRUSTED_COMPANIES: [string, string][] = [
  ['카카오, 네이버, Google, Apple', '소셜 로그인 인증'],
  ['Google (Gmail)', '회원 탈퇴 인증 메일 발송'],
  ['Google (Firebase Cloud Messaging)', '푸시 알림 발송'],
  ['OpenAI', '면접 답변 채점, 답변 음성의 텍스트 변환'],
  ['Amazon Web Services (서울 리전)', '면접 질문·답변 음성 파일 저장'],
];

const REPORT_AGENCIES = [
  { name: '개인정보침해신고센터', phone: '118', href: 'https://privacy.kisa.or.kr' },
  { name: '개인정보분쟁조정위원회', phone: '1833-6972', href: 'https://www.kopico.go.kr' },
  { name: '대검찰청 사이버수사과', phone: '1301', href: 'https://www.spo.go.kr' },
  { name: '경찰청 사이버수사국', phone: '182', href: 'https://ecrm.police.go.kr' },
];

function ExternalLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-main underline-offset-2 hover:underline"
    >
      {href.replace('https://', '')}
    </a>
  );
}

function MailLink() {
  return (
    <a
      href={`mailto:${PRIVACY_CONTACT_EMAIL}`}
      className="text-main underline-offset-2 hover:underline"
    >
      {PRIVACY_CONTACT_EMAIL}
    </a>
  );
}

export function PrivacyPage() {
  return (
    <DocumentLayout
      title="개인정보 처리방침"
      effectiveDate={EFFECTIVE_DATE}
      wideHeader={<Header isLogoOnly />}
      narrowHeader={<PageTitleBar title="개인정보 처리방침" backTo={{ to: '/' }} />}
      footer={<Footer />}
    >
      <DocumentNote tone="accent">
        <p>
          Gravit(이하 &quot;서비스&quot;)은 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를
          보호하고 관련 고충을 신속하게 처리하기 위해 이 개인정보 처리방침을 공개합니다. 서비스는
          제공에 필요한 최소한의 개인정보만 처리합니다.
        </p>
      </DocumentNote>

      <DocumentSection number={1} title="수집하는 정보">
        <DocumentSubsection title="회원가입 및 로그인">
          <DocumentList
            items={[
              '소셜 로그인(카카오, Google, 네이버, Apple) 계정 식별자',
              '소셜 로그인 계정의 이메일 주소',
              '처음 닉네임: Google·네이버는 계정 이름, 카카오는 카카오 닉네임. 온보딩에서 바꾸면 새 닉네임으로 대체됩니다.',
            ]}
          />
          <DocumentNote>
            <p>
              Apple 로그인은 Apple 사용자 식별자와 이메일만 받으며 이름은 받지 않습니다. 이메일
              가리기를 선택하면 Apple이 만든 릴레이 이메일 주소가 저장되고, 닉네임은
              &quot;애플사용자&quot;로 시작하는 임의 값으로 정해집니다.
            </p>
            <p>
              탈퇴할 때 Apple 계정 연결을 해제하기 위해 Apple이 발급한 인증 토큰(refresh token)을
              암호화해 저장하고, 발급된 곳(웹 또는 iOS 앱)을 함께 기록합니다.
            </p>
            <p>프로필 사진은 받지 않으며, 서비스가 제공하는 기본 이미지 번호만 저장합니다.</p>
          </DocumentNote>
        </DocumentSubsection>

        <DocumentSubsection title="서비스 이용">
          <DocumentList
            items={[
              '학습 기록(학습한 개념, 문제 풀이 결과, 오답노트, 북마크)',
              '리그 포인트(LP), 순위, 리그 기록, 미션 진행 상황',
              '친구 관계, 피드, 알림 내역',
              '문의 내용과 답변, 문제 신고 내용',
              '마지막 접속 시각',
            ]}
          />
        </DocumentSubsection>

        <DocumentSubsection title="면접 기능 (이용 시)">
          <DocumentList items={['면접 질문, 답변 텍스트, 답변 음성']} />
        </DocumentSubsection>

        <DocumentSubsection title="푸시 알림">
          <DocumentList items={['기기 식별자, 푸시 토큰(FCM), 기기 플랫폼(Android, iOS)']} />
          <DocumentNote>
            <p>
              푸시 토큰은 알림을 보내는 데만 쓰며, 알림 수신은 기기 설정에서 언제든지 끌 수
              있습니다.
            </p>
          </DocumentNote>
        </DocumentSubsection>

        <DocumentSubsection title="자동으로 생성되는 기록">
          <DocumentList items={['서비스 이용 기록(요청 경로, 응답 시간, 처리 결과, 회원 번호)']} />
          <DocumentNote>
            <p>
              서비스 애플리케이션은 접속 IP를 기록하지 않습니다. 다만 서버 앞단의 웹 서버 접속
              기록에는 접속 IP가 남을 수 있습니다.
            </p>
          </DocumentNote>
        </DocumentSubsection>
      </DocumentSection>

      <DocumentSection number={2} title="이용 목적">
        <DocumentText>수집한 정보는 다음 목적으로만 이용합니다.</DocumentText>
        <DocumentList
          items={[
            '회원 식별, 로그인 및 계정 관리',
            'CS 학습 콘텐츠 제공과 학습 기록 관리',
            '리그 운영(LP 관리, 순위 산정)과 미션 제공',
            '친구, 피드, 알림 기능 제공',
            '면접 답변 채점과 답변 음성의 텍스트 변환',
            '푸시 알림 발송',
            '회원 탈퇴 인증 메일 발송',
            '문의 응대와 문제 신고 확인',
            '서비스 운영, 오류 개선, 부정 이용 방지',
          ]}
        />
      </DocumentSection>

      <DocumentSection number={3} title="보유 및 파기">
        <DocumentText>
          회원 탈퇴를 확정하면 계정이 즉시 비활성화되고, 7일 동안은 탈퇴를 취소하고 계정을 복구할 수
          있습니다. 7일이 지나면 아래 정보를 지체 없이 삭제합니다. Apple 계정 연결은 탈퇴를 확정하는
          즉시 해제합니다.
        </DocumentText>
        <DocumentNote title="탈퇴 7일 뒤 삭제하는 정보">
          <DocumentList
            items={[
              '계정 정보(이메일, 소셜 로그인 식별자, 닉네임)',
              '학습 기록, 오답노트, 북마크',
              '리그와 리그 기록, 미션',
              '친구, 피드, 알림, 푸시 토큰',
              'Apple 인증 토큰',
              '문의와 답변, 문제 신고',
              '면접 기록과 저장된 답변 음성',
            ]}
          />
        </DocumentNote>
        <DocumentNote title="삭제 후에도 남는 정보">
          <DocumentList
            items={[
              '일별 이용 기록: 회원 번호와 날짜만 남으며 운영 통계에 사용합니다. 계정이 삭제되어 개인을 알아볼 수 없습니다.',
              '서비스 이용 기록: 서버 파일은 7일, 로그 저장소는 180일 동안 보관한 뒤 삭제합니다.',
              'OpenAI에 전송된 면접 답변 음성 사본: OpenAI가 최대 30일 동안 보관한 뒤 삭제하며, 서비스가 직접 삭제할 수 없습니다.',
            ]}
          />
        </DocumentNote>
        <DocumentText>
          삭제하는 정보는 복구할 수 없는 방법으로 영구 삭제합니다. 법령에 따라 보관해야 하는 정보가
          생기면 해당 기간 동안 분리해 보관합니다.
        </DocumentText>
      </DocumentSection>

      <DocumentSection number={4} title="제3자 제공">
        <DocumentText>
          서비스는 개인정보를 판매하지 않으며, 이용자의 동의가 있거나 법령에 따라 수사기관 등이
          정해진 절차로 요구하는 경우를 제외하고 제3자에게 제공하지 않습니다.
        </DocumentText>
      </DocumentSection>

      <DocumentSection number={5} title="개인정보 처리위탁">
        <DocumentText>
          서비스 제공을 위해 아래와 같이 개인정보 처리 업무를 위탁합니다. 수탁업체는 위탁 목적 범위
          안에서만 개인정보를 처리합니다.
        </DocumentText>
        <DocumentTable columns={['수탁업체', '위탁 업무']} rows={ENTRUSTED_COMPANIES} />
        <DocumentNote>
          <p>
            API 서버와 데이터베이스, 서비스 이용 기록은 외부 클라우드가 아닌 서비스 운영 조직이 직접
            관리하는 국내 서버에 저장합니다. 위탁 업체가 바뀌면 이 처리방침으로 알립니다.
          </p>
        </DocumentNote>
      </DocumentSection>

      <DocumentSection number={6} title="개인정보의 국외 이전">
        <DocumentText>
          서비스는 아래 기능을 제공하기 위해 개인정보를 국외로 이전합니다. 정보는 기능을 이용하는
          시점에 암호화된 통신망으로 전송됩니다.
        </DocumentText>
        <DocumentInfoCard
          title="Google LLC"
          rows={[
            { label: '이전 국가', value: '미국 등 Google 데이터센터 소재 국가' },
            {
              label: '이전 항목',
              value: '이메일 주소와 탈퇴 인증 링크(메일 발송), 푸시 토큰과 알림 내용(푸시 알림)',
            },
            { label: '이전 목적', value: '회원 탈퇴 인증 메일 발송, 푸시 알림 발송' },
            { label: '보유 기간', value: '목적 달성 후 Google의 보관 정책에 따라 삭제' },
            { label: '연락처', value: <ExternalLink href="https://policies.google.com/privacy" /> },
          ]}
        />
        <DocumentInfoCard
          title="OpenAI, L.L.C."
          rows={[
            { label: '이전 국가', value: '미국' },
            { label: '이전 항목', value: '면접 질문, 답변 텍스트, 답변 음성' },
            { label: '이전 목적', value: '면접 답변 채점, 답변 음성의 텍스트 변환' },
            { label: '보유 기간', value: '전송일로부터 최대 30일' },
            {
              label: '연락처',
              value: <ExternalLink href="https://openai.com/policies/privacy-policy" />,
            },
          ]}
        />
        <DocumentNote>
          <p>
            국외 이전을 원하지 않으면 면접 기능을 이용하지 않거나 기기 설정에서 알림을 끌 수
            있습니다. 이 경우 해당 기능을 이용할 수 없습니다. 탈퇴 인증 메일은 탈퇴 절차에
            필요하므로, 원하지 않으면 아래 이메일로 탈퇴를 요청할 수 있습니다.
          </p>
        </DocumentNote>
      </DocumentSection>

      <DocumentSection number={7} title="안전성 확보조치">
        <DocumentText>서비스는 개인정보 보호를 위해 다음 조치를 취하고 있습니다.</DocumentText>
        <DocumentList
          items={[
            '모든 통신의 암호화(HTTPS)',
            'Apple 인증 토큰 등 인증 정보의 암호화 저장',
            '개인정보에 접근할 수 있는 인원의 최소화',
          ]}
        />
      </DocumentSection>

      <DocumentSection number={8} title="이용자의 권리">
        <DocumentText>
          이용자는 언제든지 자신의 개인정보 열람, 정정·삭제, 처리 정지를 요구하거나 회원 탈퇴로
          동의를 철회할 수 있습니다. 닉네임 변경과 회원 탈퇴는 앱의 설정 메뉴에서 할 수 있으며, 그
          밖의 요청은 <MailLink />로 접수할 수 있습니다.
        </DocumentText>
      </DocumentSection>

      <DocumentSection number={9} title="개인정보 보호책임자">
        <DocumentInfoCard
          rows={[
            { label: '성명', value: '한준서' },
            { label: '이메일', value: <MailLink /> },
          ]}
        />
        <DocumentText>
          개인정보 침해에 대한 신고나 상담이 필요하면 아래 기관에 문의할 수 있습니다.
        </DocumentText>
        <DocumentList
          items={REPORT_AGENCIES.map((agency) => (
            <span key={agency.name}>
              {agency.name}: (국번없이) {agency.phone} (<ExternalLink href={agency.href} />)
            </span>
          ))}
        />
      </DocumentSection>

      <DocumentSection number={10} title="개인정보 처리방침 변경">
        <DocumentText>
          이 처리방침은 서비스나 관련 법령이 바뀌면 수정될 수 있으며, 변경 내용은 서비스 공지사항
          또는 이 화면으로 알립니다.
        </DocumentText>
        <DocumentList
          isEmphasized
          items={[`시행일: ${EFFECTIVE_DATE}`, `최종 수정일: ${EFFECTIVE_DATE}`]}
        />
      </DocumentSection>
    </DocumentLayout>
  );
}
