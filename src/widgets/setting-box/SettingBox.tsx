import { useRef } from "react";
import type { Item } from "@/features/button/SettingButton";
import SettingButton from "@/features/button/SettingButton";
import { useSendWithdrawEmail } from "@/features/user/delete-user/api/useWithdraw";
import { tokenManager } from "@/shared/api/config";
import {
	ConfirmModal,
	type ConfirmModalRef,
} from "@/shared/ui/modal/ConfirmModal";
import {
	type SuccessModalRef,
	SuccessNotificationModal,
} from "@/shared/ui/modal/SuccessNotificationModal";

interface Section {
	title?: string;
	items: Item[];
}

export default function UserSettingsBox() {
	const withdrawModalRef = useRef<ConfirmModalRef>(null);
	const sendWithdrawEmail = useSendWithdrawEmail();
	const successModalRef = useRef<SuccessModalRef>(null);

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
				{ label: "로그아웃" },
				{
					label: "탈퇴하기",
				},
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
							{section.items.map((item) => {
								if (item.label === "탈퇴하기") {
									return (
										<button
											type="button"
											key={item.label}
											className="flex flex-row items-center justify-between text-[#222124] text-xl font-medium"
											onClick={() => {
												withdrawModalRef.current?.open();
											}}
										>
											{item.label}
										</button>
									);
								} else if (item.label === "로그아웃") {
									return (
										<button
											type="button"
											key={item.label}
											className="flex flex-row items-center justify-between text-[#222124] text-xl font-medium"
											onClick={() => {
												tokenManager.clearTokens();
												/** TODO 나중에 수정 */
												window.location.href = "/";
											}}
										>
											{item.label}
										</button>
									);
								}

								return <SettingButton key={item.label} item={item} />;
							})}
						</div>
						{section.title && section !== sections[sections.length - 1] && (
							<p className="w-full h-[1.5px] bg-[#0000001A] mb-3.5" />
						)}
					</div>
				))}
			</section>
			<ConfirmModal
				ref={withdrawModalRef}
				title={["정말로", "탈퇴하실건가요?"]}
				description={[
					"계정을 삭제하면 저장된 모든 데이터가 사라져요.",
					"정말로 계정을 삭제하실건가요?",
				]}
				confirmText="탈퇴하기"
				cancelText="돌아가기"
				onConfirm={() => {
					/** 메일 보내기 */
					sendWithdrawEmail.mutate();
					successModalRef.current?.open();
				}}
				onCancel={() => {}}
			/>
			<SuccessNotificationModal
				title={["탈퇴하신다니 정말 아쉬워요."]}
				description={[
					"가입하신 이메일로 메일을",
					"전송해드렸으니 메일을 확인해 주시고",
					"절차를 따라주세요.",
				]}
				ref={successModalRef}
				onSubmit={() => {}}
			/>
		</div>
	);
}
