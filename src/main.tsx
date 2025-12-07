import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/app/styles/globals.css";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/app/@generated/routeTree.gen";
import { tokenManager } from "@/shared/api/config";
import type { AuthState } from "./pages/__root";
import { ToastContainer } from "./shared/ui/toast";

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		auth: {
			isAuthenticated: !!tokenManager.getAccessToken(),
		} as AuthState,
	},
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 10,
			retry: 1,
			refetchOnWindowFocus: false,
		},
		mutations: {
			retry: 1,
		},
	},
});

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found");
}
createRoot(rootElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ToastContainer />
			<RouterProvider router={router} />
		</QueryClientProvider>
	</StrictMode>,
);
