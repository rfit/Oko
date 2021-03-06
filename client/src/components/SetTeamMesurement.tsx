
import * as React from 'react';
import gql from "graphql-tag";
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import HelpIcon from '@material-ui/icons/Help';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { Mutation } from "react-apollo";
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/PersonAdd';
import Save from '@material-ui/icons/Save';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = ({ palette, spacing, breakpoints, mixins }: Theme) => createStyles({
	'@global': {
		body: {
			backgroundColor: palette.common.white,
		},
	},
	addBox: {
		...mixins.gutters(),
		// paddingTop: spacing.unit * 2,
		// paddingBottom: spacing.unit * 2,
	}
});

interface ISetTeamMeasurementProps {
	unitValue: string;
	teamId: number;
	classes: any;
	children?: React.ReactNode;
}

interface ISetTeamMeasurementState {
	unitValue?: string;
	unitHasBeenPicked: boolean;
	children?: React.ReactNode;
}

const SET_TEAM_MEASUREMENT = gql`
	mutation SetTeamMeasurement(
		$teamId: ID!
		$measurement: String!
	){
		setTeamMeasurement(
			teamId: $teamId
			measurement: $measurement
		) {
			id,
			name,
			measurement
		}
	}
`;

class SetTeamMeasurement extends React.Component<ISetTeamMeasurementProps, ISetTeamMeasurementState> {
	constructor(props: ISetTeamMeasurementProps) {
		super(props);
		console.log('SetTeamMesurement',  props.unitValue === 'KG' || props.unitValue === 'KR' ? true : false, props.unitValue);
		this.state = {
			unitValue: props.unitValue,
			unitHasBeenPicked: props.unitValue === 'KG' || props.unitValue === 'KR' ? true : false
		}
	}
	public handleUnitChange = (event: any) => {
		this.setState({ unitValue: event.target.value });
	}
	public onSave = (event: any, setTeamMeasurement: any) => {
		event.preventDefault();

		if(!this.state.unitValue) {
			alert('Du skal vælge en enhed.')
			return;
		}

		const choice = confirm('Er du sikker? Dette kan kun vælges én gang.');
		if(choice) {
			setTeamMeasurement({
				variables: {
					teamId: this.props.teamId,
					measurement: this.state.unitValue
				}
			}).then((ethen: any) => {
				console.log('loled', ethen);
				this.setState({
					unitHasBeenPicked: true
				});
			});
		}
	}
	public render() {
		const { classes } = this.props;
		const { unitHasBeenPicked } = this.state;

		return (
			<Mutation mutation={SET_TEAM_MEASUREMENT}>
			{(setTeamMeasurement: any) => (
				<form
					// tslint:disable-next-line: jsx-no-lambda
					onSubmit={e => { this.onSave(e, setTeamMeasurement); }}
				>
					<Typography component="h1" variant="h6" gutterBottom>
						Faktura mål
					</Typography>
					<Typography variant="body2" gutterBottom>
						Du kan kun vælge dette én gang.
					</Typography>

					<FormControl className={classes.formControl}>
						<RadioGroup
							aria-label="gender"
							name="gender2"
							className={classes.group}
							value={this.state.unitValue}
							onChange={this.handleUnitChange}
						>
							<FormControlLabel
								value="KR"
								control={<Radio color="primary" />}
								label="kr - Pris"
								disabled={unitHasBeenPicked}
								labelPlacement="end"
							/>
							<FormControlLabel
								value="KG"
								disabled={unitHasBeenPicked}
								control={<Radio color="primary" />}
								label="kg - Kilo"
								labelPlacement="end"
							/>
						</RadioGroup>
					</FormControl>
					<br />
					<Button type="submit" variant="contained" color="primary" disabled={unitHasBeenPicked}><Save />Gem valg</Button>
				</form>
			)}
		</Mutation>
	);
	}
}


export default withStyles(styles)(SetTeamMeasurement);
