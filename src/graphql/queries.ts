import { gql } from "@apollo/client";

export const HEALTH_CHECK = gql`
	query {
		checkApp
	}
`;

export const GET_ME = gql`
	query {
		getMe {
			id
			userName
			email
		}
	}
`;

export const LIST_PINS = gql`
	query {
		listPins {
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
