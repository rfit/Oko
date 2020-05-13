import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/PersonAdd';
import SaveIcon from '@material-ui/icons/Save';
import { useQuery } from '@apollo/react-hooks';

import React, { useState } from 'react';

import PersonList from '../components/personList';
import Loading from '../components/Loading';
import ErrorView from '../components/ErrorView';

import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import SetTeamMesurement from '../components/SetTeamMesurement';

const styles = ({ palette, spacing, breakpoints, mixins }: Theme) => createStyles({
	'@global': {
		body: {
			backgroundColor: palette.common.white,
		},
	},
	addBox: {
		...mixins.gutters(),
		paddingTop: spacing(2),
		paddingBottom: spacing(2),
	}
});

export interface IAdminProps {
	classes: any;
	unitValue?: 'kr' | 'kg';
	unitHasBeenPicked?: boolean;
	currentUser: any;
}


export interface IAdminState {
	unitValue?: 'kr' | 'kg';
	unitHasBeenPicked: boolean;
	email?: string;
	error?: string;
	emailState?: string;
	notes?: string;
	notesState?: string;
}

function handleDelete() {
	// tslint:disable-next-line:no-console
	console.log('Delete from DB.');
}

const ADD_USER_FOR_TEAM = gql`
	mutation AddUser(
		$teamId: ID!
		$email: String!
	){
		addUser(
			teamId: $teamId
			email: $email
		) {
			id,
			email,
			name
		}
	}
`;

const SET_NOTE_FOR_TEMA = gql`
	mutation SetNote(
		$teamId: ID!
		$notes: String!
	){
		setNotes(
			teamId: $teamId,
			notes: $notes
		) {
			id,
			notes
		}
	}
`;

const GET_TEAM = gql`
	query Team($teamId: ID!) {
		team(id: $teamId) {
			measurement,
			notes,
			users {
				name,
				email,
				id,
				peopleId
			}
		}
	}
`

function TeamAdminView (props: IAdminProps) {
	const [unitValue, setUnitValue] = useState(props.unitValue);
	const [unitHasBeenPicked, setUnitHasBeenPicked] = useState(props.unitHasBeenPicked || false);
	const [emailState, setEmailState] = useState('');
	const [notesState, setNotesState] = useState('');
	const [email, setEmail] = useState('');

	const { currentTeam } = props.currentUser;
	const { classes } = props;

	const { loading, data, error } = useQuery<any, any>(
		GET_TEAM,
		{
			fetchPolicy: "cache-and-network",
			variables: {
			teamId: parseInt(currentTeam.id, 10)
		}}
	);

	const handleUnitChange = (event: any) => {
		setUnitValue(event.target.value);
	}

	const handleUnitSave = () => {
		if(!unitValue) {
			alert('Du skal vælge en enhed.')
			return;
		}

		const choice = confirm('Er du sikker? Dette kan kun vælges én gang.');
		if(choice) {
			setUnitHasBeenPicked(true);
		}

		return unitValue;
	}

	const onAddNewUser = (e: any, addUser: any) => {
		e.preventDefault();
		const { currentTeam: ct } = props.currentUser;

		console.log('Add new user', e, addUser);

		addUser({
			variables: {
				teamId: ct.id,
				email
			}
		}).then((ethen: any) => {
			console.log('User added:', ethen);

			if(ethen.data.addUser.id) {
				setEmailState(`Bruger tilføjet med e-mailen ${ethen.data.addUser.email}`);
				setEmail(``);
			} else {
				setEmailState('Kunne ikke tilføje bruger, prøv igen.');
			}
		});
	}

	const onAddNotes = (e: any, addNotes: any) => {
		e.preventDefault();

		console.log('Set Notes', e, addNotes);

		addNotes({
			variables: {
				teamId: currentTeam.id,
				notes: notesState
			}
		}).then((ethen: any) => {
			console.log('Notes set:', ethen);

			if(ethen.data.setNotes.notes) {
				setNotesState(`Noten er blevet gemt.`)
			} else {
				setNotesState('Kunne ikke sætte note, prøv igen.')
			}
		});
	}

	if (loading) { return <Loading />; }
	if (error) { return (<ErrorView error={error} />); }

	console.log('TeamAdminData', data);

	return (
		<main>
			<Typography component="h1" variant="h2" gutterBottom>
				Bod Administration
			</Typography>
			<Typography variant="body2" gutterBottom>
				Styr dine indstillinger og rettigheder.
			</Typography>

			<SetTeamMesurement unitValue={data.team.measurement} teamId={currentTeam.id} />

			<hr />
			<Typography component="h1" variant="h6" gutterBottom>
				Personer med adgang
			</Typography>

			{data.team.users && <PersonList persons={data.team.users} onDeletePerson={handleDelete} />}


			<Mutation<any, any> mutation={ADD_USER_FOR_TEAM}>
				{(addUser, { error: addError, loading: addLoading }) => (
					<form
						// tslint:disable-next-line: jsx-no-lambda
						onSubmit={e => { onAddNewUser(e, addUser); }}
					>
							<Paper className={classes.addBox}>
							<Typography component="h2" variant="h5" gutterBottom>
									Tilføj adgang
								</Typography>
								<FormControl className={classes.margin}>
									<InputLabel htmlFor="input-with-icon-adornment">E-Mail eller People-ID</InputLabel>
									<Input
										id="input-with-icon-adornment"

										// tslint:disable-next-line: jsx-no-lambda
										onChange={(e) => {
											// converted this but it seems like a bug
											setNotesState(e.target.value);
										}}
										startAdornment={
											<InputAdornment position="start">
												<AccountCircle />
											</InputAdornment>
										}
									/>
								</FormControl>
								<div style={{ margin: '20px 0' }}>
									<Button type="submit" disabled={addLoading} variant="contained" color="primary"><AddIcon />
										{addLoading ? 'Tilføjer...' : 'Tilføj'}
									</Button>
								</div>
								<Typography variant="body2" gutterBottom>
									{emailState}
								</Typography>
							</Paper>
					</form>
				)}
			</Mutation>

			<hr />

			<Mutation<any, any> mutation={SET_NOTE_FOR_TEMA}>
				{(addNotes, { error: notesError, loading: notesLoading }) => (
					<form
						// tslint:disable-next-line: jsx-no-lambda
						onSubmit={e => { onAddNotes(e, addNotes); }}
					>
							<Paper className={classes.addBox}>
							<Typography component="h1" variant="h6" gutterBottom>
									Sæt note
								</Typography>
								<Typography variant="body2" gutterBottom>
									Denne besked vil blive vist til fødevarestyrelsen og alle team medlemer.
								</Typography>
								<br />
								<br />
								<FormControl className={classes.margin}>
								<InputLabel htmlFor="note">Note</InputLabel>
									<Input
										id="note"
										defaultValue={data.team.notes}
										// tslint:disable-next-line: jsx-no-lambda
										onChange={(e) => {
											setNotesState(e.target.value);
										}}

									/>
								</FormControl>
								<div style={{ margin: '20px 0' }}>
									<Button disabled={notesLoading} type="submit" variant="contained" color="primary"><SaveIcon />
										{notesLoading ? 'Gemmer...' : 'Gem'}
									</Button>
								</div>
								<Typography variant="body2" gutterBottom>
									{notesState}
								</Typography>
							</Paper>
					</form>
				)}
			</Mutation>

		</main>
	);
}


export default withStyles(styles)(TeamAdminView);
