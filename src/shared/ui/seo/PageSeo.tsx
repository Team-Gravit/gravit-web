import { Helmet } from "react-helmet-async";

/** 서비스 기본 메타데이터 상수 */
const SITE_NAME = "Gravit";
const BASE_URL = "https://grav-it.inuappcenter.kr";
const DEFAULT_DESCRIPTION =
	"재미있고 효과적인 CS 교육 플랫폼 그래빗. 자료구조부터 소프트웨어 엔지니어링까지 게임처럼 학습하세요.";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
const TWITTER_HANDLE = "@gravit_cs";

interface PageSeoProps {
	/** 브라우저 탭 및 og:title에 표시될 페이지 제목 (사이트명 자동 접미사 포함) */
	title: string;
	/** 페이지 설명 — 미입력 시 기본값 사용 */
	description?: string;
	/** 캐노니컬 URL 경로 (예: "/learning") — BASE_URL과 합산됨 */
	canonicalPath?: string;
	/** og:image URL — 미입력 시 기본 OG 이미지 사용 */
	ogImage?: string;
	/** 검색엔진 색인 여부 — 인증 필요 페이지는 false 권장 */
	noIndex?: boolean;
}

/**
 * 페이지별 SEO 메타데이터를 선언적으로 주입하는 프리미티브 컴포넌트.
 *
 * 사용 예시:
 * ```tsx
 * <PageSeo title="개념 학습" description="CS 개념을 학습하세요." canonicalPath="/learning" />
 * ```
 */
export function PageSeo({
	title,
	description = DEFAULT_DESCRIPTION,
	canonicalPath,
	ogImage = DEFAULT_OG_IMAGE,
	noIndex = false,
}: PageSeoProps) {
	// 탭 제목: "페이지명 | Gravit" 형식
	const fullTitle = `${title} | ${SITE_NAME}`;
	const canonicalUrl = canonicalPath ? `${BASE_URL}${canonicalPath}` : undefined;

	return (
		<Helmet>
			{/* 기본 메타 태그 */}
			<title>{fullTitle}</title>
			<meta name="description" content={description} />
			{noIndex && <meta name="robots" content="noindex, nofollow" />}
			{canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

			{/* Open Graph */}
			<meta property="og:type" content="website" />
			<meta property="og:site_name" content={SITE_NAME} />
			<meta property="og:title" content={fullTitle} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={ogImage} />
			{canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

			{/* Twitter Card */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content={TWITTER_HANDLE} />
			<meta name="twitter:title" content={fullTitle} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={ogImage} />
		</Helmet>
	);
}
