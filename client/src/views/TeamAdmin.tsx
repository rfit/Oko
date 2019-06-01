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
import Save from '@material-ui/icons/Save';
import * as React from 'react';

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
		paddingTop: spacing.unit * 2,
		paddingBottom: spacing.unit * 2,
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

class Admin extends React.Component<IAdminProps, IAdminState> {
	constructor(props: IAdminProps) {
		super(props);

		this.state = {
			unitValue: props.unitValue,
			unitHasBeenPicked: props.unitHasBeenPicked || false
		}
	}
	public handleUnitChange = (event: any) => {
		this.setState({ unitValue: event.target.value });
	}

	public onAddNewUser = (e: any, addUser: any) => {
		e.preventDefault();
		const { currentTeam } = this.props.currentUser;

		console.log('Add new user', e, addUser);

		addUser({
			variables: {
				teamId: currentTeam.id,
				email: this.state.email
			}
		}).then((ethen: any) => {
			console.log('User added:', ethen);

			if(ethen.data.addUser.id) {
				this.setState({
					emailState: `Bruger tilføjet med e-mailen ${ethen.data.addUser.email}`,
					email: ''
				})
			} else {
				this.setState({ emailState: 'Kunne ikke tilføje bruger, prøv igen.' })
			}
		});
	}

	public handleUnitSave = () => {

		if(!this.state.unitValue) {
			alert('Du skal vælge en enhed.')
			return;
		}

		const choice = confirm('Er du sikker? Dette kan kun vælges én gang.');
		if(choice) {
			this.setState({
				unitHasBeenPicked: true
			})
		}
		return this;
	}
	public render() {
		const { currentTeam } = this.props.currentUser;
		return (
			<Query
				variables={{
					teamId: currentTeam.id
				}}
				query={gql`
					query Team($teamId: ID!) {
						team(id: $teamId) {
							measurement,
							users {
								name,
								email,
								id,
								peopleId
							}
						}
					}
				`}
				>
				{({ loading, error, data }) => {
					if (loading) { return <Loading />; }
					if (error) { return (<ErrorView error={error} />); }

					const {
						classes,
					} = this.props;

					const {
						unitHasBeenPicked
					} = this.state;

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


							<Mutation mutation={ADD_USER_FOR_TEAM}>
								{(addUser) => (
									<form
										// tslint:disable-next-line: jsx-no-lambda
										onSubmit={e => { this.onAddNewUser(e, addUser); }}
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
															this.setState({ email: e.target.value });
														}}

														startAdornment={
															<InputAdornment position="start">
																<AccountCircle />
															</InputAdornment>
														}
													/>
												</FormControl>
												<div style={{ margin: '20px 0' }}>
													<Button type="submit" variant="contained" color="primary"><AddIcon />Tilføj</Button>
												</div>
												<Typography variant="body2" gutterBottom>
													{this.state.emailState}
												</Typography>
											</Paper>
									</form>
								)}
							</Mutation>

						</main>
					);
				}}
				</Query>
		)
	}
}


export default withStyles(styles)(Admin);
