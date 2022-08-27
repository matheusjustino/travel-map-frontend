import { gql } from "@apollo/client";

export const DO_LOGIN = gql`
	mutation doLogin($email: String!, $password: String!) {
		doLogin(input: { email: $email, password: $password })
	}
`;

export const REGISTER = gql`
	mutation register($userName: String!, $email: String!, $password: String!) {
		register(
			input: { userName: $userName, email: $email, password: $password }
		) {
			id
			userName
			email
		}
	}
`;

export const CREATE_PIN = gql`
	mutation createPin(
		$title: String!
		$description: String!
		$rating: Float!
		$lat: Float!
		$long: Float!
	) {
		createPin(
			input: {
				title: $title
				description: $description
				rating: $rating
				lat: $lat
				long: $long
			}
		) {
			id
			title
			description
			rating
			lat
			long
			user {
				id
				userName
				email
			}
			createdAt
		}
	}
`;
