// import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Link } from 'react-router5'

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ErrorIcon from '@material-ui/icons/Error';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
PaperProps: {
	style: {
	maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
	width: 250,
	},
},
};

interface ITeam {
	id: string;
	name: string;
}

interface ITeamSwitcherProps {
	currentTeam: any;
	teams: ITeam[];
	classes: any;
}

const styles = ({ palette, spacing, breakpoints, mixins }: Theme) => createStyles({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	  },
	  formControl: {
		margin: spacing.unit,
		minWidth: 120,
		maxWidth: 300,
	  },
	  chips: {
		display: 'flex',
		flexWrap: 'wrap',
	  },
	  chip: {
		margin: spacing.unit / 4,
	  },
	  noLabel: {
		marginTop: spacing.unit * 3,
	  },
});

class TeamSwitcher extends React.Component<ITeamSwitcherProps, any> {
	public state = {
		currentTeam: this.props.currentTeam,
	};

	public handleChange = (event: React.SyntheticEvent) => {
		this.setState({ currentTeam: (event.target as HTMLInputElement).value });
	};

	public render() {
		const { teams, classes, currentTeam } = this.props;

		return (
			<>
				{teams.length === 1 && (
					<Typography component="h3" style={{ padding: 10 }}>
						Team: {currentTeam.name}
					</Typography>
				)}

				{teams.length > 1 && (
					<FormControl className={classNames(classes.formControl, classes.noLabel)}>
						Team: <Select
							displayEmpty
							value={this.state.currentTeam.id}
							onChange={this.handleChange}
							input={<Input id="select-multiple-placeholder" />}
							// tslint:disable-next-line: jsx-no-lambda
							renderValue={selected => {
								if (!selected) {
									return <em>Vælg team</em>;
								}

								const ct = teams.find((element: ITeam) => {
									return element.id === selected;
								});

								return ct && ct.name || this.state.currentTeam.name;
							}}
							MenuProps={MenuProps}
						>
							<MenuItem disabled value="">
								<em>Vælg Team</em>
							</MenuItem>

							{teams.map((team: any) => (
								<MenuItem key={team.id} value={team.id}>
									{team.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				)}
			</>
		)
	}
};

const StyledTeamSwitcher = withStyles(styles)(TeamSwitcher);

const ConnectedTeamSwitcher = () => {
	return (<Query
		query={gql`
			{
				currentTeam @client
				currentUser {
					teams {
						id,
						name
					}
				}
			}
		`}
	>
	{({ loading, error, data }) => {
		if (loading) { return <p>...</p>; }
		if (error) { return <p>Error :( error</p>; }

		return (
			<StyledTeamSwitcher teams={data.currentUser.teams} currentTeam={data.currentTeam} />
		);
	}}
	</Query>)
}


export default ConnectedTeamSwitcher;
