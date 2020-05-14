import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import { useQuery } from '@apollo/react-hooks';
import ErrorView from '../components/ErrorView';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import CurrentEcoPercentage from '../components/CurrentEcoPercentage';
import calculateEcoPercentage from '../utils/calculateEcoPercentage';

const useStyles = makeStyles(theme => ({
	root: {},
	cell: {},
	unit: {},
	addBox: {
		...theme.mixins.gutters(),
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2)
	}
}));

const calcTeam = (invoices: any) => {
	if (!invoices) { return 0; }
	console.log(invoices);

	const totalEcoTeam = invoices && invoices.reduce((acc: number, currentValue: any) => acc + currentValue.eco, 0);
	const totalNonEcoTeam = invoices && invoices.reduce((acc: number, currentValue: any) => acc + currentValue.nonEco, 0);
	const totalExcludedTeam = invoices && invoices.reduce((acc: number, currentValue: any) => acc + currentValue.excluded, 0);

	const p = calculateEcoPercentage(totalEcoTeam, totalNonEcoTeam, totalExcludedTeam);

	return p.toFixed(1);
}

function FestivalOverviewTeam(props: any) {
	const invoices = props.data.team.invoices;
	const currentTeam = props.currentUser.currentTeam;
	console.log('render', props, props.data);

	const totalEco = invoices && invoices.reduce((acc: number, currentValue: any) => acc + currentValue.eco, 0);
	const totalNonEco = invoices && invoices.reduce((acc: number, currentValue: any) => acc + currentValue.nonEco, 0);
	const totalExcluded = invoices && invoices.reduce((acc: number, currentValue: any) => acc + currentValue.excluded, 0);

	const classes = useStyles();
	const measurement = props.data.team.measurement;

	return (
		<div>
			<Typography component="h1" variant="h3" gutterBottom>
				Oversigt: {props.data.team.name}
			</Typography>

			<Typography component="h2" variant="body2" gutterBottom>
				{currentTeam.notes}
			</Typography>

			<CurrentEcoPercentage eco={totalEco} nonEco={totalNonEco} excluded={totalExcluded} />

			<Paper className={classes.root}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell className={classes.cell}>Nummer</TableCell>
							<TableCell className={classes.cell}>Faktura dato</TableCell>
							<TableCell className={classes.cell}>Leverandør</TableCell>
							<TableCell className={classes.cell} align="right">Total</TableCell>
							<TableCell className={classes.cell} align="right">Ikke omfattet</TableCell>
							<TableCell className={classes.cell} align="right">Økologisk Andel</TableCell>
							<TableCell className={classes.cell}>Øko %</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{invoices.map((invoice: any, index: number) => {
							const { id, invoiceId, invoiceDate, eco, nonEco, excluded, total, supplier } = invoice;
							const percentage = calculateEcoPercentage(invoice.eco, invoice.nonEco, invoice.excluded); // this.calcTeam(invoices) || 0;
							const okoRowColor = percentage >= 90 ? 'green' : 'red';

							return (
								<TableRow key={invoice.id || invoice.invoiceId}>
									<TableCell className={classes.cell} component="th" scope="row">
										{invoiceId}
									</TableCell>
									<TableCell className={classes.cell}>{new Date(invoiceDate).toISOString().split('T')[0]}</TableCell>
									<TableCell className={classes.cell}>{supplier}</TableCell>
									<TableCell className={classes.cell} align="right">{total} <span className={classes.unit}>{measurement}</span></TableCell>
									<TableCell className={classes.cell} align="right">{excluded} <span className={classes.unit}>{measurement}</span></TableCell>
									<TableCell className={classes.cell} align="right">{eco} <span className={classes.unit}>{measurement}</span></TableCell>
									<TableCell  style={{ backgroundColor: okoRowColor }} className={classes.cell}>{calculateEcoPercentage(eco, nonEco, excluded).toFixed(1)}%</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Paper>
		</div>
	)
}

export const GET_TEAM_WITH_INVOICES = gql`
	query TeamInvoices($teamId: ID!) {
		team(id: $teamId) {
			id,
			name,
			measurement,
			invoices {
				id,
				invoiceId,
				createdDate,
				invoiceDate,
				supplier,
				teamId,
				userId,
				userName,
				eco,
				nonEco,
				excluded,
				total
			}
		}
	}
`

function FestivalOverviewTeamContainer(props: any) {
	const { route } = props;
	console.log('DATA FROM container', route.params.teamId, props);

	const { loading, data, error } = useQuery<any, any>(
		GET_TEAM_WITH_INVOICES,
		{ variables: {
			teamId: route.params.teamId
		}}
	);

	if (error) { return <ErrorView error={error} />}
	if (loading) { return <p>'Henter data...'</p>; }

	return (
		<FestivalOverviewTeam data={data} {...props} />
	);
}

export default FestivalOverviewTeamContainer;
