import gql from "graphql-tag";
import * as React from 'react';
import { Mutation, Query } from "react-apollo";
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import calculateEcoPercentage from '../utils/calculateEcoPercentage';

import { GET_ALL_INVOICES } from '../queries';

import {
	DatePicker
} from "material-ui-pickers";

export interface INewEntryProps {
	classes: any;
	currentUser: any;
	route: any;
	router: any;
	invoiceId: any;
	excludedAmount: number;
	ecoAmount: number;
	total: number;
}

export interface INewEntryState {
	invoiceDate: any;
	lastCreated?: string;
	created?: boolean;
	invoiceId?: any;
	total?: any;
	excludedAmount?: any;
	ecoAmount?: any;
	nonEcoAmount: number;
	validState: boolean;
	error?: string;
}

const UPDATE_INVOICE = gql`
	mutation UpdateInvoice(
		$id: ID!,
		$invoiceId: ID,
		$invoiceDate: String,
		$eco: Float,
		$nonEco: Float,
		$excluded: Float
	){
		updateInvoice(
			id: $id,
			invoiceId: $invoiceId,
			invoiceDate: $invoiceDate,
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

const GET_INVOICE_QUERY = gql`
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
`

const DELETE_INVOICE_MUTATION = gql`
	mutation DeleteInvoice($id: ID!) {
		deleteInvoice(id: $id)
	}
`

class EditInvoice extends React.Component<INewEntryProps, INewEntryState> {
	public state: INewEntryState = {
		created: false,
		invoiceDate: new Date(),
		nonEcoAmount: 0,
		validState: false,
		invoiceId: this.props.invoiceId,
		excludedAmount: this.props.excludedAmount,
		total: this.props.total,
		ecoAmount: this.props.ecoAmount
	}
	public handleDateChange = (date: any) => {
		this.setState({ invoiceDate: date });
	}
	public handleComplete = (data : any) => {
		// Go back to the overview
		this.props.router.navigate('overview');
	}
	public calulateNonEco() {
		const excludedAmount = parseFloat(this.state.excludedAmount) || 0;
		const ecoAmount = parseFloat(this.state.ecoAmount) || 0;
		const totalAmount = parseFloat(this.state.total) || 0;

		const nonEco = totalAmount - excludedAmount - ecoAmount;

		this.setState({ nonEcoAmount: nonEco }, () => {
			this.setState({ validState: !(nonEco < 0) });
		});

		return nonEco;
	}
	public roundNumber(num: number) {
		return Math.floor(num * 100) / 100;
	}

	public onDelete = (DeleteInvoice: any) => {
		return (e: React.SyntheticEvent) => {
			e.preventDefault();

			const choice = confirm('Er du sikker på at du vil slette denne faktura?');
			if(choice) {
				DeleteInvoice({
					variables: { id: this.props.route.params.invoiceId }
				}).then((ethen: any) => {
					console.log('DELETED', ethen);
					this.props.router.navigate('overview');

				});
			}
		}
	}
	public onCreate = (CreateInvoice: any) => {
		return (e: React.SyntheticEvent) => {
			e.preventDefault();
			const { currentUser } = this.props;
			const { currentTeam } = currentUser;

			const excludedAmount = parseFloat(this.state.excludedAmount);
			const ecoAmount = parseFloat(this.state.ecoAmount);
			const totalAmount = parseFloat(this.state.total);
			const nonEcoAmount = this.calulateNonEco()

			// if(!this.state.invoiceId) { return };
			const vars = {
				id: this.props.route.params.invoiceId,
				invoiceDate: this.state.invoiceDate,
				invoiceId: parseInt(this.state.invoiceId + '', 10),
				eco: ecoAmount,
				nonEco: nonEcoAmount,
				excluded: excludedAmount
			}

			CreateInvoice({
				variables: vars
			});
		}
	}
	public render() {
		const { classes, route, currentUser } = this.props;
		const { currentTeam } = currentUser;
		const unit = currentTeam.measurement; // Get from team settings can be "kg" | "kr"

		console.log(this.props);

		const currentPercentage = calculateEcoPercentage(
			this.state.ecoAmount,
			this.state.nonEcoAmount,
			this.state.excludedAmount
		);

		return (
			<>
				<Mutation<any, any>
					mutation={UPDATE_INVOICE}
					onCompleted={this.handleComplete}
					>
					{(UpdateInvoice: any, {  }) => (
						<form
							// tslint:disable-next-line: jsx-no-lambda
							onSubmit={this.onCreate(UpdateInvoice)}
						>
							<Paper className={classes.paper}>
								<div className={classes.contentWrapper}>
									<Typography component="h1" variant="h3" gutterBottom>
										Redigér faktura {this.state.invoiceId}
									</Typography>

									<DatePicker
										variant="outlined"
										label="Faktura dato"
										value={this.state.invoiceDate}
										onChange={this.handleDateChange} />
									<br />
									<TextField
										value={this.state.invoiceId}
										// tslint:disable-next-line: jsx-no-lambda
										onChange={(e) => this.setState({ invoiceId: e.target.value})}
										variant="outlined"
										type="number"
										id="invoice-number"
										label="Faktura/bilag nummer"
										margin="normal"
									/><br />

									<TextField
										value={this.state.total}
										type="number"
										variant="outlined"
										id="total"
										inputProps={{ min: "0" }}
										// tslint:disable-next-line: jsx-no-lambda
										onChange={(e) => {
											const val = Number(e.target.value);

											if(val < 0) {
												this.setState({
													error: 'Tal må ikke være mindre end 0'
												})
												return;
											} else {
												this.setState({
													error: undefined
												})
											}

											this.setState({ total: e.target.value, }, () => {
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
										value={this.state.excludedAmount}
										type="number"
										variant="outlined"
										inputProps={{ min: "0" }}
										id="non-eco"
										// tslint:disable-next-line: jsx-no-lambda
										onChange={(e) => {
											const val = Number(e.target.value);

											if(val < 0) {
												this.setState({
													error: 'Tal må ikke være mindre end 0'
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
										value={this.state.ecoAmount}
										type="number"
										variant="outlined"
										inputProps={{ min: "0" }}
										// tslint:disable-next-line: jsx-no-lambda
										onChange={(e) => {
											const val = Number(e.target.value);

											if(val < 0) {
												this.setState({
													error: 'Tal må ikke være mindre end 0'
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
									/>
									<br />

									<p>Ikke økologisk andel: {this.state.nonEcoAmount} {unit}</p>
									<p>Øko procent for faktura: {this.roundNumber(currentPercentage)}%</p>

									{this.state.error && (
										<p>{this.state.error}</p>
									)}

									{this.state.validState === false && (
										<p>Du skal udfylde formen korrekt, for at oprette fakturaen.</p>
									)}

									<Button disabled={!this.state.validState} type="submit" variant="contained" color="primary">Ret</Button>

									{this.state.created && (
										<p>Opdateret! {this.state.lastCreated}!</p>
									)}
								</div>
							</Paper>

						</form>
					)}
				</Mutation>
				<Mutation
					mutation={DELETE_INVOICE_MUTATION}
					refetchQueries={[{ query: GET_ALL_INVOICES, variables: { id: currentTeam.id } }]}
				>
					{(DeleteInvoice: any, {  }) => (
						<form
							// tslint:disable-next-line: jsx-no-lambda
							onSubmit={this.onDelete(DeleteInvoice)}
						>
							<Paper className={classes.paper} style={{ marginTop: 20 }}>
								<div className={classes.contentWrapper}>
									<Button type="submit" variant="contained" color="secondary">Slet</Button>
								</div>
							</Paper>

						</form>
					)}
				</Mutation>
			</>
		);
	}
}

const ConnectedInvoiceEdit = (props: {
	classes: any;
	currentUser: any;
	route: any;
	router: any;
}) => {
	const { classes, route, currentUser } = props;
	const { currentTeam } = currentUser;

	const { loading, data, error } = useQuery<any, any>(
		GET_INVOICE_QUERY,
		{ variables: { id: route.params.invoiceId } }
	);

	// if(error) { return error }
	// if(loading) { return '...'; }

	console.log(data, currentTeam.measurement);
	// this.setState({
	// 	invoiceId: data.invoice.invoiceId
	// });

	// parseFloat(data.invoice.total) - parseFloat(this.state.excludedAmount || data.invoice.excluded) - parseFloat(this.state.ecoAmount  || data.invoice.eco)

	return (
		<EditInvoice
			{...props}
			invoiceId={data.invoice.invoiceId}
			excludedAmount={data.invoice.excluded}
			ecoAmount={data.invoice.eco}
			total={data.invoice.total}
		/>
	);
}

export default withStyles(styles)(ConnectedInvoiceEdit);
