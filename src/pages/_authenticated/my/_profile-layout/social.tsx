import SocialFollowSection from "@/widgets/user/social/ui/social-follow-section";
import SocialFriendsFeedSection from "@/widgets/user/social/ui/social-friends-feed-section";
import SocialRecommendFriendSection from "@/widgets/user/social/ui/social-recommend-friend-section";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/my/_profile-layout/social",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<SocialFollowSection />
			<SocialFriendsFeedSection />
			<SocialRecommendFriendSection />
		</>
	);
}
