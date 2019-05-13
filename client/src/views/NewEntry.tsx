import gql from "graphql-tag";
import * as React from 'react';
import { Mutation } from "react-apollo";
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import {
	DatePicker
} from "material-ui-pickers";

export interface INewEntryProps {
	classes: any;
	currentUser: any;
	route: any;
	router: any;
}

export interface INewEntryState {
	invoiceDate: any;
	lastCreated?: string;
	created?: boolean;
	invoiceId?: any;
	totalAmount?: any;
	excludedAmount?: any;
	ecoAmount?: any;
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
		$teamId: ID!,
		$eco: Float!,
		$nonEco: Float!,
		$excluded: Float!
	){
		addInvoice(
			invoiceId: $invoiceId,
			invoiceDate: $invoiceDate,
			teamId: $teamId
			eco: $eco,
			nonEco: $nonEco,
			excluded: $excluded
		) {
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
`;

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

class NewEntry extends React.Component<INewEntryProps, INewEntryState> {
	public state: INewEntryState = {
		created: false,
		invoiceDate: new Date(),
	}
	public handleDateChange = (date: any) => {
		this.setState({ invoiceDate: date });
		console.log('changed!!!', this.state.invoiceDate)
	}
	public handleComplete = ({ addInvoice } : any) => {
		console.log(addInvoice.invoiceId);
		this.setState({
			'created': true,
			'lastCreated': addInvoice.invoiceId,

			// Reset
			invoiceId: '',
			totalAmount: '',
			excludedAmount: '',
			ecoAmount: ''
		});

		// Go back to the overview
		this.props.router.navigate('overview');
	}
	public onCreate = (CreateInvoice: any) => {
		return (e: React.SyntheticEvent) => {
			e.preventDefault();
			const { currentUser } = this.props;
			const { currentTeam } = currentUser;
			// if(!this.state.invoiceId) { return };

			const nonEcoAmount = parseFloat(this.state.totalAmount) - parseFloat(this.state.excludedAmount) - parseFloat((this.state.ecoAmount));

			CreateInvoice({
				variables: {
					invoiceDate: this.state.invoiceDate,
					invoiceId: parseInt(this.state.invoiceId + '', 10),
					teamId: currentTeam.id,
					eco: parseFloat(this.state.ecoAmount),
					nonEco: nonEcoAmount,
					excluded: parseFloat(this.state.excludedAmount)
				}
			});
		}
	}
	public render() {
		const { classes } = this.props;
		const unit = this.props.currentUser.currentTeam.measurement; // Get from team settings can be "kg" | "kr"

		if(!unit || unit === "" || unit === "null" ) {
			return 'Din leder skal vælge om boden registere i kilo eller kroner.';
		}

		return (
			<Mutation
				mutation={ADD_INVOICE}
				onCompleted={this.handleComplete}
				>
				{(CreateInvoice, { data }) => (
					<form
						// tslint:disable-next-line: jsx-no-lambda
						onSubmit={this.onCreate(CreateInvoice)}
					>
						<Paper className={classes.paper}>
							<div className={classes.contentWrapper}>
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
									value={this.state.invoiceId || ''}
									// tslint:disable-next-line: jsx-no-lambda
									onChange={(e) => this.setState({ invoiceId: e.target.value})}
									variant="filled"
									type="number"
									id="invoice-number"
									label="Faktura/bilag nummer"
									margin="normal"
								/><br />
								<TextField
									value={this.state.totalAmount || ''}
									type="number"
									variant="filled"
									id="total"
									// tslint:disable-next-line: jsx-no-lambda
									onChange={(e) => this.setState({ totalAmount: e.target.value})}
									label={`Samlet i ${unit}`}
									margin="normal"
								/><br />
								<TextField
									value={this.state.excludedAmount || ''}
									type="number"
									variant="filled"
									id="non-eco"
									// tslint:disable-next-line: jsx-no-lambda
									onChange={(e) => this.setState({ excludedAmount: e.target.value})}
									label={`Ikke omfattet andel i ${unit}`}
									margin="normal"
								/>
								<br />
								<TextField
									value={this.state.ecoAmount || ''}
									type="number"
									variant="filled"
									id="non-eco"
									// tslint:disable-next-line: jsx-no-lambda
									onChange={(e) => this.setState({ ecoAmount: e.target.value})}
									label={`Økologisk andel i ${unit}`}
									margin="normal"
								/><br />
								<Button type="submit" variant="contained" color="primary">Opret</Button>

								{this.state.created && (
									<p>Oprettede faktura # {this.state.lastCreated}!</p>
								)}
							</div>
						</Paper>

					</form>
				)}
			</Mutation>
		);
	}
}

export default withStyles(styles)(NewEntry);
