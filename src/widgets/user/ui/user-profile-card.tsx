import { Link, useNavigate } from "@tanstack/react-router";
import SettingIcon from "@/shared/assets/_icons/button/setting-icon.svg?react";
import Profile from "@/shared/assets/icons/profile2.svg?react";
import pcBackgroundImage from "@/shared/assets/images/pcBannerImage.webp";
import { cn } from "@/shared/lib/cn";
import { getProfileColor } from "@/shared/lib/ProfileColor";
import { Button } from "@/shared/ui/button/Button";

interface UserProfileCardProps {
	nickname: string;
	profileImageNumber: number;
	level: number;
	handle: string;
	currentLeague: string;
	consecutiveSolvedDays: number;
}

export default function UserProfileCard({
	nickname,
	profileImageNumber,
	level,
	handle,
	currentLeague,
	consecutiveSolvedDays,
}: UserProfileCardProps) {
	const navigate = useNavigate();

	const handleEditProfileClick = () => {
		navigate({ to: "/user/edit" });
	};

	return (
		<section
			aria-label="사용자 프로필 카드"
			style={{
				backgroundImage: `url(${pcBackgroundImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
			className="relative min-h-[196px] md:min-h-[204px] w-full  md:rounded-xl overflow-hidden"
		>
			<div className="absolute inset-0 size-full bg-black/40 pointer-events-none md:bg-linear-to-l md:to-[#1D0027]/0 md:via-transparent md:from-0% md:via-15% md:from-[#1D0027]/60" />
			<div className="relative flex flex-col w-full h-full gap-3 px-4 py-6 md:p-8">
				<div className="flex-1 flex min-h-0">
					<div className="flex-1 flex items-center gap-3 md:gap-8">
						<div>
							<Profile
								style={{ color: getProfileColor(profileImageNumber) }}
								className="size-[70px] md:size-[140px]"
							/>
						</div>

						<div className="flex flex-col gap-1">
							<h3 className="heading2 text-text-1-w md:display2">{nickname}</h3>

							<p className="text-semantic-info body1-normal mb-2 max-md:hidden">
								{`@${handle}`}
							</p>

							<div className="flex items-center gap-1 md:gap-2 text-cta-text caption1 md:headline2">
								<ProfileCardLabel>{`LV. ${level}`}</ProfileCardLabel>
								<ProfileCardLabel>{currentLeague}</ProfileCardLabel>
								<ProfileCardLabel className="max-md:hidden">
									{`${consecutiveSolvedDays}일 연속 학습중`}
								</ProfileCardLabel>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-3 self-start">
						<Button
							type="button"
							onClick={handleEditProfileClick}
							className="max-md:hidden"
						>
							프로필 수정
						</Button>

						<Link
							aria-label="사용자 설정 페이지로 이동"
							className="flex items-center justify-center"
							to="/user"
						>
							<SettingIcon />
						</Link>
					</div>
				</div>
				<p className="text-semantic-info body2-normal text-sm md:hidden">
					{`@${handle}`}
				</p>
				<Button
					type="button"
					variant={"secondary"}
					className="w-full md:hidden"
					onClick={handleEditProfileClick}
				>
					프로필 편집
				</Button>
			</div>
		</section>
	);
}

function ProfileCardLabel({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"bg-white/20 px-2 py-0.5 rounded-lg md:py-1 md:px-4",
				className,
			)}
		>
			{children}
		</span>
	);
}
