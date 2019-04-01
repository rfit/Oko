import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import * as React from 'react';
import { Query } from "react-apollo";
import { Link } from "react-router-dom";

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
// import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';


import AddIcon from '@material-ui/icons/Add';

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

const SimpleTable = (props: any) => (
	<Query
		query={gql`
			{
				invoices(teamId: 6822) {
					invoiceId,
					eco,
					nonEco,
					excluded,
					total
				}
			}
		`}
	>
		{({ loading, error, data }) => {
			const { classes } = props;

			if (loading) { return <p>Loading...</p>; }
			if (error) { return <p>Error :(</p>; }

			console.log('Overview data', data);

			return (
				<Paper className={classes.root}>
					<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<TableCell>Nummer</TableCell>
							<TableCell>Tidspunkt</TableCell>
							<TableCell>Øko</TableCell>
							<TableCell>Ikke Øko</TableCell>
							<TableCell>Undtaget</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.invoices.map((invoice: any) => {
						return (
							<TableRow key={invoice.id || invoice.invoiceId}>
								<TableCell component="th" scope="row">
									{invoice.invoiceId}
								</TableCell>
								<TableCell>{invoice.created}</TableCell>
								<TableCell>{invoice.eco}</TableCell>
								<TableCell>{invoice.nonEco}</TableCell>
								<TableCell>{invoice.excluded}</TableCell>
							</TableRow>
						);
						})}
					</TableBody>
					</Table>
				</Paper>
			);
		}}
	</Query>
  );

const StyledTable = withStyles(tableStyles)(SimpleTable);

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
			<main>
				<Typography component="h1" variant="h3" gutterBottom>
					Oversigt
				</Typography>

				<Card>
					<Typography component="h3" style={{ padding: 10 }}>
						Nuværende øko procent: 86%
					</Typography>
				</Card>

				<Typography component="h2" variant="h6" gutterBottom>
					Tidligere leverancer for {this.state.shopName}
				</Typography>
				<StyledTable />

				{/* tslint:disable-next-line:jsx-no-lambda
				<Fab variant="round" color="primary" component={(props: any) => <Link to="/create-new" {...props} />}>
					<AddIcon />
				</Fab>
				*/}

				{/* tslint:disable-next-line:jsx-no-lambda */}
				<Button variant="contained" color="secondary" component={(props: any) => <Link to="/create-new" {...props} />}>
					Tilføj leverance
					<AddIcon />
				</Button>
			</main>
		);
	}
}

export default withStyles(styles)(Overview);
