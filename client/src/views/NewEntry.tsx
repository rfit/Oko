import gql from "graphql-tag";
import * as React from 'react';
import { Mutation } from "react-apollo";
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import {
	DatePicker
} from "material-ui-pickers";

export interface INewEntryProps {
	classes: any;
}

export interface INewEntryState {
	invoiceDate: any
}
/*

  mutation {
	createBill(id: $ID oko: $oko, nonoko: $nooko, invoiceDate: $invoiceDate, teamId: "23") {
		  created,
	  id
	}
  }

*/
const ADD_INVOICE = gql`
	mutation addInvoice(
		$invoiceId: Int!,
		$invoiceDate: String!,
		$teamId: Int!,
		$userId: Int!,
		$userName: String
		$eco: Float!,
		$nonEco: Float!,
		$excluded: Float!
	){
		addInvoice(
			invoiceId: $invoiceId,
			invoiceDate: $invoiceDate,
			teamId: $teamId
			userId: $userId
			userName: $userName
			eco: $eco,
			nonEco: $nonEco,
			excluded: $excluded
		) {
			createdDate,
	  		id
		}
	}
`;

function uuidv4() {
	// tslint:disable-next-line: only-arrow-functions
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		// tslint:disable-next-line: one-variable-per-declaration  no-bitwise triple-equals
		const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

const styles = ({ palette, spacing, breakpoints, mixins }: Theme) => createStyles({
	paper: {
		maxWidth: 936,
		margin: 'auto',
		overflow: 'hidden',
	},
	contentWrapper: {
		margin: '40px 16px',
	},
});


class NewEntry extends React.Component<INewEntryProps, {}> {
	public state = {
		invoiceDate: new Date(),
	}
	public handleDateChange = (date: any) => {
		this.setState({ invoiceDate: date });
		console.log('changed!!!', this.state.invoiceDate)
	}
	public render() {
		let invoiceId: any;
		let totalAmount: any;
		let excludedAmount: any;
		let ecoAmount: any;
		const { classes } = this.props;
		const unit = 'kg'; // Get from team settings can be "kg" | "kr"

		return (
			<Mutation mutation={ADD_INVOICE}>
				{(CreateInvoice: any, { data }: any) => (
					<form
						// tslint:disable-next-line: jsx-no-lambda
						onSubmit={e => {
							e.preventDefault();

							const nonEcoAmount = parseFloat(totalAmount.value) - parseFloat(excludedAmount.value) - parseFloat((ecoAmount.value));

							CreateInvoice({
								variables: {
									invoiceDate: this.state.invoiceDate,
									invoiceId: parseInt(invoiceId.value, 10),
									teamId: 6822,
									userId: 23,
									userName: "Allan",
									eco: parseFloat(ecoAmount.value),
									nonEco: nonEcoAmount,
									excluded: parseFloat(excludedAmount.value)
								}
							});
						}}
					>
						<Typography component="h1" variant="h3" gutterBottom>
							Opret ny faktura
						</Typography>

						<Paper className={classes.paper}>
							<div className={classes.contentWrapper}>
								<DatePicker
									variant="filled"
									label="Faktura dato"
									value={this.state.invoiceDate}
									onChange={this.handleDateChange} />
								<br />
								<TextField
									// tslint:disable-next-line: jsx-no-lambda
									inputRef={node => {
										invoiceId = node;
									}}
									variant="filled"
									id="invoice-number"
									label="Faktura/bilag nummer"
									margin="normal"
								/><br />
								<TextField
									type="number"
									variant="filled"
									id="total-price"
									// tslint:disable-next-line: jsx-no-lambda
									inputRef={node => {
										totalAmount = node;
									}}
									label={`Samlet i ${unit}`}
									margin="normal"
								/><br />
								<TextField
									type="number"
									variant="filled"
									id="non-eco"
									// tslint:disable-next-line: jsx-no-lambda
									inputRef={node => {
										excludedAmount = node;
									}}
									label={`Ikke omfattet andel i ${unit}`}
									margin="normal"
								/>
								<br />
								<TextField
									type="number"
									variant="filled"
									id="non-eco"
									// tslint:disable-next-line: jsx-no-lambda
									inputRef={node => {
										ecoAmount = node;
									}}
									label={`Økologisk andel i ${unit}`}
									margin="normal"
								/><br />
								<Button type="submit" variant="contained" color="primary">Opret</Button>
							</div>
						</Paper>

					</form>
				)}
			</Mutation>
		);
	}
}

export default withStyles(styles)(NewEntry);
