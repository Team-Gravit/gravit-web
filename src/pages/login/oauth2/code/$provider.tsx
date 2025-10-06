import { usePostOAuth } from "@/entities/login/model/usePostOAuth";
import {
	createFileRoute,
	useLocation,
	useParams,
} from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/login/oauth2/code/$provider")({
	component: OAuthCallback,
});

function OAuthCallback() {
	const params = useParams({ from: Route.id });
	const provider = params.provider as string;
	const location = useLocation();
	const postOAuth = usePostOAuth();

	const searchParams = new URLSearchParams(location.search);
	const code = searchParams.get("code");

	useEffect(() => {
		if (provider && code) {
			postOAuth.mutate({ provider, code });
		}
	}, [provider, code, postOAuth.mutate]);

	return;
}
