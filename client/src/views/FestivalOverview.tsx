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

import calculateEcoPercentage from '../utils/calculateEcoPercentage';


const styles = ({ palette, spacing, breakpoints, mixins }: Theme) => createStyles({
	addBox: {
		...mixins.gutters(),
		paddingTop: spacing.unit * 2,
		paddingBottom: spacing.unit * 2,
	}
});

class FestivalOverview extends React.Component<any, any> {
	public calcTeam = (invoices: any) => {
		if (!invoices) { return 0; }
		console.log(invoices);

		const totalEco = invoices && invoices.reduce((acc: number, currentValue: any) => acc + currentValue.eco, 0 );
		const totalNonEco = invoices && invoices.reduce((acc: number, currentValue: any) => acc + currentValue.nonEco, 0 );
		const totalExcluded = invoices && invoices.reduce((acc: number, currentValue: any) => acc + currentValue.excluded, 0 );

		const p = calculateEcoPercentage(totalEco, totalNonEco, totalExcluded);

		return p.toFixed(1);
	}
	public render() {
		console.log('render', this.props, this.props.data);
		const { classes } = this.props;
		return (
			<div>
				<Typography component="h1" variant="h3" gutterBottom>
					Festivals Oversigt
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
							</TableRow>
						</TableHead>
						<TableBody>
						{this.props.data.teams.map((row: any, index: number) => {
							const percentage = this.calcTeam(row.invoices) || 0;
							const okoRowColor = percentage >= 90 ? 'green' : 'red';

							return (
								<TableRow key={row.name + index}>
									<TableCell component="th" scope="row">
										{row.name}
									</TableCell>
									<TableCell align="right">{row.invoices && row.invoices.length || 0}</TableCell>
									<TableCell align="right" style={{ backgroundColor: okoRowColor }} >{row.invoices && row.invoices.length && this.calcTeam(row.invoices) || '--'}</TableCell>
								</TableRow>
							)
						}

						)}
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
