import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import * as React from 'react';
import { Query } from "react-apollo";
import { Link } from "react-router-dom";

// import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';


import AddIcon from '@material-ui/icons/Add';

const styles = ({ palette, spacing, breakpoints, mixins }: Theme) => createStyles({
	layout: {
		width: 'auto',
		marginLeft: spacing.unit * 3,
		marginRight: spacing.unit * 3,
		[breakpoints.up(900 + spacing.unit * 3 * 2)]: {
			width: 900,
			marginLeft: 'auto',
			marginRight: 'auto',
		},
	},
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

let id = 0;
function createData(invoiceName: string, date: string, name: string) {
  id += 1;
  const timestamp = new Date(date);
  return { id, invoiceName, timestamp, name };
}

const rows = [
  createData('#23465', '2018-06-01T11:24:00', 'Lis'),
  createData('#23465', '2018-06-02T15:11:00', 'Lis'),
  createData('#23465', '2018-06-03T08:24:00', 'Per'),
  createData('#23465', '2018-06-04T04:24:00', 'Allan'),
  createData('#23465', '2018-06-04T06:24:00', 'Lis'),
];



const SimpleTable = (props: any) => (
	<Query
		query={gql`
			{
				users {
					email,
					memberName,
					memberId
				}
			}
		`}
	>
		{({ loading, error, data }) => {
			const { classes } = props;

			if (loading) { return <p>Loading...</p>; }
			if (error) { return <p>Error :(</p>; }

			return (
				<Paper className={classes.root}>
					<Table className={classes.table}>
					<TableHead>
						<TableRow>
						<TableCell>Nummer</TableCell>
						<TableCell>Tidspunkt</TableCell>
						<TableCell>Navn</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map(row => {
						return (
							<TableRow key={row.id}>
							<TableCell component="th" scope="row">
								{row.invoiceName}
							</TableCell>
							<TableCell>{row.timestamp.toDateString()}</TableCell>
							<TableCell>{row.name}</TableCell>
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
		const {
			classes
		} = this.props;

		return (
			<main className={classes.layout}>
				<Typography component="h1" variant="display2" gutterBottom>
					Oversigt
				</Typography>

				<Card>
					<Typography component="h3" style={{ padding: 10 }}>
						Nuværende øko procent: 86%
					</Typography>
				</Card>

				<Typography component="h2" variant="title" gutterBottom>
					Tidligere leverancer for {this.state.shopName}
				</Typography>
				<StyledTable />

				{/* tslint:disable-next-line:jsx-no-lambda */}
				<Fab variant="round" color="primary" component={(props: any) => <Link to="/create-new" {...props} />}>
					<AddIcon />
				</Fab>
			</main>
		);
	}
}

export default withStyles(styles)(Overview);
