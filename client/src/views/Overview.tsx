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
	},
	unit: {
		color: '#ccc'
	}
});

export interface IOverviewProps {
	classes: any;
	currentUser: any;
}

export interface IOverviewState {
	shopName: string;
}

const SimpleInvoiceTable = (props: any) => {
	const { classes, measurement, invoices = [] } = props;
	return (
		<Paper className={classes.root}>
			<Table className={classes.table}>
			<TableHead>
				<TableRow>
					<TableCell>Nummer</TableCell>
					<TableCell>Faktura dato</TableCell>
					<TableCell>Økologisk Andel</TableCell>
					<TableCell>Ikke Økologisk</TableCell>
					<TableCell>Undtaget</TableCell>
					<TableCell>Total</TableCell>
					<TableCell>Øko %</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{invoices && invoices.map((invoice: any) => {
					const { id, invoiceId, invoiceDate, eco, nonEco, excluded, total } = invoice;
					return (
						<TableRow key={invoice.id || invoice.invoiceId}>
							<TableCell component="th" scope="row">
								<Link routeName="edit-invoice" routeParams={{ invoiceId: id }}>
									{invoiceId}
								</Link>
							</TableCell>
							<TableCell>{new Date(invoiceDate).toISOString().split('T')[0]}</TableCell>
							<TableCell align="right">{eco} <span className={classes.unit}>{measurement}</span></TableCell>
							<TableCell align="right">{nonEco} <span className={classes.unit}>{measurement}</span></TableCell>
							<TableCell align="right">{excluded} <span className={classes.unit}>{measurement}</span></TableCell>
							<TableCell align="right">{total} <span className={classes.unit}>{measurement}</span></TableCell>
							<TableCell>{calculateEcoPercentage(eco, nonEco).toFixed(1)}%</TableCell>
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
	public render() {
		const currentTeam = this.props.currentUser.currentTeam;
		// const {
		// 	classes
		// } = this.props;

		return (
			<Query
				variables={{
					teamId: parseInt(currentTeam.id, 10)
				}}
				query={gql`
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
				`}
			>
			{({ loading, error, data }) => {

				if (loading) { return <Loading />; }
				if (error) { return <p>Error :(</p>; }

				const totalEco = data.invoices && data.invoices.reduce((acc: number, currentValue: any) => acc + currentValue.eco, 0 );
				const totalNonEco = data.invoices && data.invoices.reduce((acc: number, currentValue: any) => acc + currentValue.nonEco, 0 );

				if(!currentTeam.measurement || currentTeam.measurement === "" || currentTeam.measurement === "null" ) {
					return (
						<main>
							<Typography component="h1" variant="h3" gutterBottom>
								Oversigt
							</Typography>

							<Typography variant="body1" gutterBottom>
							Din leder skal vælge om boden registere i kilo eller kroner. Før dette er gjort kan der ikke registeres.
							</Typography>
						</main>
					)
				}

				console.log('Overview data', data);

				if(!data.invoices) {
					return (
						<main>
							<Typography component="h1" variant="h3" gutterBottom>
								Oversigt
							</Typography>

							<Typography variant="body1" gutterBottom>
								Der er endnu ikke oprettet en fraktura. Gør dette for at se overblik.
							</Typography>

							{/* tslint:disable-next-line:jsx-no-lambda */}
							<Button variant="contained" color="secondary" component={(props: any) => <Link routeName="add-invoice" {...props} />}>
								Tilføj faktura
								<AddIcon />
							</Button>
						</main>
					)
				}

				return (
					<React.Fragment>
						{/* <SubHeader title="Oversigt" /> */}
						<main>
							<Typography component="h1" variant="h3" gutterBottom>
								Oversigt
							</Typography>

							<CurrentEcoPercentage eco={totalEco} nonEco={totalNonEco} />

							<Typography component="h2" variant="h6" gutterBottom>
								Tidligere leverancer for {currentTeam.name}
							</Typography>

							<StyledInvoiceTable invoices={data.invoices} measurement={currentTeam.measurement} />

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
