import { createFileRoute } from "@tanstack/react-router";
import SettingsBox from "@/widgets/setting-box/SettingBox";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/_fixed-sidebar-layout/user/",
)({
	component: Index,
});

export default function Index() {
	return (
		<div className="w-full min-h-screen">
			<SettingsBox />
		</div>
	)
}
