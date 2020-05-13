import gql from "graphql-tag";
import * as React from 'react';
import { Query } from "react-apollo";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router5'

// import Fab from '@material-ui/core/Fab';
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
	TableHead,
	Typography,
	TableRow,
	Tooltip,
	TableSortLabel,
	Grid
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

import CurrentEcoPercentage from '../components/CurrentEcoPercentage';
import calculateEcoPercentage from '../utils/calculateEcoPercentage';

import NotesCard from '../components/Notes';
import SubHeader from '../components/SubHeader';
import Loading from '../components/Loading';

import { GET_ALL_INVOICES } from '../queries';

const useStyles = makeStyles(theme => ({
	addBox: {
		...theme.mixins.gutters(),
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
	}
}));

const useTableStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		marginTop: theme.spacing(3),
		overflowX: 'auto',
	},
	table: {
	},
	cell: {
		[theme.breakpoints.down('md')]: {
			padding: '4px 0px 4px 15px'
		},
	},
	unit: {
		color: '#ccc'
	}
}));

export interface IOverviewProps {
	classes: any;
	currentUser: any;
}

export interface IOverviewState {
	shopName: string;
}

const SimpleInvoiceTable = (props: any) => {
	const { measurement, invoices = [] } = props;
	const classes = useTableStyles();

	return (
		<Paper className={classes.root}>
			<Table className={classes.table}>
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
					{invoices && invoices.map((invoice: any) => {
						const { id, invoiceId, invoiceDate, eco, nonEco, excluded, total, supplier } = invoice;
						return (
							<TableRow key={invoice.id || invoice.invoiceId}>
								<TableCell className={classes.cell} component="th" scope="row">
									<Link routeName="edit-invoice" routeParams={{ invoiceId: id }}>
										{invoiceId}
									</Link>
								</TableCell>
								<TableCell className={classes.cell}>{new Date(invoiceDate).toISOString().split('T')[0]}</TableCell>
								<TableCell className={classes.cell}>{supplier}</TableCell>
								<TableCell className={classes.cell} align="right">{total} <span className={classes.unit}>{measurement}</span></TableCell>
								<TableCell className={classes.cell} align="right">{excluded} <span className={classes.unit}>{measurement}</span></TableCell>
								<TableCell className={classes.cell} align="right">{eco} <span className={classes.unit}>{measurement}</span></TableCell>
								<TableCell className={classes.cell}>{calculateEcoPercentage(eco, nonEco, excluded).toFixed(1)}%</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</Paper>
	);
};

const StyledInvoiceTable = SimpleInvoiceTable;

// IOverviewProps, IOverviewState>
function Overview(props: IOverviewProps) {
	const currentTeam = props.currentUser.currentTeam;
	const classes = useStyles();

	const InvoiceButton = React.forwardRef((buttonProps, ref) => <Link routeName="add-invoice" {...buttonProps} ref={ref}> {buttonProps.children} Tilføj faktura <AddIcon /></Link>);

	const { loading, data, error } = useQuery<any, any>(
		GET_ALL_INVOICES,
		{
			fetchPolicy: "cache-and-network",
			variables: {
			teamId: parseInt(currentTeam.id, 10)
		}}
	);

	if (loading) { return <Loading />; }
	if (error) { return <p>Error: {JSON.stringify(error)}</p>; }

	const totalEco = data.invoices && data.invoices.reduce((acc: number, currentValue: any) => acc + currentValue.eco, 0 );
	const totalNonEco = data.invoices && data.invoices.reduce((acc: number, currentValue: any) => acc + currentValue.nonEco, 0 );
	const totalExcluded = data.invoices && data.invoices.reduce((acc: number, currentValue: any) => acc + currentValue.excluded, 0 );

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

				<Button variant="contained" color="secondary" component={InvoiceButton} />
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

				<Grid container spacing={4}>
					<Grid item lg={3} sm={6} xl={3} xs={12}>
						<CurrentEcoPercentage eco={totalEco} nonEco={totalNonEco} excluded={totalExcluded} />
					</Grid>
					<Grid item lg={3} sm={6} xl={3} xs={12}>
						<NotesCard notes={currentTeam.notes} />
					</Grid>

					<Grid item lg={12} md={12} xl={12} xs={12}>
						<Card>
							<CardHeader
								action={
									<Button variant="contained" color="secondary" component={InvoiceButton} />
								}
								title={`Tidligere leverancer ${currentTeam.name}`}
							/>
							<Divider />
							<StyledInvoiceTable invoices={data.invoices} measurement={currentTeam.measurement} />
						</Card>
					</Grid>
				</Grid>
			</main>
		</React.Fragment>
	);
}

export default Overview;
