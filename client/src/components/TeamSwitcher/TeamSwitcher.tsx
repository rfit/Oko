import React, { useState } from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import { Link } from 'react-router5'
import { makeStyles } from '@material-ui/core/styles';;

import Typography from '@material-ui/core/Typography';
import TeamIcon from '@material-ui/icons/Group';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';

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
	changeTeam: any;
}

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	formControl: {
		margin: theme.spacing(),
		minWidth: 120,
		maxWidth: 300,
	},
	chips: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	chip: {
		margin: theme.spacing(1) / 4,
	},
	noLabel: {
		marginTop: theme.spacing(3),
	},
	teamIcon: {
		verticalAlign: 'bottom'
	}
}));

function TeamSwitcher (props: ITeamSwitcherProps) {
	const [currentTeam, setCurrentTeam] = useState(props.currentTeam);
	const { teams } = props;
	const classes = useStyles();

	const handleChange = (event: any) => {
		console.log('check', event.target.value);
		props.changeTeam({ variables: { id: event.target.value } }).then((ref: any) => {
			console.log('CHANGED!', ref.data);
			// this.setState({ currentTeam: ref.curre });
		});
	};

	return (
		<>
			{teams.length === 1 && (
				<Typography component="h3" style={{ padding: 10 }}>
					<TeamIcon className={classes.teamIcon}/> {currentTeam.name}
				</Typography>
			)}

			{teams.length > 1 && (
				<FormControl className={classNames(classes.formControl, classes.noLabel)}>
					Team: <Select
						displayEmpty
						value={currentTeam.id}
						onChange={handleChange}
						input={<Input id="select-multiple-placeholder" />}
						// tslint:disable-next-line: jsx-no-lambda
						renderValue={selected => {
							if (!selected) {
								return <em>Vælg team</em>;
							}

							const ct = teams.find((element: ITeam) => {
								return element.id === selected;
							});

							return ct && ct.name || currentTeam.name;
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

};

const CHANGE_TEAM = gql`
	mutation changeTeam($id: ID!) {
    	setCurrentTeam(id: $id) {
			id,
			currentTeam {
				id,
				name,
				measurement
			}
		}
  	}
`;

/*

const AllPeopleComponent = <Query<Data, Variables> query={ALL_PEOPLE_QUERY}>
  {({ loading, error, data }) => { ... }}
</Query>

*/
const ConnectedTeamSwitcher = () => {
	return (
		<Mutation mutation={CHANGE_TEAM}>
			{(changeTeam: any) => (
				<Query<any, any>
					query={gql`
						{
							currentUser {
								currentTeam {
									name,
									id
								},
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

						console.log(data);
					return (
						<TeamSwitcher teams={data.currentUser.teams} currentTeam={data.currentUser.currentTeam} changeTeam={changeTeam} />
					);
				}}
				</Query>
			)}
		</Mutation>
	)
}

export default ConnectedTeamSwitcher;
