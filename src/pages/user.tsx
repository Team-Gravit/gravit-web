import UserProfile from "@/widgets/user/ui/UserProfile.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user")({
	component: UserPage,
});

function UserPage() {
	return (
		<>
			<UserProfile />
		</>
	);
}
