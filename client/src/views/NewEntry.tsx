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
  mutation createBill($ID: String, $oko: Number, $nooko: Number, $teamId: String ) {
	createBill(id: $ID oko: $oko, nonoko: $nooko, teamId: $teamId) {
		created,
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
	public handleDateChange = () => {
		console.log('changed!!!')
	}
	public render() {
		let invoiceDate: any;
		let invoiceId: any;
		const unit = 'kg'; // Get from team settings can be "kg" | "kr"

		this.setState({
			invoiceDate: new Date()
		});

		return (
			<Mutation mutation={ADD_INVOICE}>
				{(CreateInvoice, { data }) => (
					<form
						// tslint:disable-next-line: jsx-no-lambda
						onSubmit={e => {
							e.preventDefault();
							CreateInvoice({
								variables: {
									invoiceDate: new Date(),
									invoiceId: invoiceId.value,
									type: invoiceDate.value,
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

						<TextField
							// tslint:disable-next-line: jsx-no-lambda
							inputRef={node => {
								invoiceDate = node;
						  	}}
							id="invoice-time"
							label="Faktura dato"
							type="date"
							margin="normal"
							defaultValue="201705-24"
						/>

						<DatePicker value={this.state.selectedDate} onChange={this.handleDateChange} />

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
