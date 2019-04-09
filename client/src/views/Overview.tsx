import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import * as React from 'react';
import { Query } from "react-apollo";
import { Link } from 'react-router5'

import Button from '@material-ui/core/Button';
// import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';

import CurrentEcoPercentage from '../components/CurrentEcoPercentage';
import calculateEcoPercentage from '../utils/calculateEcoPercentage';

import SubHeader from '../components/SubHeader';
import Loading from '../components/Loading';

const styles = ({ palette, spacing, breakpoints, mixins }: Theme) => createStyles({
	addBox: {
		...mixins.gutters(),
		paddingTop: spacing.unit * 2,
		paddingBottom: spacing.unit * 2,
	}
});

const tableStyles = ({ palette, spacing, breakpoints, mixins }: Theme) => createStyles({
	root: {
		width: '100%',
		marginTop: spacing.unit * 3,
		overflowX: 'auto',
	},
	table: {
		minWidth: 700,
	}
});

export interface IOverviewProps {
	classes: any;
}

export interface IOverviewState {
	shopName: string;
}

const SimpleInvoiceTable = (props: any) => {
	const { classes, invoices = [] } = props;
	return (
		<Paper className={classes.root}>
			<Table className={classes.table}>
			<TableHead>
				<TableRow>
					<TableCell>Nummer</TableCell>
					<TableCell>Faktura dato</TableCell>
					<TableCell>Øko</TableCell>
					<TableCell>Ikke Øko</TableCell>
					<TableCell>Undtaget</TableCell>
					<TableCell>Øko %</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{invoices.map((invoice: any) => {
				return (
					<TableRow key={invoice.id || invoice.invoiceId}>
						<TableCell component="th" scope="row">
							{invoice.invoiceId}
						</TableCell>
						<TableCell>{invoice.invoiceDate}</TableCell>
						<TableCell>{invoice.eco}</TableCell>
						<TableCell>{invoice.nonEco}</TableCell>
						<TableCell>{invoice.excluded}</TableCell>
						<TableCell>{calculateEcoPercentage(invoice.eco, invoice.nonEco).toFixed(1)}%</TableCell>
					</TableRow>
				);
				})}
			</TableBody>
			</Table>
		</Paper>
	);
};

const StyledInvoiceTable = withStyles(tableStyles)(SimpleInvoiceTable);

class Overview extends React.Component<IOverviewProps, IOverviewState> {
	constructor(props: IOverviewProps) {
		// Required step: always call the parent class' constructor
		super(props);

		// Set the state directly. Use props if necessary.
		this.state = {
			shopName: 'bodNavn',
		}
	}
	public render() {
		// const {
		// 	classes
		// } = this.props;

		return (
			<Query
				query={gql`
					{
						invoices(teamId: 6822) {
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

		console.log('Overview data', data);

				if (loading) { return <Loading />; }
				if (error) { return <p>Error :(</p>; }

				const totalEco = data.invoices && data.invoices.reduce((acc: number, currentValue: any) => acc + currentValue.eco, 0 );
				const totalNonEco =  data.invoices && data.invoices.reduce((acc: number, currentValue: any) => acc + currentValue.nonEco, 0 );

				return (
					<React.Fragment>
						<SubHeader title="Oversigt" />
						<main>
							<Typography component="h1" variant="h3" gutterBottom>
								Oversigt
							</Typography>

							<CurrentEcoPercentage eco={totalEco} nonEco={totalNonEco} />

							<Typography component="h2" variant="h6" gutterBottom>
								Tidligere leverancer for {this.state.shopName}
							</Typography>

							<StyledInvoiceTable invoices={data.invoices} />

							<br />

							{/* tslint:disable-next-line:jsx-no-lambda */}
							<Button variant="contained" color="secondary" component={(props: any) => <Link routeName="add-invoice" {...props} />}>
								Tilføj faktura
								<AddIcon />
							</Button>
						</main>
					</React.Fragment>
				);
			}}
		</Query>);
	}
}

export default withStyles(styles)(Overview);
