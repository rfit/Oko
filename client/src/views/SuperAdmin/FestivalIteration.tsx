import React, { Suspense } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
	Card,
	CardActions,
	Paper,
	CardHeader,
	CardContent,
	Button,
	Divider,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	Typography,
	TableRow,
	Tooltip,
	TableSortLabel,
	Grid
} from '@material-ui/core';

const useStyles = makeStyles({
	table: {
	  minWidth: 650,
	},
});

interface IIteration {
	id: any;
	name: string;
	year: number;
	active: boolean;
	teams: number;
}

interface IIterationTable {
	iterations: IIteration[];
}

function IterationTable(props: IIterationTable) {
	const classes = useStyles();

	return (
		<Table className={classes.table} aria-label="simple table">
		  <TableHead>
			<TableRow>
			  <TableCell>Name</TableCell>
			  <TableCell align="right">Year</TableCell>
			  <TableCell align="right">Teams</TableCell>
			  <TableCell align="right">Active</TableCell>
			  <TableCell align="right">a</TableCell>
			</TableRow>
		  </TableHead>
		  <TableBody>
			{props.iterations.map((row: any) => (
			  <TableRow key={row.name}>
				<TableCell component="th" scope="row">
				  {row.name}
				</TableCell>
				<TableCell align="right">{row.year}</TableCell>
				<TableCell align="right">{row.teams}</TableCell>
				<TableCell align="right">{row.active}</TableCell>
				<TableCell align="right">
					{!row.active && <p>activate</p>}
				</TableCell>
			  </TableRow>
			))}
		  </TableBody>
		</Table>
	);
}

function FestivalIteration() {
	const data: IIteration[] = [
		{
			id: 0,
			year: 2019,
			name: 'RF2019',
			teams: 210,
			active: false
		},
		{
			id: 1,
			year: 2020,
			name: 'RF2020 (Aflyst)',
			teams: 0,
			active: false
		},
		{
			id: 2,
			year: 2021,
			name: 'RF2021',
			teams: 3,
			active: true
		}
	];

	return <React.Fragment>
		<Card>
			<CardContent>
				<Typography variant="body1">Iteration</Typography>
				<Typography variant="body1">
				På denne side kan du kontrollere hvilket års tal ØkoAppen kører med. Brugere går på tværs af årstal, så deres kodeord er altid det samme. Teams er unikke for hvert år.
				Dette gør også at der kan laves et test år, man kan også senere se statetisk fra tidligere år.
				</Typography>
				<Divider />

				<IterationTable iterations={data} />
			</CardContent>
		</Card>
	</React.Fragment>
}

export default FestivalIteration;
