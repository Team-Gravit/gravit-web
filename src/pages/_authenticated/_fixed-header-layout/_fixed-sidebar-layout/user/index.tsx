import { createFileRoute } from "@tanstack/react-router";
import { PageSeo } from "@/shared/ui/seo/PageSeo";
import SettingsBox from "@/widgets/setting-box/SettingBox";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/_fixed-sidebar-layout/user/",
)({
	component: Index,
});

export default function Index() {
	return (
		<div className="w-full min-h-screen">
			<PageSeo
				title="내 프로필"
				description="Gravit 프로필 설정 및 계정 정보를 관리하세요."
				noIndex={true}
			/>
			<SettingsBox />
		</div>
	);
}
