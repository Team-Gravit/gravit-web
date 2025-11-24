import { useConfirmWithdraw } from "@/features/user/delete-user/api/useWithdraw";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/user/me/delete/page",
)({
	component: RouteComponent,
	validateSearch: z.object({
		mailAuthCode: z.string(),
	}),
});

function RouteComponent() {
	const confirmWithdraw = useConfirmWithdraw();
	const { mailAuthCode } = Route.useSearch() as { mailAuthCode: string };
	const navigate = useNavigate();

	useEffect(() => {
		confirmWithdraw.mutate(mailAuthCode, {
			onSuccess: () => {
				alert("계정이 삭제되었습니다.");
				navigate({ to: "/" });
			},
			onError: (error) => {
				alert(error.message || "계정 삭제에 실패했습니다.");
				navigate({ to: "/" });
			},
		});
	}, []);

	return <div></div>;
}
