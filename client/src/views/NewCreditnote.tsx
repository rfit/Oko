import gql from "graphql-tag";
import * as React from 'react';
import { Mutation } from "react-apollo";
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputAdornment from '@material-ui/core/InputAdornment';
import SaveIcon from '@material-ui/icons/Save';

import calculateEcoPercentage from '../utils/calculateEcoPercentage';

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
	nonEcoAmount: number;
	validState: boolean;
	supplier?: string;
	error?: string;
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
		$invoiceId: ID!,
		$invoiceDate: String!,
		$supplier: String!,
		$teamId: ID!,
		$eco: Float!,
		$nonEco: Float!,
		$excluded: Float!
	){
		addInvoice(
			invoiceId: $invoiceId,
			invoiceDate: $invoiceDate,
			teamId: $teamId,
			supplier: $supplier,
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
		nonEcoAmount: 0,
		validState: false
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
	public calulateNonEco() {
		const excludedAmount = parseFloat(this.state.excludedAmount) || 0;
		const ecoAmount = parseFloat(this.state.ecoAmount) || 0;
		const totalAmount = parseFloat(this.state.totalAmount) || 0;

		const nonEco = totalAmount - excludedAmount - ecoAmount;

		this.setState({ nonEcoAmount: nonEco }, () => {
			this.setState({ validState: !(nonEco > 0) });
		});

		return nonEco;
	}
	public roundNumber(num: number) {
		return Math.floor(num * 100) / 100;
	}
	public onCreate = (CreateInvoice: any) => {
		return (e: React.SyntheticEvent) => {
			e.preventDefault();
			const { currentUser } = this.props;
			const { currentTeam } = currentUser;

			const excludedAmount = parseFloat(this.state.excludedAmount);
			const ecoAmount = parseFloat(this.state.ecoAmount);
			const totalAmount = parseFloat(this.state.totalAmount);
			const nonEcoAmount = this.calulateNonEco()

			// if(!this.state.invoiceId) { return };

			CreateInvoice({
				variables: {
					invoiceDate: this.state.invoiceDate,
					invoiceId: this.state.invoiceId,
					supplier: this.state.supplier,
					teamId: currentTeam.id,
					eco: ecoAmount,
					nonEco: nonEcoAmount,
					excluded: excludedAmount
				}
			});
		}
	}
	public render() {
		const { classes } = this.props;
		const unit = this.props.currentUser.currentTeam.measurement; // Get from team settings can be "kg" | "kr"
		const currentPercentage = calculateEcoPercentage(this.state.ecoAmount, this.state.nonEcoAmount, this.state.excludedAmount );

		if(!unit || unit === "" || unit === "null" ) {
			return 'Din leder skal vælge om boden registere i kilo eller kroner.';
		}

		console.log('state', this.state)

		return (
			<Mutation<any, any>
				mutation={ADD_INVOICE}
				onCompleted={this.handleComplete}
				>
				{(CreateInvoice: any, { data, error, loading }) => (
					<form
						// tslint:disable-next-line: jsx-no-lambda
						onSubmit={this.onCreate(CreateInvoice)}
					>
						<Paper className={classes.paper}>
							<div className={classes.contentWrapper}>
								<Typography component="h1" variant="h3" gutterBottom>
									Opret ny Kreditnota
								</Typography><br />

								<DatePicker
									variant="outlined"
									label="Kreditnota dato"
									value={this.state.invoiceDate}
									onChange={this.handleDateChange} />
								<br />
								<TextField
									value={this.state.invoiceId || ''}
									// tslint:disable-next-line: jsx-no-lambda
									onChange={(e) => this.setState({ invoiceId: e.target.value})}
									variant="outlined"
									type="text"
									id="invoice-id"
									label="Kreditnota nummer"
									margin="normal"
								/><br />
								<TextField
									value={this.state.supplier || ''}
									// tslint:disable-next-line: jsx-no-lambda
									onChange={(e) => this.setState({ supplier: e.target.value})}
									variant="outlined"
									type="text"
									id="supplier-name"
									label="Leverandør"
									margin="normal"
								/><br />
								<TextField
									value={this.state.totalAmount || ''}
									type="number"
									variant="outlined"
									id="total"
									// tslint:disable-next-line: jsx-no-lambda
									onChange={(e) => {
										const val = Number(e.target.value);

										if(val > 0) {
											this.setState({
												error: 'Tal må ikke være højre end 0'
											})
											return;
										} else {
											this.setState({
												error: undefined
											})
										}

										this.setState({ totalAmount: e.target.value, }, () => {
											this.calulateNonEco();
										});
									}}
									label={`Samlet`}
									margin="normal"
									InputProps={{
										endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
									}}
								/><br />
								<TextField
									value={this.state.excludedAmount || ''}
									type="number"
									variant="outlined"
									id="non-eco"
									// tslint:disable-next-line: jsx-no-lambda
									onChange={(e) => {
										const val = Number(e.target.value);

										if(val > 0) {
											this.setState({
												error: 'Tal må ikke være højre end 0'
											})
											return;
										} else {
											this.setState({
												error: undefined
											})
										}

										this.setState({ excludedAmount: val }, () => {
											this.calulateNonEco();
										});
									}}
									label={`Ikke omfattet andel`}
									margin="normal"
									InputProps={{
										endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
									}}
								/>
								<br />
								<TextField
									value={this.state.ecoAmount || ''}
									type="number"
									variant="outlined"
									id="eco"
									// tslint:disable-next-line: jsx-no-lambda
									onChange={(e) => {
										const val = Number(e.target.value);

										if(val > 0) {
											this.setState({
												error: 'Tal må ikke være højre end 0'
											})
											return;
										} else {
											this.setState({
												error: undefined
											})
										}


										this.setState({ ecoAmount: e.target.value, }, () => {
											this.calulateNonEco();
										});
									}}
									label={`Økologisk andel`}
									margin="normal"
									InputProps={{
										endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
									}}
								/><br />

								<p>Ikke økologisk andel: {this.state.nonEcoAmount} {unit}</p>
								<p>Øko procent for kreditnotaen: {this.roundNumber(currentPercentage)}%</p>

								{this.state.error && (
									<p>{this.state.error}</p>
								)}

								{this.state.validState === false && (
									<p>Du skal udfylde formen korrekt, for at oprette kreditnotaen.</p>
								)}

								<Button
									disabled={!this.state.validState || loading}
									type="submit" variant="contained" color="primary">
									{loading ? 'Opretter...' : (<><SaveIcon /> Opret kreditnota</>)}
								</Button>

								{this.state.created && (
									<p>Oprettede kreditnota # {this.state.lastCreated}!</p>
								)}

								{error && (
									<div>
										<h2>Der opstod en fejl.</h2>
										<pre>
											{JSON.stringify(error, null, '\t') }
										</pre>
									</div>
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
