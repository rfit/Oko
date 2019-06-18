import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import CurrentEcoPercentage from '../components/CurrentEcoPercentage';
import calculateEcoPercentage from '../utils/calculateEcoPercentage';

const styles = ({ palette, spacing, breakpoints, mixins }: Theme) => createStyles({
	addBox: {
		...mixins.gutters(),
		paddingTop: spacing.unit * 2,
		paddingBottom: spacing.unit * 2,
	}
});

class FestivalOverviewTeam extends React.Component<any, any> {
	public calcTeam = (invoices: any) => {
		if (!invoices) { return 0; }
		console.log(invoices);

		const totalEco = invoices && invoices.reduce((acc: number, currentValue: any) => acc + currentValue.eco, 0);
		const totalNonEco = invoices && invoices.reduce((acc: number, currentValue: any) => acc + currentValue.nonEco, 0);
		const totalExcluded = invoices && invoices.reduce((acc: number, currentValue: any) => acc + currentValue.excluded, 0);

		const p = calculateEcoPercentage(totalEco, totalNonEco, totalExcluded);

		return p.toFixed(1);
	}
	public render() {
		const invoices = this.props.data.team.invoices;
		const currentTeam = this.props.currentUser.currentTeam;
		console.log('render', this.props, this.props.data);

		const totalEco = invoices && invoices.reduce((acc: number, currentValue: any) => acc + currentValue.eco, 0);
		const totalNonEco = invoices && invoices.reduce((acc: number, currentValue: any) => acc + currentValue.nonEco, 0);
		const totalExcluded = invoices && invoices.reduce((acc: number, currentValue: any) => acc + currentValue.excluded, 0);

		const { classes } = this.props;
		const measurement = this.props.data.team.measurement;

		return (
			<div>
				<Typography component="h1" variant="h3" gutterBottom>
					Oversigt: {this.props.data.team.name}
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

// tslint:disable-next-line: max-classes-per-file
class FestivalOverviewTeamContainer extends React.Component<any, any> {
	public render() {
		const { route } = this.props;

		console.log('DATA FROM container', route.params.teamId, this.props);

		return (
			<Query
				variables={{
					teamId: route.params.teamId
				}}
				query={GET_TEAM_WITH_INVOICES}
			>
				{({ loading, error, data }) => {
					if (error) { return error }
					if (loading) { return 'Henter data...'; }

					return (
						<FestivalOverviewTeam data={data} {...this.props} />
					);
				}}
			</Query>
		)
	}
}

export default withStyles(styles)(FestivalOverviewTeamContainer);
