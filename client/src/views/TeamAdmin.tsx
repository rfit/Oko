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

import gql from "graphql-tag";
import { Query } from "react-apollo";
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
	currentTeam: any;
}


export interface IAdminState {
	unitValue?: 'kr' | 'kg';
	unitHasBeenPicked: boolean
}

function handleDelete() {
	// tslint:disable-next-line:no-console
	console.log('Delete from DB.');
}

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
		return (
			<Query
				variables={{
					teamId: parseInt(this.props.currentTeam.id, 10)
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
					if (error) { return <p>Error :(</p>; }

					const {
						classes,
					} = this.props;

					const {
						unitHasBeenPicked
					} = this.state;

					console.log('TeamADminData', data);

					return (
						<main>
							<Typography component="h1" variant="h2" gutterBottom>
								Bod Administration
							</Typography>
							<Typography variant="body2" gutterBottom>
								Styr dine indstillinger og rettigheder.
							</Typography>

							<SetTeamMesurement unitValue={data.team.measurement} />

							<hr />
							<Typography component="h1" variant="h6" gutterBottom>
								Personer med adgang
							</Typography>

							{data.team.users && <PersonList persons={data.team.users} onDeletePerson={handleDelete} />}

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
		)
	}
}


export default withStyles(styles)(Admin);
