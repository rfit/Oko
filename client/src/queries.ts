
import gql from "graphql-tag";

export const GET_ALL_INVOICES = gql`
	query Invoices($teamId: ID!) {
		invoices(teamId: $teamId) {
			id,
			invoiceId,
			createdDate,
			invoiceDate,
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
