import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import * as React from 'react';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/PersonAdd';

import PersonList from '../components/personList';

import gql from "graphql-tag";
import { Query } from "react-apollo";

const styles = ({ palette, spacing, breakpoints, mixins }: Theme) => createStyles({
	'@global': {
		body: {
			backgroundColor: palette.common.white,
		},
	},
	addBox: {
		...mixins.gutters(),
		paddingTop: spacing.unit * 2,
		paddingBottom: spacing.unit * 2,
	}
});

export interface IAdminProps {
	classes: any;
}

function handleDelete() {
	// tslint:disable-next-line:no-console
	console.log('Delete from DB.');
}

const Admin = (props: IAdminProps) => (
	<Query
	  query={gql`
		{
			users {
				memberId,
				email,
			memberName
			}
		}
	  `}
	>
	  {({ loading, error, data }) => {
		if (loading) { return <p>Loading...</p>; }
		if (error) { return <p>Error :(</p>; }

		const {
			classes
		} = props;

		console.log('TeamADminData', data);

		return (
			<main>
				<Typography component="h1" variant="display2" gutterBottom>
					Bod Administration
				</Typography>
				<Typography variant="body2" gutterBottom>
					Styr dine indstillinger og rettigheder.
				</Typography>

				<Typography component="h1" variant="title" gutterBottom>
					Personer med adgang
				</Typography>

				<PersonList persons={data.users} onDeletePerson={handleDelete} />

				<Paper className={classes.addBox}>
					<FormControl className={classes.margin}>
						<InputLabel htmlFor="input-with-icon-adornment">E-Mail eller People-ID</InputLabel>
						<Input
						id="input-with-icon-adornment"
						startAdornment={
							<InputAdornment position="start">
							<AccountCircle />
							</InputAdornment>
						}
						/>
					</FormControl>
					<Button variant="contained" color="primary"><AddIcon />Tilføj adgang</Button>
				</Paper>
			</main>
		);
	  }}
	</Query>
  );

export default withStyles(styles)(Admin);
