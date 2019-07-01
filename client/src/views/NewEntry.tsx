import gql from "graphql-tag";
import * as React from 'react';
import { Mutation } from "react-apollo";
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';

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
	inlineError: {
		display: 'block',
		color: 'red'
	}
});

const InvoiceSchema = Yup.object().shape({
	invoiceId: Yup.string()
		.required('Du skal angive et faktura ID.'),
	supplier: Yup.string()
		.required('Du skal angive leverandør'),
	total: Yup.number()
		.min(0, 'Må ikke være mindre end 0')
		.required('Angiv den totale mængde'),
	excluded: Yup.number()
		.min(0, 'Må ikke være mindre end 0')
		.required('Angiv ikke omfattet andel.'),
	organic: Yup.number()
		.min(0, 'Må ikke være mindre end 0')
		.required('Angiv den økologiske andel'),
});

class NewEntry extends React.Component<INewEntryProps, INewEntryState> {
	public state: INewEntryState = {
		created: false,
		nonEcoAmount: 0,
		validState: false
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
	public calulateNonEco(excluded: any, organic: any, total: any) {
		const excludedAmount = parseFloat(excluded) || 0;
		const ecoAmount = parseFloat(organic) || 0;
		const totalAmount = parseFloat(total) || 0;

		const nonEco = totalAmount - excludedAmount - ecoAmount;

		this.setState({ nonEcoAmount: nonEco }, () => {
			this.setState({ validState: !(nonEco < 0) });
		});

		return nonEco;
	}
	public roundNumber(num: number) {
		return Math.floor(num * 100) / 100;
	}
	public onCreate = (CreateInvoice: any, values: any) => {
		const { currentUser } = this.props;
		const { currentTeam } = currentUser;

		const excludedAmount = parseFloat(values.excluded);
		const ecoAmount = parseFloat(values.organic);
		const totalAmount = parseFloat(values.total);
		const nonEcoAmount = this.calulateNonEco(excludedAmount, ecoAmount, totalAmount)

		CreateInvoice({
			variables: {
				invoiceDate: values.invoiceDate,
				invoiceId: values.invoiceId,
				supplier: values.supplier,
				teamId: currentTeam.id,
				eco: ecoAmount,
				nonEco: nonEcoAmount,
				excluded: excludedAmount
			}
		});
	}
	public render() {
		const { classes } = this.props;
		const unit = this.props.currentUser.currentTeam.measurement; // Get from team settings can be "kg" | "kr"

		const onSubmitCreate = this.onCreate;

		if(!unit || unit === "" || unit === "null" ) {
			return 'Din leder skal vælge om boden registere i kilo eller kroner.';
		}

		return (
			<Mutation
				mutation={ADD_INVOICE}
				onCompleted={this.handleComplete}
				>
				{(CreateInvoice, { data, error, loading }) => (
					<Formik
						validationSchema={InvoiceSchema}
						initialValues={{
							invoiceDate: new Date(),
							invoiceId: '',
							supplier: '',
							excluded: '',
							organic: '',
							total: ''
						}}
						// tslint:disable-next-line: jsx-no-lambda
						onSubmit={(values, actions) => {
							console.log(JSON.stringify(values, null, 2));
							onSubmitCreate(CreateInvoice, values)
						}}
						render={props => {
							const excludedAmount = parseFloat(props.values.excluded);
							const ecoAmount = parseFloat(props.values.organic);
							const totalAmount = parseFloat(props.values.total);
							const nonEcoAmount = totalAmount - excludedAmount - ecoAmount;

							const currentPercentage = calculateEcoPercentage(parseFloat(props.values.organic), nonEcoAmount, parseFloat(props.values.excluded));

							return (
							<form onSubmit={props.handleSubmit}>
								<Paper className={classes.paper}>
								<div className={classes.contentWrapper}>
									<Typography component="h1" variant="h3" gutterBottom>
										Opret ny faktura
									</Typography><br />

									<DatePicker
										variant="outlined"
										label="Faktura dato"
										// value={this.state.invoiceDate}
										// onChange={this.handleDateChange}
										onChange={props.handleChange}
										onBlur={props.handleBlur}
										value={props.values.invoiceDate}
										name="excluded"

									/>
									{props.errors.invoiceDate && props.touched.invoiceDate && <span className={classes.inlineError}>{props.errors.invoiceDate}</span>}

									<br />
									<TextField
										variant="outlined"
										type="text"
										onChange={props.handleChange}
										onBlur={props.handleBlur}
										value={props.values.invoiceId}
										name="invoiceId"
										id="invoice-id"
										label="Faktura/bilag nummer"
										margin="normal"
									/>
									{props.errors.invoiceId && props.touched.invoiceId && <span className={classes.inlineError}>{props.errors.invoiceId}</span>}


									<br />
									<TextField
										onChange={props.handleChange}
										onBlur={props.handleBlur}
										value={props.values.supplier}
										name="supplier"
										variant="outlined"
										type="text"
										id="supplier-name"
										label="Leverandør"
										margin="normal"
									/>

									{props.errors.supplier && props.touched.supplier && <span className={classes.inlineError}>{props.errors.supplier}</span>}

									<br />
									<TextField
										type="number"
										variant="outlined"
										id="total"
										inputProps={{ min: "0" }}
										// tslint:disable-next-line: jsx-no-lambda
										onChange={props.handleChange}
										onBlur={props.handleBlur}
										value={props.values.total}
										name="total"
										label={`Samlet`}
										margin="normal"
										InputProps={{
											endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
										}}
									/>
									{props.errors.total && props.touched.total && <span className={classes.inlineError}>{props.errors.total}</span>}
									<br />
									<TextField
										onChange={props.handleChange}
										onBlur={props.handleBlur}
										value={props.values.excluded}
										name="excluded"
										type="number"
										variant="outlined"
										// inputProps={{ min: "0" }}
										id="non-eco"
										// tslint:disable-next-line: jsx-no-lambda
										label={`Ikke omfattet andel`}
										margin="normal"
										InputProps={{
											endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
										}}
									/>
									{props.errors.excluded && props.touched.excluded && <span className={classes.inlineError}>{props.errors.excluded}</span>}

									<br />
									<TextField
										type="number"
										variant="outlined"
										inputProps={{ min: "0" }}
										id="eco"
										onChange={props.handleChange}
										onBlur={props.handleBlur}
										value={props.values.organic}
										name="organic"
										label={`Økologisk andel`}
										margin="normal"
										InputProps={{
											endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
										}}
									/><br />
									{props.errors.organic && props.touched.organic && <span className={classes.inlineError}>{props.errors.organic}</span>}



									<p>Ikke økologisk andel: {nonEcoAmount} {unit}</p>
									<p>Øko procent for faktura: {this.roundNumber(currentPercentage)}%</p>

									{this.state.error && (
										<p>{this.state.error}</p>
									)}

									{this.state.validState === false && (
										<p>Du skal udfylde formen korrekt, for at oprette fakturaen.</p>
									)}

									<Button
										disabled={!props.isValid || loading || nonEcoAmount < 0}
										type="submit" variant="contained" color="primary">
										{loading ? 'Opretter...' : (<><SaveIcon /> Opret faktura</>)}
									</Button>

									{this.state.created && (
										<p>Oprettede faktura # {this.state.lastCreated}!</p>
									)}

									{error && (
										<div>
											<h2>Der opstoed en fejl.</h2>
											<pre>
												{JSON.stringify(error, null, '\t') }
											</pre>
										</div>
									)}
								</div>
							</Paper>

							<pre style={{
								display: 'none',
								background: '#f6f8fa',
								fontSize: '.65rem',
								padding: '.5rem',
							}}>
								<strong>props</strong> ={' '}
								{JSON.stringify(props, null, 2)}
							</pre>


							</form>
						)}}
					/>
				)}
			</Mutation>
		);
	}
}

export default withStyles(styles)(NewEntry);
