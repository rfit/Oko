
import gql from "graphql-tag";

export const GET_ALL_INVOICES = gql`
	query Invoices($teamId: ID!) {
		invoices(teamId: $teamId) {
			_id,
			invoiceId,
			createdDate,
			invoiceDate,
			supplier,
			teamId,
			userId,
			userName,
			eco,
			nonEco,
			excluded,
			total
		}
	}
`

export const LOGIN = gql`
	query Login($id: String! $pw: String!) {
		login(email: $id, pw: $pw) {
			token
		}
	}
`
