import gql from "graphql-tag";
import * as React from 'react';
import { Mutation, Query } from "react-apollo";
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
	currentTeam: any;
	currentUser: any;
	route: any;
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

const UPDATE_INVOICE = gql`
	mutation UpdateInvoice(
		$id: ID!,
		$invoiceId: Int,
		$invoiceDate: String,
		$userId: Int!,
		$userName: String
		$eco: Float,
		$nonEco: Float,
		$excluded: Float
	){
		updateInvoice(
			id: $id,
			invoiceId: $invoiceId,
			invoiceDate: $invoiceDate,
			userId: $userId
			userName: $userName
			eco: $eco,
			nonEco: $nonEco,
			excluded: $excluded
		) {
			invoiceId,
			createdDate,
	  		id
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

class EditInvoice extends React.Component<INewEntryProps, INewEntryState> {
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
			'invoiceId': undefined
		});
	}
	public onCreate = (CreateInvoice: any) => {
		return (e: React.SyntheticEvent) => {
			e.preventDefault();

			// if(!this.state.invoiceId) { return };

			const nonEcoAmount = parseFloat(this.state.totalAmount) - parseFloat(this.state.excludedAmount) - parseFloat((this.state.ecoAmount));
			const vars = {
				id: this.props.route.params.invoiceId,
				invoiceDate: this.state.invoiceDate,
				invoiceId: parseInt(this.state.invoiceId + '', 10),
				// teamId: this.props.currentTeam.id,
				userId: this.props.currentUser.uid,
				userName: this.props.currentUser.name,
				eco: parseFloat(this.state.ecoAmount),
				nonEco: nonEcoAmount,
				excluded: parseFloat(this.state.excludedAmount)
			}

			console.log(vars);

			CreateInvoice({
				variables: vars
			});
		}
	}
	public render() {
		const { classes, route } = this.props;
		const unit = 'kg'; // Get from team settings can be "kg" | "kr"

		console.log(this.props);

		return (
			<Query
				variables={{
					id: route.params.invoiceId
				}}
				query={gql`
					query Invoice($id: ID!) {
						invoice(id: $id) {
							id,
							invoiceId,
							invoiceDate,
							createdDate,
							eco,
							nonEco,
							excluded,
							total
						}
					}
				`}
			>
			{({ loading, error, data }) => {
				if(error) { return error }
				if(loading) { return '...'; }

				console.log(data, this.props.currentTeam.measurement);
				// this.setState({
				// 	invoiceId: data.invoice.invoiceId
				// });

				return (
					<Mutation
						mutation={UPDATE_INVOICE}
						onCompleted={this.handleComplete}
					>
						{(UpdateInvoice, {  }) => (
							<form
								// tslint:disable-next-line: jsx-no-lambda
								onSubmit={this.onCreate(UpdateInvoice)}
							>
								<Paper className={classes.paper}>
									<div className={classes.contentWrapper}>
										<Typography component="h1" variant="h3" gutterBottom>
											Redigér faktura {data.invoice.invoiceId}
										</Typography>

										<DatePicker
											variant="filled"
											label="Faktura dato"
											value={this.state.invoiceDate}
											onChange={this.handleDateChange} />
										<br />
										<TextField
											value={this.state.invoiceId || data.invoice.invoiceId}
											// tslint:disable-next-line: jsx-no-lambda
											onChange={(e) => this.setState({ invoiceId: e.target.value})}
											variant="filled"
											type="number"
											id="invoice-number"
											label="Faktura/bilag nummer"
											margin="normal"
										/><br />
										<TextField
											value={this.state.totalAmount || data.invoice.total}
											type="number"
											variant="filled"
											// tslint:disable-next-line: jsx-no-lambda
											onChange={(e) => this.setState({ totalAmount: e.target.value})}
											label={`Samlet i ${unit}`}
											margin="normal"
										/><br />
										<TextField
											value={this.state.excludedAmount || data.invoice.excluded}
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
											value={this.state.ecoAmount || data.invoice.eco}
											type="number"
											variant="filled"
											// tslint:disable-next-line: jsx-no-lambda
											onChange={(e) => this.setState({ ecoAmount: e.target.value})}
											label={`Økologisk andel i ${unit}`}
											margin="normal"
										/><br />
										<Button type="submit" variant="contained" color="primary">Opret</Button>

										{this.state.created && (
											<p>Opdateret! {this.state.lastCreated}!</p>
										)}
									</div>
								</Paper>

							</form>
						)}
					</Mutation>
				);
			}}
		</Query>
		);
	}
}

export default withStyles(styles)(EditInvoice);
