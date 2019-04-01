import gql from "graphql-tag";
import * as React from 'react';
import { Mutation } from "react-apollo";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {
	DatePicker
} from "material-ui-pickers";

export interface INewEntryProps {
	onSave: () => void;
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
	mutation createInvoice(
		$invoiceId: Number,
		$invoiceDate: String,
		$teamId: Number,
		$eco: Number,
		$nonEco: Number,
		$excluded: Number,
		$total: Number
	){
		createBill(id: $ID oko: $oko, nonoko: $nooko, teamId: $teamId) {
			createdDate,
			invoiceId,
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

console.log(uuidv4());

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
		const unit = 'kg'; // Get from team settings can be "kg" | "kr"

		return (
			<Mutation mutation={ADD_INVOICE}>
				{(CreateInvoice, { data }) => (
					<form
						// tslint:disable-next-line: jsx-no-lambda
						onSubmit={e => {
							e.preventDefault();
							CreateInvoice({
								variables: {
									invoiceDate: this.state.invoiceDate,
									invoiceId: invoiceId.value,
									oko: '100',
									nooko: '0',
									teamId: '23'
								}
							});
						}}
					>
						<Typography component="h1" variant="h3" gutterBottom>
							Opret ny faktura
						</Typography>

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
							label={`Samlet i ${unit}`}
							margin="normal"
						/><br />
						<TextField
							type="number"
							variant="filled"
							id="non-eco"
							label={`Ikke omfattet andel i ${unit}`}
							margin="normal"
						/>
						<br />
						<TextField
							type="number"
							variant="filled"
							id="non-eco"
							label={`Økologisk andel i ${unit}`}
							margin="normal"
						/><br />
						<Button type="submit" variant="contained" color="primary">Opret</Button>
					</form>
				)}
			</Mutation>
		);
	}
}


export default NewEntry;
