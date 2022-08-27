import {
	ApolloClient,
	InMemoryCache,
	HttpLink,
	ApolloLink,
	concat,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { parseCookies } from "nookies";

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		// graphQLErrors.forEach(({ message, locations, path }) => {
		// 	alert(`Graphql error ${message}`);
		// });
	}
});

const httpLink = new HttpLink({
	uri: `${process.env.NEXT_PUBLIC_BASE_URL}`,
});

const authMiddleware = new ApolloLink((operation, forward) => {
	let cookies = parseCookies(undefined);

	operation.setContext({
		headers: {
			authorization: cookies["@auth.token"]
				? `Bearer ${cookies["@auth.token"]}`
				: "",
		},
	});

	return forward(operation);
});

export const apolloClient = new ApolloClient({
	cache: new InMemoryCache({
		addTypename: false,
	}),
	link: concat(authMiddleware, httpLink),
});
