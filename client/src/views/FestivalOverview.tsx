import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import { Link } from 'react-router5'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import calculateEcoPercentage from '../utils/calculateEcoPercentage';

const styles = ({ palette, spacing, breakpoints, mixins }: Theme) => createStyles({
	addBox: {
		...mixins.gutters(),
		paddingTop: spacing.unit * 2,
		paddingBottom: spacing.unit * 2,
	},
	warningIcon: {

	},
	okIcon: {
		color: 'green'
	}
});

class FestivalOverview extends React.Component<any, any> {
	public calcTeam = (invoices: any) => {
		if (!invoices) { return 0; }

		const totalEco = invoices && invoices.reduce((acc: number, currentValue: any) => acc + currentValue.eco, 0 );
		const totalNonEco = invoices && invoices.reduce((acc: number, currentValue: any) => acc + currentValue.nonEco, 0 );
		const totalExcluded = invoices && invoices.reduce((acc: number, currentValue: any) => acc + currentValue.excluded, 0 );

		const p = calculateEcoPercentage(totalEco, totalNonEco, totalExcluded);

		return p.toFixed(1);
	}
	public calulateFestivalTotal = (teams: any) => {
		const allInvoices = [].concat(...teams.map((team: any) => team.invoices));

		console.log(allInvoices);

		const totalEco = allInvoices && allInvoices.reduce((acc: number, currentValue: any) => acc + currentValue.eco, 0 );
		const totalNonEco = allInvoices && allInvoices.reduce((acc: number, currentValue: any) => acc + currentValue.nonEco, 0 );
		const totalExcluded = allInvoices && allInvoices.reduce((acc: number, currentValue: any) => acc + currentValue.excluded, 0 );

		const p = calculateEcoPercentage(totalEco, totalNonEco, totalExcluded);

		console.log(p);

		return p;
	}
	public render() {
		console.log('render', this.props, this.props.data);
		const { classes, data } = this.props;

		const krTeams = data.teams.filter((team: any) => team.measurement === 'KR');
		const kgTeams = data.teams.filter((team: any) => team.measurement === 'KG');

		console.log(krTeams);

		const kgPercentage: number = this.calulateFestivalTotal(kgTeams);
		const krPercentage = this.calulateFestivalTotal(krTeams);

		const combinedTotalPercentage = (krPercentage + kgPercentage) / 2;

		console.log(kgPercentage, krPercentage, combinedTotalPercentage);

		return (
			<div>
				<Typography component="h1" variant="h3" gutterBottom>
					Festivals Oversigt
				</Typography>
				<Typography paragraph>
					Oversigt over hele festivallens øko procent.
				</Typography>

				<Paper className={classes.root} style={{ marginBottom: 40 }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Måleenhed</TableCell>
								<TableCell align="right">Teams</TableCell>
								<TableCell align="right">Øko Procent</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell component="th" scope="row">
									kg
								</TableCell>
								<TableCell align="right">
									{kgTeams.length}
								</TableCell>
								<TableCell align="right">
									{kgPercentage.toFixed(1)}%
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell component="th" scope="row">
									kr
								</TableCell>
								<TableCell align="right">
									{krTeams.length}
								</TableCell>
								<TableCell align="right" >
									{krPercentage.toFixed(1)}%
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell component="th" scope="row" />
								<TableCell align="right" >
									Total Gennemsnit
								</TableCell>
								<TableCell align="right">
									<strong>{combinedTotalPercentage.toFixed(1)}%</strong>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Paper>

				<Typography component="h2" variant="h3" gutterBottom>
					Team Oversigt
				</Typography>
				<Typography paragraph>
					Oversigt over alle boder.
				</Typography>


				<Paper className={classes.root}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Team Navn</TableCell>
								<TableCell align="right">Antal Fakturer</TableCell>
								<TableCell align="right">Øko Procent</TableCell>
								<TableCell align="center">Status</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
						{this.props.data.teams.map((row: any, index: number) => {
							const percentage = this.calcTeam(row.invoices) || 0;
							const showError = percentage >= 90 ? false : true;

							/* Don't show them in red if they havent started yet. */
							if(row.invoices.length === 0) {
								// showError = 'transparent';
							}

							return (
								<TableRow key={row.name + index}>
									<TableCell component="th" scope="row">
										<Link routeName="festival-overview-team" routeParams={{ teamId: row.id }}>
											{row.name}
										</Link>
									</TableCell>
									<TableCell align="right">{row.invoices && row.invoices.length || 0}</TableCell>
									<TableCell align="right" >
										{row.invoices && row.invoices.length && this.calcTeam(row.invoices) || '--'}
									</TableCell>
									<TableCell align="center">
										{showError &&
											<WarningIcon className={classes.warningIcon} color="error" />
										}
										{!showError &&
											<CheckCircleIcon className={classes.okIcon} />
										}
									</TableCell>
								</TableRow>
							)
						})}
						</TableBody>
					</Table>
				</Paper>
			</div>
		)
	}
}



export const GET_ALL_TEAMS_WITH_INVOICES = gql`
	{
		teams {
			id,
			name,
			measurement,
			invoices {
				id,
				invoiceId,
				eco,
				nonEco,
				excluded,
				total
			}
		}
	}
`


// tslint:disable-next-line: max-classes-per-file
class FestivalOverviewContainer extends React.Component<any, any> {
	public render() {
		return (
			<Query
			variables={{}}
			query={GET_ALL_TEAMS_WITH_INVOICES}
		>
			{({ loading, error, data }) => {
				if(error) { return error }
				if(loading) { return 'Henter data...'; }

				return (
					<FestivalOverview data={data} {...this.props} />
				);
			}}
		</Query>
		)
	}
}

export default withStyles(styles)(FestivalOverviewContainer);
// export default FestivalOverviewContainer;
