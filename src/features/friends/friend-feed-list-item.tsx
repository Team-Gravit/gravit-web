import Profile from "@/entities/user/ui/profile";
import FriendFeedCongratulateButton from "./friend-feed-congratulate-button";
import useResponsive from "@/shared/model/use-responsive";
import type { FriendActivityFeed } from "@/entities/friends/model/types";
import { formatRelativeTime } from "@/shared/lib/formatDate";

interface FriendFeedListItemProps {
	feed: FriendActivityFeed;
}

function FriendFeedListItem({ feed }: FriendFeedListItemProps) {
	const { isDesktop } = useResponsive();

	const { feedId, actorNickname, actorProfileImgNumber, createdAt, message } =
		feed;

	return (
		<li className="flex items-center justify-between md:px-6 py-5 md:py-4">
			<div className="flex items-center gap-3 md:gap-6">
				<Profile profileImgId={actorProfileImgNumber} size="sm" />
				<div className="flex flex-col md:flex-col-reverse gap-1 md:gap-0.5">
					<div className="flex items-center gap-1 md:gap-[1.5px]">
						<span className="md:hidden text-label1 text-text-1">
							{actorNickname}
						</span>
						<span className="text-caption1 md:text-label1 text-text-4">
							{formatRelativeTime(createdAt)}
						</span>
					</div>
					<p className="text-label2 md:text-heading2 text-text-3 md:text-text-2">
						{isDesktop ? `${actorNickname}님이 ${message}` : message}
					</p>
				</div>
			</div>

			<div className="w-fit rounded-lg">
				<FriendFeedCongratulateButton feedId={feedId} />
			</div>
		</li>
	);
}

export default FriendFeedListItem;
