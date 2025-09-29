import SettingButton from "@/features/button/SettingButton";
import type { Item } from "@/features/button/SettingButton";

interface Section {
	title?: string;
	items: Item[];
}

export default function UserSettingsBox() {
	const sections: Section[] = [
		{
			title: "계정 정보",
			items: [{ label: "내 정보", to: "/user/edit" }],
		},
		{
			title: "사용자 설정",
			items: [
				{ label: "마케팅 / 이벤트 알림", hasCheckbox: true },
				{ label: "공지사항", to: "/user/notice" },
				{ label: "개인정보 처리 방침", to: "/user/privacy" },
			],
		},
		{
			items: [
				{ label: "로그아웃", to: "/user/logout" },
				{ label: "탈퇴하기", to: "/user/delete" },
			],
		},
	];

	return (
		<div className="flex w-full h-full flex-col p-8 gap-10 bg-[#f2f2f2]">
			<section className="w-full h-[510px] bg-white rounded-xl border border-[#000000]/10 p-8">
				{sections.map((section) => (
					<div
						key={section.title ?? section.items[0].label}
						className="flex flex-col gap-2"
					>
						{section.title && (
							<h3 className="text-base font-medium text-[#6D6D6D]">
								{section.title}
							</h3>
						)}
						<div className="flex flex-col p-3 justify-between gap-8">
							{section.items.map((item) => (
								<SettingButton key={item.label} item={item} />
							))}
						</div>
						{section.title && section !== sections[sections.length - 1] && (
							<p className="w-full h-[1.5px] bg-[#0000001A] mb-3.5" />
						)}
					</div>
				))}
			</section>
		</div>
	);
}
