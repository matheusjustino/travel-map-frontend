import "../styles/globals.scss";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";

// SERVICES
import { apolloClient } from "../services/apollo";

// CONTEXTS
import { ToastProvider } from "../contexts/toast.context";
import { AuthProvider } from "../contexts/auth.context";

function MyApp({ Component, pageProps }: AppProps) {
	const [isSSR, setIsSSR] = useState(true);

	useEffect(() => {
		setIsSSR(false);
	}, []);

	if (isSSR) return null;

	return (
		<ApolloProvider client={apolloClient}>
			<ToastProvider>
				<AuthProvider>
					<Component {...pageProps} />
				</AuthProvider>
			</ToastProvider>
		</ApolloProvider>
	);
}

export default MyApp;
