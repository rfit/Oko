import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import { useQuery } from '@apollo/react-hooks';
import ErrorView from '../../../components/ErrorView';

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
	TextField,
	Grid
} from '@material-ui/core';

export const GET_TEAM = gql`
	query Team($teamId: ID!) {
		team(id: $teamId) {
			id,
			name,
			measurement
		}
	}
`

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

function EditTeam() {
	return (
		<>
			<Grid container spacing={4}>
				<Grid item lg={4} sm={6} xl={4} xs={12}>
					Edit name

					<TextField
						fullWidth
						label="First name"
						name="firstName"
						type="text"
						variant="outlined"
					/>
				</Grid>
				<Grid item lg={3} sm={6} xl={3} xs={12}>
					edit measurement
				</Grid>
				<Grid item lg={3} sm={6} xl={3} xs={12}>
					edit???
				</Grid>

				<Grid item lg={12} md={12} xl={12} xs={12}>
					<Card>
						<Divider />

					</Card>
				</Grid>
			</Grid>
		</>
	)
}

function EditTeamContainer(props: any) {
	const { route } = props;
	console.log('DATA FROM container', route.params.teamId, props);

	const { loading, data, error } = useQuery<any, any>(
		GET_TEAM,
		{ variables: {
			teamId: route.params.teamId
		}}
	);

	if (error) { return <ErrorView error={error} />}
	if (loading) { return <p>Henter data...</p>; }

	return (
		<EditTeam data={data} {...props} />
	);
}


export default EditTeamContainer;
